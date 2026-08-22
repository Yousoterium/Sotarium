import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
const DEFAULT_ALLOWED_IPS = ["24.49.252.230"];
const PAGE_SIZE = 1000;

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
  return value === "success" || value === "error" || value === "info" || value === "pending"
    ? value
    : fallback;
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
    return res.status(403).json({ authorized: false, ip: clientIp, error: "Access denied" });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Logs endpoint is missing Supabase server credentials");
    return res.status(500).json({ authorized: true, error: "Logs service is not configured" });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const [keys, providerEvents] = await Promise.all([
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
    ]);

    const keyLogs = keys.map((key) => {
      const owner = key.owner_username || key.owner_roblox_id || "Unknown";
      const expiry = key.expires_at ? ` · expires ${new Date(key.expires_at).toLocaleString("en-US", { timeZone: "UTC", timeZoneName: "short" })}` : "";

      return {
        id: `key:${key.id}`,
        time: key.created_at,
        providerName: key.provider || "Lootlabs",
        message: key.claimed
          ? `Key ${key.key_string} claimed by Roblox user: ${owner}${expiry}`
          : `Key generated: ${key.key_string}${expiry}`,
        status: key.claimed ? "success" : "pending",
        source: "key",
      };
    });

    const eventLogs = providerEvents.map((event) => ({
      id: `event:${event.id}`,
      time: event.created_at,
      providerName: event.provider_name || "Unknown",
      message: event.message || "Provider event recorded",
      status: toLogStatus(event.status, "info"),
      source: "provider-event",
    }));

    const logs = [...keyLogs, ...eventLogs].sort((left, right) => {
      return new Date(right.time).getTime() - new Date(left.time).getTime();
    });

    return res.status(200).json({
      authorized: true,
      ip: clientIp,
      total: logs.length,
      logs,
    });
  } catch (error) {
    console.error("Logs endpoint error:", error);
    return res.status(500).json({ authorized: true, error: "Could not load logs" });
  }
}
