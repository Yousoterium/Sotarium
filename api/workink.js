import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";
import { issueVerifiedSessionKey } from "./_lib/key-issuance.js";

const WORKINK_STEP_ONE_BASE = "https://work.ink/2dbK/sotarium-step-1";
const WORKINK_STEP_TWO_BASE = "https://work.ink/2dbK/sotarium-step-2";
const SESSION_COOKIE_NAME = "sotarium_workink_session";
const SESSION_LIFETIME_MS = 30 * 60 * 1000;

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
const KEY_ISSUANCE_SECRET = process.env.KEY_ISSUANCE_SECRET || SUPABASE_SERVICE_ROLE_KEY;

function getOrigin(req) {
  const forwardedHost = req.headers["x-forwarded-host"];
  const host = forwardedHost || req.headers.host || "sotarium.vercel.app";
  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol = forwardedProto || (host.includes("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

async function createWorkinkOverrideLink(baseLink, destinationUrl) {
  try {
    const overrideApi = `https://work.ink/_api/v2/override?destination=${encodeURIComponent(destinationUrl)}`;
    const response = await fetch(overrideApi, {
      method: "GET",
      headers: {
        "User-Agent": "Sotarium/1.0",
      },
    });

    if (response.ok) {
      const data = await response.json().catch(() => null);
      if (data?.sr) {
        const separator = baseLink.includes("?") ? "&" : "?";
        return `${baseLink}${separator}sr=${data.sr}`;
      }
    }
  } catch (err) {
    console.error("Work.ink override error:", err);
  }
  return baseLink;
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

  if (!["pending", "completed"].includes(session.status) || new Date(session.expires_at).getTime() <= Date.now()) {
    const expired = new Error("Work.ink session expired");
    expired.statusCode = 410;
    throw expired;
  }

  return session;
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (requireConfiguration(res)) {
    return;
  }

  const action = String(req.query.action || req.body?.action || "start").toLowerCase();
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const origin = getOrigin(req);

  try {
    if (action === "start") {
      const sessionId = randomUUID();
      const expiresAt = new Date(Date.now() + SESSION_LIFETIME_MS).toISOString();

      // Destination uses official Link Override format: https://yoursite.com/verify?token={TOKEN}&uid=${userId}&step=1
      const destination1 = `${origin}/verify?token={TOKEN}&uid=${sessionId}&step=1`;
      const stepOneLink = await createWorkinkOverrideLink(WORKINK_STEP_ONE_BASE, destination1);

      const { error: insertError } = await supabase.from("earnpaste_sessions").insert({
        id: sessionId,
        current_step: 1,
        status: "pending",
        step_started_at: new Date().toISOString(),
        step_one_url: stepOneLink,
        step_two_url: null,
        expires_at: expiresAt,
      });

      if (insertError) {
        console.error("Work.ink session insert error:", insertError);
      }

      setSessionCookie(res, sessionId);
      return res.status(200).json({
        url: stepOneLink,
        session: sessionId,
        step: 1,
        expires_at: expiresAt,
      });
    }

    if (action === "step2" || action === "advance") {
      const sessionId = req.body?.session || req.query.session || readCookie(req, SESSION_COOKIE_NAME) || randomUUID();
      const expiresAt = new Date(Date.now() + SESSION_LIFETIME_MS).toISOString();

      // Destination for Step 2: https://yoursite.com/verify?token={TOKEN}&uid=${userId}&step=2
      const destination2 = `${origin}/verify?token={TOKEN}&uid=${sessionId}&step=2`;
      const stepTwoLink = await createWorkinkOverrideLink(WORKINK_STEP_TWO_BASE, destination2);

      await supabase
        .from("earnpaste_sessions")
        .update({
          current_step: 2,
          step_started_at: new Date().toISOString(),
          step_two_url: stepTwoLink,
        })
        .eq("id", sessionId);

      setSessionCookie(res, sessionId);
      return res.status(200).json({
        url: stepTwoLink,
        session: sessionId,
        step: 2,
        expires_at: expiresAt,
      });
    }

    return res.status(400).json({ error: "Unknown action" });
  } catch (error) {
    console.error("Work.ink handler error:", error);
    return res.status(500).json({ error: "Work.ink link creation failed" });
  }
}
