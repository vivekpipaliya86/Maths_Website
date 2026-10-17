import React from 'react';
import { useApp } from '../../context/AppContext';
import { ActivePage } from '../../types';
import {
  LayoutDashboard,
  BookOpen,
  Calculator,
  HelpCircle,
  GraduationCap,
  LineChart,
  FileCode2,
  Gamepad2,
  User,
  Settings,
  X,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activePage, setActivePage } = useApp();

  const navItems: { id: ActivePage; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'subjects', label: 'Syllabus Modules', icon: BookOpen },
    { id: 'solvers', label: 'Numerical Solvers', icon: Calculator, badge: '6 Tools' },
    { id: 'practice', label: 'Practice MCQs', icon: HelpCircle, badge: '150+' },
    { id: 'mock-exam', label: 'Mock Examinations', icon: GraduationCap },
    { id: 'progress', label: 'Progress Tracker', icon: LineChart },
    { id: 'formulas', label: 'Formula Reference', icon: FileCode2 },
    { id: 'game', label: 'Factory Game', icon: Gamepad2, badge: 'Play' },
    { id: 'profile', label: 'Student Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: ActivePage) => {
    setActivePage(id);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[61px] left-0 z-50 lg:z-30 w-64 h-screen lg:h-[calc(100vh-61px)] bg-slate-950 border-r border-slate-800/80 p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Mobile Header with Close button */}
          <div className="flex items-center justify-between lg:hidden pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500 text-slate-950 flex items-center justify-center font-bold font-mono">
                OR
              </div>
              <span className="font-heading font-bold text-white text-sm">OR MASTER</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive =
                activePage === item.id ||
                (item.id === 'subjects' && activePage === 'topic-detail') ||
                (item.id === 'mock-exam' && (activePage === 'exam-running' || activePage === 'exam-result'));

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/15 to-teal-500/10 text-cyan-300 border border-cyan-500/30 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-md font-bold ${
                        item.badge === 'Play'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Banner */}
        <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800/80 space-y-1 text-center">
          <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Collegiate OR Suite</span>
          </div>
          <p className="text-[10px] text-slate-500 font-mono">
            Simplex &middot; Transportation &middot; Hungarian &middot; Games
          </p>
        </div>
      </aside>
    </>
  );
};
