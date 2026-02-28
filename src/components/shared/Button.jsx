import { useState } from 'react';
import { useTheme } from '../../theme/ThemeContext';

export default function Button({ children, variant = 'primary', size = 'md', fullWidth, disabled, onClick, icon, style: extraStyle }) {
  const { theme } = useTheme();
  const [pressed, setPressed] = useState(false);

  const sizes = {
    sm: { padding: '8px 16px', fontSize: 14 },
    md: { padding: '12px 24px', fontSize: 16 },
    lg: { padding: '16px 32px', fontSize: 18 },
  };

  const variants = {
    primary: { background: theme.primary, color: '#FFFFFF', border: 'none' },
    secondary: { background: 'transparent', color: theme.primary, border: `2px solid ${theme.primary}` },
    ghost: { background: 'transparent', color: theme.textSecondary, border: 'none' },
    danger: { background: theme.error, color: '#FFFFFF', border: 'none' },
    success: { background: theme.success, color: '#FFFFFF', border: 'none' },
  };

  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onPointerDown={!disabled ? () => setPressed(true) : undefined}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        ...v,
        ...s,
        borderRadius: 12,
        fontWeight: 600,
        fontFamily: 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        width: fullWidth ? '100%' : undefined,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        minHeight: 48,
        transition: 'transform 0.12s ease, opacity 0.15s ease, box-shadow 0.15s ease',
        transform: pressed && !disabled ? 'scale(0.97)' : 'scale(1)',
        letterSpacing: '0.01em',
        ...extraStyle,
      }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
