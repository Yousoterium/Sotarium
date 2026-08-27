-- ============================================================================
-- Sotarium key system — secure Supabase schema
-- Run this once in the SQL Editor of the replacement Supabase project.
-- Key lookup and claiming are performed by Vercel server routes using
-- SUPABASE_SERVICE_ROLE_KEY. The existing public key-generation flow may only
-- insert a newly issued, unclaimed key; it cannot read, alter, or delete keys.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.keys (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_string        text UNIQUE NOT NULL,
  provider          text NOT NULL,
  expires_at        timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  claimed           boolean NOT NULL DEFAULT false,
  owner_roblox_id   text,
  owner_username    text,
  is_products_key   boolean NOT NULL DEFAULT false,
  CONSTRAINT keys_key_format CHECK (key_string ~ '^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}$')
);

CREATE INDEX IF NOT EXISTS idx_keys_owner_roblox_id ON public.keys(owner_roblox_id);
CREATE INDEX IF NOT EXISTS idx_keys_expires_at ON public.keys(expires_at);

ALTER TABLE public.keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_keys" ON public.keys;
DROP POLICY IF EXISTS "anon_insert_keys" ON public.keys;
DROP POLICY IF EXISTS "anon_update_keys" ON public.keys;
DROP POLICY IF EXISTS "anon_delete_keys" ON public.keys;

CREATE POLICY "anon_insert_unclaimed_keys" ON public.keys
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    claimed = false
    AND owner_roblox_id IS NULL
    AND owner_username IS NULL
    AND key_string ~ '^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{3}$'
  );

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON TABLE public.keys TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.keys TO service_role;

CREATE TABLE IF NOT EXISTS public.key_authorized_devices (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_id          uuid NOT NULL REFERENCES public.keys(id) ON DELETE CASCADE,
  roblox_id       text NOT NULL,
  roblox_username text,
  added_at        timestamptz NOT NULL DEFAULT now(),
  added_by        text NOT NULL DEFAULT 'owner',
  CONSTRAINT uq_key_authorized_devices UNIQUE (key_id, roblox_id)
);

CREATE INDEX IF NOT EXISTS idx_key_authorized_devices_key_id
  ON public.key_authorized_devices(key_id);
CREATE INDEX IF NOT EXISTS idx_key_authorized_devices_roblox_id
  ON public.key_authorized_devices(roblox_id);

ALTER TABLE public.key_authorized_devices ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.key_authorized_devices TO service_role;

DROP POLICY IF EXISTS "anon_select_key_authorized_devices" ON public.key_authorized_devices;
DROP POLICY IF EXISTS "anon_insert_key_authorized_devices" ON public.key_authorized_devices;
DROP POLICY IF EXISTS "anon_update_key_authorized_devices" ON public.key_authorized_devices;
DROP POLICY IF EXISTS "anon_delete_key_authorized_devices" ON public.key_authorized_devices;


-- Earnpaste two-step sessions are created, rotated, and completed only by the
-- Vercel server route. They are not exposed to the browser or public database roles.
CREATE TABLE IF NOT EXISTS public.earnpaste_sessions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  current_step    smallint NOT NULL DEFAULT 1 CHECK (current_step IN (1, 2)),
  status          text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  step_started_at timestamptz NOT NULL DEFAULT now(),
  expires_at      timestamptz NOT NULL,
  completed_at    timestamptz,
  step_one_url    text,
  step_two_url    text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_earnpaste_sessions_expires_at
  ON public.earnpaste_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_earnpaste_sessions_status
  ON public.earnpaste_sessions(status);

ALTER TABLE public.earnpaste_sessions ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.earnpaste_sessions TO service_role;

DROP POLICY IF EXISTS "anon_select_earnpaste_sessions" ON public.earnpaste_sessions;
DROP POLICY IF EXISTS "anon_insert_earnpaste_sessions" ON public.earnpaste_sessions;
DROP POLICY IF EXISTS "anon_update_earnpaste_sessions" ON public.earnpaste_sessions;
DROP POLICY IF EXISTS "anon_delete_earnpaste_sessions" ON public.earnpaste_sessions;
