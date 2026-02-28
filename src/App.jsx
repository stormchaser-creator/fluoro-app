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
  return (
    <div style={{
      minHeight: '100vh',
      background: '#121212',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <div style={{
        width: 48,
        height: 48,
        border: '3px solid #333333',
        borderTopColor: '#4DB6AC',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <div style={{ color: '#808080', fontSize: 14, marginTop: 16, fontWeight: 500 }}>
        Loading...
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
      <div style={{
        maxWidth: 680,
        margin: '0 auto',
        padding: '0 16px',
        paddingBottom: 80,
      }}>
        <Header onGoHome={() => navigateTo('home')} />
        {activeTab === 'home' && <HomeTab onNavigate={navigateTo} />}
        {activeTab === 'study' && <StudyTab key={navContext?._ts || 'default'} onLaunchRsvp={launchRsvp} navContext={navContext} onNavigate={navigateTo} />}
        {activeTab === 'review' && <ReviewTab />}
        {activeTab === 'progress' && <ProgressTab />}
        {activeTab === 'profile' && <ProfileTab onSignOut={handleSignOut} signingOut={signingOut} />}
        {activeTab === 'mockExam' && <MockExam onClose={() => navigateTo('home')} />}
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
