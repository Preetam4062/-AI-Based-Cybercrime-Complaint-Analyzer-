import React, { useContext, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import { AppContext, AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';

import Header from './components/Header';
import BottomNav from './components/BottomNav';
import StatsGrid from './components/StatsGrid';
import ChatSidebar from './components/ChatSidebar';

import LoginPage from './pages/LoginPage';
import AnalyzePage from './pages/AnalyzePage';
import TrackerPage from './pages/TrackerPage';
import CasesPage from './pages/CasesPage';
import InsightsPage from './pages/InsightsPage';
import AwarenessPage from './pages/AwarenessPage';

function AppInner() {
  const { user, loading } = useContext(AuthContext);
  const { activePage, theme } = useContext(AppContext);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  if (loading) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
        <div className="spinner-large" />
        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', marginTop: '1rem', fontSize: '0.85rem' }}>Initializing AI Core...</p>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  const PAGE_MAP = {
    analyze:   <AnalyzePage />,
    tracker:   <TrackerPage />,
    cases:     <CasesPage />,
    insights:  <InsightsPage />,
    awareness: <AwarenessPage />,
  };

  return (
    <>
      <Header />
      <main className="app-main">
        <StatsGrid />
        <div style={{ animation: 'fadeIn 0.4s ease' }}>
          {PAGE_MAP[activePage]}
        </div>
      </main>
      <BottomNav />
      <ChatSidebar />
      <a href="tel:1930" className="fab emergency-fab" aria-label="Emergency">
        <i className="ti ti-phone" />
        <span className="hide-mobile">Emergency? Call 1930</span>
      </a>
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppProvider>
          <AppInner />
        </AppProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
