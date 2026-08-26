-- Two-account lifetime-key migration for Sotarium.
-- Run this entire file once in the Supabase SQL Editor before deploying the updated API route.

ALTER TABLE public.keys
  ADD COLUMN IF NOT EXISTS max_roblox_accounts smallint NOT NULL DEFAULT 1;

ALTER TABLE public.keys
  DROP CONSTRAINT IF EXISTS keys_max_roblox_accounts_range;

ALTER TABLE public.keys
  ADD CONSTRAINT keys_max_roblox_accounts_range
  CHECK (max_roblox_accounts BETWEEN 1 AND 10);

-- The function locks the matching key row so two concurrent verification attempts
-- cannot both claim a third account.
CREATE OR REPLACE FUNCTION public.verify_and_bind_key(
  p_key_string text,
  p_roblox_id text,
  p_roblox_username text DEFAULT NULL
)
RETURNS TABLE (
  valid boolean,
  message text,
  expires_at timestamptz,
  remaining_seconds bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_key public.keys%ROWTYPE;
  v_account_count integer;
  v_is_authorized boolean;
  v_remaining_seconds bigint;
BEGIN
  SELECT *
    INTO v_key
    FROM public.keys
   WHERE key_string = upper(trim(p_key_string))
   FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 'Key Invalid'::text, NULL::timestamptz, NULL::bigint;
    RETURN;
  END IF;

  IF v_key.expires_at IS NOT NULL AND v_key.expires_at <= now() THEN
    RETURN QUERY SELECT false, 'Key Expired'::text, v_key.expires_at, 0::bigint;
    RETURN;
  END IF;

  -- Bring keys issued under the earlier one-owner model into the authorization table.
  IF v_key.owner_roblox_id IS NOT NULL THEN
    INSERT INTO public.key_authorized_devices (key_id, roblox_id, roblox_username, added_by)
    VALUES (v_key.id, v_key.owner_roblox_id, v_key.owner_username, 'legacy_owner')
    ON CONFLICT (key_id, roblox_id) DO NOTHING;
  END IF;

  SELECT EXISTS (
    SELECT 1
      FROM public.key_authorized_devices
     WHERE key_id = v_key.id
       AND roblox_id = trim(p_roblox_id)
  )
  INTO v_is_authorized;

  IF NOT v_is_authorized THEN
    SELECT count(*)
      INTO v_account_count
      FROM public.key_authorized_devices
     WHERE key_id = v_key.id;

    IF v_account_count >= v_key.max_roblox_accounts THEN
      RETURN QUERY SELECT false, 'Key has reached its Roblox account limit'::text, v_key.expires_at, NULL::bigint;
      RETURN;
    END IF;

    INSERT INTO public.key_authorized_devices (key_id, roblox_id, roblox_username, added_by)
    VALUES (v_key.id, trim(p_roblox_id), nullif(trim(p_roblox_username), ''), 'verify_key');
  END IF;

  -- Keep legacy owner columns populated with the first account for compatibility.
  UPDATE public.keys
     SET claimed = true,
         owner_roblox_id = coalesce(owner_roblox_id, trim(p_roblox_id)),
         owner_username = coalesce(owner_username, nullif(trim(p_roblox_username), ''))
   WHERE id = v_key.id;

  v_remaining_seconds := CASE
    WHEN v_key.expires_at IS NULL THEN NULL
    ELSE floor(extract(epoch FROM (v_key.expires_at - now())))::bigint
  END;

  RETURN QUERY SELECT true, 'Access granted.'::text, v_key.expires_at, v_remaining_seconds;
END;
$$;

REVOKE ALL ON FUNCTION public.verify_and_bind_key(text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_and_bind_key(text, text, text) TO service_role;

-- Issue a LIFETIME key that may bind to exactly two Roblox accounts.
-- Replace LIFE-2AC-KEY with any unique key that matches XXX-XXX-XXX.
INSERT INTO public.keys (
  key_string,
  provider,
  expires_at,
  claimed,
  owner_roblox_id,
  owner_username,
  max_roblox_accounts,
  is_products_key
) VALUES (
  'LIF-2AC-KEY',
  'manual_lifetime',
  NULL,
  false,
  NULL,
  NULL,
  2,
  true
);
