-- FluoroPath — Supabase Auth Migration
-- Replaces device_id-based access with proper Supabase Auth (auth.uid()).
--
-- WHAT THIS DOES:
-- 1. Adds auth_user_id column to fluoro_app_state and fluoro_study_state
-- 2. Drops old device_id-based RLS policies
-- 3. Creates new auth.uid()-based RLS policies on all tables
-- 4. Creates a profiles table for future use (user preferences, etc.)
--
-- Run in Supabase Dashboard → SQL Editor
-- IMPORTANT: Run this AFTER enabling Email Auth in Supabase Dashboard → Authentication → Providers

-- =============================================
-- STEP 1: Add auth_user_id to existing state tables
-- =============================================

-- fluoro_app_state: add auth_user_id, make it the new identity column
ALTER TABLE fluoro_app_state
  ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE UNIQUE INDEX IF NOT EXISTS idx_fluoro_app_state_auth_user
  ON fluoro_app_state(auth_user_id);

-- fluoro_study_state: add auth_user_id, make it the new identity column
ALTER TABLE fluoro_study_state
  ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE UNIQUE INDEX IF NOT EXISTS idx_fluoro_study_state_auth_user
  ON fluoro_study_state(auth_user_id);

-- =============================================
-- STEP 2: Create profiles table
-- =============================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_auth_user ON profiles(auth_user_id);

-- =============================================
-- STEP 3: Drop ALL old RLS policies
-- =============================================

-- Drop old policies on fluoro_app_state
DROP POLICY IF EXISTS "anon_select" ON fluoro_app_state;
DROP POLICY IF EXISTS "anon_insert" ON fluoro_app_state;
DROP POLICY IF EXISTS "anon_update" ON fluoro_app_state;
DROP POLICY IF EXISTS "anon_delete" ON fluoro_app_state;
DROP POLICY IF EXISTS "device_select" ON fluoro_app_state;
DROP POLICY IF EXISTS "device_insert" ON fluoro_app_state;
DROP POLICY IF EXISTS "device_update" ON fluoro_app_state;
DROP POLICY IF EXISTS "device_delete" ON fluoro_app_state;
DROP POLICY IF EXISTS "Allow all" ON fluoro_app_state;
DROP POLICY IF EXISTS "Allow anonymous access" ON fluoro_app_state;

-- Drop old policies on fluoro_study_state
DROP POLICY IF EXISTS "anon_select" ON fluoro_study_state;
DROP POLICY IF EXISTS "anon_insert" ON fluoro_study_state;
DROP POLICY IF EXISTS "anon_update" ON fluoro_study_state;
DROP POLICY IF EXISTS "anon_delete" ON fluoro_study_state;
DROP POLICY IF EXISTS "device_select" ON fluoro_study_state;
DROP POLICY IF EXISTS "device_insert" ON fluoro_study_state;
DROP POLICY IF EXISTS "device_update" ON fluoro_study_state;
DROP POLICY IF EXISTS "device_delete" ON fluoro_study_state;
DROP POLICY IF EXISTS "Allow all" ON fluoro_study_state;
DROP POLICY IF EXISTS "Allow anonymous access" ON fluoro_study_state;

-- =============================================
-- STEP 4: Enable RLS on all tables
-- =============================================

ALTER TABLE fluoro_app_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE fluoro_study_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- =============================================
-- STEP 5: Create new auth-based RLS policies
-- =============================================

-- fluoro_app_state: authenticated users can only access their own row
CREATE POLICY "auth_select" ON fluoro_app_state
  FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY "auth_insert" ON fluoro_app_state
  FOR INSERT WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "auth_update" ON fluoro_app_state
  FOR UPDATE USING (auth_user_id = auth.uid());

CREATE POLICY "auth_delete" ON fluoro_app_state
  FOR DELETE USING (auth_user_id = auth.uid());

-- fluoro_study_state: authenticated users can only access their own row
CREATE POLICY "auth_select" ON fluoro_study_state
  FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY "auth_insert" ON fluoro_study_state
  FOR INSERT WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "auth_update" ON fluoro_study_state
  FOR UPDATE USING (auth_user_id = auth.uid());

CREATE POLICY "auth_delete" ON fluoro_study_state
  FOR DELETE USING (auth_user_id = auth.uid());

-- profiles: authenticated users can only access their own profile
CREATE POLICY "auth_profiles_select" ON profiles
  FOR SELECT USING (auth_user_id = auth.uid());

CREATE POLICY "auth_profiles_insert" ON profiles
  FOR INSERT WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "auth_profiles_update" ON profiles
  FOR UPDATE USING (auth_user_id = auth.uid());

CREATE POLICY "auth_profiles_delete" ON profiles
  FOR DELETE USING (auth_user_id = auth.uid());

-- =============================================
-- STEP 6: Migration helper — link device_id data to auth user
-- =============================================
-- Call after a user signs up to claim their existing device_id data.
-- Usage: supabase.rpc('link_fluoro_device_to_auth', { p_device_id: 'old-uuid', p_auth_user_id: 'auth-uuid' })

CREATE OR REPLACE FUNCTION link_fluoro_device_to_auth(p_device_id TEXT, p_auth_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Link app state
  UPDATE fluoro_app_state
  SET auth_user_id = p_auth_user_id,
      updated_at = NOW()
  WHERE device_id = p_device_id AND auth_user_id IS NULL;

  -- Link study state
  UPDATE fluoro_study_state
  SET auth_user_id = p_auth_user_id,
      updated_at = NOW()
  WHERE device_id = p_device_id AND auth_user_id IS NULL;

  RETURN TRUE;
END;
$$;

-- =============================================
-- NOTES
-- =============================================
-- After running this migration:
--
-- 1. Enable Email Auth in Supabase Dashboard → Authentication → Providers → Email
--    - Recommended: enable "Confirm email" for production
--    - For development: you can disable "Confirm email" for easier testing
--
-- 2. The old device_id column is kept for backward compatibility and migration.
--    Once all users have migrated to auth accounts, you can safely drop it:
--    ALTER TABLE fluoro_app_state DROP COLUMN device_id;
--    ALTER TABLE fluoro_study_state DROP COLUMN device_id;
--
-- 3. The app now uses auth_user_id as the upsert conflict column.
--    Cloud sync functions in supabase.js upsert on auth_user_id instead of device_id.
