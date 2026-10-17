import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Volume2,
  VolumeX,
  Moon,
  Sun,
  User,
  GraduationCap,
  Calculator,
  BookOpen,
  HelpCircle,
  Menu,
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onToggleSidebar }) => {
  const { user, activePage, setActivePage, settings, updateSettings } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3 flex items-center justify-between">
      {/* Brand & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          onClick={() => setActivePage('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <span className="font-heading font-black text-sm tracking-tighter">OR</span>
          </div>

          <div>
            <span className="font-heading font-black text-base tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              OR MASTER
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              EdTech
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Quick Shortcuts */}
      <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 border border-slate-800/60 p-1 rounded-xl text-xs font-semibold">
        <button
          onClick={() => setActivePage('dashboard')}
          className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
            activePage === 'dashboard' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActivePage('subjects')}
          className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
            activePage === 'subjects' || activePage === 'topic-detail'
              ? 'bg-cyan-500 text-slate-950'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Syllabus
        </button>
        <button
          onClick={() => setActivePage('solvers')}
          className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
            activePage === 'solvers' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
          }`}
        >
          Solvers
        </button>
        <button
          onClick={() => setActivePage('practice')}
          className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
            activePage === 'practice' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
          }`}
        >
          Practice MCQs
        </button>
        <button
          onClick={() => setActivePage('mock-exam')}
          className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
            activePage === 'mock-exam' || activePage === 'exam-result'
              ? 'bg-cyan-500 text-slate-950'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Mock Exams
        </button>
      </nav>

      {/* Right Controls: Theme, Audio, Profile */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition cursor-pointer"
          title="Toggle Audio Feedback"
        >
          {settings.soundEnabled ? (
            <Volume2 className="w-4 h-4 text-cyan-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-500" />
          )}
        </button>

        <button
          onClick={() => updateSettings({ darkMode: !settings.darkMode })}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition cursor-pointer"
          title="Toggle Dark/Light Mode"
        >
          {settings.darkMode ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {user ? (
          <button
            onClick={() => setActivePage('profile')}
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
          >
            <div className="w-6 h-6 rounded-lg bg-cyan-500 text-slate-950 flex items-center justify-center font-bold text-xs font-mono">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline-block text-xs font-semibold text-slate-200 truncate max-w-[100px]">
              {user.name.split(' ')[0]}
            </span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer shadow"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
