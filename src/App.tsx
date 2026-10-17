import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/layout/ToastContainer';
import { AuthModal } from './components/auth/AuthModal';

import { SplashScreen } from './components/splash/SplashScreen';
import { Dashboard } from './components/dashboard/Dashboard';
import { SubjectsTopics } from './components/topics/SubjectsTopics';
import { TopicDetails } from './components/topics/TopicDetails';
import { NumericalSolversHub } from './components/solvers/NumericalSolversHub';
import { PracticeMCQs } from './components/practice/PracticeMCQs';
import { MockExamHub } from './components/exam/MockExamHub';
import { ExamRunning } from './components/exam/ExamRunning';
import { ExamResultView } from './components/exam/ExamResultView';
import { ProgressTrackerView } from './components/progress/ProgressTrackerView';
import { FormulaReferenceView } from './components/formulas/FormulaReferenceView';
import { UserProfileView } from './components/profile/UserProfileView';
import { SettingsView } from './components/settings/SettingsView';
import { ORGame } from './components/game/ORGame';

const AppContent: React.FC = () => {
  const { activePage } = useApp();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  // 1. Full-viewport Game Shell (never renders website navbars or footers, per craft guidelines)
  if (activePage === 'game') {
    return (
      <main className="w-screen h-screen overflow-hidden bg-slate-950">
        <ORGame />
        <ToastContainer />
      </main>
    );
  }

  // 2. Splash Screen View
  if (activePage === 'splash') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
        <Navbar onOpenAuth={() => openAuth('login')} onToggleSidebar={() => {}} />
        <main className="flex-1 flex items-center justify-center">
          <SplashScreen onOpenAuth={openAuth} />
        </main>
        <footer className="py-6 text-center text-xs text-slate-600 font-mono border-t border-slate-900">
          OR Master &copy; {new Date().getFullYear()} &middot; Operations Research & Linear Programming Learning Platform
        </footer>
        <AuthModal
          isOpen={isAuthOpen}
          initialMode={authMode}
          onClose={() => setIsAuthOpen(false)}
        />
        <ToastContainer />
      </div>
    );
  }

  // 3. Main Application Shell with Navbar & Responsive Sidebar
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <Navbar
        onOpenAuth={() => openAuth('login')}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
      />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full pb-24 lg:pb-12">
          {activePage === 'dashboard' && <Dashboard />}
          {activePage === 'subjects' && <SubjectsTopics />}
          {activePage === 'topic-detail' && <TopicDetails />}
          {activePage === 'solvers' && <NumericalSolversHub />}
          {activePage === 'practice' && <PracticeMCQs />}
          {activePage === 'mock-exam' && <MockExamHub />}
          {activePage === 'exam-running' && <ExamRunning />}
          {activePage === 'exam-result' && <ExamResultView />}
          {activePage === 'progress' && <ProgressTrackerView />}
          {activePage === 'formulas' && <FormulaReferenceView />}
          {activePage === 'profile' && <UserProfileView />}
          {activePage === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Modals & Toasts */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
      />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
