import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { IntroScreen } from './components/IntroScreen';
import { LoginScreen } from './components/LoginScreen';
import { CampusShell } from './components/CampusShell';
import { HomeScreen } from './components/HomeScreen';
import { SearchBrowseScreen } from './components/SearchBrowseScreen';
import { MatchesScreen } from './components/MatchesScreen';
import { CampusMapScreen } from './components/CampusMapScreen';
import { NotificationsScreen } from './components/NotificationsScreen';
import { CampusHeroesScreen } from './components/CampusHeroesScreen';
import { AdminSecurityDashboard } from './components/AdminSecurityDashboard';
import { StudentFacultyDashboard } from './components/StudentFacultyDashboard';
import { ProfileScreen } from './components/ProfileScreen';
import { ReportModal } from './components/ReportModal';
import { HandoverChatModal } from './components/HandoverChatModal';
import { MessagingWindow } from './components/MessagingWindow';
import { LifecycleWalkthroughModal } from './components/LifecycleWalkthroughModal';
import { CertificateModal } from './components/CertificateModal';
import { CommandPalette } from './components/CommandPalette';
import { ToastContainer } from './components/Toast';

const MainAppContent: React.FC = () => {
  const { currentUser, activeTab, showIntro, setShowIntro } = useApp();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global keyboard listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 1. Mandatory Intro Screen: Plays with logo upon app entry or logout if requested
  if (showIntro) {
    return (
      <>
        <IntroScreen onEnter={() => setShowIntro(false)} />
        <ToastContainer />
      </>
    );
  }

  // 2. Authentication Gate: If explicitly logged out
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
        return <HomeScreen onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />;
      case 'search':
      case 'inventory':
        return <SearchBrowseScreen />;
      case 'matches':
        return <MatchesScreen />;
      case 'map':
        return <CampusMapScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'messages':
      case 'chat':
        return <MessagingWindow isFullScreen={true} />;
      case 'heroes':
        return <CampusHeroesScreen />;
      case 'admin':
        return currentUser.role === 'admin' || currentUser.role === 'security' ? (
          <AdminSecurityDashboard />
        ) : (
          <StudentFacultyDashboard />
        );
      case 'dashboard':
        return <StudentFacultyDashboard />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />;
    }
  };

  return (
    <CampusShell onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}>
      {renderActiveScreen()}

      {/* Overlays, Modals, Command Palette and Toasts */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
      <ReportModal />
      <HandoverChatModal />
      <CertificateModal />
      <LifecycleWalkthroughModal />
      <ToastContainer />
    </CampusShell>
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
