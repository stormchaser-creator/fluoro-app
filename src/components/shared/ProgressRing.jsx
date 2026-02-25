import { useTheme } from '../../theme/ThemeContext';

export default function ProgressRing({ value = 0, size = 120, strokeWidth = 8, label = 'Readiness' }) {
  const { theme } = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(value, 100) / 100) * circumference;

  const getColor = (v) => {
    if (v < 40) return theme.error;
    if (v < 70) return theme.warning;
    return theme.success;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={theme.border}
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getColor(value)}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease-out, stroke 0.3s' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ fontSize: size > 140 ? 32 : 26, fontWeight: 800, color: theme.text, lineHeight: 1 }}>
            {Math.round(value)}%
          </div>
          <div style={{ fontSize: 12, color: theme.textMuted, fontWeight: 500, marginTop: 4 }}>
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}
