import { useTheme } from '../../theme/ThemeContext';

export default function ProgressBar({ value = 0, color, height = 8, label, showPercent }) {
  const { theme } = useTheme();
  const barColor = color || (value < 40 ? theme.error : value < 70 ? theme.warning : theme.success);

  return (
    <div>
      {(label || showPercent) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          {label && <span style={{ fontSize: 14, color: theme.textSecondary }}>{label}</span>}
          {showPercent && <span style={{ fontSize: 14, fontWeight: 600, color: barColor }}>{Math.round(value)}%</span>}
        </div>
      )}
      <div style={{
        height,
        borderRadius: height / 2,
        background: theme.border,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${Math.min(Math.max(value, 0), 100)}%`,
          borderRadius: height / 2,
          background: barColor,
          transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          minWidth: value > 0 ? 4 : 0,
        }} />
      </div>
    </div>
  );
}
