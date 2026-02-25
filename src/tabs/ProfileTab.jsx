import { useTheme } from '../theme/ThemeContext';
import { useApp } from '../context/AppContext';
import { useStudy } from '../context/StudyContext';
import { BADGES, getLevelForXp, xpForLevel, LEVEL_TITLES } from '../data/badges';
import Card from '../components/shared/Card';

export default function ProfileTab() {
  const { isDark, theme, toggleTheme } = useTheme();
  const { state, dispatch } = useApp();
  const { study } = useStudy();

  const level = getLevelForXp(state.xp);
  const currentLevelXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  const progressToNext = nextLevelXp > currentLevelXp
    ? ((state.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100 : 100;

  // Check badge unlock status
  function isBadgeUnlocked(badge) {
    switch (badge.id) {
      case 'first-quiz': return study.totalAnswered >= 1;
      case 'ten-correct': return study.totalCorrect >= 10;
      case 'hundred-questions': return study.totalAnswered >= 100;
      case 'week-streak': return state.streak.longest >= 7;
      case 'month-streak': return state.streak.longest >= 30;
      case 'domain-master': {
        return Object.entries(study.quizResults).some(([, r]) => {
          const total = r.correct + r.wrong;
          return total >= 5 && (r.correct / total) >= 0.9;
        });
      }
      case 'all-domains': return study.domainsStudied.length >= 7;
      case 'speed-reader': return study.maxWpm >= 500;
      case 'completionist': return Object.values(state.completedDays).filter(Boolean).length >= 30;
      case 'night-owl': return study.lateNightSessions > 0;
      default: return false;
    }
  }

  const unlockedCount = BADGES.filter(b => isBadgeUnlocked(b)).length;

  return (
    <div>
      {/* Level Card */}
      <Card style={{ marginBottom: 20, textAlign: 'center' }}>
        <div style={{
          width: 72, height: 72, borderRadius: 36,
          background: theme.primaryLight,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 12px',
        }}>
          <span style={{ fontSize: 32 }}>🩺</span>
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: theme.text, marginBottom: 4 }}>
          {LEVEL_TITLES[level] || 'Trainee'}
        </div>
        <div style={{ fontSize: 14, color: theme.textMuted, marginBottom: 16 }}>
          Level {level} · {state.xp} XP
        </div>
        <div style={{ position: 'relative', height: 8, background: theme.border, borderRadius: 4, marginBottom: 6 }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${Math.min(progressToNext, 100)}%`,
            background: theme.primary, borderRadius: 4,
            transition: 'width 0.5s ease',
          }} />
        </div>
        <div style={{ fontSize: 12, color: theme.textMuted }}>
          {nextLevelXp - state.xp} XP to Level {level + 1}
        </div>
      </Card>

      {/* Badges */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>
            Badges
          </div>
          <div style={{ fontSize: 13, color: theme.textMuted }}>
            {unlockedCount} / {BADGES.length}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
          {BADGES.map(badge => {
            const unlocked = isBadgeUnlocked(badge);
            return (
              <div
                key={badge.id}
                title={`${badge.name}: ${badge.desc}`}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 24,
                  background: unlocked ? theme.primaryLight : theme.surfaceHover,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22,
                  opacity: unlocked ? 1 : 0.35,
                  filter: unlocked ? 'none' : 'grayscale(1)',
                }}>
                  {badge.icon}
                </div>
                <div style={{
                  fontSize: 10, fontWeight: 500, textAlign: 'center',
                  color: unlocked ? theme.text : theme.textDim,
                  lineHeight: 1.2,
                }}>
                  {badge.name}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Settings */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, marginBottom: 16 }}>
          Settings
        </div>

        {/* Dark Mode Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 500, color: theme.text }}>Dark Mode</div>
            <div style={{ fontSize: 13, color: theme.textMuted }}>Easier on the eyes at night</div>
          </div>
          <button
            onClick={toggleTheme}
            style={{
              width: 52, height: 28, borderRadius: 14,
              background: isDark ? theme.primary : theme.border,
              border: 'none', cursor: 'pointer', position: 'relative',
              transition: 'background 0.2s',
            }}
          >
            <div style={{
              width: 22, height: 22, borderRadius: 11,
              background: '#FFF',
              position: 'absolute', top: 3,
              left: isDark ? 27 : 3,
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </button>
        </div>

        {/* RSVP WPM */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 500, color: theme.text }}>Speed Reader WPM</div>
              <div style={{ fontSize: 13, color: theme.textMuted }}>Words per minute for RSVP</div>
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: theme.primary }}>{state.rsvpWpm}</span>
          </div>
          <input
            type="range"
            min={100}
            max={800}
            step={25}
            value={state.rsvpWpm}
            onChange={e => dispatch({ type: 'SET_RSVP_WPM', wpm: parseInt(e.target.value) })}
            style={{ width: '100%', accentColor: theme.primary }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: theme.textMuted }}>
            <span>100</span>
            <span>800</span>
          </div>
        </div>

        {/* RSVP Chunk Size */}
        <div>
          <div style={{ fontSize: 15, fontWeight: 500, color: theme.text, marginBottom: 4 }}>
            Chunk Size
          </div>
          <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 10 }}>
            Words shown at a time in speed reader
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[1, 2, 3].map(n => (
              <button
                key={n}
                onClick={() => dispatch({ type: 'SET_RSVP_CHUNK', chunk: n })}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 8,
                  border: state.rsvpChunk === n ? 'none' : `1px solid ${theme.border}`,
                  background: state.rsvpChunk === n ? theme.primary : 'transparent',
                  color: state.rsvpChunk === n ? '#FFF' : theme.textSecondary,
                  fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
                  minHeight: 44,
                }}
              >
                {n} word{n > 1 ? 's' : ''}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* About */}
      <Card>
        <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, marginBottom: 8 }}>
          About FluoroPath
        </div>
        <div style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.7 }}>
          FluoroPath helps you prepare for the California fluoroscopy permit exam with structured
          30-day study plans, quizzes, speed reading, and spaced review. Built to help you pass
          with confidence.
        </div>
        <div style={{ fontSize: 12, color: theme.textDim, marginTop: 12 }}>
          Version 2.0.0
        </div>
      </Card>
    </div>
  );
}
