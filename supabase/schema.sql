-- ============================================================================
-- Sotarium — full schema, run once in Supabase SQL editor
-- ============================================================================

-- ── keys table ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS keys (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_string        text UNIQUE NOT NULL,
  provider          text NOT NULL,
  expires_at        timestamptz,
  created_at        timestamptz DEFAULT now(),
  claimed           boolean NOT NULL DEFAULT false,
  owner_roblox_id   text,
  owner_username    text,
  is_products_key   boolean NOT NULL DEFAULT false
);

ALTER TABLE keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_keys" ON keys;
CREATE POLICY "anon_select_keys" ON keys FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_keys" ON keys;
CREATE POLICY "anon_insert_keys" ON keys FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_keys" ON keys;
CREATE POLICY "anon_update_keys" ON keys FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_keys" ON keys;
CREATE POLICY "anon_delete_keys" ON keys FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_keys_owner_roblox_id ON keys(owner_roblox_id);

-- ── key_authorized_devices table ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS key_authorized_devices (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_id          uuid NOT NULL REFERENCES keys(id) ON DELETE CASCADE,
  roblox_id       text NOT NULL,
  roblox_username text,
  added_at        timestamptz DEFAULT now(),
  added_by        text NOT NULL DEFAULT 'owner'
);

ALTER TABLE key_authorized_devices ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_key_authorized_devices'
  ) THEN
    ALTER TABLE key_authorized_devices
      ADD CONSTRAINT uq_key_authorized_devices UNIQUE (key_id, roblox_id);
  END IF;
END $$;

DROP POLICY IF EXISTS "anon_select_key_authorized_devices" ON key_authorized_devices;
CREATE POLICY "anon_select_key_authorized_devices" ON key_authorized_devices FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_key_authorized_devices" ON key_authorized_devices;
CREATE POLICY "anon_insert_key_authorized_devices" ON key_authorized_devices FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_key_authorized_devices" ON key_authorized_devices;
CREATE POLICY "anon_update_key_authorized_devices" ON key_authorized_devices FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_key_authorized_devices" ON key_authorized_devices;
CREATE POLICY "anon_delete_key_authorized_devices" ON key_authorized_devices FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_key_authorized_devices_key_id     ON key_authorized_devices(key_id);
CREATE INDEX IF NOT EXISTS idx_key_authorized_devices_roblox_id  ON key_authorized_devices(roblox_id);
