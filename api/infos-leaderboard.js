import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const ALLOWED_IP = "24.49.252.230";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Extract client IP
  const forwarded = req.headers["x-forwarded-for"];
  const rawIp = forwarded ? forwarded.split(",")[0].trim() : req.socket?.remoteAddress || "";
  const cleanIp = rawIp.replace(/^::ffff:/, "").trim();

  // Allow the specific IP (and localhost during dev)
  const isAllowed = cleanIp === ALLOWED_IP || cleanIp === "127.0.0.1" || cleanIp === "::1";

  if (!isAllowed) {
    return res.status(403).json({
      allowed: false,
      message: "Access forbidden",
    });
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ allowed: true, error: "Supabase not configured", leaderboard: [] });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Fetch all claimed keys
    const { data: keys, error } = await supabase
      .from("keys")
      .select("id, key_string, expires_at, claimed, owner_roblox_id, owner_username, created_at, provider")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      return res.status(500).json({ allowed: true, error: error.message, leaderboard: [] });
    }

    const now = new Date();
    const playerMap = new Map();
    let totalClaimed = 0;
    let totalActive = 0;

    (keys || []).forEach((k) => {
      if (!k.claimed && !k.owner_roblox_id && !k.owner_username) return;

      totalClaimed++;
      const playerId = String(k.owner_roblox_id || k.owner_username || "Unknown").trim();
      const username = k.owner_username || `Player_${playerId.slice(0, 6)}`;
      
      const isExpired = k.expires_at ? new Date(k.expires_at) <= now : false;
      if (!isExpired) totalActive++;

      if (!playerMap.has(playerId)) {
        playerMap.set(playerId, {
          roblox_id: k.owner_roblox_id || null,
          username: username,
          total_keys: 0,
          active_keys: 0,
          expired_keys: 0,
          last_claimed: k.created_at || null,
          provider_breakdown: {},
          keys_list: [],
        });
      }

      const player = playerMap.get(playerId);
      player.total_keys += 1;
      if (isExpired) {
        player.expired_keys += 1;
      } else {
        player.active_keys += 1;
      }

      if (!player.last_claimed || new Date(k.created_at) > new Date(player.last_claimed)) {
        player.last_claimed = k.created_at;
      }

      const prov = k.provider || "Standard";
      player.provider_breakdown[prov] = (player.provider_breakdown[prov] || 0) + 1;

      player.keys_list.push({
        key: k.key_string,
        expires_at: k.expires_at,
        is_expired: isExpired,
        created_at: k.created_at,
      });
    });

    // Convert map to sorted array (descending by total redeemed keys)
    const leaderboard = Array.from(playerMap.values()).sort((a, b) => {
      if (b.total_keys !== a.total_keys) {
        return b.total_keys - a.total_keys;
      }
      return new Date(b.last_claimed || 0).getTime() - new Date(a.last_claimed || 0).getTime();
    });

    return res.status(200).json({
      allowed: true,
      client_ip: cleanIp,
      stats: {
        total_keys_claimed: totalClaimed,
        total_unique_players: leaderboard.length,
        total_active_keys: totalActive,
      },
      leaderboard,
    });
  } catch (err) {
    console.error("Leaderboard handler error:", err);
    return res.status(500).json({ allowed: true, error: err.message, leaderboard: [] });
  }
}
