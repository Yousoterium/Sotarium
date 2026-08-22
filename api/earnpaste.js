import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { issueVerifiedSessionKey } from "./_lib/key-issuance.js";

const EARNPASTE_ENDPOINT = "https://us-central1-earnpaste-3cd5a.cloudfunctions.net/apiCreatePaste";
const EARNPASTE_TIMER_SECONDS = 15;
const SESSION_LIFETIME_MS = 30 * 60 * 1000;

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
const EARNPASTE_API_KEY = process.env.EARNPASTE_API_KEY;
const KEY_ISSUANCE_SECRET = process.env.KEY_ISSUANCE_SECRET || SUPABASE_SERVICE_ROLE_KEY;

function getOrigin(req) {
  const forwardedHost = req.headers["x-forwarded-host"];
  const host = forwardedHost || req.headers.host || "sotarium.vercel.app";
  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol = forwardedProto || (host.includes("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

function secondsSince(isoDate) {
  return (Date.now() - new Date(isoDate).getTime()) / 1000;
}

async function createEarnpasteUrl(targetUrl, title) {
  const response = await fetch(EARNPASTE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": EARNPASTE_API_KEY,
    },
    body: JSON.stringify({
      targetUrl,
      timer: EARNPASTE_TIMER_SECONDS,
      revenueModel: "view",
      title,
    }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.url || typeof data.url !== "string" || !data.url.startsWith("http")) {
    throw new Error(data?.message || "Earnpaste did not return a valid link");
  }

  return data.url;
}

function requireConfiguration(res) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !EARNPASTE_API_KEY) {
    res.status(500).json({ error: "Earnpaste is not configured on the server" });
    return true;
  }
  return false;
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (requireConfiguration(res)) {
    return;
  }

  const action = String(req.query.action || "").toLowerCase();
  const sessionId = typeof req.body?.session === "string" ? req.body.session.trim() : "";
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    if (action === "start") {
      const id = randomUUID();
      const now = new Date();
      const expiresAt = new Date(now.getTime() + SESSION_LIFETIME_MS).toISOString();
      const { error: insertError } = await supabase.from("earnpaste_sessions").insert({
        id,
        current_step: 1,
        status: "pending",
        step_started_at: now.toISOString(),
        expires_at: expiresAt,
      });

      if (insertError) {
        console.error("Earnpaste session insert error:", insertError);
        return res.status(500).json({ error: "Could not create Earnpaste session" });
      }

      const returnUrl = `${getOrigin(req)}/earnpaste?upgrade&session=${encodeURIComponent(id)}`;
      const url = await createEarnpasteUrl(returnUrl, "Sotarium Earnpaste — Step 1 of 2");

      const { error: updateError } = await supabase
        .from("earnpaste_sessions")
        .update({ step_one_url: url })
        .eq("id", id);

      if (updateError) {
        console.error("Earnpaste step-one link update error:", updateError);
      }

      return res.status(200).json({ url, session: id, step: 1, expires_at: expiresAt });
    }

    if (!sessionId) {
      return res.status(400).json({ error: "Missing Earnpaste session" });
    }

    const { data: session, error: sessionError } = await supabase
      .from("earnpaste_sessions")
      .select("id, current_step, status, step_started_at, expires_at")
      .eq("id", sessionId)
      .maybeSingle();

    if (sessionError || !session) {
      return res.status(404).json({ error: "Earnpaste session not found" });
    }

    const isCompletedSession = session.status === "completed";
    if ((!isCompletedSession && session.status !== "pending") || new Date(session.expires_at).getTime() <= Date.now()) {
      return res.status(410).json({ error: "Earnpaste session expired" });
    }

    if (!isCompletedSession && secondsSince(session.step_started_at) < EARNPASTE_TIMER_SECONDS) {
      return res.status(429).json({
        error: "The Earnpaste timer has not completed yet",
        retry_after: Math.ceil(EARNPASTE_TIMER_SECONDS - secondsSince(session.step_started_at)),
      });
    }

    if (action === "rotate") {
      if (isCompletedSession || session.current_step !== 1) {
        return res.status(409).json({ error: "Earnpaste step 1 was already completed" });
      }

      const returnUrl = `${getOrigin(req)}/earnpaste?completed&session=${encodeURIComponent(sessionId)}`;
      const url = await createEarnpasteUrl(returnUrl, "Sotarium Earnpaste — Step 2 of 2");
      const { error: updateError } = await supabase
        .from("earnpaste_sessions")
        .update({
          current_step: 2,
          step_started_at: new Date().toISOString(),
          step_two_url: url,
        })
        .eq("id", sessionId)
        .eq("current_step", 1)
        .eq("status", "pending");

      if (updateError) {
        console.error("Earnpaste step-two session update error:", updateError);
        return res.status(500).json({ error: "Could not rotate the Earnpaste link" });
      }

      return res.status(200).json({ url, session: sessionId, step: 2 });
    }

    if (action === "complete") {
      if (session.current_step !== 2) {
        return res.status(409).json({ error: "Complete Earnpaste step 1 before step 2" });
      }

      if (!isCompletedSession) {
        const { data: completedSession, error: updateError } = await supabase
          .from("earnpaste_sessions")
          .update({ status: "completed", completed_at: new Date().toISOString() })
          .eq("id", sessionId)
          .eq("current_step", 2)
          .eq("status", "pending")
          .select("id")
          .maybeSingle();

        if (updateError || !completedSession) {
          console.error("Earnpaste completion update error:", updateError);
          return res.status(409).json({ error: "Could not complete the Earnpaste session" });
        }
      }

      const issuedKey = await issueVerifiedSessionKey({
        supabase,
        sessionId,
        provider: "Earnpaste",
        signingKey: KEY_ISSUANCE_SECRET,
      });

      return res.status(200).json({ accepted: true, session: sessionId, step: 2, ...issuedKey });
    }

    return res.status(400).json({ error: "Unknown Earnpaste action" });
  } catch (error) {
    console.error("Earnpaste handler error:", error);
    return res.status(502).json({ error: "Earnpaste link creation failed" });
  }
}
