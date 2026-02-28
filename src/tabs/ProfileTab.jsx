import { useTheme } from '../theme/ThemeContext';
import { useApp } from '../context/AppContext';
import { useStudy } from '../context/StudyContext';
import { BADGES, getLevelForXp, xpForLevel, LEVEL_TITLES } from '../data/badges';
import Card from '../components/shared/Card';

export default function ProfileTab({ onSignOut, signingOut }) {
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
          width: 72, height: 72, borderRadius: 20,
          background: `linear-gradient(135deg, ${theme.primary}20, ${theme.primary}08)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 12px',
          border: `1px solid ${theme.primary}15`,
        }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: theme.text, marginBottom: 2, letterSpacing: '-0.02em' }}>
          {LEVEL_TITLES[level] || 'Trainee'}
        </div>
        <div style={{ fontSize: 14, color: theme.textMuted, marginBottom: 18 }}>
          Level {level} &middot; {state.xp.toLocaleString()} XP
        </div>
        <div style={{ position: 'relative', height: 8, background: theme.border, borderRadius: 4, marginBottom: 6 }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${Math.min(progressToNext, 100)}%`,
            background: `linear-gradient(90deg, ${theme.primary}, ${theme.primaryDark || theme.primary})`,
            borderRadius: 4,
            transition: 'width 0.5s ease',
          }} />
        </div>
        <div style={{ fontSize: 12, color: theme.textMuted }}>
          {(nextLevelXp - state.xp).toLocaleString()} XP to Level {level + 1}
        </div>
      </Card>

      {/* Badges */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: theme.textMuted,
            textTransform: 'uppercase', letterSpacing: 0.5,
          }}>
            Badges
          </div>
          <div style={{
            fontSize: 13, fontWeight: 600, color: theme.primary,
            background: theme.primaryLight,
            padding: '2px 10px', borderRadius: 12,
          }}>
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
                  width: 48, height: 48, borderRadius: 14,
                  background: unlocked ? theme.primaryLight : theme.surfaceHover,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22,
                  opacity: unlocked ? 1 : 0.3,
                  filter: unlocked ? 'none' : 'grayscale(1)',
                  border: unlocked ? `1px solid ${theme.primary}25` : 'none',
                  transition: 'all 0.3s',
                }}>
                  {badge.icon}
                </div>
                <div style={{
                  fontSize: 10, fontWeight: unlocked ? 600 : 500, textAlign: 'center',
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
        <div style={{
          fontSize: 13, fontWeight: 700, color: theme.textMuted,
          textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 18,
        }}>
          Settings
        </div>

        {/* Dark Mode Toggle */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${theme.border}`,
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: theme.text }}>Dark Mode</div>
            <div style={{ fontSize: 13, color: theme.textMuted }}>Easier on the eyes at night</div>
          </div>
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
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
        <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: theme.text }}>Speed Reader</div>
              <div style={{ fontSize: 13, color: theme.textMuted }}>Words per minute for RSVP</div>
            </div>
            <span style={{
              fontSize: 15, fontWeight: 700, color: theme.primary,
              background: theme.primaryLight,
              padding: '2px 10px', borderRadius: 8,
            }}>
              {state.rsvpWpm} WPM
            </span>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: theme.textDim, marginTop: 4 }}>
            <span>100</span>
            <span>300</span>
            <span>500</span>
            <span>800</span>
          </div>
        </div>

        {/* RSVP Chunk Size */}
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, marginBottom: 4 }}>
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
                  transition: 'all 0.2s',
                }}
              >
                {n} word{n > 1 ? 's' : ''}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* About */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(135deg, ${theme.primary}20, ${theme.primary}08)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2 L12 22" />
              <path d="M2 12 L22 12" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>
              Fluoro<span style={{ color: theme.primary }}>Path</span>
            </div>
            <div style={{ fontSize: 12, color: theme.textDim }}>Version 2.1</div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.7 }}>
          Prepare for the California fluoroscopy permit exam with structured 30-day study plans,
          adaptive quizzes, speed reading, and spaced review. Built to help you pass with confidence.
        </div>
      </Card>

      {/* Sign Out */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={onSignOut}
          disabled={signingOut}
          style={{
            width: '100%',
            padding: '14px 16px',
            fontSize: 15,
            fontWeight: 600,
            color: theme.error,
            backgroundColor: theme.surface,
            border: `1px solid ${theme.error}30`,
            borderRadius: 12,
            cursor: signingOut ? 'not-allowed' : 'pointer',
            opacity: signingOut ? 0.6 : 1,
            transition: 'opacity 0.2s, background 0.2s',
            fontFamily: 'inherit',
            boxShadow: theme.shadow,
          }}
        >
          {signingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </div>
  );
}
