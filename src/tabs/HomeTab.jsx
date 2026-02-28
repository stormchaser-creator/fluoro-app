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
  const answeredQ = study.totalAnswered;
  const correctRate = study.totalAnswered > 0 ? (study.totalCorrect / study.totalAnswered) * 100 : 0;
  const dayProgress = (completedCount / 30) * 100;

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
      {/* Greeting */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 14, color: theme.textMuted, marginBottom: 4 }}>
          {phase?.name} Phase &middot; Day {state.currentDay} of 30
        </div>
      </div>

      {/* Readiness Ring */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <ProgressRing value={readiness} size={140} strokeWidth={10} label="Exam Readiness" />
      </div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{
          fontSize: 14, fontWeight: 600, color: readinessInfo.color,
          display: 'inline-block',
          padding: '4px 16px', borderRadius: 20,
          background: readinessInfo.color + '15',
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
          border: `2px solid ${theme.primary}30`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, boxShadow: `0 4px 12px ${theme.primary}30`,
          }}>
            🏆
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: theme.text, marginBottom: 2 }}>
              Mock Exam
            </div>
            <div style={{ fontSize: 13, color: theme.textMuted }}>
              90 questions, 2-hour timer — simulate the real ARRT exam
            </div>
          </div>
          <span style={{ color: theme.primary, fontSize: 22, fontWeight: 700 }}>›</span>
        </div>
        {bestExamScore !== null && (
          <div style={{
            marginTop: 12, paddingTop: 10, borderTop: `1px solid ${theme.border}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 13, color: theme.textMuted }}>
              Best score: <strong style={{ color: bestExamScore >= 75 ? theme.success : theme.warning }}>{bestExamScore}%</strong>
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
                border: 'none', background: theme.primary, color: '#FFF',
                fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit',
                minHeight: 48,
              }}
            >
              {hasProgress ? 'Continue Session' : 'Start Session'}
            </button>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_DAY', day: state.currentDay })}
              style={{
                padding: '12px 20px', borderRadius: 10,
                border: state.completedDays[state.currentDay] ? 'none' : `2px solid ${theme.border}`,
                background: state.completedDays[state.currentDay] ? theme.success : 'transparent',
                color: state.completedDays[state.currentDay] ? '#FFF' : theme.textMuted,
                fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit',
                minHeight: 48,
              }}
            >
              {state.completedDays[state.currentDay] ? '✓ Done' : 'Mark Done'}
            </button>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Quiz', sub: `${totalQ} questions`, icon: '⚡', tab: 'study', color: theme.primary },
          { label: 'Review', sub: `${study.missedQuestions.length} missed`, icon: '🔄', tab: 'review', color: theme.warning },
          { label: 'Numbers', sub: 'Key values', icon: '🔢', tab: 'review', color: '#D97706' },
          { label: 'Progress', sub: `${completedCount}/30 days`, icon: '📊', tab: 'progress', color: theme.success },
        ].map(item => (
          <Card key={item.label} onClick={() => onNavigate(item.tab)} padding="sm" style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: item.color + '15',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
              }}>
                {item.icon}
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
          style={{
            width: 40, height: 40, borderRadius: 10,
            border: `1px solid ${theme.border}`, background: theme.surface,
            color: theme.textMuted, fontSize: 16, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ‹
        </button>
        <div style={{ fontSize: 14, color: theme.textMuted, minWidth: 80, textAlign: 'center' }}>
          Day {state.currentDay} of 30
        </div>
        <button
          onClick={() => dispatch({ type: 'SET_DAY', day: state.currentDay + 1 })}
          style={{
            width: 40, height: 40, borderRadius: 10,
            border: `1px solid ${theme.border}`, background: theme.surface,
            color: theme.textMuted, fontSize: 16, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ›
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
