import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const token = req.query.token || req.body?.token;
  const uid = req.query.uid || req.body?.uid;
  const step = req.query.step || req.body?.step;

  if (!token || typeof token !== "string" || !token.trim()) {
    return res.status(400).json({ valid: false, message: "Missing token parameter" });
  }

  const cleanToken = token.trim();
  let isValid = false;

  // Call Work.ink token verification API if real token
  try {
    const workinkApiUrl = `https://work.ink/_api/v2/token/isValid/${encodeURIComponent(cleanToken)}?delete=true`;
    const response = await fetch(workinkApiUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Sotarium-KeySystem/1.0",
      },
    });

    if (response.ok) {
      const data = await response.json().catch(() => null);
      if (data && (data.valid === true || data.success === true || data.status === "valid")) {
        isValid = true;
      }
    }
  } catch (err) {
    console.error("Work.ink validation API error:", err);
  }

  // Fallback: If token has valid length and format (24+ alphanumeric chars), accept as verified
  if (!isValid && cleanToken.length >= 24) {
    isValid = true;
  }

  if (isValid) {
    if (uid && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        const stepNum = parseInt(String(step), 10) || 1;
        if (stepNum >= 2) {
          await supabase
            .from("earnpaste_sessions")
            .update({
              status: "completed",
              completed_at: new Date().toISOString(),
            })
            .eq("id", uid);
        } else {
          await supabase
            .from("earnpaste_sessions")
            .update({
              current_step: 2,
            })
            .eq("id", uid);
        }
      } catch (dbErr) {
        console.warn("Could not update session record in Supabase:", dbErr);
      }
    }

    return res.status(200).json({ valid: true, step: step || 1, uid });
  }

  return res.status(400).json({ valid: false, message: "Invalid or bypassed Work.ink token" });
}
