import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { issueVerifiedSessionKey } from "./_lib/key-issuance.js";

const WORKINK_STEP_ONE_URL = "https://work.ink/2dbK/sotarium-step-1";
const WORKINK_STEP_TWO_URL = "https://work.ink/2dbK/sotarium-step-2";
const SESSION_COOKIE_NAME = "sotarium_workink_session";
const SESSION_LIFETIME_MS = 30 * 60 * 1000;

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
const KEY_ISSUANCE_SECRET = process.env.KEY_ISSUANCE_SECRET || SUPABASE_SERVICE_ROLE_KEY;
const WORKINK_BASE_LINK = process.env.WORKINK_BASE_LINK;

function generateRandomReturnToken(step = 1) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
  let token = `s${step}_`;
  for (let i = 0; i < 48; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

function getDestinationUrl(req, token) {
  const forwardedHost = req.headers["x-forwarded-host"];
  const host = forwardedHost || req.headers.host || "sotarium.vercel.app";
  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol = forwardedProto || (host.includes("localhost") ? "http" : "https");
  return `${protocol}://${host}/workink/${token}`;
}

async function createWorkinkOverrideLink(destinationUrl, fallbackUrl) {
  if (!WORKINK_BASE_LINK) {
    return fallbackUrl;
  }
  try {
    const overrideApi = `https://work.ink/_api/v2/override?destination=${encodeURIComponent(destinationUrl)}`;
    const response = await fetch(overrideApi, { method: "GET" });
    if (!response.ok) return fallbackUrl;
    const data = await response.json().catch(() => null);
    if (data?.sr) {
      return `${WORKINK_BASE_LINK}?sr=${data.sr}`;
    }
  } catch (err) {
    console.error("Work.ink override error:", err);
  }
  return fallbackUrl;
}

function requireConfiguration(res) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    res.status(500).json({ error: "Work.ink is not configured on the server" });
    return true;
  }
  return false;
}

function readCookie(req, name) {
  const rawCookie = typeof req.headers.cookie === "string" ? req.headers.cookie : "";
  for (const part of rawCookie.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) {
      try {
        return decodeURIComponent(value.join("="));
      } catch {
        return "";
      }
    }
  }
  return "";
}

function setSessionCookie(res, sessionId) {
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(sessionId)}; Max-Age=${Math.floor(SESSION_LIFETIME_MS / 1000)}; Path=/; HttpOnly; Secure; SameSite=Lax`,
  );
}

function clearSessionCookie(res) {
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax`,
  );
}

async function getPendingSession(supabase, sessionId) {
  const { data: session, error } = await supabase
    .from("earnpaste_sessions")
    .select("id, current_step, status, expires_at, step_one_url, step_two_url")
    .eq("id", sessionId)
    .maybeSingle();

  if (error || !session) {
    const notFound = new Error("Work.ink session not found");
    notFound.statusCode = 404;
    throw notFound;
  }

  if (!['pending', 'completed'].includes(session.status) || new Date(session.expires_at).getTime() <= Date.now()) {
    const expired = new Error("Work.ink session expired");
    expired.statusCode = 410;
    throw expired;
  }

  return session;
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (requireConfiguration(res)) {
    return;
  }

  const action = String(req.query.action || "").toLowerCase();
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    if (action === "start") {
      const id = randomUUID();
      const expiresAt = new Date(Date.now() + SESSION_LIFETIME_MS).toISOString();
      const token1 = generateRandomReturnToken(1);
      const destination1 = getDestinationUrl(req, token1);
      const link1 = await createWorkinkOverrideLink(destination1, WORKINK_STEP_ONE_URL);

      const { error: insertError } = await supabase.from("earnpaste_sessions").insert({
        id,
        current_step: 1,
        status: "pending",
        step_started_at: new Date().toISOString(),
        step_one_url: link1,
        step_two_url: null,
        expires_at: expiresAt,
      });

      if (insertError) {
        console.error("Work.ink session insert error:", insertError);
        return res.status(500).json({ error: "Could not create Work.ink session" });
      }

      setSessionCookie(res, id);
      return res.status(200).json({ url: link1, token: token1, step: 1, expires_at: expiresAt });
    }

    if (action !== "advance") {
      return res.status(400).json({ error: "Unknown Work.ink action" });
    }

    const sessionId = readCookie(req, SESSION_COOKIE_NAME);
    const step = Number(req.body?.step);
    if (!sessionId || !Number.isInteger(step) || ![1, 2].includes(step)) {
      return res.status(400).json({ error: "Missing or invalid Work.ink verification data" });
    }

    const session = await getPendingSession(supabase, sessionId);
    if (session.current_step !== step) {
      return res.status(409).json({ error: "This Work.ink checkpoint is no longer active" });
    }

    if (step === 1) {
      const token2 = generateRandomReturnToken(2);
      const destination2 = getDestinationUrl(req, token2);
      const link2 = await createWorkinkOverrideLink(destination2, WORKINK_STEP_TWO_URL);

      const { data: updatedSession, error: updateError } = await supabase
        .from("earnpaste_sessions")
        .update({
          current_step: 2,
          step_started_at: new Date().toISOString(),
          step_two_url: link2,
        })
        .eq("id", sessionId)
        .eq("status", "pending")
        .eq("current_step", 1)
        .select("id")
        .maybeSingle();

      if (updateError || !updatedSession) {
        console.error("Work.ink step-one completion error:", updateError);
        return res.status(409).json({ error: "This Work.ink checkpoint was already processed" });
      }

      return res.status(200).json({ url: link2, token: token2, step: 2 });
    }

    if (session.status === "completed") {
      const issuedKey = await issueVerifiedSessionKey({
        supabase,
        sessionId,
        provider: "Work.ink",
        signingKey: KEY_ISSUANCE_SECRET,
      });
      clearSessionCookie(res);
      return res.status(200).json({ accepted: true, step: 2, ...issuedKey });
    }

    const { data: completedSession, error: updateError } = await supabase
      .from("earnpaste_sessions")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", sessionId)
      .eq("status", "pending")
      .eq("current_step", 2)
      .select("id")
      .maybeSingle();

    if (updateError || !completedSession) {
      console.error("Work.ink step-two completion error:", updateError);
      return res.status(409).json({ error: "This Work.ink checkpoint was already processed" });
    }

    const issuedKey = await issueVerifiedSessionKey({
      supabase,
      sessionId,
      provider: "Work.ink",
      signingKey: KEY_ISSUANCE_SECRET,
    });
    clearSessionCookie(res);
    return res.status(200).json({ accepted: true, step: 2, ...issuedKey });
  } catch (error) {
    console.error("Work.ink handler error:", error);
    const statusCode = Number.isInteger(error?.statusCode) ? error.statusCode : 502;
    return res.status(statusCode).json({ error: error instanceof Error ? error.message : "Work.ink request failed" });
  }
}
