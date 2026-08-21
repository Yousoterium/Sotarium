import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";

const WORKINK_OVERRIDE_ENDPOINT = "https://work.ink/_api/v2/override";
const WORKINK_TOKEN_VALIDATION_BASE = "https://work.ink/_api/v2/token/isValid/";
const SESSION_LIFETIME_MS = 30 * 60 * 1000;

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
const WORKINK_BASE_LINK = process.env.WORKINK_BASE_LINK;

function getOrigin(req) {
  const forwardedHost = req.headers["x-forwarded-host"];
  const host = forwardedHost || req.headers.host || "sotarium.vercel.app";
  const forwardedProto = req.headers["x-forwarded-proto"];
  const protocol = forwardedProto || (host.includes("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

function requireConfiguration(res) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !WORKINK_BASE_LINK) {
    res.status(500).json({ error: "Work.ink is not configured on the server" });
    return true;
  }
  return false;
}

function parseBaseLink() {
  let baseLink;
  try {
    baseLink = new URL(WORKINK_BASE_LINK);
  } catch {
    throw new Error("WORKINK_BASE_LINK is not a valid URL");
  }

  if (baseLink.protocol !== "https:" || baseLink.hostname !== "work.ink") {
    throw new Error("WORKINK_BASE_LINK must be an https://work.ink publisher link");
  }

  return baseLink;
}

async function createOverrideUrl(destination) {
  const endpoint = new URL(WORKINK_OVERRIDE_ENDPOINT);
  endpoint.searchParams.set("destination", destination);

  const response = await fetch(endpoint, {
    headers: { Accept: "application/json" },
  });
  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.sr || typeof data.sr !== "string") {
    throw new Error("Work.ink did not return a valid destination override");
  }

  const workinkUrl = parseBaseLink();
  workinkUrl.searchParams.set("sr", data.sr);
  return workinkUrl.toString();
}

async function validateWorkinkToken(token) {
  if (!token || token.length > 200) {
    return false;
  }

  const endpoint = new URL(`${WORKINK_TOKEN_VALIDATION_BASE}${encodeURIComponent(token)}`);
  endpoint.searchParams.set("deleteToken", "1");
  endpoint.searchParams.set("forbiddenOnFail", "1");

  const response = await fetch(endpoint, {
    headers: { Accept: "application/json" },
  });
  const data = await response.json().catch(() => null);

  return Boolean(response.ok && data?.valid === true);
}

function getReturnUrl(req, sessionId, step, flow = "workink") {
  const isOpera = flow === "opera";
  const url = new URL(`${getOrigin(req)}/${isOpera ? "opera" : "workink"}`);
  url.searchParams.set(isOpera ? "verify" : step === 1 ? "ok" : "done", "");
  url.searchParams.set("session", sessionId);
  url.searchParams.set("token", "{TOKEN}");
  return url.toString();
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

  if (session.status !== "pending" || new Date(session.expires_at).getTime() <= Date.now()) {
    const expired = new Error("Work.ink session expired");
    expired.statusCode = 410;
    throw expired;
  }

  if (!session.step_one_url || !session.step_one_url.startsWith("https://work.ink/")) {
    const notFound = new Error("Work.ink session not found");
    notFound.statusCode = 404;
    throw notFound;
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
      const flow = req.body?.flow === "opera" ? "opera" : "workink";
      const id = randomUUID();
      const expiresAt = new Date(Date.now() + SESSION_LIFETIME_MS).toISOString();
      const { error: insertError } = await supabase.from("earnpaste_sessions").insert({
        id,
        current_step: 1,
        status: "pending",
        step_started_at: new Date().toISOString(),
        step_two_url: flow === "opera" ? "opera" : null,
        expires_at: expiresAt,
      });

      if (insertError) {
        console.error("Work.ink session insert error:", insertError);
        return res.status(500).json({ error: "Could not create Work.ink session" });
      }

      const url = await createOverrideUrl(getReturnUrl(req, id, 1, flow));
      const { error: updateError } = await supabase
        .from("earnpaste_sessions")
        .update({ step_one_url: url })
        .eq("id", id)
        .eq("status", "pending")
        .eq("current_step", 1);

      if (updateError) {
        console.error("Work.ink step-one URL update error:", updateError);
        return res.status(500).json({ error: "Could not prepare the Work.ink checkpoint" });
      }

      return res.status(200).json({ url, session: id, step: 1, flow, expires_at: expiresAt });
    }

    if (action !== "verify") {
      return res.status(400).json({ error: "Unknown Work.ink action" });
    }

    const sessionId = typeof req.body?.session === "string" ? req.body.session.trim() : "";
    const token = typeof req.body?.token === "string" ? req.body.token.trim() : "";
    const step = Number(req.body?.step);

    if (!sessionId || !token || !Number.isInteger(step) || ![1, 2].includes(step)) {
      return res.status(400).json({ error: "Missing or invalid Work.ink verification data" });
    }

    const session = await getPendingSession(supabase, sessionId);
    const isOperaSession = session.step_two_url === "opera";
    if (session.current_step !== step || (isOperaSession && step !== 1)) {
      return res.status(409).json({ error: "This Work.ink checkpoint is no longer active" });
    }

    const valid = await validateWorkinkToken(token);
    if (!valid) {
      return res.status(403).json({ error: "Work.ink could not verify the completed checkpoint" });
    }

    const now = new Date().toISOString();
    if (isOperaSession) {
      const { error: updateError } = await supabase
        .from("earnpaste_sessions")
        .update({
          status: "completed",
          completed_at: now,
        })
        .eq("id", sessionId)
        .eq("status", "pending")
        .eq("current_step", 1);

      if (updateError) {
        console.error("Opera Work.ink completion error:", updateError);
        return res.status(409).json({ error: "This Opera offer was already processed" });
      }

      return res.status(200).json({ accepted: true, session: sessionId, step: 1, flow: "opera" });
    }

    if (step === 1) {
      const nextUrl = await createOverrideUrl(getReturnUrl(req, sessionId, 2));
      const { error: updateError } = await supabase
        .from("earnpaste_sessions")
        .update({
          current_step: 2,
          step_started_at: now,
          step_two_url: nextUrl,
        })
        .eq("id", sessionId)
        .eq("status", "pending")
        .eq("current_step", 1);

      if (updateError) {
        console.error("Work.ink step-one completion error:", updateError);
        return res.status(409).json({ error: "This Work.ink checkpoint was already processed" });
      }

      return res.status(200).json({ url: nextUrl, session: sessionId, step: 2 });
    }

    const { error: updateError } = await supabase
      .from("earnpaste_sessions")
      .update({
        status: "completed",
        completed_at: now,
      })
      .eq("id", sessionId)
      .eq("status", "pending")
      .eq("current_step", 2);

    if (updateError) {
      console.error("Work.ink step-two completion error:", updateError);
      return res.status(409).json({ error: "This Work.ink checkpoint was already processed" });
    }

    return res.status(200).json({ accepted: true, session: sessionId, step: 2 });
  } catch (error) {
    console.error("Work.ink handler error:", error);
    const statusCode = Number.isInteger(error?.statusCode) ? error.statusCode : 502;
    return res.status(statusCode).json({ error: error instanceof Error ? error.message : "Work.ink request failed" });
  }
}
