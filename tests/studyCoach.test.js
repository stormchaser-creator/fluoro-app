import test from 'node:test';
import assert from 'node:assert/strict';
import { COACH_QUESTIONS } from '../src/data/coachQuestions.js';
import { EXAM_CATEGORIES, questionIndexInDomain } from '../src/data/examBlueprint.js';
import { QUESTIONS } from '../src/data/questions.js';
import { EMPTY_COACH, recordCoachAnswer, selectCoachSession, parseCoachBackup, daysUntilExam, categoryEvidence } from '../src/lib/studyCoach.js';

test('baseline samples every category without duplicate questions', () => {
  const session = selectCoachSession(COACH_QUESTIONS, EMPTY_COACH, 'diagnostic');
  assert.equal(session.length, 10);
  assert.equal(new Set(session.map(q => q.id)).size, 10);
  for (const c of EXAM_CATEGORIES) assert.equal(session.filter(q => q.category === c.id).length, 2);
  assert.equal(EXAM_CATEGORIES.reduce((n, c) => n + c.count, 0), 90);
});

test('wrong, uncertain, and confident responses produce distinct review intervals', () => {
  const q = COACH_QUESTIONS[0], now = 100000000;
  const wrong = recordCoachAnswer(EMPTY_COACH, q, false, 'sure', now);
  assert.equal(wrong.cards[q.id].due, now + 600000);
  assert.equal(wrong.cards[q.id].streak, 0);
  const uncertain = recordCoachAnswer(wrong, q, true, 'unsure', now);
  assert.equal(uncertain.cards[q.id].due, now + 86400000);
  const first = recordCoachAnswer(EMPTY_COACH, q, true, 'sure', now);
  const second = recordCoachAnswer(first, q, true, 'sure', now + 86400000);
  assert.equal(second.cards[q.id].due, now + 4 * 86400000);
  assert.equal(EMPTY_COACH.attempts.length, 0);
});

test('daily selection prioritizes due errors and excludes future scheduled cards', () => {
  const q = COACH_QUESTIONS[0], now = 100000000;
  const state = recordCoachAnswer(EMPTY_COACH, q, false, 'sure', now);
  assert.equal(selectCoachSession(COACH_QUESTIONS, state, 'due', now).length, 0);
  assert.equal(selectCoachSession(COACH_QUESTIONS, state, 'daily', now + 600001)[0].id, q.id);
  const due = selectCoachSession(COACH_QUESTIONS, state, 'due', now + 600001);
  assert.deepEqual(due.map(q => q.id), [q.id]);
});

test('practice evidence remains absent for untested categories', () => {
  const evidence = categoryEvidence(EMPTY_COACH);
  assert.ok(evidence.every(c => c.accuracy === null && c.distinct === 0));
  assert.equal(evidence[0].id, 'rad_protection');
});

test('all starter items have valid choices, unique IDs, and known categories', () => {
  assert.equal(new Set(COACH_QUESTIONS.map(q => q.id)).size, COACH_QUESTIONS.length);
  for (const q of COACH_QUESTIONS) {
    assert.ok(EXAM_CATEGORIES.some(c => c.id === q.category));
    assert.equal(q.options.length, 4);
    assert.ok(q.answer >= 0 && q.answer < q.options.length);
    assert.equal(new Set(q.options).size, 4);
    assert.ok(q.explanation && q.source && q.section);
  }
});

test('review IDs resolve the same question after a shuffled or copied session', () => {
  for (const q of [...QUESTIONS].reverse()) {
    const copy = { ...q, arrtCategory: 'test' };
    const index = questionIndexInDomain(QUESTIONS, copy);
    assert.equal(QUESTIONS.filter(x => x.domain === q.domain)[index].q, q.q);
  }
});

test('backup parser rejects invalid shapes and discards unknown cards', () => {
  assert.throws(() => parseCoachBackup(null, COACH_QUESTIONS));
  const state = recordCoachAnswer(EMPTY_COACH, COACH_QUESTIONS[0], true, 'sure', 1000);
  assert.deepEqual(parseCoachBackup(state, COACH_QUESTIONS), state);
  assert.deepEqual(parseCoachBackup({ ...state, cards: { unknown: { due: 1 } } }, COACH_QUESTIONS).cards, {});
});

test('exam horizon uses calendar dates across daylight saving time', () => {
  assert.equal(daysUntilExam('2026-11-02', new Date(2026, 9, 31, 23)), 2);
  assert.equal(daysUntilExam('', new Date()), null);
});
