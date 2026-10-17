import React from 'react';
import { useApp } from '../../context/AppContext';
import { modulesData } from '../../data/syllabus';
import { questionsData } from '../../data/questionBank';
import {
  TrendingUp,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Calculator,
  Play,
  Sparkles,
  Gamepad2,
  Bookmark,
  BarChart3,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    user,
    completedTopics,
    examHistory,
    setActivePage,
    openTopic,
    bookmarkedTopics,
  } = useApp();

  const allTopics = modulesData.flatMap(m => m.topics);
  const totalTopicsCount = allTopics.length;
  const completedCount = completedTopics.length;
  const pendingCount = totalTopicsCount - completedCount;
  const progressPercent = Math.round((completedCount / totalTopicsCount) * 100);

  // Find next pending topic
  const nextPendingTopic = allTopics.find(t => !completedTopics.includes(t.id)) || allTopics[0];

  // Calculate average exam score
  const avgExamScore =
    examHistory.length > 0
      ? Math.round(examHistory.reduce((s, e) => s + e.percentage, 0) / examHistory.length)
      : null;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Student Learning Portal &middot; Academic Edition
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black font-heading text-white">
              Welcome back, {user?.name || 'Operations Master'}!
            </h1>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Targeting: <strong className="text-white">{user?.targetExam || 'B.Tech / MBA Operations Research'}</strong>. Track syllabus milestones, solve numerical tableaus, and prepare for exams.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => openTopic(nextPendingTopic.id, nextPendingTopic.moduleId)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <span>Continue Learning: {nextPendingTopic.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActivePage('game')}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4" />
                Play Factory Optimizer Game
              </button>
            </div>
          </div>

          {/* Overall Progress Dial Card */}
          <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl flex items-center gap-5 min-w-[220px]">
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="w-16 h-16 -rotate-90">
                <circle cx="32" cy="32" r="26" stroke="#1e293b" strokeWidth="5" fill="none" />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="#06b6d4"
                  strokeWidth="5"
                  fill="none"
                  strokeDasharray="163.36"
                  strokeDashoffset={163.36 - (163.36 * progressPercent) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute font-mono font-black text-white text-base">
                {progressPercent}%
              </span>
            </div>

            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                Overall Progress
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                {completedCount} of {totalTopicsCount} Completed
              </div>
              <div className="text-[10px] text-emerald-400 font-mono mt-1">
                {pendingCount} Topics Pending
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Completed Topics</div>
            <div className="text-2xl font-black font-mono text-white">{completedCount}</div>
            <div className="text-[10px] text-slate-500 font-mono">of {totalTopicsCount} total</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Pending Topics</div>
            <div className="text-2xl font-black font-mono text-white">{pendingCount}</div>
            <div className="text-[10px] text-slate-500 font-mono">Curriculum rest</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Avg. Exam Score</div>
            <div className="text-2xl font-black font-mono text-white">
              {avgExamScore !== null ? `${avgExamScore}%` : 'N/A'}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              {examHistory.length} tests taken
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Bookmarked Topics</div>
            <div className="text-2xl font-black font-mono text-white">{bookmarkedTopics.length}</div>
            <div className="text-[10px] text-slate-500 font-mono">Saved for revision</div>
          </div>
        </div>
      </div>

      {/* Quick Access to Numerical Solvers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-cyan-400" />
              <span>Interactive Numerical Solvers</span>
            </h2>
            <p className="text-xs text-slate-400">
              Input custom numerical matrices and generate step-by-step mathematical solutions.
            </p>
          </div>

          <button
            onClick={() => setActivePage('solvers')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            Open All Solvers &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div
            onClick={() => setActivePage('solvers')}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl transition cursor-pointer group shadow-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Interactive</span>
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition">
              Graphical LPP Solver
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Plot feasible regions, drag iso-profit lines, and evaluate all corner vertices.
            </p>
          </div>

          <div
            onClick={() => setActivePage('solvers')}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl transition cursor-pointer group shadow-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Algorithm</span>
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition">
              Simplex Tableau Engine
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Step through iterations, calculate C_j - Z_j, pivot rows, and minimum ratio tests.
            </p>
          </div>

          <div
            onClick={() => setActivePage('solvers')}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl transition cursor-pointer group shadow-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Optimization</span>
            </div>
            <h3 className="font-bold text-base text-white group-hover:text-teal-300 transition">
              Transportation & MODI
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              NWCR, Least Cost Method, and u-v dual opportunity cost loop testing.
            </p>
          </div>
        </div>
      </div>

      {/* Module Overview & Recent Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Module breakdown (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Syllabus Module Status
            </h3>
            <button
              onClick={() => setActivePage('subjects')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
            >
              View Syllabus &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {modulesData.map(mod => {
              const countDone = mod.topics.filter(t => completedTopics.includes(t.id)).length;
              const pct = Math.round((countDone / mod.topics.length) * 100);

              return (
                <div
                  key={mod.id}
                  onClick={() => setActivePage('subjects')}
                  className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition cursor-pointer"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-xs text-white">
                      {mod.code}: {mod.shortTitle}
                    </span>
                    <span className="font-mono text-xs text-cyan-400">
                      {countDone}/{mod.topics.length} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Exams (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Recent Examinations
            </h3>
            <button
              onClick={() => setActivePage('mock-exam')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
            >
              New Exam
            </button>
          </div>

          {examHistory.length > 0 ? (
            <div className="space-y-3">
              {examHistory.slice(0, 3).map((ex, i) => (
                <div key={i} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-white">
                    <span className="truncate max-w-[140px]">{ex.examTitle}</span>
                    <span
                      className={`font-mono ${
                        ex.percentage >= 70 ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {ex.percentage}%
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>{new Date(ex.timestamp).toLocaleDateString()}</span>
                    <span>{ex.totalQuestions} Questions</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 space-y-3">
              <p>No exams completed yet.</p>
              <button
                onClick={() => setActivePage('mock-exam')}
                className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow"
              >
                Take First Mock Exam
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
