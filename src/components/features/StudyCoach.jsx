import { useRef, useState } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { COACH_QUESTIONS, COACH_SOURCES } from '../../data/coachQuestions';
import { BLUEPRINT_URL, EXAM_CATEGORIES } from '../../data/examBlueprint';
import { categoryEvidence, daysUntilExam, EMPTY_COACH, parseCoachBackup, recordCoachAnswer, selectCoachSession } from '../../lib/studyCoach';
import './StudyCoach.css';

const STORAGE_KEY = 'fluoro_coach_v1';
function loadProgress() {
  try { return parseCoachBackup(JSON.parse(localStorage.getItem(STORAGE_KEY)), COACH_QUESTIONS); }
  catch { return EMPTY_COACH; }
}

export default function StudyCoach({ onClose }) {
  const { theme } = useTheme();
  const [progress, setProgress] = useState(loadProgress);
  const [view, setView] = useState('plan');
  const [session, setSession] = useState(null);
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState(null);
  const [confidence, setConfidence] = useState('unsure');
  const [feedback, setFeedback] = useState(false);
  const [results, setResults] = useState([]);
  const [notice, setNotice] = useState('');
  const upload = useRef(null);
  const evidence = categoryEvidence(progress);
  const due = COACH_QUESTIONS.filter(q => progress.cards[q.id]?.due <= Date.now()).length;
  const days = daysUntilExam(progress.examDate);
  const q = session?.[index];
  const category = EXAM_CATEGORIES.find(c => c.id === q?.category);

  function save(next) {
    setProgress(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }
    catch { setNotice('This browser could not save progress. Export a backup before closing.'); }
  }
  function start(mode) {
    const questions = selectCoachSession(COACH_QUESTIONS, progress, mode);
    if (!questions.length) { setNotice('You are caught up. Come back when reviews are due, or retake the baseline.'); return; }
    setSession(questions); setIndex(0); setChoice(null); setConfidence('unsure'); setFeedback(false); setResults([]); setView('practice'); setNotice('');
  }
  function answer() {
    if (choice === null || feedback) return;
    const correct = choice === q.answer;
    save(recordCoachAnswer(progress, q, correct, confidence));
    setResults([...results, { id: q.id, correct }]); setFeedback(true);
  }
  function next() {
    if (index === session.length - 1) { setView('results'); return; }
    setIndex(index + 1); setChoice(null); setConfidence('unsure'); setFeedback(false);
  }
  function exportProgress() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = 'fluoropath-study-backup.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function importProgress(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      if (file.size > 2000000) throw new Error('Backup is too large.');
      const nextProgress = parseCoachBackup(JSON.parse(await file.text()), COACH_QUESTIONS);
      if (window.confirm('Replace this device’s study coach progress with the selected backup?')) {
        save(nextProgress); setNotice('Backup restored.');
      }
    } catch (error) { setNotice(error.message || 'Could not read this backup.'); }
    event.target.value = '';
  }

  return <div className="coach" style={{ '--coach-bg': theme.bg, '--coach-surface': theme.surface, '--coach-muted': theme.textSecondary, '--coach-border': theme.border, '--coach-primary': theme.primary, color: theme.text, background: theme.bg }}>
    <header className="coach-header"><div><span className="coach-eyebrow">FLUOROPATH / CALIFORNIA</span><strong>Study coach</strong></div><button onClick={onClose}>Back to app</button></header>
    <main>
      <nav className="coach-nav" aria-label="Study coach"><button aria-current={view === 'plan' ? 'page' : undefined} onClick={() => setView('plan')}>My plan</button><button aria-current={view === 'library' ? 'page' : undefined} onClick={() => setView('library')}>Sources & study method</button></nav>
      {notice && <p role="status" className="coach-panel">{notice}</p>}
      {view === 'plan' && <>
        <section className="coach-hero"><span className="coach-eyebrow">ONE FOCUSED SESSION AT A TIME</span><h1>Understand it.<br />Recall it. Keep it.</h1><p>Practice first. Read the explanation. Return to the concepts that need another look.</p><div className="coach-actions"><button className="coach-primary" onClick={() => start(progress.attempts.length ? 'daily' : 'diagnostic')}>{progress.attempts.length ? 'Start today’s practice' : 'Start 10-question baseline'}</button><button onClick={() => start('due')}>Review due ({due})</button></div><small>20 original scored starter questions · 5 exam categories · no account needed</small></section>
        <section className="coach-panel"><h2>Your exam horizon</h2><label htmlFor="coach-date">Next exam date (optional)</label><input id="coach-date" type="date" value={progress.examDate} onChange={e => save({ ...progress, examDate: e.target.value })} /><p>{days === null ? 'Start with 20–30 minutes a day. Add your date to pace the work.' : days < 0 ? 'This date has passed. Update it when your next exam is scheduled.' : days === 0 ? 'Exam day: use brief retrieval practice and your testing instructions.' : `${days} days to go. ${days <= 7 ? 'Prioritize due reviews, errors, and the official topic checklist.' : 'Build consistency now; reserve the final week for mixed practice and reviewing errors.'}`}</p></section>
        <section><div className="coach-section-title"><h2>Where to focus next</h2><span>{progress.attempts.length} recorded answers</span></div><p>Ordered by exam weight and your recent practice accuracy. “No evidence” means untested, not mastered.</p><div className="coach-grid">{evidence.map(c => <article className="coach-panel" key={c.id}><span className="coach-eyebrow">{c.count} OF 90 SCORED EXAM ITEMS</span><h3>{c.name}</h3><strong className="coach-score">{c.accuracy === null ? 'No evidence yet' : `${c.accuracy}% practice accuracy`}</strong><p>{c.attempts} recent attempts · {c.distinct} distinct starter items</p><small>{c.distinct < 4 ? 'Limited sample — keep testing and use the full outline.' : 'Small practice sample — verify broader topic coverage.'}</small></article>)}</div></section>
        <section className="coach-panel"><h2>Today’s 25-minute loop</h2><ol><li><strong>5 min:</strong> retrieve due concepts without looking at notes.</li><li><strong>10 min:</strong> study the highest-priority category using the official outline and a trusted resource.</li><li><strong>10 min:</strong> answer mixed questions; explain why each wrong choice fails.</li></ol><p>Incorrect answers return in 10 minutes. Uncertain correct answers return tomorrow. Confident correct answers spread to 1, 3, 7, 14, then 30 days.</p><button onClick={() => start('diagnostic')}>Retake the short baseline</button></section>
        <section className="coach-panel"><h2>Keep your progress</h2><p>Study coach progress stays in this browser, separate from the app’s account-based recall history. Export it to move devices or keep a backup.</p><div className="coach-actions"><button onClick={exportProgress}>Export backup</button><button onClick={() => upload.current?.click()}>Import backup</button><input hidden ref={upload} type="file" accept="application/json,.json" onChange={importProgress} /></div></section>
      </>}
      {view === 'practice' && q && <section className="coach-panel coach-practice">
        <div className="coach-section-title"><span>{category?.name}</span><span>Question {index + 1} / {session.length}</span></div><progress aria-label="Session progress" max={session.length} value={results.length} /><span className="coach-eyebrow">{q.topic}</span><h1>{q.q}</h1>
        <fieldset disabled={feedback}><legend>Choose the best answer</legend>{q.options.map((option, i) => <label className={`coach-option ${feedback && i === q.answer ? 'coach-correct' : ''}`} key={option}><input type="radio" name="coach-answer" checked={choice === i} onChange={() => setChoice(i)} /><span><b>{String.fromCharCode(65 + i)}.</b> {option}</span>{feedback && i === q.answer && <b>✓</b>}</label>)}</fieldset>
        {!feedback && <><fieldset className="coach-confidence"><legend>How confident are you?</legend><label><input type="radio" name="confidence" checked={confidence === 'unsure'} onChange={() => setConfidence('unsure')} /> Unsure / guessing</label><label><input type="radio" name="confidence" checked={confidence === 'sure'} onChange={() => setConfidence('sure')} /> I can explain it</label></fieldset><button className="coach-primary" disabled={choice === null} onClick={answer}>Check answer</button></>}
        {feedback && <div className="coach-feedback" role="status"><h2>{choice === q.answer ? 'Correct' : 'Let’s work through this'}</h2><p><strong>Answer: {q.options[q.answer]}</strong></p><p>{q.explanation}</p><a href={COACH_SOURCES[q.source].url} target="_blank" rel="noreferrer">{COACH_SOURCES[q.source].title}</a><small>{q.section}</small><p>{choice !== q.answer ? 'Scheduled for review in 10 minutes.' : confidence === 'unsure' ? 'Correct but uncertain — review tomorrow.' : 'Scheduled for spaced review.'}</p><button className="coach-primary" onClick={next}>{index === session.length - 1 ? 'See session results' : 'Next question'}</button></div>}
      </section>}
      {view === 'results' && <section className="coach-panel"><span className="coach-eyebrow">SESSION COMPLETE</span><h1>{results.filter(r => r.correct).length} / {results.length} correct</h1><p>This is practice evidence from a small starter bank. It does not predict an ARRT scaled score or passing.</p><h2>Revisit these concepts</h2>{results.filter(r => !r.correct).length ? <ul>{results.filter(r => !r.correct).map(r => <li key={r.id}>{COACH_QUESTIONS.find(q => q.id === r.id)?.topic}</li>)}</ul> : <p>No errors this session. Check the full official outline for topics this bank does not sample.</p>}<button className="coach-primary" onClick={() => setView('plan')}>Return to my plan</button></section>}
      {view === 'library' && <>
        <section className="coach-panel"><span className="coach-eyebrow">START WITH THE TEST BLUEPRINT</span><h1>Study the tested concepts.</h1><p>The current published ARRT fluoroscopy outline is effective January 1, 2023. It lists 90 scored items, plus up to 20 unscored pilot items. Checked October 18, 2026.</p><a href={BLUEPRINT_URL} target="_blank" rel="noreferrer">Open the official ARRT fluoroscopy outline ↗</a><ul>{EXAM_CATEGORIES.map(c => <li key={c.id}>{c.name}: {c.count} scored items ({c.pct}%)</li>)}</ul><p>Use your authorization and current candidate handbook for your assigned exam, timing, and testing rules. An ARRT scaled score is not the same as percent correct.</p><a href="https://state.arrt.org/pages/state-licensing-examination-handbooks-and-fees" target="_blank" rel="noreferrer">Current candidate handbook and exam information ↗</a></section>
        <section className="coach-panel"><h2>Source shelf</h2>{Object.entries(COACH_SOURCES).map(([id, source]) => <p key={id}><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a></p>)}<p><a href="https://www.cdph.ca.gov/Programs/CEH/DRSEM/Pages/RHB-Certification/FAQ.aspx" target="_blank" rel="noreferrer">CDPH exam preparation guidance ↗</a></p><p>CDPH points candidates to the ARRT content specifications and ASRT fluoroscopy modules. Compare older manuals and shared notes with current guidance, especially numerical limits and contrast safety.</p></section>
        <section className="coach-panel"><h2>Use your existing materials in this order</h2><ol><li>Turn every bullet in the current ARRT outline into a topic checklist.</li><li>Use a fluoroscopy syllabus or ASRT module to learn the concept.</li><li>Use your notes, review documents, and Anki deck for closed-book retrieval.</li><li>Use physics tutorials to resolve equipment and image-quality gaps.</li><li>Use mixed timed multiple-choice practice to test application and pacing.</li></ol><p>The existing app’s 395 recall cards are self-graded learning prompts. Its recall practice is useful, but it is not an objective mock exam. This coach’s 20 scored questions are a starting point, not a comprehensive exam bank.</p></section>
      </>}
      <footer className="coach-footer">Learning tool for exam preparation. Original practice items; no affiliation with ARRT or CDPH. Follow current clinical protocols for patient care.</footer>
    </main>
  </div>;
}
