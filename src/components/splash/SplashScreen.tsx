import React from 'react';
import { useApp } from '../../context/AppContext';
import { Play, BookOpen, Calculator, GraduationCap, CheckCircle2, ArrowRight } from 'lucide-react';

export const SplashScreen: React.FC<{ onOpenAuth: (mode: 'login' | 'signup') => void }> = ({ onOpenAuth }) => {
  const { setActivePage } = useApp();

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center text-center p-6 space-y-10">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 shadow-md">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        Operations Research & Linear Programming Learning Platform
      </div>

      {/* Main Title Lockup */}
      <div className="space-y-4 max-w-3xl">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-heading text-white tracking-tight leading-[1.1]">
          OR MASTER <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
            Learn, Practice & Excel
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          The ultimate college companion for Operations Research. Step-by-step Simplex tableaus, interactive 2-variable graphical solvers, Hungarian bipartite matching, MODI loops, 150+ original MCQs, and realistic university mock exams.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <button
          onClick={() => setActivePage('dashboard')}
          className="flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black font-heading text-base rounded-2xl shadow-xl shadow-cyan-500/25 transition transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>ENTER LEARNING DASHBOARD</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActivePage('solvers')}
          className="flex items-center gap-2 px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold border border-slate-800 rounded-2xl transition cursor-pointer text-sm"
        >
          <Calculator className="w-4 h-4 text-cyan-400" />
          Interactive Numerical Solvers
        </button>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl w-full pt-8 text-left">
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
            01
          </div>
          <h3 className="font-bold text-white text-sm font-heading">Complete 5-Module Syllabus</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            From basic OR scope to Duality, Transportation, Hungarian assignments, and Game Theory with real solved problems.
          </p>
        </div>

        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold">
            02
          </div>
          <h3 className="font-bold text-white text-sm font-heading">Interactive Live Solvers</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Enter your own numerical problems to generate step-by-step Simplex tableaus, graphical feasible polygons, and MODI evaluations.
          </p>
        </div>

        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
            03
          </div>
          <h3 className="font-bold text-white text-sm font-heading">College Mock Exams</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Timed 10–70 MCQ tests with countdown timers, review palettes, and diagnostic analytics report cards.
          </p>
        </div>
      </div>
    </div>
  );
};
