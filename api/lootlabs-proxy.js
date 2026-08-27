import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { issueVerifiedSessionKey } from "./_lib/key-issuance.js";

const LOOTLABS_API_TOKEN = "93f905beb1e1f6bffee13f868bdbb51ea281f20a16b0d9bab873f35369a114bf";
const CONTENT_LOCKER_URL = "https://creators.lootlabs.gg/api/public/content_locker";
const URL_ENCRYPTOR_URL = "https://creators.lootlabs.gg/api/public/url_encryptor";
const SESSION_LIFETIME_MS = 30 * 60 * 1000;

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
const KEY_ISSUANCE_SECRET = process.env.KEY_ISSUANCE_SECRET || SUPABASE_SERVICE_ROLE_KEY;

const extractMessage = (data) => {
  if (!data || typeof data !== "object") return null;
  const msg = data.message;
  if (Array.isArray(msg)) return msg[0] || null;
  if (msg && typeof msg === "object") return msg;
  return null;
};

function getOrigin(req) {
  const host = req.headers["x-forwarded-host"] || req.headers.host || "sotarium.vercel.app";
  const protocol = req.headers["x-forwarded-proto"] || (host.includes("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

function requireServerConfiguration(res) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !KEY_ISSUANCE_SECRET) {
    res.status(500).json({ error: "Lootlabs verification is not configured on the server" });
    return true;
  }
  return false;
}

async function createLootlabsLink({ title, destinationUrl, tierId = 1, numberOfTasks = 1, theme = 3, thumbnail }) {
  const response = await fetch(CONTENT_LOCKER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LOOTLABS_API_TOKEN}`,
    },
    body: JSON.stringify({
      title: title.substring(0, 30),
      url: destinationUrl,
      tier_id: tierId,
      number_of_tasks: numberOfTasks,
      theme,
      thumbnail: thumbnail || undefined,
    }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || data?.type === "error") {
    const message = extractMessage(data);
    throw new Error(message || data?.message || "Lootlabs could not create a checkpoint");
  }

  const message = extractMessage(data);
  const lootUrl = message?.loot_url || message?.url || data?.loot_url || data?.url || (typeof data?.message === "string" && data.message.startsWith("http") ? data.message : null);
  if (!lootUrl || typeof lootUrl !== "string" || !lootUrl.startsWith("http")) {
    throw new Error("Lootlabs did not return a valid checkpoint link");
  }

  return lootUrl;
}

async function getSession(supabase, sessionId) {
  const { data, error } = await supabase
    .from("earnpaste_sessions")
    .select("id, current_step, status, expires_at")
    .eq("id", sessionId)
    .maybeSingle();

  if (error || !data) {
    const notFound = new Error("Lootlabs session not found");
    notFound.statusCode = 404;
    throw notFound;
  }

  if (!["pending", "completed"].includes(data.status) || new Date(data.expires_at).getTime() <= Date.now()) {
    const expired = new Error("Lootlabs session expired");
    expired.statusCode = 410;
    throw expired;
  }

  return data;
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const action = String(req.query.action || "").toLowerCase();

  try {
    if (action === "encrypt_url") {
      const { destinationUrl } = req.body || {};
      if (!destinationUrl) return res.status(400).json({ error: "Missing required field: destinationUrl" });

      const response = await fetch(URL_ENCRYPTOR_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOOTLABS_API_TOKEN}` },
        body: JSON.stringify({ destination_url: destinationUrl }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || data?.type === "error") {
        const message = extractMessage(data);
        return res.status(502).json({ error: message || data?.message || "Lootlabs URL encryption failed" });
      }
      const message = extractMessage(data);
      return res.status(200).json({ encryptedData: message?.encrypted_data || message?.destination_url || data?.message || null });
    }

    if (requireServerConfiguration(res)) return;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    if (action === "start") {
      const sessionId = randomUUID();
      const now = new Date();
      const expiresAt = new Date(now.getTime() + SESSION_LIFETIME_MS).toISOString();
      const { error: insertError } = await supabase.from("earnpaste_sessions").insert({
        id: sessionId,
        current_step: 1,
        status: "pending",
        step_started_at: now.toISOString(),
        expires_at: expiresAt,
      });
      if (insertError) throw new Error("Could not create the Lootlabs verification session");

      const destinationUrl = `${getOrigin(req)}/lootlabs?session=${encodeURIComponent(sessionId)}&step=1`;
      const url = await createLootlabsLink({ title: "Sotarium Checkpoint 1 of 2", destinationUrl });
      const { error: updateError } = await supabase
        .from("earnpaste_sessions")
        .update({ step_one_url: url })
        .eq("id", sessionId)
        .eq("status", "pending")
        .eq("current_step", 1);
      if (updateError) throw new Error("Could not prepare the first Lootlabs checkpoint");

      return res.status(200).json({ url, session: sessionId, step: 1, expires_at: expiresAt });
    }

    if (action === "complete") {
      const sessionId = typeof req.body?.session === "string" ? req.body.session.trim() : "";
      const step = Number(req.body?.step);
      if (!sessionId || !Number.isInteger(step) || ![1, 2].includes(step)) {
        return res.status(400).json({ error: "Missing or invalid Lootlabs verification data" });
      }

      const session = await getSession(supabase, sessionId);
      if (session.current_step !== step) {
        return res.status(409).json({ error: "This Lootlabs checkpoint is no longer active" });
      }

      if (session.status === "completed") {
        if (step !== 2) return res.status(409).json({ error: "This Lootlabs session was already completed" });
        const issuedKey = await issueVerifiedSessionKey({ supabase, sessionId, provider: "Lootlabs", signingKey: KEY_ISSUANCE_SECRET });
        return res.status(200).json({ accepted: true, session: sessionId, step: 2, ...issuedKey });
      }

      if (step === 1) {
        const destinationUrl = `${getOrigin(req)}/lootlabs?session=${encodeURIComponent(sessionId)}&step=2`;
        const url = await createLootlabsLink({ title: "Sotarium Checkpoint 2 of 2", destinationUrl });
        const { data: advancedSession, error: advanceError } = await supabase
          .from("earnpaste_sessions")
          .update({ current_step: 2, step_started_at: new Date().toISOString(), step_two_url: url })
          .eq("id", sessionId)
          .eq("status", "pending")
          .eq("current_step", 1)
          .select("id")
          .maybeSingle();
        if (advanceError || !advancedSession) return res.status(409).json({ error: "This Lootlabs checkpoint was already processed" });
        return res.status(200).json({ url, session: sessionId, step: 2 });
      }

      const { data: completedSession, error: completeError } = await supabase
        .from("earnpaste_sessions")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", sessionId)
        .eq("status", "pending")
        .eq("current_step", 2)
        .select("id")
        .maybeSingle();
      if (completeError || !completedSession) return res.status(409).json({ error: "This Lootlabs session was already processed" });

      const issuedKey = await issueVerifiedSessionKey({ supabase, sessionId, provider: "Lootlabs", signingKey: KEY_ISSUANCE_SECRET });
      return res.status(200).json({ accepted: true, session: sessionId, step: 2, ...issuedKey });
    }

    return res.status(400).json({ error: "Unknown action" });
  } catch (error) {
    console.error("Lootlabs handler error:", error);
    return res.status(Number.isInteger(error?.statusCode) ? error.statusCode : 502).json({ error: error instanceof Error ? error.message : "Lootlabs request failed" });
  }
}
