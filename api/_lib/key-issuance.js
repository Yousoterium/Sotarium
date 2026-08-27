import { createHmac } from "crypto";

const KEY_LIFETIME_MS = 24 * 60 * 60 * 1000;
const KEY_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function keyForVerifiedSession(sessionId, provider, signingKey) {
  const digest = createHmac("sha256", signingKey)
    .update(`sotarium:verified-provider-key:${provider}:${sessionId}`)
    .digest();

  let characters = "";
  for (const byte of digest) {
    characters += KEY_ALPHABET[byte % KEY_ALPHABET.length];
    if (characters.length === 9) break;
  }

  return `${characters.slice(0, 3)}-${characters.slice(3, 6)}-${characters.slice(6, 9)}`;
}

export async function issueVerifiedSessionKey({ supabase, sessionId, provider, signingKey }) {
  if (!sessionId || !provider || !signingKey) {
    throw new Error("Verified-key issuance is not configured");
  }

  const keyString = keyForVerifiedSession(sessionId, provider, signingKey);
  const expiresAt = new Date(Date.now() + KEY_LIFETIME_MS).toISOString();

  const { data: existing, error: lookupError } = await supabase
    .from("keys")
    .select("key_string, expires_at")
    .eq("key_string", keyString)
    .maybeSingle();

  if (lookupError) {
    throw new Error("Could not check the verified key record");
  }

  if (existing) {
    return { key: existing.key_string, expires_at: existing.expires_at, issued: false };
  }

  const { error: insertError } = await supabase.from("keys").insert({
    key_string: keyString,
    provider,
    expires_at: expiresAt,
    claimed: false,
    is_products_key: false,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      const { data: conflicted, error: conflictError } = await supabase
        .from("keys")
        .select("key_string, expires_at")
        .eq("key_string", keyString)
        .maybeSingle();

      if (!conflictError && conflicted) {
        return { key: conflicted.key_string, expires_at: conflicted.expires_at, issued: false };
      }
    }

    throw new Error("Could not issue the verified key");
  }

  return { key: keyString, expires_at: expiresAt, issued: true };
}
