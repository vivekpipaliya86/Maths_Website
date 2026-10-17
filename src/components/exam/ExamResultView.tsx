import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { questionsData } from '../../data/questionBank';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  BarChart2,
  RotateCcw,
  BookOpen,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export const ExamResultView: React.FC = () => {
  const { lastExamResult, setActivePage, openTopic } = useApp();

  useEffect(() => {
    if (lastExamResult && lastExamResult.percentage >= 60) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  }, [lastExamResult]);

  if (!lastExamResult) {
    return (
      <div className="bg-slate-900 border border-slate-800 p-12 rounded-3xl text-center space-y-4 max-w-md mx-auto">
        <h3 className="text-xl font-bold font-heading text-white">No Exam Results Found</h3>
        <p className="text-xs text-slate-400">Take a mock examination to view your performance report.</p>
        <button
          onClick={() => setActivePage('mock-exam')}
          className="px-6 py-2.5 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer"
        >
          Go to Mock Exams
        </button>
      </div>
    );
  }

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  // Grade badge & suggestions
  let grade = 'Needs Revision';
  let gradeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  let advice =
    'Focus on understanding foundational definitions and step-by-step algorithms. Try the interactive solvers to build visual intuition.';

  if (lastExamResult.percentage >= 85) {
    grade = 'Distinction (Mastery)';
    gradeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    advice =
      'Outstanding performance! You have demonstrated exceptional mastery of Operations Research formulations and calculations.';
  } else if (lastExamResult.percentage >= 70) {
    grade = 'First Class (Proficient)';
    gradeColor = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    advice =
      'Great work! Review the few missed numerical questions below and double check edge cases (degeneracy, tie-breakers).';
  } else if (lastExamResult.percentage >= 50) {
    grade = 'Pass (Competent)';
    gradeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    advice =
      'Fair attempt. Practice more questions in the MCQ bank and review Hungarian matrix line coverings and Simplex ratio tests.';
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner & Score Cards */}
      <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Official Examination Report
            </span>
            <h1 className="text-2xl md:text-3xl font-black font-heading text-white mt-1">
              {lastExamResult.examTitle}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Completed on {new Date(lastExamResult.timestamp).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-2xl border font-bold text-sm ${gradeColor}`}>
              {grade}
            </span>
          </div>
        </div>

        {/* 4 Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
            <span className="text-[11px] font-bold uppercase text-slate-400">Total Score</span>
            <div className="text-3xl font-black font-mono text-cyan-400 mt-1">
              {lastExamResult.percentage}%
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              Net Marks: {lastExamResult.score} pts
            </span>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
            <span className="text-[11px] font-bold uppercase text-slate-400">Correct Answers</span>
            <div className="text-3xl font-black font-mono text-emerald-400 mt-1">
              {lastExamResult.correctAnswers}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              of {lastExamResult.totalQuestions} questions
            </span>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
            <span className="text-[11px] font-bold uppercase text-slate-400">Incorrect / Skipped</span>
            <div className="text-3xl font-black font-mono text-rose-400 mt-1">
              {lastExamResult.incorrectAnswers} <span className="text-slate-500 text-xl font-normal">/</span>{' '}
              <span className="text-amber-400 text-xl">{lastExamResult.unattempted}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              {lastExamResult.unattempted} unattempted
            </span>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
            <span className="text-[11px] font-bold uppercase text-slate-400">Time Taken</span>
            <div className="text-2xl font-black font-mono text-slate-200 mt-2">
              {formatSeconds(lastExamResult.timeTakenSeconds)}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              Allotted: {formatSeconds(lastExamResult.totalTimeSeconds)}
            </span>
          </div>
        </div>

        {/* Personalized Feedback & Advice */}
        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Diagnostic Academic Feedback:
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">{advice}</p>
          </div>
        </div>

        {/* Topic-Wise Performance Breakdown */}
        {lastExamResult.topicBreakdown.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span>Topic-Wise Accuracy Breakdown</span>
            </h3>

            <div className="space-y-2">
              {lastExamResult.topicBreakdown.map((t, idx) => {
                const pct = Math.round((t.correct / t.total) * 100);

                return (
                  <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs">
                    <div className="flex justify-between items-center mb-1.5 font-medium">
                      <span className="text-slate-200">{t.topicTitle}</span>
                      <span className="font-mono text-cyan-400">
                        {t.correct}/{t.total} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          pct >= 75 ? 'bg-emerald-400' : pct >= 50 ? 'bg-amber-400' : 'bg-rose-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Detailed Question-by-Question Review */}
      <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-lg font-bold font-heading text-white">
            Comprehensive Question Review & Solutions
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {lastExamResult.totalQuestions} Questions Analyzed
          </span>
        </div>

        <div className="space-y-6">
          {lastExamResult.userAnswers.map((ua, index) => {
            const q = questionsData.find(item => item.id === ua.questionId);
            if (!q) return null;

            return (
              <div
                key={index}
                className={`p-5 rounded-2xl border space-y-4 ${
                  ua.isCorrect
                    ? 'bg-slate-950/60 border-emerald-900/40'
                    : ua.selectedOption === null
                    ? 'bg-slate-950/60 border-slate-800'
                    : 'bg-slate-950/60 border-rose-900/40'
                }`}
              >
                {/* Meta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-300">
                      Q{index + 1}.
                    </span>
                    <span className="text-xs text-slate-400">{q.topicTitle}</span>
                  </div>

                  <div>
                    {ua.isCorrect ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+4)
                      </span>
                    ) : ua.selectedOption === null ? (
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
                        Unattempted (0)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/30">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect (-1)
                      </span>
                    )}
                  </div>
                </div>

                {/* Question */}
                <div className="text-sm font-medium text-slate-200 leading-relaxed">
                  {q.question}
                </div>

                {/* Options display */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  {q.options.map((opt, optIdx) => {
                    const isCorrectAnswer = optIdx === q.correctIndex;
                    const isUserChoice = optIdx === ua.selectedOption;

                    let optBg = 'bg-slate-900/60 border-slate-800 text-slate-400';
                    if (isCorrectAnswer) {
                      optBg = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold';
                    } else if (isUserChoice && !isCorrectAnswer) {
                      optBg = 'bg-rose-950/60 border-rose-500 text-rose-300 font-bold';
                    }

                    return (
                      <div key={optIdx} className={`p-3 rounded-xl border flex items-center justify-between ${optBg}`}>
                        <span>
                          {String.fromCharCode(65 + optIdx)}. {opt}
                        </span>
                        {isCorrectAnswer && <span className="text-[10px] text-emerald-400">Correct Answer &check;</span>}
                        {isUserChoice && !isCorrectAnswer && (
                          <span className="text-[10px] text-rose-400">Your Selection &cross;</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="font-bold text-cyan-400 uppercase tracking-wider text-[10px]">
                    Detailed Explanation:
                  </div>
                  <p className="leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <button
          onClick={() => setActivePage('mock-exam')}
          className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition text-xs cursor-pointer shadow-md"
        >
          <RotateCcw className="w-4 h-4" />
          Retake Another Exam
        </button>

        <button
          onClick={() => setActivePage('subjects')}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition text-xs cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          Review All Topics & Syllabus
        </button>
      </div>
    </div>
  );
};
