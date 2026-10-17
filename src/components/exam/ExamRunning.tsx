import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { questionsData } from '../../data/questionBank';
import { Question, ExamResult } from '../../types';
import { sounds } from '../../utils/audio';
import {
  Timer,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Send,
} from 'lucide-react';

export const ExamRunning: React.FC = () => {
  const { activeExamConfig, completeExam, addToast, settings } = useApp();

  // Assemble questions for this exam
  const examQuestions = useMemo(() => {
    let pool = [...questionsData];

    if (activeExamConfig?.moduleId) {
      pool = pool.filter(q => q.moduleId === activeExamConfig.moduleId);
    }
    if (activeExamConfig && activeExamConfig.difficulty !== 'Mixed') {
      pool = pool.filter(q => q.difficulty === activeExamConfig.difficulty);
    }

    // Shuffle pool
    const shuffled = pool.sort(() => Math.random() - 0.5);
    const targetCount = activeExamConfig?.questionCount || 20;

    // In case pool has fewer than targetCount, loop back or slice
    const selected: Question[] = [];
    for (let i = 0; i < targetCount; i++) {
      selected.push(shuffled[i % shuffled.length]);
    }

    return selected;
  }, [activeExamConfig]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: number | null }>({});
  const [markedForReview, setMarkedForReview] = useState<{ [qId: string]: boolean }>({});
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // Timer
  const totalSeconds = (activeExamConfig?.durationMinutes || 30) * 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(totalSeconds);
  const startTimeRef = useRef<number>(Date.now());

  const currentQ: Question | undefined = examQuestions[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto submit
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (idx: number) => {
    if (!currentQ) return;
    sounds.playClick();
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: idx,
    }));
  };

  const handleClearResponse = () => {
    if (!currentQ) return;
    sounds.playClick();
    setUserAnswers(prev => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
    addToast('Response cleared');
  };

  const toggleReview = () => {
    if (!currentQ) return;
    sounds.playClick();
    setMarkedForReview(prev => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id],
    }));
  };

  const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k] !== null).length;
  const markedCount = Object.values(markedForReview).filter(Boolean).length;
  const unattemptedCount = examQuestions.length - answeredCount;

  const handleSubmitExam = () => {
    const timeSpent = Math.min(totalSeconds, Math.round((Date.now() - startTimeRef.current) / 1000));

    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    const topicStats: { [topic: string]: { total: number; correct: number } } = {};

    const detailedAnswers = examQuestions.map(q => {
      const selected = userAnswers[q.id] ?? null;
      const isCorrect = selected !== null && selected === q.correctIndex;

      if (selected === null) unattempted++;
      else if (isCorrect) correct++;
      else incorrect++;

      if (!topicStats[q.topicTitle]) {
        topicStats[q.topicTitle] = { total: 0, correct: 0 };
      }
      topicStats[q.topicTitle].total++;
      if (isCorrect) topicStats[q.topicTitle].correct++;

      return {
        questionId: q.id,
        selectedOption: selected,
        isCorrect,
        isMarkedForReview: !!markedForReview[q.id],
      };
    });

    const total = examQuestions.length;
    const percentage = Math.round((correct / total) * 100);

    const result: ExamResult = {
      id: 'result-' + Date.now(),
      examTitle: activeExamConfig?.title || 'Operations Research Examination',
      timestamp: new Date().toISOString(),
      totalQuestions: total,
      correctAnswers: correct,
      incorrectAnswers: incorrect,
      unattempted,
      score: correct * 4 - incorrect * 1, // standard marking +4 / -1
      percentage,
      timeTakenSeconds: timeSpent,
      totalTimeSeconds: totalSeconds,
      moduleId: activeExamConfig?.moduleId,
      userAnswers: detailedAnswers,
      topicBreakdown: Object.keys(topicStats).map(t => ({
        topicTitle: t,
        total: topicStats[t].total,
        correct: topicStats[t].correct,
      })),
    };

    completeExam(result);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Floating Exam Status Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 sticky top-4 z-20 shadow-xl backdrop-blur-md">
        <div>
          <div className="text-xs uppercase font-bold text-slate-400">
            {activeExamConfig?.title}
          </div>
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <span>Question {currentIndex + 1} of {examQuestions.length}</span>
            <span className="text-slate-600">|</span>
            <span className="text-xs font-mono text-emerald-400">
              Answered: {answeredCount}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-xs font-mono text-amber-400">
              Marked: {markedCount}
            </span>
          </div>
        </div>

        {/* Timer cluster */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-bold text-base transition ${
              secondsRemaining < 300
                ? 'bg-red-500/10 border-red-500/40 text-red-400 animate-pulse'
                : 'bg-slate-950 border-slate-800 text-cyan-300'
            }`}
          >
            <Timer className="w-5 h-5" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-md transition cursor-pointer text-xs"
          >
            <Send className="w-3.5 h-3.5 fill-slate-950" />
            Submit Examination
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Question */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
          {currentQ && (
            <>
              {/* Question Metadata */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-bold font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                  Q{currentIndex + 1} &middot; {currentQ.topicTitle}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleReview}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                      markedForReview[currentQ.id]
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    {markedForReview[currentQ.id] ? 'Marked for Review' : 'Mark for Review'}
                  </button>

                  {userAnswers[currentQ.id] !== undefined && (
                    <button
                      onClick={handleClearResponse}
                      className="text-xs text-slate-400 hover:text-rose-400 px-2.5 py-1.5 rounded-xl hover:bg-slate-800 transition cursor-pointer"
                    >
                      Clear Response
                    </button>
                  )}
                </div>
              </div>

              {/* Question Statement */}
              <div className="text-base md:text-lg font-medium text-slate-100 leading-relaxed">
                {currentQ.question}
              </div>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = userAnswers[currentQ.id] === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full flex items-start gap-3.5 p-4 rounded-xl border text-left text-sm transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-500 text-white font-semibold ring-1 ring-cyan-500'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold font-mono text-xs shrink-0 ${
                          isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 leading-snug">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Steppers */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                <button
                  disabled={currentIndex === 0}
                  onClick={() => {
                    sounds.playClick();
                    setCurrentIndex(prev => prev - 1);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="text-xs font-mono text-slate-500">
                  Question {currentIndex + 1} of {examQuestions.length}
                </div>

                <button
                  disabled={currentIndex === examQuestions.length - 1}
                  onClick={() => {
                    sounds.playClick();
                    setCurrentIndex(prev => prev + 1);
                  }}
                  className="flex items-center gap-1.5 px-5 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 disabled:pointer-events-none text-slate-950 text-xs font-bold rounded-xl transition cursor-pointer shadow-md"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right Column: Question Palette Navigation Grid */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl h-fit">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
            <span>Question Navigation</span>
            <span className="font-mono text-cyan-400">{examQuestions.length} Total</span>
          </div>

          {/* Palette legend */}
          <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-400 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Answered
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Review
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              Pending
            </div>
          </div>

          {/* Question Number Badges Grid */}
          <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
            {examQuestions.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined && userAnswers[q.id] !== null;
              const isMarked = markedForReview[q.id];
              const isCurrent = idx === currentIndex;

              let badgeStyle = 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700';

              if (isMarked) {
                badgeStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold';
              } else if (isAnswered) {
                badgeStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold';
              }

              if (isCurrent) {
                badgeStyle += ' ring-2 ring-cyan-400';
              }

              return (
                <button
                  key={idx}
                  onClick={() => {
                    sounds.playClick();
                    setCurrentIndex(idx);
                  }}
                  className={`h-9 rounded-xl border text-xs font-mono font-semibold transition cursor-pointer flex items-center justify-center ${badgeStyle}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirmation Modal before Submit */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-5 animate-fade-in">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold font-heading text-white">
                Submit Examination?
              </h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to finish this examination? You will not be able to change your answers.
              </p>
            </div>

            {/* Stats summary in modal */}
            <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div className="p-2">
                <span className="text-[10px] uppercase text-slate-500 block">Answered</span>
                <span className="text-emerald-400 font-bold text-base">{answeredCount}</span>
              </div>
              <div className="p-2">
                <span className="text-[10px] uppercase text-slate-500 block">Pending</span>
                <span className="text-rose-400 font-bold text-base">{unattemptedCount}</span>
              </div>
              <div className="p-2">
                <span className="text-[10px] uppercase text-slate-500 block">In Review</span>
                <span className="text-amber-400 font-bold text-base">{markedCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition text-xs cursor-pointer"
              >
                Return to Exam
              </button>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  handleSubmitExam();
                }}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition text-xs cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
