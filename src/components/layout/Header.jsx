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
      padding: '12px 0',
      marginBottom: 8,
    }}>
      <div onClick={onGoHome} style={{ cursor: 'pointer' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: theme.text, letterSpacing: -0.5 }}>
          Fluoro<span style={{ color: theme.primary }}>Path</span>
        </div>
        <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>
          {LEVEL_TITLES[level] || 'Trainee'} &middot; {state.xp} XP
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {state.streak.current > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: theme.warningBg, padding: '6px 12px', borderRadius: 20,
          }}>
            <span style={{ fontSize: 16 }}>🔥</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: theme.warning }}>
              {state.streak.current}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
