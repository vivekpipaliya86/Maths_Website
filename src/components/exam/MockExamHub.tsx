import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { modulesData } from '../../data/syllabus';
import { ExamConfig, Difficulty } from '../../types';
import { GraduationCap, Timer, Award, CheckCircle2, Play } from 'lucide-react';

export const MockExamHub: React.FC = () => {
  const { startExam } = useApp();

  const [examScope, setExamScope] = useState<'all' | string>('all');
  const [difficulty, setDifficulty] = useState<Difficulty | 'Mixed'>('Mixed');
  const [questionCount, setQuestionCount] = useState<10 | 20 | 30 | 50 | 70>(20);
  const [durationMinutes, setDurationMinutes] = useState<number>(30);

  const handleStartExam = () => {
    let title = 'Complete Syllabus Comprehensive Examination';
    if (examScope !== 'all') {
      const mod = modulesData.find(m => m.id === examScope);
      title = `${mod ? mod.shortTitle : 'Unit'} Examination`;
    }

    const config: ExamConfig = {
      id: 'exam-' + Date.now(),
      title,
      moduleId: examScope === 'all' ? undefined : examScope,
      difficulty,
      questionCount,
      durationMinutes,
    };

    startExam(config);
  };

  // Adjust duration automatically when question count changes
  const handleCountChange = (count: 10 | 20 | 30 | 50 | 70) => {
    setQuestionCount(count);
    if (count === 10) setDurationMinutes(15);
    else if (count === 20) setDurationMinutes(30);
    else if (count === 30) setDurationMinutes(45);
    else if (count === 50) setDurationMinutes(75);
    else if (count === 70) setDurationMinutes(105);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl text-center space-y-3">
        <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto text-cyan-400">
          <GraduationCap className="w-8 h-8" />
        </div>

        <h1 className="text-2xl md:text-3xl font-black font-heading text-white">
          University Mock Examination Center
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
          Simulate timed, high-stakes collegiate university exams. Choose syllabus scope, question length, and difficulty level to test your operational mastery under realistic exam conditions.
        </p>
      </div>

      {/* Configuration Card */}
      <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
        {/* 1. Examination Scope */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-3">
            1. Select Syllabus Coverage:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <button
              onClick={() => setExamScope('all')}
              className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                examScope === 'all'
                  ? 'bg-cyan-500/15 border-cyan-500 text-white font-bold ring-1 ring-cyan-500'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-xs font-mono text-cyan-400">FULL SYLLABUS</div>
              <div className="text-sm">Complete 5-Module Exam</div>
            </button>

            {modulesData.map(m => (
              <button
                key={m.id}
                onClick={() => setExamScope(m.id)}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                  examScope === m.id
                    ? 'bg-cyan-500/15 border-cyan-500 text-white font-bold ring-1 ring-cyan-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-mono text-cyan-400">{m.code}</div>
                <div className="text-sm truncate">{m.shortTitle}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Number of Questions (10, 20, 30, 50, 70 MCQs) */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-3">
            2. Number of Questions:
          </label>
          <div className="grid grid-cols-5 gap-2.5">
            {[10, 20, 30, 50, 70].map(cnt => (
              <button
                key={cnt}
                onClick={() => handleCountChange(cnt as 10 | 20 | 30 | 50 | 70)}
                className={`py-3 rounded-xl border text-center font-mono font-bold transition cursor-pointer ${
                  questionCount === cnt
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 border-cyan-400 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span className="text-lg block leading-none">{cnt}</span>
                <span className="text-[10px] uppercase font-semibold">MCQs</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Difficulty Level & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
              3. Difficulty Level:
            </label>
            <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              {(['Mixed', 'Easy', 'Medium', 'Hard'] as const).map(diff => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                    difficulty === diff
                      ? 'bg-slate-800 text-cyan-300 shadow font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
              4. Exam Duration:
            </label>
            <div className="flex items-center gap-2 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
              <Timer className="w-4 h-4 text-cyan-400" />
              <input
                type="number"
                min="5"
                max="180"
                value={durationMinutes}
                onChange={e => setDurationMinutes(Number(e.target.value) || 30)}
                className="w-16 bg-slate-900 border border-slate-700/60 rounded px-2 py-1 text-center font-bold text-white focus:outline-none"
              />
              <span>Minutes</span>
              <span className="text-slate-500 text-[11px] ml-auto">
                (~{Number((durationMinutes / questionCount).toFixed(1))} min/question)
              </span>
            </div>
          </div>
        </div>

        {/* Exam Protocol Guidelines */}
        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-2 font-mono">
          <div className="font-bold text-slate-300 font-sans text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            University Examination Rules:
          </div>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li>Answers remain strictly hidden during the test to simulate true exam conditions.</li>
            <li>You can flag questions for review and navigate via the status panel at any time.</li>
            <li>The test will auto-submit when the countdown timer hits 00:00:00.</li>
            <li>In-depth score analytics and explanations appear on the Results page upon submission.</li>
          </ul>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartExam}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black font-heading rounded-2xl shadow-xl shadow-cyan-500/20 text-base tracking-wide flex items-center justify-center gap-2 transition cursor-pointer transform hover:scale-[1.01] active:scale-[0.99]"
        >
          <Play className="w-5 h-5 fill-slate-950" />
          START EXAMINATION NOW
        </button>
      </div>
    </div>
  );
};
