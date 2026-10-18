import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { COACH_QUESTIONS, COACH_SOURCES } from '../../data/coachQuestions';
import { LESSONS } from '../../data/coachLessons';
import { BLUEPRINT_URL, EXAM_CATEGORIES } from '../../data/examBlueprint';
import { categoryEvidence, daysUntilExam, EMPTY_COACH, gradePractice, lessonEvidence, parseCoachBackup, recordCoachAnswer, selectCoachSession, selectTimedPractice } from '../../lib/studyCoach';
import { AnswerExplanation, LessonPage } from './CoachTeaching';
import './StudyCoach.css';

const STORAGE_KEY = 'fluoro_coach_v1';
function loadProgress() {
  try { return parseCoachBackup(JSON.parse(localStorage.getItem(STORAGE_KEY)), COACH_QUESTIONS); }
  catch { return EMPTY_COACH; }
}
function Clock({ deadline, onExpire }) {
  const [left, setLeft] = useState(() => Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
  const expired = useRef(false);
  useEffect(() => {
    function tick() {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setLeft(remaining);
      if (!remaining && !expired.current) { expired.current = true; onExpire(); }
    }
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [deadline, onExpire]);
  return <span className="coach-clock" role="timer" aria-label="Practice time remaining">{Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}</span>;
}

export default function StudyCoach({ onClose, closeLabel = 'Back to app' }) {
  const { theme } = useTheme();
  const [progress, setProgress] = useState(loadProgress);
  const [view, setView] = useState('plan');
  const [session, setSession] = useState([]);
  const [mode, setMode] = useState('daily');
  const [index, setIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [feedback, setFeedback] = useState(false);
  const [results, setResults] = useState([]);
  const [deadline, setDeadline] = useState(0);
  const [lessonId, setLessonId] = useState(LESSONS[0].id);
  const [returnView, setReturnView] = useState('lessons');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const submitted = useRef(false);
  const answerLock = useRef(false);
  const upload = useRef(null);
  const evidence = categoryEvidence(progress);
  const due = COACH_QUESTIONS.filter(q => progress.cards[q.id]?.due <= Date.now()).length;
  const mistakeQuestions = COACH_QUESTIONS.filter(q => progress.cards[q.id] && (!progress.cards[q.id].correct || progress.cards[q.id].confidence !== 'sure'));
  const days = daysUntilExam(progress.examDate);
  const q = session[index];
  const response = responses[q?.id] || { choice: null, confidence: 'unsure' };
  const currentLesson = LESSONS.find(l => l.id === lessonId);
  const recommended = LESSONS.find(l => lessonEvidence(l, COACH_QUESTIONS, progress).errors > 0) || LESSONS.find(l => !progress.lessons?.[l.id]) || LESSONS[0];
  const resumeActive = session.length > 0 && !submitted.current;

  function save(next) {
    setProgress(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }
    catch { setNotice('This browser could not save progress. Export a backup before closing.'); }
  }
  function openLesson(id, from = view) {
    const previous = progress.lessons?.[id];
    save({ ...progress, lessons: { ...progress.lessons, [id]: { readAt: Date.now(), reflection: previous?.reflection || '' } } });
    setLessonId(id); setReturnView(from); setView('lesson');
  }
  function start(nextMode) {
    const questions = nextMode === 'timed' ? selectTimedPractice(COACH_QUESTIONS) : selectCoachSession(COACH_QUESTIONS, progress, nextMode);
    if (!questions.length) { setNotice('Nothing is due in this queue. You can study a lesson or start mixed timed practice.'); return; }
    setSession(questions); setMode(nextMode); setIndex(0); setResponses({}); setFeedback(false); setResults([]); setDeadline(nextMode === 'timed' ? Date.now() + 40 * 60000 : 0);
    submitted.current = false; answerLock.current = false; setView('practice'); setNotice('');
  }
  function setResponse(next) { setResponses({ ...responses, [q.id]: { ...response, ...next } }); }
  function answer() {
    if (response.choice === null || feedback || answerLock.current) return;
    answerLock.current = true;
    const correct = response.choice === q.answer;
    save(recordCoachAnswer(progress, q, correct, response.confidence));
    setResults([...results, { id: q.id, choice: response.choice, confidence: response.confidence, correct }]); setFeedback(true);
  }
  function finishTimed() {
    if (submitted.current) return;
    submitted.current = true;
    const graded = gradePractice(session, responses);
    const nextProgress = graded.reduce((state, result, i) => recordCoachAnswer(state, session[i], result.correct, result.confidence), progress);
    save(nextProgress); setResults(graded); setView('results');
  }
  function next() {
    if (index === session.length - 1) { submitted.current = true; setView('results'); return; }
    setIndex(index + 1); setFeedback(false); answerLock.current = false;
  }
  function exportProgress() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = 'fluoropath-study-backup.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function importProgress(event) {
    const file = event.target.files?.[0]; if (!file) return;
    try {
      if (file.size > 2000000) throw new Error('Backup is too large.');
      const restored = parseCoachBackup(JSON.parse(await file.text()), COACH_QUESTIONS);
      if (window.confirm('Replace this device’s study coach progress with this backup?')) {
        save(restored); setSession([]); submitted.current = true; setView('plan'); setNotice('Backup restored.');
      }
    } catch (error) { setNotice(error.message || 'Could not read this backup.'); }
    event.target.value = '';
  }

  return <div className="coach" style={{ '--coach-bg': theme.bg, '--coach-surface': theme.surface, '--coach-muted': theme.textSecondary, '--coach-border': theme.border, '--coach-primary': theme.primary, color: theme.text, background: theme.bg }}>
    <header className="coach-header"><div><span className="coach-eyebrow">FLUOROPATH / CALIFORNIA</span><strong>Learn it. Work it out. Remember it.</strong></div><button onClick={onClose}>{closeLabel}</button></header>
    <main>
      <nav className="coach-nav" aria-label="Study coach">{[['plan', 'My path'], ['lessons', 'Lessons'], ['errors', 'Mistakes & uncertainty'], ['library', 'Sources']].map(([id, label]) => <button key={id} aria-current={view === id ? 'page' : undefined} onClick={() => setView(id)}>{label}{id === 'errors' && mistakeQuestions.length ? ` (${mistakeQuestions.length})` : ''}</button>)}</nav>
      {resumeActive && view !== 'practice' && <aside className="coach-resume"><span>{mode === 'timed' ? 'Timed practice is in progress; the deadline keeps running.' : 'Your learning session is still open.'}</span><button onClick={() => setView('practice')}>Resume session</button></aside>}
      {notice && <p role="status" className="coach-panel">{notice}</p>}
      {view === 'plan' && <>
        <section className="coach-hero"><span className="coach-eyebrow">UNDERSTANDING COMES BEFORE SPEED</span><h1>Make the next attempt<br />a better-prepared one.</h1><p>Learn the mechanism, work an example, then apply it to a new question. Every answer includes an explanation for all four choices.</p><div className="coach-actions"><button className="coach-primary" onClick={() => openLesson(recommended.id, 'plan')}>Start with: {recommended.title}</button><button onClick={() => start('diagnostic')}>Find my gaps · 15 questions</button></div><div className="coach-facts"><span><b>{LESSONS.length}</b> explained lessons</span><span><b>{COACH_QUESTIONS.length}</b> scored questions</span><span><b>16</b> visual concept guides</span></div></section>
        <div className="coach-grid coach-path"><article className="coach-panel"><span className="coach-step">01 / LEARN</span><h2>Understand one concept</h2><p>Plain-language explanation → mechanism → worked example → teach it back.</p><button onClick={() => setView('lessons')}>Explore the lessons</button></article><article className="coach-panel"><span className="coach-step">02 / APPLY</span><h2>Make the reasoning visible</h2><p>Practice mixed questions. Compare each distractor with the mechanism you learned.</p><button onClick={() => start('daily')}>Start a learning session</button></article><article className="coach-panel"><span className="coach-step">03 / REPAIR</span><h2>Relearn the uncertain parts</h2><p>A correct guess still belongs in review. Return to mistakes and test the concept again.</p><button onClick={() => start('mistakes')}>Practice mistakes & uncertainty</button></article><article className="coach-panel"><span className="coach-step">04 / REHEARSE</span><h2>Practice without hints</h2><p>30 mixed questions in 40 minutes. Explanations stay hidden until submission. This is a custom practice format.</p><button onClick={() => start('timed')}>Start timed practice</button></article></div>
        <section className="coach-panel"><div className="coach-section-title"><h2>Return to what is due</h2><strong>{due} questions due</strong></div><p>Errors return after 10 minutes. Uncertain answers tomorrow. Confident correct answers move to 1, 3, 7, 14, then 30 days.</p><button onClick={() => start('due')}>Review due questions</button></section>
        <section><h2>Your practice evidence</h2><p>These are small practice samples, not a prediction of passing. Repeated attempts can raise accuracy without proving retention on new questions.</p><div className="coach-grid">{evidence.map(c => <article className="coach-panel" key={c.id}><span className="coach-eyebrow">{c.count} OF 90 SCORED EXAM ITEMS</span><h3>{c.name}</h3><strong>{c.accuracy === null ? 'No evidence yet' : `${c.accuracy}% recent accuracy`}</strong><p>{c.attempts} recent attempts · {c.distinct} distinct questions</p><button onClick={() => { setFilter(c.id); setView('lessons'); }}>Study this category</button></article>)}</div></section>
        <section className="coach-panel"><h2>Your exam horizon</h2><label htmlFor="coach-date">Next exam date (optional)</label><input id="coach-date" type="date" value={progress.examDate} onChange={e => save({ ...progress, examDate: e.target.value })} /><p>{days === null ? 'No date is needed to start. Aim for one lesson and a short retrieval session each day.' : days < 0 ? 'Update this date when the next examination is scheduled.' : `${days} days to go. Keep the daily loop focused on understanding, application, and delayed review.`}</p></section>
        <section className="coach-panel"><h2>Keep your progress</h2><p>Saved in this browser, separate from the older app’s recall history. Export a backup to move devices. A live session is not restored after closing the page; completed answers and lesson notes are saved.</p><div className="coach-actions"><button onClick={exportProgress}>Export backup</button><button onClick={() => upload.current?.click()}>Import backup</button><input hidden ref={upload} type="file" accept="application/json,.json" onChange={importProgress} /></div></section>
      </>}
      {view === 'lessons' && <>
        <section className="coach-lesson-heading"><span className="coach-eyebrow">A COURSE YOU CAN WORK THROUGH</span><h1>Learn the “why.”</h1><p>Start with tube production and build toward equipment, protection, and clinical decisions. You can also jump directly to a weak category.</p><label htmlFor="coach-search">Find a concept</label><input id="coach-search" type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Try scatter, pixels, metformin…" /><label htmlFor="coach-category">Exam category</label><select id="coach-category" value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All categories</option>{EXAM_CATEGORIES.map(c => <option value={c.id} key={c.id}>{c.name}</option>)}</select></section>
        <div className="coach-lesson-list">{LESSONS.filter(l => (filter === 'all' || l.category === filter) && `${l.title} ${l.goal} ${l.plain} ${l.chain.join(' ')}`.toLowerCase().includes(search.toLowerCase())).map((l, i) => {
          const stats = lessonEvidence(l, COACH_QUESTIONS, progress);
          return <article className="coach-panel coach-lesson-card" key={l.id}><span className="coach-lesson-number">{String(LESSONS.indexOf(l) + 1).padStart(2, '0')}</span><div><span className="coach-eyebrow">{EXAM_CATEGORIES.find(c => c.id === l.category)?.name} · {l.minutes} MIN</span><h2>{l.title}</h2><p>{l.goal}</p><small>{stats.status} · {stats.tested}/{stats.total} questions attempted{progress.lessons?.[l.id]?.reflection ? ' · notes saved' : progress.lessons?.[l.id] ? ' · opened' : ''}</small><div className="coach-actions"><button className={i === 0 ? 'coach-primary' : ''} onClick={() => openLesson(l.id, 'lessons')}>Learn this concept</button><button onClick={() => start(`lesson:${l.id}`)}>Practice this lesson</button></div></div></article>;
        })}</div>
      </>}
      {view === 'lesson' && currentLesson && <LessonPage key={currentLesson.id} lesson={currentLesson} saved={progress.lessons?.[currentLesson.id]} evidence={lessonEvidence(currentLesson, COACH_QUESTIONS, progress)} onSave={entry => save({ ...progress, lessons: { ...progress.lessons, [currentLesson.id]: entry } })} onPractice={() => start(`lesson:${currentLesson.id}`)} onBack={() => setView(returnView)} />}
      {view === 'practice' && q && <section className="coach-panel coach-practice">
        <div className="coach-section-title"><span>{mode === 'timed' ? 'Timed mixed practice' : EXAM_CATEGORIES.find(c => c.id === q.category)?.name}</span><span>Question {index + 1} / {session.length}</span>{mode === 'timed' && <Clock deadline={deadline} onExpire={finishTimed} />}</div><progress aria-label="Session progress" max={session.length} value={mode === 'timed' ? Object.keys(responses).filter(id => responses[id].choice !== null).length : results.length} /><span className="coach-eyebrow">{q.topic}</span><h1>{q.q}</h1>
        <fieldset disabled={feedback}><legend>Choose the best answer</legend>{q.options.map((option, i) => <label className={`coach-option ${feedback && i === q.answer ? 'coach-correct' : ''}`} key={option}><input type="radio" name="coach-answer" checked={response.choice === i} onChange={() => setResponse({ choice: i })} /><span><b>{String.fromCharCode(65 + i)}.</b> {option}</span>{feedback && i === q.answer && <b>✓</b>}</label>)}</fieldset>
        {!feedback && <fieldset className="coach-confidence"><legend>How confident are you?</legend><label><input type="radio" name="confidence" checked={response.confidence === 'unsure'} onChange={() => setResponse({ confidence: 'unsure' })} /> Unsure / guessing</label><label><input type="radio" name="confidence" checked={response.confidence === 'sure'} onChange={() => setResponse({ confidence: 'sure' })} /> I can explain it</label></fieldset>}
        {mode === 'timed' ? <><div className="coach-actions"><button disabled={index === 0} onClick={() => setIndex(index - 1)}>Previous question</button><button disabled={index === session.length - 1} onClick={() => setIndex(index + 1)}>Next question</button><button className="coach-primary" onClick={() => { if (window.confirm('Submit this practice? Unanswered questions count as incorrect.')) finishTimed(); }}>Submit timed practice</button></div><small>Answers and explanations appear after submission. Your choices remain available when you move between questions.</small></> : !feedback ? <button className="coach-primary" disabled={response.choice === null} onClick={answer}>Check my reasoning</button> : <><AnswerExplanation question={q} choice={response.choice} lesson={LESSONS.find(l => l.id === q.lessonId)} onLearn={id => openLesson(id, 'practice')} /><p>{response.choice !== q.answer ? 'This item returns in 10 minutes. Study the mechanism now, then check it again.' : response.confidence === 'unsure' ? 'Correct but uncertain: scheduled again tomorrow.' : 'Correct and confident: scheduled for delayed review.'}</p><button className="coach-primary" onClick={next}>{index === session.length - 1 ? 'Review this session' : 'Apply another concept →'}</button></>}
      </section>}
      {view === 'results' && <>
        <section className="coach-panel"><span className="coach-eyebrow">NOW REPAIR THE GAPS</span><h1>{results.filter(r => r.correct).length} / {results.length} correct</h1><p>{results.filter(r => r.correct && r.confidence !== 'sure').length} correct but uncertain. Review those alongside errors. This custom practice score is not an ARRT scaled score.</p><button className="coach-primary" onClick={() => setView('errors')}>Build my relearning queue</button></section>
        {results.map(r => { const question = COACH_QUESTIONS.find(q => q.id === r.id); return <details className="coach-panel" key={r.id}><summary>{r.correct ? '✓' : '↻'} {question.q}{r.confidence !== 'sure' ? ' · uncertain' : ''}</summary><AnswerExplanation question={question} choice={r.choice} lesson={LESSONS.find(l => l.id === question.lessonId)} onLearn={id => openLesson(id, 'results')} /></details>; })}
      </>}
      {view === 'errors' && <>
        <section className="coach-lesson-heading"><span className="coach-eyebrow">YOUR RELEARNING QUEUE</span><h1>Find the reason.<br />Fix the pattern.</h1><p>This queue uses your most recent response to each item. It includes wrong answers and correct guesses, even before their next spaced review is due.</p><button className="coach-primary" disabled={!mistakeQuestions.length} onClick={() => start('mistakes')}>Practice this queue</button></section>
        {!mistakeQuestions.length && <section className="coach-panel"><h2>No recorded mistakes or uncertainty yet</h2><p>Start the gap-finding session or choose a lesson. An empty queue before testing does not establish readiness.</p><button onClick={() => start('diagnostic')}>Find my gaps</button></section>}
        {LESSONS.filter(l => mistakeQuestions.some(q => q.lessonId === l.id)).map(l => <section className="coach-panel" key={l.id}><h2>{l.title}</h2><p>{l.goal}</p><ul>{mistakeQuestions.filter(q => q.lessonId === l.id).map(q => <li key={q.id}>{q.q}<small>{progress.cards[q.id].correct ? 'Correct but uncertain' : 'Incorrect on latest attempt'}{!progress.cards[q.id].correct && progress.cards[q.id].confidence === 'sure' ? ' · high confidence: inspect the misconception' : ''}</small></li>)}</ul><div className="coach-actions"><button onClick={() => openLesson(l.id, 'errors')}>Relearn the mechanism</button><button onClick={() => start(`lesson:${l.id}`)}>Test this concept again</button></div></section>)}
      </>}
      {view === 'library' && <>
        <section className="coach-panel"><span className="coach-eyebrow">THE OFFICIAL EXAM OUTLINE IS THE CHECKLIST</span><h1>Keep the target clear.</h1><p>The currently published ARRT fluoroscopy specifications, effective January 2023, list 90 scored items plus up to 20 unscored items. Checked October 18, 2026.</p><a href={BLUEPRINT_URL} target="_blank" rel="noreferrer">Open the official outline ↗</a><ul>{EXAM_CATEGORIES.map(c => <li key={c.id}>{c.name}: {c.count} scored items</li>)}</ul><p>This course develops core concepts across all five categories. It does not claim complete coverage of every outline bullet. Compare the outline with your course materials, particularly detailed regulations, dosimetry, QC procedures, and clinical protocols.</p><a href="https://state.arrt.org/pages/state-licensing-examination-handbooks-and-fees" target="_blank" rel="noreferrer">Current candidate handbook and assigned-exam information ↗</a></section>
        <section className="coach-panel"><h2>Teaching and verification sources</h2>{Object.entries(COACH_SOURCES).map(([id, source]) => <p key={id}><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a></p>)}<p><a href="https://www.cdph.ca.gov/Programs/CEH/DRSEM/Pages/RHB-Certification/FAQ.aspx" target="_blank" rel="noreferrer">California CDPH preparation guidance ↗</a></p><p>Numerical rules need their context and jurisdiction. US occupational regulations are labeled explicitly; international recommendations are not automatically California legal limits.</p></section>
        <section className="coach-panel"><h2>Use your recovered materials</h2><p>The prior syllabus, notes, ASRT modules, physics tutorials, and Anki deck remain useful supporting resources. Use the syllabus to resolve a mechanism, the notes for retrieval, and the official outline to identify gaps. Older clinical and regulatory claims need current-source checks.</p><p>The older app’s 395 self-graded recall prompts remain available. This course adds objective choices and explanations; it does not convert the older recall bank into a validated mock examination.</p></section>
      </>}
      <footer className="coach-footer">Original exam-preparation material. Not actual or recalled ARRT questions; no ARRT or CDPH affiliation. Follow current facility protocols for clinical care.</footer>
    </main>
  </div>;
}
