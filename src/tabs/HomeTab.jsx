import { useTheme } from '../theme/ThemeContext';
import { useApp } from '../context/AppContext';
import { useStudy } from '../context/StudyContext';
import { DOMAINS } from '../data/domains';
import { QUESTIONS } from '../data/questions';
import { PHASES } from '../data/phases';
import STUDY_MATERIAL from '../studyMaterial';
import Card from '../components/shared/Card';
import ProgressRing from '../components/shared/ProgressRing';
import ProgressBar from '../components/shared/ProgressBar';

export default function HomeTab({ onNavigate }) {
  const { theme, domainColors } = useTheme();
  const { state, dispatch } = useApp();
  const { study } = useStudy();

  const phase = PHASES.find(p => state.currentDay >= p.dayRange[0] && state.currentDay <= p.dayRange[1]);
  const schedule = (() => {
    for (const p of PHASES) {
      const found = p.dailySchedule.find(d => d.day === state.currentDay);
      if (found) return { ...found, phase: p.name };
    }
    return null;
  })();
  const scheduleDomains = (schedule?.domains || []).map(id => DOMAINS.find(d => d.id === id)).filter(Boolean);

  // Determine if user has study progress and find resume point
  const hasProgress = study.totalAnswered > 0 || Object.keys(study.readSections).length > 0;
  const resumeDomain = (() => {
    // First check today's scheduled domains for one with unread sections
    const todayDomainIds = schedule?.domains || [];
    for (const domainId of todayDomainIds) {
      const material = STUDY_MATERIAL[domainId];
      if (!material) continue;
      const readSet = study.readSections[domainId] || [];
      if (readSet.length < material.length) return domainId;
    }
    // Fallback: find any domain the user has started reading but hasn't finished
    for (const d of DOMAINS) {
      const material = STUDY_MATERIAL[d.id];
      if (!material) continue;
      const readSet = study.readSections[d.id] || [];
      if (readSet.length > 0 && readSet.length < material.length) return d.id;
    }
    // Fallback: find any domain with unread sections (even if user hasn't started it)
    for (const d of DOMAINS) {
      const material = STUDY_MATERIAL[d.id];
      if (!material) continue;
      const readSet = study.readSections[d.id] || [];
      if (readSet.length < material.length) return d.id;
    }
    return null;
  })();

  const completedCount = Object.values(state.completedDays).filter(Boolean).length;

  // Calculate readiness from quiz data
  const totalQ = QUESTIONS.length;
  const correctRate = study.totalAnswered > 0 ? (study.totalCorrect / study.totalAnswered) * 100 : 0;

  // ═══════════════════════════════════════════════════════
  // PASS READINESS PREDICTION (Feature 3)
  // ═══════════════════════════════════════════════════════

  // Factor 1: Quiz accuracy (last 50 questions approximated via overall accuracy) — 40% weight
  const accuracyScore = correctRate;

  // Factor 2: Domain coverage (have they studied all 8 domains?) — 25% weight
  const domainsCovered = study.domainsStudied?.length || 0;
  const domainCoverageScore = (domainsCovered / DOMAINS.length) * 100;

  // Factor 3: Mock exam scores (if any taken) — 35% weight
  const examHistory = study.examHistory || [];
  const recentExams = examHistory.slice(-3); // last 3 exams
  const examScore = recentExams.length > 0
    ? recentExams.reduce((sum, e) => sum + (e.total > 0 ? (e.score / e.total) * 100 : 0), 0) / recentExams.length
    : 0;
  const hasExams = recentExams.length > 0;

  // Weighted readiness: if no exams taken, redistribute exam weight to accuracy
  const readiness = hasExams
    ? Math.round(accuracyScore * 0.40 + domainCoverageScore * 0.25 + examScore * 0.35)
    : Math.round(accuracyScore * 0.60 + domainCoverageScore * 0.40);

  // Readiness label and color
  const getReadinessInfo = (r) => {
    if (r >= 90) return { label: "You're ready — schedule your exam", color: '#D4AF37' }; // gold
    if (r >= 75) return { label: 'Almost ready', color: theme.success };
    if (r >= 50) return { label: 'Getting closer', color: theme.warning };
    return { label: 'Keep studying', color: theme.error };
  };
  const readinessInfo = getReadinessInfo(readiness);

  // Domain-level readiness (sorted weakest to strongest)
  const domainReadiness = DOMAINS.map(d => {
    const result = study.quizResults[d.id];
    const total = result ? result.correct + result.wrong : 0;
    const accuracy = total > 0 ? Math.round((result.correct / total) * 100) : 0;
    return { ...d, accuracy, total };
  }).sort((a, b) => a.accuracy - b.accuracy);

  // Best mock exam score
  const bestExamScore = examHistory.length > 0
    ? Math.max(...examHistory.map(e => e.total > 0 ? Math.round((e.score / e.total) * 100) : 0))
    : null;

  return (
    <div>
      {/* Phase Tag */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <span style={{
          fontSize: 13, color: phase?.color || theme.textMuted, fontWeight: 600,
          padding: '4px 14px', borderRadius: 20,
          background: (phase?.color || theme.textMuted) + '12',
          letterSpacing: '0.02em',
        }}>
          {phase?.name} Phase &middot; Day {state.currentDay} of 30
        </span>
      </div>

      {/* Readiness Ring */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <ProgressRing value={readiness} size={148} strokeWidth={10} label="Exam Readiness" />
      </div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{
          fontSize: 14, fontWeight: 600, color: readinessInfo.color,
          display: 'inline-block',
          padding: '5px 18px', borderRadius: 20,
          background: readinessInfo.color + '15',
          letterSpacing: '0.01em',
        }}>
          {readinessInfo.label}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          MOCK EXAM CARD — Prominent, premium placement
          ══════════════════════════════════════════════════ */}
      <Card
        onClick={() => onNavigate('mockExam')}
        style={{
          marginBottom: 16, cursor: 'pointer',
          background: `linear-gradient(135deg, ${theme.primaryLight}, ${theme.surface})`,
          border: `1px solid ${theme.primary}25`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark || theme.primary})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 14px ${theme.primary}30`,
            flexShrink: 0,
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: theme.text, marginBottom: 2, letterSpacing: '-0.01em' }}>
              Mock Exam
            </div>
            <div style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.4 }}>
              90 questions &middot; 2 hours &middot; ARRT-weighted
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
        {bestExamScore !== null && (
          <div style={{
            marginTop: 12, paddingTop: 10, borderTop: `1px solid ${theme.border}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 13, color: theme.textMuted }}>
              Best: <strong style={{ color: bestExamScore >= 75 ? theme.success : theme.warning }}>{bestExamScore}%</strong>
            </span>
            <span style={{ fontSize: 13, color: theme.textMuted }}>
              {examHistory.length} exam{examHistory.length !== 1 ? 's' : ''} taken
            </span>
          </div>
        )}
      </Card>

      {/* Today's Plan */}
      {schedule && (
        <Card accent={phase?.color} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: phase?.color, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                Today's Focus
              </div>
              <div style={{ fontSize: 17, fontWeight: 600, color: theme.text, lineHeight: 1.4 }}>
                {schedule.focus}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {scheduleDomains.map(d => (
              <span key={d.id} style={{
                background: (domainColors[d.id] || d.color) + '18',
                color: domainColors[d.id] || d.color,
                padding: '4px 12px', borderRadius: 20,
                fontSize: 13, fontWeight: 500,
              }}>
                {d.icon} {d.name}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => onNavigate('study', resumeDomain ? { domain: resumeDomain } : undefined)}
              style={{
                flex: 1, padding: '12px 20px', borderRadius: 10,
                border: 'none',
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark || theme.primary})`,
                color: '#FFF',
                fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit',
                minHeight: 48,
                boxShadow: `0 2px 8px ${theme.primary}30`,
                transition: 'transform 0.1s, box-shadow 0.2s',
              }}
            >
              {hasProgress ? 'Continue Studying' : 'Start Session'}
            </button>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_DAY', day: state.currentDay })}
              style={{
                padding: '12px 20px', borderRadius: 10,
                border: state.completedDays[state.currentDay] ? 'none' : `1.5px solid ${theme.border}`,
                background: state.completedDays[state.currentDay] ? theme.success : 'transparent',
                color: state.completedDays[state.currentDay] ? '#FFF' : theme.textMuted,
                fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit',
                minHeight: 48,
                transition: 'all 0.2s',
              }}
            >
              {state.completedDays[state.currentDay] ? 'Done' : 'Mark Done'}
            </button>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          {
            label: 'Quiz', sub: `${totalQ} questions`, tab: 'study', color: theme.primary,
            svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
          },
          {
            label: 'Review', sub: `${study.missedQuestions.length} missed`, tab: 'review', color: theme.warning,
            svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
          },
          {
            label: 'Numbers', sub: 'Key values', tab: 'review', color: '#D97706',
            svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>,
          },
          {
            label: 'Progress', sub: `${completedCount}/30 days`, tab: 'progress', color: theme.success,
            svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
          },
        ].map(item => (
          <Card key={item.label} onClick={() => onNavigate(item.tab)} padding="sm" style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: item.color + '15',
                color: item.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {item.svg}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: theme.text }}>{item.label}</div>
                <div style={{ fontSize: 12, color: theme.textMuted }}>{item.sub}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════
          DOMAIN READINESS — Mini bar chart (weakest to strongest)
          ══════════════════════════════════════════════════ */}
      {study.totalAnswered > 0 && (
        <Card style={{ marginBottom: 16 }}>
          <div style={{
            fontSize: 12, fontWeight: 600, color: theme.textMuted,
            textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12,
          }}>
            Domain Readiness (weakest → strongest)
          </div>
          {domainReadiness.map(d => {
            const dc = domainColors[d.id] || d.color;
            return (
              <div key={d.id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14 }}>{d.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{d.name}</span>
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: 700,
                    color: d.total === 0 ? theme.textDim : d.accuracy >= 75 ? theme.success : d.accuracy >= 50 ? theme.warning : theme.error,
                  }}>
                    {d.total > 0 ? `${d.accuracy}%` : 'Not started'}
                  </span>
                </div>
                <ProgressBar value={d.accuracy} color={dc} height={5} />
              </div>
            );
          })}
        </Card>
      )}

      {/* Day Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginBottom: 16 }}>
        <button
          onClick={() => dispatch({ type: 'SET_DAY', day: state.currentDay - 1 })}
          disabled={state.currentDay <= 1}
          style={{
            width: 40, height: 40, borderRadius: 10,
            border: `1px solid ${theme.border}`, background: theme.surface,
            color: state.currentDay <= 1 ? theme.textDim : theme.textMuted,
            fontSize: 16, cursor: state.currentDay <= 1 ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: state.currentDay <= 1 ? 0.5 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div style={{ fontSize: 14, fontWeight: 600, color: theme.textSecondary, minWidth: 100, textAlign: 'center' }}>
          Day {state.currentDay} of 30
        </div>
        <button
          onClick={() => dispatch({ type: 'SET_DAY', day: state.currentDay + 1 })}
          disabled={state.currentDay >= 30}
          style={{
            width: 40, height: 40, borderRadius: 10,
            border: `1px solid ${theme.border}`, background: theme.surface,
            color: state.currentDay >= 30 ? theme.textDim : theme.textMuted,
            fontSize: 16, cursor: state.currentDay >= 30 ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: state.currentDay >= 30 ? 0.5 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      {/* Protocol Tips */}
      {phase && (
        <Card style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
            Study Tips &mdash; {phase.name}
          </div>
          {phase.protocol.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
              <span style={{
                color: phase.color, fontWeight: 700, fontSize: 14,
                minWidth: 22, height: 22, borderRadius: 11,
                background: phase.color + '15',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {i + 1}
              </span>
              <span style={{ color: theme.textSecondary, fontSize: 14, lineHeight: 1.6 }}>{step}</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
