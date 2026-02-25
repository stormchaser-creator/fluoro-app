import { useTheme } from '../theme/ThemeContext';
import { useApp } from '../context/AppContext';
import { useStudy } from '../context/StudyContext';
import { DOMAINS } from '../data/domains';
import { QUESTIONS } from '../data/questions';
import { PHASES } from '../data/phases';
import Card from '../components/shared/Card';
import ProgressRing from '../components/shared/ProgressRing';

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

  const completedCount = Object.values(state.completedDays).filter(Boolean).length;

  // Calculate readiness from quiz data
  const totalQ = QUESTIONS.length;
  const answeredQ = study.totalAnswered;
  const correctRate = study.totalAnswered > 0 ? (study.totalCorrect / study.totalAnswered) * 100 : 0;
  const dayProgress = (completedCount / 30) * 100;
  const readiness = Math.round(correctRate * 0.6 + dayProgress * 0.4);

  return (
    <div>
      {/* Greeting */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 14, color: theme.textMuted, marginBottom: 4 }}>
          {phase?.name} Phase &middot; Day {state.currentDay} of 30
        </div>
      </div>

      {/* Readiness Ring */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
        <ProgressRing value={readiness} size={140} strokeWidth={10} label="Exam Readiness" />
      </div>

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
              onClick={() => onNavigate('study')}
              style={{
                flex: 1, padding: '12px 20px', borderRadius: 10,
                border: 'none', background: theme.primary, color: '#FFF',
                fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit',
                minHeight: 48,
              }}
            >
              Start Session
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
