import { createContext, useContext, useState, useEffect } from 'react';
import { THEMES, DOMAIN_COLORS } from './theme';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = localStorage.getItem('fluoro_theme');
      if (saved !== null) return saved === 'dark';
      // Check old key for migration
      const old = localStorage.getItem('fluoro_darkMode');
      if (old !== null) return old === 'true';
      return false;
    } catch { return false; }
  });

  const theme = isDark ? THEMES.dark : THEMES.light;
  const domainColors = isDark ? DOMAIN_COLORS.dark : DOMAIN_COLORS.light;

  useEffect(() => {
    localStorage.setItem('fluoro_theme', isDark ? 'dark' : 'light');
    document.body.style.background = theme.bg;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.bg);
  }, [isDark, theme.bg]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, theme, domainColors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
