import { useTheme } from '../../theme/ThemeContext';

const TABS = [
  {
    id: 'home', label: 'Home',
    icon: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    id: 'study', label: 'Study',
    icon: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  },
  {
    id: 'review', label: 'Review',
    icon: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  },
  {
    id: 'progress', label: 'Progress',
    icon: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  },
  {
    id: 'profile', label: 'Profile',
    icon: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  },
];

export default function BottomTabBar({ activeTab, onTabChange, reviewCount = 0 }) {
  const { theme } = useTheme();

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 56,
      background: theme.tabBar,
      borderTop: `1px solid ${theme.tabBarBorder}`,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      zIndex: 100,
    }}>
      {TABS.map(tab => {
        const isActive = activeTab === tab.id;
        const color = isActive ? theme.tabActive : theme.tabInactive;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 0',
              position: 'relative',
              minHeight: 48,
            }}
          >
            {isActive && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: '25%',
                right: '25%',
                height: 2,
                borderRadius: 1,
                background: theme.tabActive,
              }} />
            )}
            {tab.icon(color)}
            <span style={{
              fontSize: 11,
              fontWeight: isActive ? 600 : 400,
              color,
              letterSpacing: 0.2,
            }}>
              {tab.label}
            </span>
            {tab.id === 'review' && reviewCount > 0 && (
              <div style={{
                position: 'absolute',
                top: 4,
                right: '50%',
                marginRight: -20,
                background: theme.error,
                color: '#FFF',
                fontSize: 10,
                fontWeight: 700,
                width: 18,
                height: 18,
                borderRadius: 9,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {reviewCount > 9 ? '9+' : reviewCount}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
