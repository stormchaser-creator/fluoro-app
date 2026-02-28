import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../context/AppContext';
import { useStudy } from '../../context/StudyContext';
import { DOMAINS } from '../../data/domains';
import { QUESTIONS } from '../../data/questions';
import Card from '../shared/Card';
import Button from '../shared/Button';
import ProgressBar from '../shared/ProgressBar';

// ═══════════════════════════════════════════════════════════
// ARRT Domain Mapping
// ═══════════════════════════════════════════════════════════

const ARRT_CATEGORIES = [
  {
    id: 'patient_care',
    name: 'Patient Care',
    pct: 10,
    count: 9,
    color: '#F97316',
    icon: '🩺',
    domainIds: ['patientcare'],
  },
  {
    id: 'rad_physics_bio',
    name: 'Radiation Physics & Biology',
    pct: 24,
    count: 22,
    color: '#10B981',
    icon: '🧬',
    domainIds: ['radbio', 'skineffects'],
  },
  {
    id: 'rad_protection',
    name: 'Radiation Protection',
    pct: 27,
    count: 24,
    color: '#EF4444',
    icon: '🛡️',
    domainIds: ['radprotection', 'doselimits'],
  },
  {
    id: 'equip_operation',
    name: 'Equipment Operation',
    pct: 24,
    count: 22,
    color: '#8B5CF6',
    icon: '⚡',
    domainIds: ['equipment', 'digital'],
  },
  {
    id: 'image_eval_qc',
    name: 'Image Evaluation & QC',
    pct: 14,
    count: 13,
    color: '#06B6D4',
    icon: '✅',
    domainIds: ['qa'],
  },
];

// ═══════════════════════════════════════════════════════════
// Question Selection Engine
// ═══════════════════════════════════════════════════════════

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function selectExamQuestions(totalCount = 90) {
  // For the standard 90-question exam, use ARRT distribution
  if (totalCount === 90) {
    const selected = [];
    for (const cat of ARRT_CATEGORIES) {
      const pool = QUESTIONS.filter(q => cat.domainIds.includes(q.domain));
      if (pool.length === 0) {
        // Patient Care has no dedicated domain — pull from all domains weighted toward rad protection
        const fallbackPool = shuffleArray(QUESTIONS);
        selected.push(...fallbackPool.slice(0, cat.count).map(q => ({ ...q, arrtCategory: cat.id })));
      } else {
        const shuffled = shuffleArray(pool);
        // If not enough questions, cycle through pool
        const picked = [];
        for (let i = 0; i < cat.count; i++) {
          picked.push({ ...shuffled[i % shuffled.length], arrtCategory: cat.id });
        }
        selected.push(...picked);
      }
    }
    return shuffleArray(selected);
  }
  // For custom quiz, just shuffle all and take N
  return shuffleArray(QUESTIONS).slice(0, totalCount).map(q => ({ ...q, arrtCategory: getArrtCategory(q.domain) }));
}

function selectCustomQuestions({ count = 25, domains = null, difficulty = null }) {
  let pool = [...QUESTIONS];
  if (domains && domains.length > 0) {
    pool = pool.filter(q => domains.includes(q.domain));
  }
  if (difficulty && difficulty !== 'all') {
    const diffMap = { easy: 1, medium: 2, hard: 3 };
    pool = pool.filter(q => q.difficulty === diffMap[difficulty]);
  }
  const shuffled = shuffleArray(pool);
  return shuffled.slice(0, Math.min(count, shuffled.length)).map(q => ({ ...q, arrtCategory: getArrtCategory(q.domain) }));
}

function getArrtCategory(domainId) {
  for (const cat of ARRT_CATEGORIES) {
    if (cat.domainIds.includes(domainId)) return cat.id;
  }
  return 'patient_care';
}

function getArrtCategoryInfo(catId) {
  return ARRT_CATEGORIES.find(c => c.id === catId) || ARRT_CATEGORIES[0];
}

// Timer proportional to question count (2 hours for 90 questions)
function getTimerSeconds(questionCount) {
  return Math.round((questionCount / 90) * 120 * 60);
}

function formatTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ═══════════════════════════════════════════════════════════
// Main MockExam Component
// ═══════════════════════════════════════════════════════════

export default function MockExam({ onClose }) {
  const { theme, domainColors } = useTheme();
  const { dispatch } = useApp();
  const { study, studyDispatch } = useStudy();

  // Phase: 'setup' | 'exam' | 'results'
  const [phase, setPhase] = useState('setup');
  const [mode, setMode] = useState('exam'); // 'exam' | 'custom'

  // Custom quiz settings
  const [customCount, setCustomCount] = useState(25);
  const [customDomains, setCustomDomains] = useState([]);
  const [customDifficulty, setCustomDifficulty] = useState('all');
  const [customTimed, setCustomTimed] = useState(true);

  // Exam state
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { idx: 'correct' | 'wrong' }
  const [flagged, setFlagged] = useState({}); // { idx: true }
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [examStartTime, setExamStartTime] = useState(null);
  const timerRef = useRef(null);

  // Results
  const [results, setResults] = useState(null);

  // Timer countdown
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerActive(false);
            // Auto-submit
            handleFinishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [timerActive]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startExam = () => {
    const q = selectExamQuestions(90);
    setQuestions(q);
    setCurrentIdx(0);
    setAnswers({});
    setFlagged({});
    setShowAnswer(false);
    setTimeLeft(getTimerSeconds(90));
    setTimerActive(true);
    setExamStartTime(Date.now());
    setPhase('exam');
  };

  const startCustomQuiz = () => {
    const q = selectCustomQuestions({
      count: customCount,
      domains: customDomains.length > 0 ? customDomains : null,
      difficulty: customDifficulty,
    });
    if (q.length === 0) return;
    setQuestions(q);
    setCurrentIdx(0);
    setAnswers({});
    setFlagged({});
    setShowAnswer(false);
    if (customTimed) {
      setTimeLeft(getTimerSeconds(q.length));
      setTimerActive(true);
    } else {
      setTimeLeft(0);
      setTimerActive(false);
    }
    setExamStartTime(Date.now());
    setPhase('exam');
  };

  const handleFinishExam = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerActive(false);

    // Calculate results
    const totalQ = questions.length;
    let correct = 0;
    const missed = [];
    const domainScores = {};

    questions.forEach((q, idx) => {
      const cat = q.arrtCategory;
      if (!domainScores[cat]) domainScores[cat] = { correct: 0, total: 0 };
      domainScores[cat].total++;

      if (answers[idx] === 'correct') {
        correct++;
        domainScores[cat].correct++;
      } else {
        missed.push({ q: q.q, a: q.a, domain: q.domain, arrtCategory: cat });
      }
    });

    const score = totalQ > 0 ? Math.round((correct / totalQ) * 100) : 0;
    const passed = score >= 75;

    const resultData = {
      score,
      correct,
      total: totalQ,
      passed,
      domainScores,
      missed,
      duration: Math.round((Date.now() - examStartTime) / 1000),
      date: new Date().toISOString(),
    };

    setResults(resultData);

    // Save to study context
    studyDispatch({
      type: 'SAVE_EXAM_RESULT',
      date: resultData.date,
      score: resultData.correct,
      total: resultData.total,
      domainScores: resultData.domainScores,
      questionsMissed: missed.length,
    });

    // Award XP
    dispatch({ type: 'ADD_XP', amount: correct * 5 + (passed ? 50 : 0) });
    dispatch({ type: 'UPDATE_STREAK' });

    setPhase('results');
  }, [questions, answers, examStartTime, studyDispatch, dispatch]);

  // Wire up the auto-submit when timer hits 0
  useEffect(() => {
    if (phase === 'exam' && timerActive && timeLeft <= 0) {
      handleFinishExam();
    }
  }, [timeLeft, phase, timerActive, handleFinishExam]);

  const markAnswer = (correct) => {
    setAnswers(prev => ({ ...prev, [currentIdx]: correct ? 'correct' : 'wrong' }));
    // Also record in main study context for global stats
    const q = questions[currentIdx];
    studyDispatch({ type: 'RECORD_ANSWER', domain: q.domain, correct, questionIndex: currentIdx });
    dispatch({ type: 'ADD_XP', amount: correct ? 10 : 3 });
  };

  const goNext = () => {
    setShowAnswer(false);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const goPrev = () => {
    setShowAnswer(false);
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const toggleFlag = () => {
    setFlagged(prev => ({ ...prev, [currentIdx]: !prev[currentIdx] }));
  };

  const answeredCount = Object.keys(answers).length;
  const progressPct = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  // ═══════════════════════════════════════════════════════
  // SETUP SCREEN
  // ═══════════════════════════════════════════════════════

  if (phase === 'setup') {
    return (
      <div>
        {/* Back button */}
        <button
          onClick={onClose}
          style={{
            background: 'none', border: 'none', color: theme.primary,
            fontSize: 15, fontWeight: 500, cursor: 'pointer', padding: '8px 0',
            marginBottom: 16, fontFamily: 'inherit',
          }}
        >
          ← Back to Home
        </button>

        {/* Mode selector pills */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[
            { id: 'exam', label: 'Mock Exam' },
            { id: 'custom', label: 'Custom Quiz' },
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              style={{
                flex: 1, padding: '12px 16px', borderRadius: 10,
                border: mode === m.id ? `2px solid ${theme.primary}` : `1px solid ${theme.border}`,
                background: mode === m.id ? theme.primaryLight : theme.surface,
                color: mode === m.id ? theme.primary : theme.textMuted,
                fontWeight: mode === m.id ? 700 : 400,
                fontSize: 16, cursor: 'pointer', fontFamily: 'inherit',
                minHeight: 48,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === 'exam' ? (
          <>
            {/* Mock Exam Info Card */}
            <Card style={{ marginBottom: 16, background: `linear-gradient(135deg, ${theme.primaryLight}, ${theme.surface})` }}>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>🏆</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: theme.text, marginBottom: 4 }}>
                  ARRT Mock Exam
                </div>
                <div style={{ fontSize: 14, color: theme.textMuted }}>
                  Simulates the real California Fluoroscopy Permit Exam
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Questions', value: '90', icon: '📝' },
                  { label: 'Time Limit', value: '2 hours', icon: '⏱️' },
                  { label: 'Pass Score', value: '75%', icon: '🎯' },
                ].map(item => (
                  <div key={item.label} style={{
                    background: theme.surface, borderRadius: 10, padding: 12,
                    textAlign: 'center', boxShadow: theme.shadow,
                  }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{item.icon}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: theme.text }}>{item.value}</div>
                    <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 500 }}>{item.label}</div>
                  </div>
                ))}
              </div>

              {/* ARRT category breakdown */}
              <div style={{
                fontSize: 12, fontWeight: 600, color: theme.textMuted,
                textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10,
              }}>
                Domain Distribution
              </div>
              {ARRT_CATEGORIES.map(cat => (
                <div key={cat.id} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  marginBottom: 8, padding: '6px 0',
                }}>
                  <span style={{ fontSize: 16, minWidth: 24 }}>{cat.icon}</span>
                  <span style={{ flex: 1, fontSize: 14, color: theme.textSecondary, fontWeight: 500 }}>
                    {cat.name}
                  </span>
                  <span style={{
                    fontSize: 13, fontWeight: 700, color: cat.color,
                    background: cat.color + '15', padding: '2px 10px', borderRadius: 12,
                  }}>
                    {cat.count}q ({cat.pct}%)
                  </span>
                </div>
              ))}
            </Card>

            <Button onClick={startExam} fullWidth size="lg" style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`,
              fontSize: 18, fontWeight: 800, minHeight: 56,
              boxShadow: `0 4px 15px ${theme.primary}40`,
            }}>
              Start Mock Exam
            </Button>
          </>
        ) : (
          <>
            {/* Custom Quiz Setup */}
            <Card style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: theme.text, marginBottom: 20 }}>
                Configure Your Quiz
              </div>

              {/* Question Count */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
                  Number of Questions
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[10, 25, 50, 75, 90].map(n => (
                    <button
                      key={n}
                      onClick={() => setCustomCount(n)}
                      style={{
                        flex: 1, padding: '10px 4px', borderRadius: 10,
                        border: customCount === n ? `2px solid ${theme.primary}` : `1px solid ${theme.border}`,
                        background: customCount === n ? theme.primaryLight : theme.surface,
                        color: customCount === n ? theme.primary : theme.textMuted,
                        fontWeight: customCount === n ? 700 : 500,
                        fontSize: 15, cursor: 'pointer', fontFamily: 'inherit',
                        minHeight: 44,
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Domain Filter */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
                  Domains (select specific or leave blank for all)
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {DOMAINS.map(d => {
                    const selected = customDomains.includes(d.id);
                    const dc = domainColors[d.id] || d.color;
                    return (
                      <button
                        key={d.id}
                        onClick={() => {
                          setCustomDomains(prev =>
                            selected ? prev.filter(x => x !== d.id) : [...prev, d.id]
                          );
                        }}
                        style={{
                          padding: '8px 14px', borderRadius: 10,
                          border: selected ? `2px solid ${dc}` : `1px solid ${theme.border}`,
                          background: selected ? dc + '18' : theme.surface,
                          color: selected ? dc : theme.textMuted,
                          fontWeight: selected ? 600 : 400,
                          fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
                        }}
                      >
                        {d.icon} {d.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
                  Difficulty
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'easy', label: 'Easy' },
                    { id: 'medium', label: 'Medium' },
                    { id: 'hard', label: 'Hard' },
                  ].map(d => (
                    <button
                      key={d.id}
                      onClick={() => setCustomDifficulty(d.id)}
                      style={{
                        flex: 1, padding: '10px 4px', borderRadius: 10,
                        border: customDifficulty === d.id ? `2px solid ${theme.primary}` : `1px solid ${theme.border}`,
                        background: customDifficulty === d.id ? theme.primaryLight : theme.surface,
                        color: customDifficulty === d.id ? theme.primary : theme.textMuted,
                        fontWeight: customDifficulty === d.id ? 700 : 500,
                        fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
                        minHeight: 44,
                      }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timed Toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>Timed</div>
                  <div style={{ fontSize: 12, color: theme.textMuted }}>
                    {customTimed ? formatTime(getTimerSeconds(customCount)) : 'No time limit'}
                  </div>
                </div>
                <button
                  onClick={() => setCustomTimed(prev => !prev)}
                  style={{
                    width: 52, height: 30, borderRadius: 15, border: 'none',
                    background: customTimed ? theme.primary : theme.border,
                    cursor: 'pointer', position: 'relative',
                    transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    width: 24, height: 24, borderRadius: 12,
                    background: '#FFF', position: 'absolute',
                    top: 3, left: customTimed ? 25 : 3,
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }} />
                </button>
              </div>
            </Card>

            <Button onClick={startCustomQuiz} fullWidth size="lg" style={{
              fontSize: 17, fontWeight: 700, minHeight: 56,
            }}>
              Start Quiz ({customCount} questions)
            </Button>
          </>
        )}

        {/* Exam History */}
        {(study.examHistory || []).length > 0 && (
          <Card style={{ marginTop: 20 }}>
            <div style={{
              fontSize: 12, fontWeight: 600, color: theme.textMuted,
              textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12,
            }}>
              Recent Exam History
            </div>
            {[...(study.examHistory || [])].reverse().slice(0, 5).map((exam, i) => {
              const pct = exam.total > 0 ? Math.round((exam.score / exam.total) * 100) : 0;
              const passed = pct >= 75;
              const dateStr = new Date(exam.date).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
              });
              return (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: i < 4 ? `1px solid ${theme.border}` : 'none',
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>
                      {exam.score}/{exam.total}
                    </div>
                    <div style={{ fontSize: 12, color: theme.textMuted }}>{dateStr}</div>
                  </div>
                  <div style={{
                    padding: '4px 12px', borderRadius: 20,
                    background: passed ? theme.successBg : theme.errorBg,
                    color: passed ? theme.success : theme.error,
                    fontSize: 14, fontWeight: 700,
                  }}>
                    {pct}% {passed ? 'PASS' : 'FAIL'}
                  </div>
                </div>
              );
            })}
          </Card>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // EXAM SCREEN
  // ═══════════════════════════════════════════════════════

  if (phase === 'exam') {
    const q = questions[currentIdx];
    if (!q) return null;
    const domain = DOMAINS.find(d => d.id === q.domain);
    const dc = domainColors[q.domain] || domain?.color || theme.primary;
    const catInfo = getArrtCategoryInfo(q.arrtCategory);
    const isAnswered = answers[currentIdx] !== undefined;
    const isFlagged = flagged[currentIdx];

    // Timer color
    let timerColor = theme.text;
    if (timerActive) {
      if (timeLeft <= 600) timerColor = theme.error; // 10 min
      else if (timeLeft <= 1800) timerColor = theme.warning; // 30 min
    }

    return (
      <div>
        {/* Top bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 12, padding: '8px 0',
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: theme.textSecondary }}>
            Question {currentIdx + 1} of {questions.length}
          </div>
          {(timerActive || timeLeft > 0) && (
            <div style={{
              fontSize: 18, fontWeight: 800, color: timerColor,
              fontVariantNumeric: 'tabular-nums',
              padding: '4px 12px', borderRadius: 8,
              background: timeLeft <= 600 ? theme.errorBg : timeLeft <= 1800 ? theme.warningBg : 'transparent',
            }}>
              {formatTime(timeLeft)}
            </div>
          )}
          <button
            onClick={() => {
              if (window.confirm('End this exam early? Your current answers will be scored.')) {
                handleFinishExam();
              }
            }}
            style={{
              background: 'none', border: `1px solid ${theme.border}`,
              color: theme.textMuted, fontSize: 13, fontWeight: 500,
              padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            End Exam
          </button>
        </div>

        {/* Progress bar */}
        <ProgressBar value={progressPct} color={theme.primary} height={4} />
        <div style={{ height: 12 }} />

        {/* Domain label */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{
            background: catInfo.color + '18', color: catInfo.color,
            padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
          }}>
            {catInfo.icon} {catInfo.name}
          </span>
          <button
            onClick={toggleFlag}
            style={{
              background: isFlagged ? theme.warningBg : 'transparent',
              border: isFlagged ? `1px solid ${theme.warning}` : `1px solid ${theme.border}`,
              borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
              fontSize: 13, color: isFlagged ? theme.warning : theme.textMuted,
              fontWeight: 600, fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            {isFlagged ? '🚩 Flagged' : '🏳️ Flag'}
          </button>
        </div>

        {/* Question card */}
        <Card accent={dc} style={{ marginBottom: 16 }}>
          <div style={{
            fontSize: 18, fontWeight: 600, color: theme.text,
            lineHeight: 1.5, marginBottom: 20,
          }}>
            {q.q}
          </div>

          {!showAnswer && !isAnswered ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: theme.textDim, fontSize: 14, marginBottom: 12, fontStyle: 'italic' }}>
                Try to answer from memory before revealing...
              </div>
              <Button onClick={() => setShowAnswer(true)} fullWidth>
                Reveal Answer
              </Button>
            </div>
          ) : (
            <div>
              <div style={{
                background: theme.answerBg, borderRadius: 10, padding: 16,
                marginBottom: 16, borderLeft: `3px solid ${theme.answerBorder}`,
              }}>
                <div style={{ color: theme.answerText, fontSize: 15, lineHeight: 1.7 }}>{q.a}</div>
              </div>
              {!isAnswered ? (
                <div style={{ display: 'flex', gap: 12 }}>
                  <Button variant="danger" onClick={() => markAnswer(false)} style={{ flex: 1 }}>
                    Wrong
                  </Button>
                  <Button variant="success" onClick={() => markAnswer(true)} style={{ flex: 1 }}>
                    Correct
                  </Button>
                </div>
              ) : (
                <div style={{
                  textAlign: 'center', padding: '8px 0',
                  color: answers[currentIdx] === 'correct' ? theme.success : theme.error,
                  fontWeight: 700, fontSize: 15,
                }}>
                  {answers[currentIdx] === 'correct' ? 'Marked Correct' : 'Marked Wrong'}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            variant="ghost"
            onClick={goPrev}
            disabled={currentIdx === 0}
            style={{ flex: 1 }}
          >
            Previous
          </Button>
          {currentIdx < questions.length - 1 ? (
            <Button
              onClick={goNext}
              style={{ flex: 1 }}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleFinishExam}
              style={{
                flex: 1,
                background: answeredCount === questions.length ? theme.success : theme.primary,
              }}
            >
              {answeredCount === questions.length ? 'Finish Exam' : `Finish (${answeredCount}/${questions.length})`}
            </Button>
          )}
        </div>

        {/* Quick nav dots for flagged/unanswered */}
        {questions.length <= 90 && (
          <div style={{
            marginTop: 16, padding: 12, background: theme.surface,
            borderRadius: 12, boxShadow: theme.shadow,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 600, color: theme.textMuted,
              textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8,
            }}>
              Question Map
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {questions.map((_, idx) => {
                const isActive = idx === currentIdx;
                const isFlagged = flagged[idx];
                const isAnswered = answers[idx] !== undefined;
                const isCorrect = answers[idx] === 'correct';
                let bg = theme.border;
                if (isAnswered) bg = isCorrect ? theme.success : theme.error;
                if (isActive) bg = theme.primary;

                return (
                  <button
                    key={idx}
                    onClick={() => { setCurrentIdx(idx); setShowAnswer(false); }}
                    style={{
                      width: 28, height: 28, borderRadius: 6,
                      border: isFlagged ? `2px solid ${theme.warning}` : 'none',
                      background: bg, color: (isActive || isAnswered) ? '#FFF' : theme.textDim,
                      fontSize: 10, fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'inherit',
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <span style={{ fontSize: 11, color: theme.textMuted }}>
                <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: theme.success, marginRight: 4, verticalAlign: 'middle' }} />
                Correct
              </span>
              <span style={{ fontSize: 11, color: theme.textMuted }}>
                <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: theme.error, marginRight: 4, verticalAlign: 'middle' }} />
                Wrong
              </span>
              <span style={{ fontSize: 11, color: theme.textMuted }}>
                <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, background: theme.border, border: `2px solid ${theme.warning}`, marginRight: 4, verticalAlign: 'middle' }} />
                Flagged
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // RESULTS SCREEN
  // ═══════════════════════════════════════════════════════

  if (phase === 'results' && results) {
    const { score, correct, total, passed, domainScores, missed, duration } = results;

    return (
      <div>
        {/* Hero result */}
        <Card style={{
          marginBottom: 20, textAlign: 'center',
          background: passed
            ? `linear-gradient(135deg, ${theme.successBg}, ${theme.surface})`
            : `linear-gradient(135deg, ${theme.errorBg}, ${theme.surface})`,
        }}>
          <div style={{ fontSize: 56, marginBottom: 8 }}>
            {passed ? '🎉' : '📚'}
          </div>
          <div style={{
            fontSize: 48, fontWeight: 900, color: passed ? theme.success : theme.error,
            marginBottom: 4,
          }}>
            {score}%
          </div>
          <div style={{
            fontSize: 20, fontWeight: 700,
            color: passed ? theme.success : theme.error,
            marginBottom: 8,
          }}>
            {passed ? 'PASSED' : 'NOT YET'}
          </div>
          <div style={{ fontSize: 16, color: theme.textSecondary, marginBottom: 4 }}>
            {correct} of {total} correct
          </div>
          <div style={{ fontSize: 14, color: theme.textMuted }}>
            Completed in {formatTime(duration)}
          </div>
        </Card>

        {/* Domain Breakdown */}
        <Card style={{ marginBottom: 16 }}>
          <div style={{
            fontSize: 12, fontWeight: 600, color: theme.textMuted,
            textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16,
          }}>
            Score by Category
          </div>
          {ARRT_CATEGORIES.map(cat => {
            const ds = domainScores[cat.id] || { correct: 0, total: 0 };
            const catPct = ds.total > 0 ? Math.round((ds.correct / ds.total) * 100) : 0;
            return (
              <div key={cat.id} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{cat.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{cat.name}</span>
                  </div>
                  <span style={{
                    fontSize: 14, fontWeight: 700,
                    color: catPct >= 75 ? theme.success : catPct >= 50 ? theme.warning : theme.error,
                  }}>
                    {ds.correct}/{ds.total} ({catPct}%)
                  </span>
                </div>
                <ProgressBar value={catPct} color={cat.color} height={6} />
              </div>
            );
          })}
        </Card>

        {/* Missed Questions */}
        {missed.length > 0 && (
          <Card style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 12, fontWeight: 600, color: theme.error,
              textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12,
            }}>
              Missed Questions ({missed.length})
            </div>
            {missed.map((m, i) => {
              const catInfo = getArrtCategoryInfo(m.arrtCategory);
              return (
                <div key={i} style={{
                  padding: '12px 0',
                  borderBottom: i < missed.length - 1 ? `1px solid ${theme.border}` : 'none',
                }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: catInfo.color,
                    textTransform: 'uppercase',
                  }}>
                    {catInfo.icon} {catInfo.name}
                  </span>
                  <div style={{
                    fontSize: 15, fontWeight: 600, color: theme.text,
                    lineHeight: 1.5, margin: '6px 0',
                  }}>
                    {m.q}
                  </div>
                  <div style={{
                    background: theme.answerBg, borderRadius: 8, padding: 12,
                    borderLeft: `3px solid ${theme.answerBorder}`,
                  }}>
                    <div style={{ color: theme.answerText, fontSize: 13, lineHeight: 1.6 }}>
                      {m.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </Card>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <Button
            variant="secondary"
            onClick={() => {
              setPhase('setup');
              setResults(null);
            }}
            style={{ flex: 1 }}
          >
            Back to Setup
          </Button>
          <Button
            onClick={() => {
              setPhase('setup');
              setResults(null);
              setTimeout(() => startExam(), 50);
            }}
            style={{ flex: 1 }}
          >
            Retake Exam
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
