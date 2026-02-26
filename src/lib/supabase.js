import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xwhotgkmlbqcyjpdhlbt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3aG90Z2ttbGJxY3lqcGRobGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwNjA5NTksImV4cCI6MjA4NzYzNjk1OX0.VI7sMUCh-IxSCSEouagYNBBIuQExbhF7uePSO0oNuXc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Stable device ID for identifying this browser
function getDeviceId() {
  let id = localStorage.getItem('fluoro_device_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('fluoro_device_id', id);
  }
  return id;
}

export const DEVICE_ID = getDeviceId();

/**
 * Save state to a Supabase table. Upserts by device_id.
 */
export async function syncToCloud(table, state) {
  try {
    await supabase.from(table).upsert(
      { device_id: DEVICE_ID, state, updated_at: new Date().toISOString() },
      { onConflict: 'device_id' }
    );
  } catch (e) {
    console.warn(`[fluoro] Cloud sync failed for ${table}:`, e.message);
  }
}

/**
 * Restore state from a Supabase table by device_id.
 * Returns the stored state object, or null if nothing found.
 */
export async function restoreFromCloud(table) {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('state, updated_at')
      .eq('device_id', DEVICE_ID)
      .maybeSingle();

    if (error) throw error;
    return data?.state ?? null;
  } catch (e) {
    console.warn(`[fluoro] Cloud restore failed for ${table}:`, e.message);
    return null;
  }
}
