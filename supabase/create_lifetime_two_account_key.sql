-- Run supabase/two-account-lifetime-keys.sql first.
-- This generates and returns one lifetime key that can bind to at most two Roblox accounts.
WITH generated_key AS (
  SELECT upper(
    substr(replace(gen_random_uuid()::text, '-', ''), 1, 3) || '-' ||
    substr(replace(gen_random_uuid()::text, '-', ''), 1, 3) || '-' ||
    substr(replace(gen_random_uuid()::text, '-', ''), 1, 3)
  ) AS key_string
)
INSERT INTO public.keys (
  key_string,
  provider,
  expires_at,
  claimed,
  max_roblox_accounts,
  is_products_key
)
SELECT
  key_string,
  'manual_lifetime',
  NULL,
  false,
  2,
  true
FROM generated_key
ON CONFLICT (key_string) DO NOTHING
RETURNING key_string, max_roblox_accounts, expires_at;
