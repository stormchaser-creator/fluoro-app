import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hkpnnsjcwprrwobmpqyy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrcG5uc2pjd3BycndvYm1wcXl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwOTIwODksImV4cCI6MjA4NzY2ODA4OX0._8iVLrhaDshKbxWV4XIs9LuyuS_-25fmABwloazhB-U';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Auth Helpers ───────────────────────────────────────────

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function signInWithOAuth(provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: window.location.origin + '/' },
  });
  if (error) throw error;
  return data;
}

export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}

// ─── Profile Management ─────────────────────────────────────

export async function ensureProfile(authUserId) {
  if (!authUserId) return null;

  // Check if profile exists for this auth user
  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_user_id', authUserId)
    .maybeSingle();

  if (existing) return existing;

  // Create new profile linked to auth user
  const newId = crypto.randomUUID();
  const { data: created, error } = await supabase
    .from('profiles')
    .insert({ id: newId, auth_user_id: authUserId })
    .select()
    .single();

  if (error) {
    console.warn('[fluoro] Failed to create profile:', error.message);
    return null;
  }
  return created;
}

// ─── Cloud Sync (auth-based) ────────────────────────────────
// Uses auth_user_id instead of device_id for data ownership.

const syncTimers = {};

export function syncToCloud(table, state, authUserId) {
  if (!authUserId) return;
  const timerKey = `${table}-${authUserId}`;
  if (syncTimers[timerKey]) clearTimeout(syncTimers[timerKey]);
  syncTimers[timerKey] = setTimeout(async () => {
    try {
      await supabase.from(table).upsert(
        { auth_user_id: authUserId, state, updated_at: new Date().toISOString() },
        { onConflict: 'auth_user_id' }
      );
    } catch (e) {
      console.warn(`[fluoro] Cloud sync failed for ${table}:`, e.message);
    }
  }, 2000);
}

export async function restoreFromCloud(table, authUserId) {
  if (!authUserId) return null;
  try {
    const { data, error } = await supabase
      .from(table)
      .select('state, updated_at')
      .eq('auth_user_id', authUserId)
      .maybeSingle();

    if (error) throw error;
    return data?.state ?? null;
  } catch (e) {
    console.warn(`[fluoro] Cloud restore failed for ${table}:`, e.message);
    return null;
  }
}
