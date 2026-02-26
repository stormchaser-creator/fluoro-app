import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { syncToCloud, restoreFromCloud } from '../lib/supabase';

const AppContext = createContext();

const STORAGE_KEY = 'fluoro_app_state';
const CLOUD_TABLE = 'fluoro_app_state';

function getToday() {
  return new Date().toISOString().split('T')[0];
}

const defaultState = {
  onboardingComplete: false,
  currentDay: 1,
  completedDays: {},
  streak: { current: 0, longest: 0, lastStudyDate: null },
  xp: 0,
  rsvpWpm: 300,
  rsvpChunk: 1,
};

function migrateFromV1() {
  const oldDay = localStorage.getItem('fluoro_currentDay');
  const oldCompleted = localStorage.getItem('fluoro_completedDays');
  const oldWpm = localStorage.getItem('fluoro_rsvpWpm');
  const oldChunk = localStorage.getItem('fluoro_rsvpChunk');

  if (oldDay || oldCompleted) {
    const migrated = {
      ...defaultState,
      onboardingComplete: true,
      currentDay: oldDay ? JSON.parse(oldDay) : 1,
      completedDays: oldCompleted ? JSON.parse(oldCompleted) : {},
      rsvpWpm: oldWpm ? parseInt(oldWpm) || 300 : 300,
      rsvpChunk: oldChunk ? parseInt(oldChunk) || 1 : 1,
    };
    ['fluoro_currentDay', 'fluoro_completedDays', 'fluoro_rsvpWpm', 'fluoro_rsvpChunk', 'fluoro_darkMode']
      .forEach(k => localStorage.removeItem(k));
    return migrated;
  }
  return null;
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...defaultState, ...JSON.parse(saved) };
    const migrated = migrateFromV1();
    if (migrated) return migrated;
    return defaultState;
  } catch {
    return defaultState;
  }
}

// Pick the state with more progress (higher XP = more usage)
function pickBestState(local, cloud) {
  if (!cloud) return local;
  if (!local || local.xp === 0) return { ...defaultState, ...cloud };
  // Cloud wins if it has more XP (more progress)
  if ((cloud.xp || 0) > (local.xp || 0)) return { ...defaultState, ...cloud };
  return local;
}

function appReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE_FROM_CLOUD':
      return { ...state, ...action.state };
    case 'SET_DAY':
      return { ...state, currentDay: Math.max(1, Math.min(30, action.day)) };
    case 'TOGGLE_DAY': {
      const day = action.day;
      const newCompleted = { ...state.completedDays, [day]: !state.completedDays[day] };
      return { ...state, completedDays: newCompleted };
    }
    case 'ADD_XP': {
      const newXp = state.xp + action.amount;
      return { ...state, xp: newXp };
    }
    case 'UPDATE_STREAK': {
      const today = getToday();
      if (state.streak.lastStudyDate === today) return state;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const newCurrent = state.streak.lastStudyDate === yesterday ? state.streak.current + 1 : 1;
      return {
        ...state,
        streak: {
          current: newCurrent,
          longest: Math.max(state.streak.longest, newCurrent),
          lastStudyDate: today,
        },
      };
    }
    case 'SET_RSVP_WPM':
      return { ...state, rsvpWpm: action.wpm };
    case 'SET_RSVP_CHUNK':
      return { ...state, rsvpChunk: action.chunk };
    case 'COMPLETE_ONBOARDING':
      return { ...state, onboardingComplete: true };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, null, loadState);
  const cloudRestored = useRef(false);

  // Restore from cloud on mount (if cloud has better data)
  useEffect(() => {
    if (cloudRestored.current) return;
    cloudRestored.current = true;
    restoreFromCloud(CLOUD_TABLE).then(cloudState => {
      if (cloudState) {
        const local = loadState();
        const best = pickBestState(local, cloudState);
        if (best !== local) {
          dispatch({ type: 'HYDRATE_FROM_CLOUD', state: best });
        }
      }
    });
  }, []);

  // Persist to localStorage + cloud on every state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch { /* silently fail */ }
    syncToCloud(CLOUD_TABLE, state);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
