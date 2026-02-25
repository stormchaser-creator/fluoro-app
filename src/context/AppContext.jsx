import { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const STORAGE_KEY = 'fluoro_app_state';

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
  // Check for old localStorage keys and migrate
  const oldDay = localStorage.getItem('fluoro_currentDay');
  const oldCompleted = localStorage.getItem('fluoro_completedDays');
  const oldWpm = localStorage.getItem('fluoro_rsvpWpm');
  const oldChunk = localStorage.getItem('fluoro_rsvpChunk');

  if (oldDay || oldCompleted) {
    const migrated = {
      ...defaultState,
      onboardingComplete: true, // existing user
      currentDay: oldDay ? JSON.parse(oldDay) : 1,
      completedDays: oldCompleted ? JSON.parse(oldCompleted) : {},
      rsvpWpm: oldWpm ? parseInt(oldWpm) || 300 : 300,
      rsvpChunk: oldChunk ? parseInt(oldChunk) || 1 : 1,
    };
    // Clean up old keys
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

function appReducer(state, action) {
  switch (action.type) {
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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch { /* silently fail */ }
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
