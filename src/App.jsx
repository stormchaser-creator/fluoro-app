import { useState } from 'react';
import { ThemeProvider, useTheme } from './theme/ThemeContext';
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

function AppShell() {
  const { theme } = useTheme();
  const { study } = useStudy();
  const [activeTab, setActiveTab] = useState('home');
  const [navContext, setNavContext] = useState(null);
  const [rsvp, setRsvp] = useState(null); // { words: [], title: '' }

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
        {activeTab === 'study' && <StudyTab onLaunchRsvp={launchRsvp} navContext={navContext} />}
        {activeTab === 'review' && <ReviewTab />}
        {activeTab === 'progress' && <ProgressTab />}
        {activeTab === 'profile' && <ProfileTab />}
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

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <StudyProvider>
          <AppShell />
        </StudyProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
