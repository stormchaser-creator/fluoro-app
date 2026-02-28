import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[FluoroPath] Uncaught error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // Detect dark mode from localStorage or system preference
      let isDark = false;
      try {
        const saved = localStorage.getItem('fluoro_theme');
        isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
      } catch { /* ignore */ }

      const colors = isDark
        ? { bg: '#121212', surface: '#1E1E1E', text: '#E8E8E8', muted: '#808080', border: '#333333', primary: '#4DB6AC', primaryDark: '#0D7377' }
        : { bg: '#F8F9FA', surface: '#FFFFFF', text: '#1A1A2E', muted: '#718096', border: '#E2E8F0', primary: '#0D7377', primaryDark: '#095557' };

      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 32,
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'center',
          background: colors.bg,
          color: colors.text,
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primary}08)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: colors.text }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: 14, color: colors.muted, marginBottom: 24, maxWidth: 400, lineHeight: 1.6 }}>
            FluoroPath encountered an unexpected error. Your study progress is saved locally and will be here when you return.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '14px 36px',
              borderRadius: 12,
              border: 'none',
              background: `linear-gradient(135deg, ${colors.primaryDark}, ${colors.primary})`,
              color: '#FFF',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: `0 4px 12px ${colors.primary}30`,
            }}
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
