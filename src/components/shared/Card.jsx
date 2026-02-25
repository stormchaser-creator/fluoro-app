import { useTheme } from '../../theme/ThemeContext';

export default function Card({ children, accent, onClick, padding = 'md', style }) {
  const { theme } = useTheme();
  const pad = padding === 'sm' ? 12 : padding === 'lg' ? 28 : 20;

  return (
    <div
      onClick={onClick}
      style={{
        background: theme.surface,
        borderRadius: 12,
        padding: pad,
        borderLeft: accent ? `3px solid ${accent}` : undefined,
        boxShadow: theme.shadow,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background 0.15s',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
