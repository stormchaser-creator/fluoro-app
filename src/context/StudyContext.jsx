import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { syncToCloud, restoreFromCloud } from '../lib/supabase';

const StudyContext = createContext();

const STORAGE_KEY = 'fluoro_study_state';
const CLOUD_TABLE = 'fluoro_study_state';

const defaultState = {
  quizResults: {},
  flaggedQuestions: [],
  missedQuestions: [],
  reviewQueue: [],
  totalAnswered: 0,
  totalCorrect: 0,
  maxWpm: 300,
  domainsStudied: [],
  lateNightSessions: 0,
  readSections: {},  // { domainId: [0, 2, 5] } — indices of read sections
};

function migrateQuizResults() {
  try {
    const old = localStorage.getItem('fluoro_quizResults');
    if (old) {
      const parsed = JSON.parse(old);
      localStorage.removeItem('fluoro_quizResults');
      return parsed;
    }
  } catch { /* ignore */ }
  return null;
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...defaultState, ...JSON.parse(saved) };
    const oldResults = migrateQuizResults();
    if (oldResults) return { ...defaultState, quizResults: oldResults };
    return defaultState;
  } catch {
    return defaultState;
  }
}

// Pick the state with more progress (more answers = more usage)
function pickBestState(local, cloud) {
  if (!cloud) return local;
  if (!local || local.totalAnswered === 0) return { ...defaultState, ...cloud };
  const localProgress = (local.totalAnswered || 0) + Object.keys(local.readSections || {}).length;
  const cloudProgress = (cloud.totalAnswered || 0) + Object.keys(cloud.readSections || {}).length;
  if (cloudProgress > localProgress) return { ...defaultState, ...cloud };
  return local;
}

function studyReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE_FROM_CLOUD':
      return { ...state, ...action.state };
    case 'RECORD_ANSWER': {
      const { domain, correct, questionIndex } = action;
      const prev = state.quizResults[domain] || { correct: 0, wrong: 0 };
      const newResults = {
        ...state.quizResults,
        [domain]: {
          correct: prev.correct + (correct ? 1 : 0),
          wrong: prev.wrong + (correct ? 0 : 1),
        },
      };
      const newMissed = correct
        ? state.missedQuestions
        : [...new Set([...state.missedQuestions, `${domain}-${questionIndex}`])];
      const newDomains = state.domainsStudied.includes(domain)
        ? state.domainsStudied
        : [...state.domainsStudied, domain];
      const hour = new Date().getHours();
      return {
        ...state,
        quizResults: newResults,
        missedQuestions: newMissed,
        totalAnswered: state.totalAnswered + 1,
        totalCorrect: state.totalCorrect + (correct ? 1 : 0),
        domainsStudied: newDomains,
        lateNightSessions: hour >= 22 ? state.lateNightSessions + 1 : state.lateNightSessions,
      };
    }
    case 'TOGGLE_FLAG': {
      const qid = action.questionId;
      const flagged = state.flaggedQuestions.includes(qid)
        ? state.flaggedQuestions.filter(f => f !== qid)
        : [...state.flaggedQuestions, qid];
      return { ...state, flaggedQuestions: flagged };
    }
    case 'SET_MAX_WPM':
      return { ...state, maxWpm: Math.max(state.maxWpm, action.wpm) };
    case 'CLEAR_MISSED':
      return { ...state, missedQuestions: [] };
    case 'MARK_SECTION_READ': {
      const { domain, sectionIndex } = action;
      const prev = state.readSections[domain] || [];
      if (prev.includes(sectionIndex)) return state;
      return {
        ...state,
        readSections: {
          ...state.readSections,
          [domain]: [...prev, sectionIndex].sort((a, b) => a - b),
        },
      };
    }
    default:
      return state;
  }
}

export function StudyProvider({ children }) {
  const [state, dispatch] = useReducer(studyReducer, null, loadState);
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
    <StudyContext.Provider value={{ study: state, studyDispatch: dispatch }}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error('useStudy must be used within StudyProvider');
  return ctx;
}
