import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { IntroScreen } from './components/IntroScreen';
import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { MatchesScreen } from './components/MatchesScreen';
import { CampusMapScreen } from './components/CampusMapScreen';
import { NotificationsScreen } from './components/NotificationsScreen';
import { CampusHeroesScreen } from './components/CampusHeroesScreen';
import { AdminSecurityDashboard } from './components/AdminSecurityDashboard';
import { ProfileScreen } from './components/ProfileScreen';
import { ReportModal } from './components/ReportModal';
import { HandoverChatModal } from './components/HandoverChatModal';
import { MessagingWindow } from './components/MessagingWindow';
import { LifecycleWalkthroughModal } from './components/LifecycleWalkthroughModal';
import { ToastContainer } from './components/Toast';

const MainAppContent: React.FC = () => {
  const { currentUser, activeTab, showIntro, setShowIntro } = useApp();

  // 1. Mandatory Intro Screen: Plays with logo upon app entry or logout
  if (showIntro) {
    return (
      <>
        <IntroScreen onEnter={() => setShowIntro(false)} />
        <ToastContainer />
      </>
    );
  }

  // 2. Authentication Gate: Application starts from login
  if (!currentUser) {
    return (
      <>
        <LoginScreen />
        <ToastContainer />
      </>
    );
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'matches':
        return <MatchesScreen />;
      case 'map':
        return <CampusMapScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'messages':
        return <MessagingWindow isFullScreen={true} />;
      case 'heroes':
        return <CampusHeroesScreen />;
      case 'admin':
        return <AdminSecurityDashboard />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] text-[#0b241c] flex flex-col font-body selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Fixed Header */}
      <Header />

      {/* Main Screen Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto">
        {renderActiveScreen()}
      </main>

      {/* Bottom Fixed Navigation Bar */}
      <BottomNav />

      {/* Overlays, Modals, and Toasts */}
      <ReportModal />
      <HandoverChatModal />
      <LifecycleWalkthroughModal />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
