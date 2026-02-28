import { useState } from 'react';
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { StudyProvider, useStudy } from './context/StudyContext';
import Header from './components/layout/Header';
import BottomTabBar from './components/layout/BottomTabBar';
import HomeTab from './tabs/HomeTab';
import StudyTab from './tabs/StudyTab';
import ReviewTab from './tabs/ReviewTab';
import ProgressTab from './tabs/ProgressTab';
import ProfileTab from './tabs/ProfileTab';
import SpeedReader from './components/study/SpeedReader';
import MockExam from './components/features/MockExam';
import ErrorBoundary from './components/shared/ErrorBoundary';
import AuthPage from './components/pages/AuthPage';
import { signOut } from './lib/supabase';

function LoadingSpinner() {
  // Detect saved theme preference for loading screen
  let isDark = true;
  try {
    const saved = localStorage.getItem('fluoro_theme');
    if (saved) isDark = saved === 'dark';
  } catch { /* ignore */ }

  return (
    <div style={{
      minHeight: '100dvh',
      background: isDark ? '#121212' : '#F8F9FA',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <div style={{
        width: 72,
        height: 72,
        borderRadius: 22,
        background: 'linear-gradient(135deg, #0D7377 0%, #4DB6AC 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        boxShadow: '0 8px 24px rgba(13,115,119,0.3)',
      }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2 L12 22" />
          <path d="M2 12 L22 12" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      </div>
      <div style={{
        width: 40,
        height: 40,
        border: '3px solid #333333',
        borderTopColor: '#4DB6AC',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <div style={{ color: '#808080', fontSize: 14, marginTop: 16, fontWeight: 500 }}>
        Loading FluoroPath...
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function AppShell() {
  const { theme } = useTheme();
  const { study } = useStudy();
  const [activeTab, setActiveTab] = useState('home');
  const [navContext, setNavContext] = useState(null);
  const [rsvp, setRsvp] = useState(null); // { words: [], title: '' }
  const [signingOut, setSigningOut] = useState(false);

  const reviewCount = study.missedQuestions.length + study.flaggedQuestions.length;

  // Navigate to a tab with optional context (e.g. { domain: 'radiation_physics' })
  // Wrap context in a new object each time so useEffect always fires
  const navigateTo = (tab, context) => {
    setNavContext(context ? { ...context, _ts: Date.now() } : null);
    setActiveTab(tab);
  };

  const launchRsvp = (text, title) => {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    setRsvp({ words, title });
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } catch (err) {
      console.warn('Sign out failed:', err.message);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.bg,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: theme.text,
    }}>
      <style>{`
        @keyframes tabFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .tab-content { animation: tabFadeIn 0.2s ease-out; }
      `}</style>
      <div style={{
        maxWidth: 680,
        margin: '0 auto',
        padding: '0 16px',
        paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
      }}>
        <Header onGoHome={() => navigateTo('home')} />
        <div key={activeTab} className="tab-content">
          {activeTab === 'home' && <HomeTab onNavigate={navigateTo} />}
          {activeTab === 'study' && <StudyTab key={navContext?._ts || 'default'} onLaunchRsvp={launchRsvp} navContext={navContext} onNavigate={navigateTo} />}
          {activeTab === 'review' && <ReviewTab />}
          {activeTab === 'progress' && <ProgressTab />}
          {activeTab === 'profile' && <ProfileTab onSignOut={handleSignOut} signingOut={signingOut} />}
          {activeTab === 'mockExam' && <MockExam onClose={() => navigateTo('home')} />}
        </div>
      </div>
      <BottomTabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        reviewCount={reviewCount}
      />
      {rsvp && (
        <SpeedReader
          words={rsvp.words}
          title={rsvp.title}
          onClose={() => setRsvp(null)}
        />
      )}
    </div>
  );
}

function AuthGate() {
  const { user, authChecked } = useAuth();

  // Still checking auth session — show loading spinner
  if (!authChecked) {
    return <LoadingSpinner />;
  }

  // Not authenticated — show auth page
  if (!user) {
    return <AuthPage />;
  }

  // Authenticated — render the app
  return (
    <AppProvider>
      <StudyProvider>
        <AppShell />
      </StudyProvider>
    </AppProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AuthGate />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
