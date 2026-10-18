import { EXAM_CATEGORIES } from '../data/examBlueprint.js';

export const EMPTY_COACH = { version: 1, cards: {}, attempts: [], examDate: '', lessons: {} };
const DAY = 86400000;

export function recordCoachAnswer(state, question, correct, confidence, now = Date.now()) {
  const previous = state.cards[question.id] || {};
  const streak = correct && confidence === 'sure' ? (previous.streak || 0) + 1 : 0;
  // Uncertain correct answers return tomorrow; errors return after 10 minutes.
  const delay = !correct ? 10 * 60000 : confidence !== 'sure' ? DAY : [1, 3, 7, 14, 30][Math.min(streak - 1, 4)] * DAY;
  return {
    ...state,
    cards: { ...state.cards, [question.id]: { correct, confidence, streak, due: now + delay, lastAnswered: now } },
    attempts: [...state.attempts, { id: question.id, category: question.category, lessonId: question.lessonId, correct, confidence, at: now }].slice(-1000),
  };
}

export function categoryEvidence(state) {
  return EXAM_CATEGORIES.map(category => {
    const attempts = state.attempts.filter(a => a.category === category.id).slice(-20);
    const distinct = new Set(attempts.map(a => a.id)).size;
    const accuracy = attempts.length ? Math.round(attempts.filter(a => a.correct).length / attempts.length * 100) : null;
    return { ...category, attempts: attempts.length, distinct, accuracy,
      priority: category.count / 90 * (accuracy === null ? 1 : 1 - accuracy / 100 + 0.2) };
  }).sort((a, b) => b.priority - a.priority);
}

export function selectCoachSession(questions, state, mode = 'daily', now = Date.now(), count = 10) {
  if (mode === 'diagnostic') {
    // Sample different concepts before returning to a second item in a lesson.
    return EXAM_CATEGORIES.flatMap(c => diverseTake(questions.filter(q => q.category === c.id), 3));
  }
  if (mode.startsWith('lesson:')) return questions.filter(q => q.lessonId === mode.slice(7));
  if (mode === 'mistakes') return questions.filter(q => state.cards[q.id] && (!state.cards[q.id].correct || state.cards[q.id].confidence !== 'sure')).slice(0, count);
  const priorities = Object.fromEntries(categoryEvidence(state).map(c => [c.id, c.priority]));
  const ranked = questions.filter(q => mode !== 'due' || (state.cards[q.id] && state.cards[q.id].due <= now))
    .map((q, index) => {
      const card = state.cards[q.id];
      const rank = card && card.due <= now ? 3 : !card ? 2 : 0;
      return { q, rank, priority: priorities[q.category], due: card?.due ?? 0, index };
    })
    .sort((a, b) => b.rank - a.rank || b.priority - a.priority || a.due - b.due || a.index - b.index)
    .filter(x => x.rank > 0);
  const overdue = diverseTake(ranked.filter(x => x.rank === 3).map(x => x.q), count);
  return [...overdue, ...diverseTake(ranked.filter(x => x.rank === 2).map(x => x.q), count - overdue.length)];
}

function diverseTake(pool, count) {
  if (count <= 0) return [];
  const selected = [], seen = new Set();
  for (const q of pool) {
    if (seen.has(q.lessonId)) continue;
    selected.push(q); seen.add(q.lessonId);
    if (selected.length === count) return selected;
  }
  return [...selected, ...pool.filter(q => !selected.includes(q))].slice(0, count);
}

export function lessonEvidence(lesson, questions, state) {
  const pool = questions.filter(q => q.lessonId === lesson.id);
  const tested = pool.filter(q => state.cards[q.id]);
  const secure = tested.filter(q => state.cards[q.id].correct && state.cards[q.id].confidence === 'sure');
  const errors = tested.filter(q => !state.cards[q.id].correct);
  return { total: pool.length, tested: tested.length, secure: secure.length, errors: errors.length,
    status: errors.length ? 'Relearn this concept' : !tested.length ? 'Not tested yet' : secure.length < tested.length ? 'Correct but uncertain' : 'Check retention later' };
}

export function selectTimedPractice(questions, count = 30, random = Math.random) {
  const targets = EXAM_CATEGORIES.map(c => ({ ...c, quota: Math.floor(count * c.count / 90), remainder: count * c.count / 90 % 1 }));
  let remaining = count - targets.reduce((sum, c) => sum + c.quota, 0);
  for (const c of [...targets].sort((a, b) => b.remainder - a.remainder)) {
    if (remaining-- <= 0) break;
    c.quota++;
  }
  const shuffle = values => {
    const a = [...values];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const selected = targets.flatMap(c => shuffle(questions.filter(q => q.category === c.id)).slice(0, c.quota));
  return shuffle(selected);
}

export function gradePractice(questions, responses) {
  return questions.map(q => ({ id: q.id, choice: responses[q.id]?.choice ?? null,
    confidence: responses[q.id]?.confidence || 'unsure', correct: responses[q.id]?.choice === q.answer }));
}

export function daysUntilExam(date, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return null;
  const [year, month, day] = date.split('-').map(Number);
  const target = Date.UTC(year, month - 1, day);
  if (!Number.isFinite(target)) return null;
  return Math.round((target - Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())) / DAY);
}

export function parseCoachBackup(value, questions) {
  if (!value || value.version !== 1 || !value.cards || typeof value.cards !== 'object' || Array.isArray(value.cards) || !Array.isArray(value.attempts)) throw new Error('Choose a FluoroPath study coach backup.');
  const ids = new Set(questions.map(q => q.id));
  const categories = new Set(EXAM_CATEGORIES.map(c => c.id));
  const cards = Object.fromEntries(Object.entries(value.cards).filter(([id, c]) => ids.has(id) && c && typeof c.correct === 'boolean' && ['sure', 'unsure'].includes(c.confidence) && Number.isFinite(c.due) && Number.isFinite(c.lastAnswered) && Number.isInteger(c.streak) && c.streak >= 0));
  const attempts = value.attempts.filter(a => a && ids.has(a.id) && categories.has(a.category) && typeof a.correct === 'boolean' && Number.isFinite(a.at)).slice(-1000);
  const lessons = value.lessons && typeof value.lessons === 'object' && !Array.isArray(value.lessons)
    ? Object.fromEntries(Object.entries(value.lessons).filter(([id, l]) => /^[a-z-]+$/.test(id) && l && Number.isFinite(l.readAt)).map(([id, l]) => [id, { readAt: l.readAt, reflection: typeof l.reflection === 'string' ? l.reflection.slice(0, 4000) : '' }])) : {};
  return { version: 1, cards, attempts, lessons, examDate: /^\d{4}-\d{2}-\d{2}$/.test(value.examDate || '') ? value.examDate : '' };
}
