import { useTheme } from '../theme/ThemeContext';
import { useApp } from '../context/AppContext';
import { useStudy } from '../context/StudyContext';
import { DOMAINS } from '../data/domains';
import { QUESTIONS } from '../data/questions';
import Card from '../components/shared/Card';
import ProgressBar from '../components/shared/ProgressBar';

export default function ProgressTab() {
  const { theme, domainColors } = useTheme();
  const { state } = useApp();
  const { study } = useStudy();

  const completedCount = Object.values(state.completedDays).filter(Boolean).length;
  const overallAccuracy = study.totalAnswered > 0
    ? Math.round((study.totalCorrect / study.totalAnswered) * 100) : 0;

  // Domain breakdown
  const domainStats = DOMAINS.map(d => {
    const result = study.quizResults[d.id];
    const total = result ? result.correct + result.wrong : 0;
    const accuracy = total > 0 ? Math.round((result.correct / total) * 100) : 0;
    const questionCount = QUESTIONS.filter(q => q.domain === d.id).length;
    return { ...d, total, accuracy, correct: result?.correct || 0, wrong: result?.wrong || 0, questionCount };
  });

  // 30-day calendar
  const dayGrid = [];
  for (let d = 1; d <= 30; d++) {
    dayGrid.push({
      day: d,
      completed: !!state.completedDays[d],
      isCurrent: d === state.currentDay,
    });
  }

  return (
    <div>
      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Accuracy', value: `${overallAccuracy}%`, color: overallAccuracy >= 75 ? theme.success : overallAccuracy >= 50 ? theme.warning : theme.error },
          { label: 'Answered', value: study.totalAnswered.toLocaleString(), color: theme.primary },
          { label: 'Streak', value: `${state.streak.current}d`, color: theme.warning },
        ].map(stat => (
          <Card key={stat.label} padding="sm" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: stat.color, letterSpacing: '-0.02em' }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* 30-Day Calendar */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{
          fontSize: 13, fontWeight: 700, color: theme.textMuted,
          textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14,
        }}>
          30-Day Progress
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
          {dayGrid.map(({ day, completed, isCurrent }) => (
            <div
              key={day}
              style={{
                aspectRatio: '1',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: isCurrent ? 700 : 500,
                background: completed ? theme.success : isCurrent ? theme.primaryLight : theme.surfaceHover,
                color: completed ? '#FFF' : isCurrent ? theme.primary : theme.textMuted,
                border: isCurrent && !completed ? `2px solid ${theme.primary}` : 'none',
              }}
            >
              {day}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 13, color: theme.textMuted, textAlign: 'center' }}>
          {completedCount} of 30 days completed ({Math.round(completedCount / 30 * 100)}%)
        </div>
      </Card>

      {/* Domain Breakdown */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{
          fontSize: 13, fontWeight: 700, color: theme.textMuted,
          textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16,
        }}>
          Domain Mastery
        </div>
        {domainStats.map(d => (
          <div key={d.id} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>{d.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{d.name}</span>
              </div>
              <div style={{ fontSize: 13, color: theme.textMuted }}>
                {d.total > 0 ? `${d.accuracy}%` : '—'} · {d.correct}/{d.total}
              </div>
            </div>
            <ProgressBar
              value={d.accuracy}
              color={domainColors[d.id]}
              height={6}
            />
          </div>
        ))}
      </Card>

      {/* Question Coverage */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{
          fontSize: 13, fontWeight: 700, color: theme.textMuted,
          textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14,
        }}>
          Question Coverage
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 14, color: theme.textSecondary }}>Total Questions</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{QUESTIONS.length}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 14, color: theme.textSecondary }}>Answered</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: theme.primary }}>{study.totalAnswered}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 14, color: theme.textSecondary }}>Correct</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: theme.success }}>{study.totalCorrect}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 14, color: theme.textSecondary }}>Wrong</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: theme.error }}>{study.totalAnswered - study.totalCorrect}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, color: theme.textSecondary }}>Missed Queue</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: theme.warning }}>{study.missedQuestions.length}</span>
        </div>
      </Card>

      {/* Additional Stats */}
      <Card>
        <div style={{
          fontSize: 13, fontWeight: 700, color: theme.textMuted,
          textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14,
        }}>
          Additional Stats
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 14, color: theme.textSecondary }}>XP Earned</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: theme.primary }}>{state.xp.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 14, color: theme.textSecondary }}>Longest Streak</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: theme.warning }}>{state.streak.longest} days</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 14, color: theme.textSecondary }}>Domains Studied</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{study.domainsStudied.length} / {DOMAINS.length}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, color: theme.textSecondary }}>Speed Read Max WPM</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{study.maxWpm}</span>
        </div>
      </Card>
    </div>
  );
}
