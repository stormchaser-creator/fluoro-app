import { useState } from 'react';
import { useTheme } from '../../theme/ThemeContext';

export default function Card({ children, accent, onClick, padding = 'md', style }) {
  const { theme } = useTheme();
  const [pressed, setPressed] = useState(false);
  const pad = padding === 'sm' ? 12 : padding === 'lg' ? 28 : 20;
  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      onPointerDown={isClickable ? () => setPressed(true) : undefined}
      onPointerUp={isClickable ? () => setPressed(false) : undefined}
      onPointerLeave={isClickable ? () => setPressed(false) : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      style={{
        background: theme.surface,
        borderRadius: 14,
        padding: pad,
        borderLeft: accent ? `3px solid ${accent}` : undefined,
        boxShadow: theme.shadow,
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease',
        transform: pressed ? 'scale(0.98)' : 'scale(1)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
