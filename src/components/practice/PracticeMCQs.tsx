import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { questionsData } from '../../data/questionBank';
import { modulesData } from '../../data/syllabus';
import { sounds } from '../../utils/audio';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Bookmark,
  Filter,
  Award,
  Sparkles,
} from 'lucide-react';
import { Question, Difficulty } from '../../types';

export const PracticeMCQs: React.FC = () => {
  const { flaggedQuestionIds, toggleFlagQuestion, addToast } = useApp();

  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [sessionCorrect, setSessionCorrect] = useState<number>(0);
  const [sessionAttempted, setSessionAttempted] = useState<number>(0);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return questionsData.filter(q => {
      const matchMod = selectedModule === 'all' || q.moduleId === selectedModule;
      const matchDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
      return matchMod && matchDiff;
    });
  }, [selectedModule, selectedDifficulty]);

  const currentQuestion: Question | undefined = filteredQuestions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return; // already answered
    setSelectedOption(index);
    setShowExplanation(true);
    setSessionAttempted(prev => prev + 1);

    if (currentQuestion && index === currentQuestion.correctIndex) {
      setSessionCorrect(prev => prev + 1);
      sounds.playSuccess();
    } else {
      sounds.playError();
    }
  };

  const handleNext = () => {
    sounds.playClick();
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    sounds.playClick();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const handleShuffle = () => {
    sounds.playClick();
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    setCurrentIndex(randomIndex);
    setSelectedOption(null);
    setShowExplanation(false);
    addToast('Jumped to random question! 🎲');
  };

  const isFlagged = currentQuestion ? flaggedQuestionIds.includes(currentQuestion.id) : false;

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
            <span>MCQ Practice Bank</span>
            <span className="text-xs bg-cyan-500/20 text-cyan-300 font-mono px-2 py-0.5 rounded-full border border-cyan-500/30">
              {filteredQuestions.length} Questions Available
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Solve topic-wise questions with instant feedback and in-depth conceptual explanations.
          </p>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedModule}
              onChange={e => {
                setSelectedModule(e.target.value);
                setCurrentIndex(0);
                setSelectedOption(null);
                setShowExplanation(false);
              }}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Modules</option>
              {modulesData.map(m => (
                <option key={m.id} value={m.id}>
                  {m.code}: {m.shortTitle}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <select
              value={selectedDifficulty}
              onChange={e => {
                setSelectedDifficulty(e.target.value);
                setCurrentIndex(0);
                setSelectedOption(null);
                setShowExplanation(false);
              }}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <button
            onClick={handleShuffle}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition cursor-pointer"
            title="Random Question"
          >
            <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
            Random
          </button>
        </div>
      </div>

      {/* Main Question Card */}
      {currentQuestion ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {/* Question Header & Meta */}
          <div className="bg-slate-950/70 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                Question {currentIndex + 1} of {filteredQuestions.length}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {currentQuestion.topicTitle}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  currentQuestion.difficulty === 'Easy'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : currentQuestion.difficulty === 'Medium'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {currentQuestion.difficulty}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Session Accuracy Counter */}
              <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  Session: <strong className="text-emerald-400">{sessionCorrect}</strong>/{sessionAttempted}
                </span>
              </div>

              <button
                onClick={() => {
                  toggleFlagQuestion(currentQuestion.id);
                  addToast(isFlagged ? 'Removed from flagged' : 'Flagged for revision! 📌');
                }}
                className={`p-1.5 rounded-lg border transition cursor-pointer ${
                  isFlagged
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
                }`}
                title="Flag for Review"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question Text */}
          <div className="p-6 md:p-8 space-y-6">
            <div className="text-base md:text-lg font-medium text-slate-100 leading-relaxed">
              {currentQuestion.question}
            </div>

            {/* 4 Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctIndex;
                const hasAnswered = selectedOption !== null;

                let btnStyles = 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-200';

                if (hasAnswered) {
                  if (isCorrect) {
                    btnStyles = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-semibold ring-1 ring-emerald-500';
                  } else if (isSelected && !isCorrect) {
                    btnStyles = 'bg-rose-950/40 border-rose-500 text-rose-200 font-semibold';
                  } else {
                    btnStyles = 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={hasAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`flex items-start gap-3 p-4 rounded-xl border text-left text-sm transition-all cursor-pointer ${btnStyles}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold font-mono text-xs shrink-0 ${
                        hasAnswered && isCorrect
                          ? 'bg-emerald-500 text-slate-950'
                          : hasAnswered && isSelected && !isCorrect
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-snug">{option}</span>

                    {hasAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {hasAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Box */}
            {showExplanation && (
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 animate-fade-in">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Answer Explanation</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* Stepper Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                disabled={currentIndex === 0}
                onClick={handlePrevious}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Question
              </button>

              <div className="text-xs font-mono text-slate-500">
                Question {currentIndex + 1} of {filteredQuestions.length}
              </div>

              <button
                disabled={currentIndex === filteredQuestions.length - 1}
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 disabled:pointer-events-none text-slate-950 text-xs font-bold rounded-xl transition cursor-pointer shadow-md"
              >
                Next Question
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center text-slate-400 text-sm">
          No questions match the current filter selection.
        </div>
      )}
    </div>
  );
};
