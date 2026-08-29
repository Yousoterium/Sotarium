import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const DEFAULT_ALLOWED_IPS = ["24.49.252.230", "127.0.0.1", "::1", "localhost", "::ffff:127.0.0.1"];
const PAGE_SIZE = 1000;
const SIXTEEN_MINUTES_MS = 16 * 60 * 1000;

function normalizeIp(value) {
  if (!value || typeof value !== "string") return null;

  let ip = value.trim();
  if (ip.includes(",")) ip = ip.split(",")[0].trim();
  if (ip.startsWith("::ffff:")) ip = ip.slice(7);
  if (ip.startsWith("[") && ip.endsWith("]")) ip = ip.slice(1, -1);

  return ip || null;
}

function getClientIp(req) {
  return normalizeIp(
    req.headers["x-vercel-forwarded-for"] ||
      req.headers["x-forwarded-for"] ||
      req.headers["x-real-ip"] ||
      req.socket?.remoteAddress ||
      "",
  );
}

function getAllowedIps() {
  const configured = process.env.LOGS_ALLOWED_IPS;
  if (!configured) return DEFAULT_ALLOWED_IPS;

  const allowed = configured
    .split(",")
    .map(normalizeIp)
    .filter(Boolean);

  return allowed.length > 0 ? allowed : DEFAULT_ALLOWED_IPS;
}

function toLogStatus(value, fallback) {
  return value === "success" || value === "error" || value === "info" || value === "pending" || value === "processing" || value === "expired"
    ? value
    : fallback;
}

function getSessionProvider(session) {
  if (session.step_two_url === "opera") return "Opera";
  if (typeof session.step_one_url === "string" && session.step_one_url.includes("work.ink")) return "Work.ink";
  if (typeof session.step_two_url === "string" && session.step_two_url.includes("work.ink")) return "Work.ink";
  return "Work.ink";
}

function getSessionUrlLogs(session) {
  const providerName = getSessionProvider(session);
  const now = Date.now();
  const logs = [];

  const isSessionCompleted = session.status === "completed" || Boolean(session.completed_at);

  // Step 1 URL Log
  if (session.step_one_url) {
    const step1Start = session.created_at || session.step_started_at || new Date().toISOString();
    const step1StartTime = new Date(step1Start).getTime();
    const isStep1Completed = isSessionCompleted || session.current_step >= 2 || Boolean(session.step_two_url);
    const isStep1Expired = !isStep1Completed && (
      (now - step1StartTime > SIXTEEN_MINUTES_MS) ||
      (session.expires_at && now > new Date(session.expires_at).getTime()) ||
      session.status === "expired"
    );

    let status = "processing";
    if (isStep1Completed) {
      status = "success";
    } else if (isStep1Expired) {
      status = "expired";
    }

    const expiresAtIso = new Date(step1StartTime + SIXTEEN_MINUTES_MS).toISOString();

    logs.push({
      id: `url:${session.id}:step1`,
      sessionId: session.id,
      step: 1,
      time: step1Start,
      completedAt: isStep1Completed ? (session.completed_at || step1Start) : null,
      expiresAt: expiresAtIso,
      providerName,
      url: session.step_one_url,
      message: isStep1Completed
        ? `Step 1 verification URL completed successfully`
        : isStep1Expired
        ? `Step 1 verification URL expired after 16 minutes`
        : `Step 1 verification URL started — in Processing state (expires in 16m)`,
      status,
      source: "verification-url",
    });
  }

  // Step 2 URL Log
  if (session.step_two_url && session.step_two_url !== "opera") {
    const step2Start = session.step_started_at || session.created_at || new Date().toISOString();
    const step2StartTime = new Date(step2Start).getTime();
    const isStep2Completed = isSessionCompleted;
    const isStep2Expired = !isStep2Completed && (
      (now - step2StartTime > SIXTEEN_MINUTES_MS) ||
      (session.expires_at && now > new Date(session.expires_at).getTime()) ||
      session.status === "expired"
    );

    let status = "processing";
    if (isStep2Completed) {
      status = "success";
    } else if (isStep2Expired) {
      status = "expired";
    }

    const expiresAtIso = new Date(step2StartTime + SIXTEEN_MINUTES_MS).toISOString();

    logs.push({
      id: `url:${session.id}:step2`,
      sessionId: session.id,
      step: 2,
      time: step2Start,
      completedAt: isStep2Completed ? (session.completed_at || step2Start) : null,
      expiresAt: expiresAtIso,
      providerName,
      url: session.step_two_url,
      message: isStep2Completed
        ? `Step 2 verification URL completed successfully`
        : isStep2Expired
        ? `Step 2 verification URL expired after 16 minutes`
        : `Step 2 verification URL started — in Processing state (expires in 16m)`,
      status,
      source: "verification-url",
    });
  }

  // Fallback if session has no specific step URLs
  if (logs.length === 0) {
    const sessionStart = session.created_at || session.step_started_at || new Date().toISOString();
    const sessionStartTime = new Date(sessionStart).getTime();
    const isExpired = !isSessionCompleted && (
      (now - sessionStartTime > SIXTEEN_MINUTES_MS) ||
      (session.expires_at && now > new Date(session.expires_at).getTime()) ||
      session.status === "expired"
    );

    let status = "processing";
    if (isSessionCompleted) {
      status = "success";
    } else if (isExpired) {
      status = "expired";
    }

    logs.push({
      id: `session:${session.id}`,
      sessionId: session.id,
      step: session.current_step || 1,
      time: isSessionCompleted && session.completed_at ? session.completed_at : sessionStart,
      expiresAt: new Date(sessionStartTime + SIXTEEN_MINUTES_MS).toISOString(),
      providerName,
      message: isSessionCompleted
        ? `Verification completed — key issued`
        : isExpired
        ? `Verification session expired after 16 minutes`
        : `Verification session started — in Processing state`,
      status,
      source: "verification-session",
    });
  }

  return logs;
}

async function fetchAllRows(queryFactory) {
  const rows = [];
  let from = 0;

  while (true) {
    const { data, error } = await queryFactory().range(from, from + PAGE_SIZE - 1);
    if (error) throw error;

    const page = data || [];
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return rows;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "private, no-store, max-age=0");
  res.setHeader("Vary", "X-Forwarded-For, X-Real-IP");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ authorized: false, error: "Method not allowed" });
  }

  const clientIp = getClientIp(req);
  if (!clientIp || !getAllowedIps().includes(clientIp)) {
    return res.status(403).json({ authorized: false, error: "Access denied" });
  }

  const databaseKeys = [...new Set([SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY].filter(Boolean))];
  if (!SUPABASE_URL || databaseKeys.length === 0) {
    console.error("Logs endpoint is missing Supabase credentials");
    return res.status(500).json({ authorized: true, error: "Logs service is not configured" });
  }

  try {
    let lastError;

    for (const databaseKey of databaseKeys) {
      try {
        const supabase = createClient(SUPABASE_URL, databaseKey);
        const [keys, providerEvents, verificationSessions] = await Promise.all([
          fetchAllRows(() =>
            supabase
              .from("keys")
              .select("id, key_string, provider, expires_at, claimed, owner_roblox_id, owner_username, created_at")
              .order("created_at", { ascending: false }),
          ),
          fetchAllRows(() =>
            supabase
              .from("logs")
              .select("id, provider_name, message, status, created_at")
              .order("created_at", { ascending: false }),
          ).catch((error) => {
            // The logs table is optional on older projects; key history still remains available.
            console.warn("Could not read provider event history:", error.message || error);
            return [];
          }),
          fetchAllRows(() =>
            supabase
              .from("earnpaste_sessions")
              .select("id, current_step, status, created_at, completed_at, step_started_at, expires_at, step_one_url, step_two_url")
              .order("created_at", { ascending: false }),
          ).catch((error) => {
            console.warn("Could not read verification session history:", error.message || error);
            return [];
          }),
        ]);

        const keyLogs = keys.map((key) => {
          const owner = key.owner_username || key.owner_roblox_id || "Unknown";
          const expiry = key.expires_at ? ` · expires ${new Date(key.expires_at).toLocaleString("en-US", { timeZone: "UTC", timeZoneName: "short" })}` : "";

          return {
            id: `key:${key.id}`,
            time: key.created_at,
            providerName: key.provider || "Work.ink",
            message: key.claimed
              ? `Key ${key.key_string} claimed by Roblox user: ${owner}${expiry}`
              : `Key generated: ${key.key_string}${expiry}`,
            status: "success",
            source: "key",
          };
        });

        const eventLogs = providerEvents.map((event) => ({
          id: `event:${event.id}`,
          time: event.created_at,
          providerName: event.provider_name || "Work.ink",
          message: event.message || "Provider event recorded",
          status: toLogStatus(event.status, "info"),
          source: "provider-event",
        }));

        const sessionLogs = verificationSessions.flatMap((session) => getSessionUrlLogs(session));

        const logs = [...sessionLogs, ...keyLogs, ...eventLogs].sort((left, right) => {
          return new Date(right.time).getTime() - new Date(left.time).getTime();
        });

        return res.status(200).json({
          authorized: true,
          total: logs.length,
          logs,
        });
      } catch (error) {
        lastError = error;
        const canRetryWithFallback = error?.code === "PGRST303" && databaseKey !== databaseKeys.at(-1);
        if (!canRetryWithFallback) throw error;
        console.warn("Logs endpoint retrying with the configured read credential because the server JWT was rejected for clock skew.");
      }
    }

    throw lastError;
  } catch (error) {
    console.error("Logs endpoint error:", error);
    return res.status(500).json({ authorized: true, error: "Could not load logs" });
  }
}
