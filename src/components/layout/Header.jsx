import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../context/AppContext';
import { getLevelForXp, LEVEL_TITLES } from '../../data/badges';

export default function Header({ onGoHome }) {
  const { theme } = useTheme();
  const { state } = useApp();
  const level = getLevelForXp(state.xp);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 0 12px',
      marginBottom: 12,
      borderBottom: `1px solid ${theme.border}`,
    }}>
      <div
        onClick={onGoHome}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') onGoHome(); }}
        aria-label="Go to home"
      >
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: `linear-gradient(135deg, ${theme.primary}20, ${theme.primary}08)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2 L12 22" />
            <path d="M2 12 L22 12" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </div>
        <div>
          <div style={{
            fontSize: 20, fontWeight: 800, color: theme.text,
            letterSpacing: '-0.03em', lineHeight: 1.2,
          }}>
            Fluoro<span style={{ color: theme.primary }}>Path</span>
          </div>
          <div style={{ fontSize: 11, color: theme.textMuted, fontWeight: 500 }}>
            {LEVEL_TITLES[level] || 'Trainee'} &middot; {state.xp.toLocaleString()} XP
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {state.streak.current > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: theme.warningBg, padding: '5px 12px', borderRadius: 20,
            border: `1px solid ${theme.warning}20`,
          }}>
            <span style={{ fontSize: 14 }}>&#x1F525;</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: theme.warning }}>
              {state.streak.current}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
