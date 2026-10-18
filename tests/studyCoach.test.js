import test from 'node:test';
import assert from 'node:assert/strict';
import { COACH_QUESTIONS } from '../src/data/coachQuestions.js';
import { EXAM_CATEGORIES, questionIndexInDomain } from '../src/data/examBlueprint.js';
import { LESSONS } from '../src/data/coachLessons.js';
import { gradePractice, lessonEvidence, selectTimedPractice } from '../src/lib/studyCoach.js';
import { QUESTIONS } from '../src/data/questions.js';
import { EMPTY_COACH, recordCoachAnswer, selectCoachSession, parseCoachBackup, daysUntilExam, categoryEvidence } from '../src/lib/studyCoach.js';

test('baseline samples every category without duplicate questions', () => {
  const session = selectCoachSession(COACH_QUESTIONS, EMPTY_COACH, 'diagnostic');
  assert.equal(session.length, 15);
  assert.equal(new Set(session.map(q => q.id)).size, 15);
  for (const c of EXAM_CATEGORIES) assert.equal(session.filter(q => q.category === c.id).length, 3);
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


test('every lesson has explanations, application questions, and a teach-back example', () => {
  assert.equal(LESSONS.length, 16);
  assert.equal(COACH_QUESTIONS.length, 80);
  for (const lesson of LESSONS) {
    assert.ok(lesson.plain.length > 80 && lesson.chain.length >= 4);
    assert.ok(lesson.example.steps.length >= 3 && lesson.recallAnswer && lesson.trap);
    assert.ok(COACH_QUESTIONS.filter(q => q.lessonId === lesson.id).length >= 3);
    for (const q of COACH_QUESTIONS.filter(q => q.lessonId === lesson.id)) {
      assert.equal(q.rationales.length, 4);
      assert.ok(q.rationales.every(r => typeof r === 'string' && r.trim().length > 0));
      assert.match(q.rationales[q.answer], /^Correct/);
    }
  }
});

test('timed practice has 30 unique items with blueprint-proportional coverage', () => {
  const session = selectTimedPractice(COACH_QUESTIONS, 30, () => 0.4);
  assert.equal(session.length, 30);
  assert.equal(new Set(session.map(q => q.id)).size, 30);
  for (const c of EXAM_CATEGORIES) {
    assert.ok(Math.abs(session.filter(q => q.category === c.id).length - 30 * c.count / 90) < 1);
  }
  const responses = { [session[0].id]: { choice: session[0].answer, confidence: 'sure' } };
  const graded = gradePractice(session, responses);
  assert.equal(graded.filter(r => r.correct).length, 1);
  assert.equal(graded.filter(r => r.choice === null).length, 29);
});

test('reading or writing notes never counts as demonstrated question understanding', () => {
  const lesson = LESSONS[0];
  const state = { ...EMPTY_COACH, lessons: { [lesson.id]: { readAt: 1000, reflection: 'my notes' } } };
  assert.equal(lessonEvidence(lesson, COACH_QUESTIONS, state).tested, 0);
  assert.equal(lessonEvidence(lesson, COACH_QUESTIONS, state).status, 'Not tested yet');
  assert.deepEqual(parseCoachBackup(state, COACH_QUESTIONS), state);
});

test('correct but uncertain items remain in the repair queue until a confident correct response', () => {
  const question = COACH_QUESTIONS[0];
  const uncertain = recordCoachAnswer(EMPTY_COACH, question, true, 'unsure', 1000);
  assert.ok(selectCoachSession(COACH_QUESTIONS, uncertain, 'mistakes').some(q => q.id === question.id));
  const repaired = recordCoachAnswer(uncertain, question, true, 'sure', 2000);
  assert.ok(!selectCoachSession(COACH_QUESTIONS, repaired, 'mistakes').some(q => q.id === question.id));
});
