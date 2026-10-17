import React from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, BookOpen, Calculator, HelpCircle, GraduationCap } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activePage, setActivePage } = useApp();

  const tabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'subjects', label: 'Topics', icon: BookOpen },
    { id: 'solvers', label: 'Solvers', icon: Calculator },
    { id: 'practice', label: 'Practice', icon: HelpCircle },
    { id: 'mock-exam', label: 'Exams', icon: GraduationCap },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 lg:hidden px-3 py-2 flex items-center justify-around">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive =
          activePage === tab.id ||
          (tab.id === 'subjects' && activePage === 'topic-detail') ||
          (tab.id === 'mock-exam' && (activePage === 'exam-running' || activePage === 'exam-result'));

        return (
          <button
            key={tab.id}
            onClick={() => setActivePage(tab.id)}
            className={`flex flex-col items-center gap-1 p-1.5 transition cursor-pointer ${
              isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] leading-none">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
