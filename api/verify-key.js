import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Client-Info, Apikey");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ valid: false, message: "Method not allowed" });
  }

  try {
    let body = req.body;
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

    if (!normalized.match(/^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}$/)) {
      return res.status(200).json({ valid: false, message: "Key Invalid" });
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return res.status(500).json({ valid: false, message: "Server not configured" });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const { data, error } = await supabase
      .from("keys")
      .select("id, key_string, expires_at, claimed, owner_roblox_id, owner_username")
      .eq("key_string", normalized)
      .maybeSingle();

    if (error) {
      console.error("Supabase query error:", error);
      return res.status(500).json({ valid: false, message: "Key Invalid" });
    }

    if (!data) {
      return res.status(200).json({ valid: false, message: "Key Invalid" });
    }

    if (data.claimed && data.owner_roblox_id) {
      const ownerId = String(data.owner_roblox_id);
      const incomingId = String(robloxId).trim();
      if (ownerId !== incomingId) {
        return res.status(200).json({ valid: false, message: "Key already assigned to another account" });
      }
    }

    if (!data.claimed) {
      const { error: updateError } = await supabase
        .from("keys")
        .update({
          claimed: true,
          owner_roblox_id: String(robloxId).trim(),
          owner_username: robloxUsername ? String(robloxUsername).trim() : null,
        })
        .eq("id", data.id);

      if (updateError) {
        console.error("Supabase update error:", updateError);
        return res.status(500).json({ valid: false, message: "Could not bind key to account" });
      }
    }

    if (data.expires_at) {
      const expiresAt = new Date(data.expires_at);
      const now = new Date();
      if (expiresAt <= now) {
        return res.status(200).json({ valid: false, message: "Key Expired" });
      }

      const remainingMs = expiresAt.getTime() - now.getTime();
      const remainingSeconds = Math.floor(remainingMs / 1000);

      return res.status(200).json({
        valid: true,
        status: "success",
        message: "Access granted.",
        expires_at: data.expires_at,
        remaining_seconds: remainingSeconds,
      });
    }

    return res.status(200).json({
      valid: true,
      status: "success",
      message: "Access granted.",
      expires_at: null,
      remaining_seconds: null,
    });
  } catch (err) {
    console.error("Verify key handler error:", err);
    return res.status(500).json({ valid: false, message: "Key Invalid" });
  }
}
