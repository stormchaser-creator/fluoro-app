import { useState, useEffect } from 'react';
import { useTheme } from '../../theme/ThemeContext';

export default function ProgressRing({ value = 0, size = 120, strokeWidth = 8, label = 'Readiness' }) {
  const { theme } = useTheme();
  const [animatedValue, setAnimatedValue] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(animatedValue, 100) / 100) * circumference;

  // Animate on mount and value change
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const getColor = (v) => {
    if (v < 40) return theme.error;
    if (v < 70) return theme.warning;
    if (v >= 90) return '#D4AF37'; // gold for exam-ready
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
            stroke={getColor(animatedValue)}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease' }}
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
          <div style={{
            fontSize: size > 140 ? 34 : 28,
            fontWeight: 800,
            color: theme.text,
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}>
            {Math.round(animatedValue)}%
          </div>
          <div style={{ fontSize: 12, color: theme.textMuted, fontWeight: 500, marginTop: 4 }}>
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}
