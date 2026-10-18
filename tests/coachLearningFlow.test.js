import test from 'node:test';
import assert from 'node:assert/strict';
import React, { act } from 'react';
import { JSDOM } from 'jsdom';
import { build } from 'esbuild';
import { pathToFileURL } from 'node:url';
import { mkdir } from 'node:fs/promises';
import { COACH_QUESTIONS } from '../src/data/coachQuestions.js';

const dom = new JSDOM('<!doctype html><html><head><meta name="theme-color"></head><body><div id="test-root"></div></body></html>', { url: 'https://study.example.test/' });
Object.assign(globalThis, { window: dom.window, document: dom.window.document, localStorage: dom.window.localStorage, HTMLElement: dom.window.HTMLElement, Event: dom.window.Event, IS_REACT_ACT_ENVIRONMENT: true });
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
window.confirm = () => true;
const { createRoot } = await import('react-dom/client');
await mkdir('node_modules/.cache', { recursive: true });
const file = `${process.cwd()}/node_modules/.cache/coach-test.mjs`;
await build({ stdin: { contents: `export {default as StudyCoach} from './src/components/features/StudyCoach.jsx'; export {ThemeProvider} from './src/theme/ThemeContext.jsx'; export {default as LessonVisual} from './src/components/features/CoachVisuals.jsx';`, resolveDir: process.cwd(), loader: 'jsx' }, outfile: file, bundle: true, platform: 'node', format: 'esm', packages: 'external', jsx: 'automatic', loader: { '.css': 'empty' } });
const { StudyCoach, ThemeProvider, LessonVisual } = await import(pathToFileURL(file));
const container = document.getElementById('test-root');
let root;
async function mount(node = React.createElement(ThemeProvider, null, React.createElement(StudyCoach, { onClose() {} }))) {
  localStorage.clear(); root = createRoot(container); await act(async () => root.render(node));
}
async function cleanup() { await act(async () => root.unmount()); }
function button(text) {
  const found = [...container.querySelectorAll('button')].find(b => b.textContent === text);
  assert.ok(found, `Missing button: ${text}`); return found;
}
async function click(node) { await act(async () => node.click()); }
function currentQuestion() {
  return COACH_QUESTIONS.find(q => q.q === container.querySelector('.coach-practice h1')?.textContent);
}

test('learning experience', async t => {
  await t.test('lessons explain mechanisms, render a tube diagram, and open associated practice', async () => {
    await mount();
    try {
      assert.match(container.textContent, /80 scored questions/);
      await click(button('Explore the lessons'));
      assert.equal(container.querySelectorAll('.coach-lesson-card').length, 16);
      await click([...container.querySelectorAll('button')].find(b => b.textContent === 'Learn this concept'));
      assert.match(container.textContent, /Follow the mechanism/);
      assert.ok(container.querySelector('svg[aria-label="Electron flow from cathode to anode, with x-rays leaving the target"]'));
      assert.match(container.textContent, /Maximum photon energy: 80 keV/);
      await click(button('Compare with a model explanation'));
      assert.match(container.textContent, /mA mainly changes how many electrons/);
      await click(button('Apply this lesson in questions'));
      assert.equal(currentQuestion().lessonId, 'production');
    } finally { await cleanup(); }
  });
  await t.test('wrong answers show all rationales, link to teaching, and enter the repair queue', async () => {
    await mount();
    try {
      await click(button('Find my gaps · 15 questions'));
      const q = currentQuestion();
      await click(container.querySelectorAll('input[name="coach-answer"]')[(q.answer + 1) % 4]);
      await click(container.querySelectorAll('input[name="confidence"]')[1]);
      await click(button('Check my reasoning'));
      assert.equal(container.querySelectorAll('.coach-rationales article').length, 4);
      assert.ok(container.textContent.includes(q.rationales[q.answer]));
      const teach = [...container.querySelectorAll('button')].find(b => b.textContent.startsWith('Teach me:'));
      await click(teach);
      assert.match(container.textContent, /Follow the mechanism/);
      await click(button('← Back'));
      assert.match(container.textContent, /Why each choice works or fails/);
      const saved = JSON.parse(localStorage.getItem('fluoro_coach_v1'));
      assert.equal(saved.cards[q.id].correct, false);
      const errors = [...container.querySelectorAll('nav button')].find(b => b.textContent.startsWith('Mistakes & uncertainty'));
      await click(errors);
      assert.match(container.textContent, /high confidence: inspect the misconception/);
      await click(button('Practice this queue'));
      assert.equal(currentQuestion().id, q.id);
    } finally { await cleanup(); }
  });
  await t.test('timed practice preserves answers between questions and reveals explanations only after grading', async () => {
    await mount();
    try {
      await click(button('Start timed practice'));
      assert.match(container.textContent, /Question 1 \/ 30/);
      assert.equal(container.querySelectorAll('.coach-rationales article').length, 0);
      const q = currentQuestion();
      await click(container.querySelectorAll('input[name="coach-answer"]')[q.answer]);
      await click(button('Next question'));
      await click(button('Previous question'));
      assert.equal(container.querySelectorAll('input[name="coach-answer"]')[q.answer].checked, true);
      assert.equal(container.querySelectorAll('.coach-rationales article').length, 0);
      await click(button('Submit timed practice'));
      assert.match(container.textContent, /1 \/ 30 correct/);
      assert.equal(container.querySelectorAll('details').length, 30);
      assert.equal(JSON.parse(localStorage.getItem('fluoro_coach_v1')).attempts.length, 30);
    } finally { await cleanup(); }
  });
  await t.test('visual toggles explain scatter, collimation, and local dose concentration', async () => {
    for (const [lessonId, toggle, expected] of [
      ['interactions', 'Compton scattering', /photon survives with a new direction/],
      ['reduction', 'Crop after exposure', /Radiation was still delivered across the larger/],
      ['skin', 'Repeat the same patch', /Highest patch: 8 units/],
    ]) {
      await mount(React.createElement(LessonVisual, { lessonId }));
      try { await click(button(toggle)); assert.match(container.textContent, expected); }
      finally { await cleanup(); }
    }
  });
});
