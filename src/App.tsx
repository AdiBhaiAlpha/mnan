import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SchoolTopBar } from './components/SchoolTopBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { AboutView } from './components/AboutView';
import { StudentsView } from './components/StudentsView';
import { ProfileView } from './components/ProfileView';
import { CommunityView } from './components/CommunityView';
import { ReunionView } from './components/ReunionView';
import { MarketplaceView } from './components/MarketplaceView';
import { AuthView } from './components/AuthView';
import { DashboardView } from './components/DashboardView';
import { AdminView } from './components/AdminView';
import { motion, AnimatePresence } from 'motion/react';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'about':
        return <AboutView />;
      case 'students':
        return <StudentsView />;
      case 'profile':
        return <ProfileView />;
      case 'reunion':
        return <ReunionView />;
      case 'community':
        return <CommunityView />;
      case 'marketplace':
        return <MarketplaceView />;
      case 'login':
        return <AuthView initialMode="login" />;
      case 'register':
        return <AuthView initialMode="register" />;
      case 'dashboard':
        return <DashboardView />;
      case 'admin':
        return <AdminView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          {renderActiveView()}
        </motion.div>
      </AnimatePresence>
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-slate-100/70 text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
        <SchoolTopBar />
        <Navbar />
        <div className="flex-1">
          <MainContent />
        </div>
        <Footer />
      </div>
    </AppProvider>
  );
}
