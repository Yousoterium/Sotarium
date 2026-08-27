import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Client-Info, Apikey");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ valid: false, message: "Method not allowed" });
  }

  try {
    let body = req.method === "GET" ? req.query : req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = { key: body };
      }
    }

    const key = body?.key || (typeof req.body === "string" ? req.body : null);
    const robloxId = body?.roblox_id || body?.robloxId || null;
    const robloxUsername = body?.roblox_username || body?.robloxUsername || null;

    if (!key || typeof key !== "string") {
      return res.status(400).json({ valid: false, message: "Missing key" });
    }
    if (!robloxId || typeof robloxId !== "string" || !robloxId.trim()) {
      return res.status(400).json({ valid: false, message: "Missing Roblox account" });
    }

    const normalized = key.trim().toUpperCase();
    if (!/^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(normalized)) {
      return res.status(200).json({ valid: false, message: "Key Invalid" });
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ valid: false, message: "Server not configured" });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await supabase
      .rpc("verify_and_bind_key", {
        p_key_string: normalized,
        p_roblox_id: String(robloxId).trim(),
        p_roblox_username: robloxUsername ? String(robloxUsername).trim() : null,
      })
      .maybeSingle();

    if (error) {
      console.error("Key verification RPC error:", error);
      return res.status(500).json({ valid: false, message: "Key verification unavailable" });
    }
    if (!data) {
      return res.status(200).json({ valid: false, message: "Key Invalid" });
    }

    return res.status(200).json({
      valid: Boolean(data.valid),
      status: data.valid ? "success" : "error",
      message: data.message || (data.valid ? "Access granted." : "Key Invalid"),
      expires_at: data.expires_at || null,
      remaining_seconds: data.remaining_seconds ?? null,
    });
  } catch (err) {
    console.error("Verify key handler error:", err);
    return res.status(500).json({ valid: false, message: "Key Invalid" });
  }
}
