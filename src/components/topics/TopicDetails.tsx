import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { modulesData } from '../../data/syllabus';
import { questionsData } from '../../data/questionBank';
import { MathView } from '../MathView';
import {
  CheckCircle2,
  Bookmark,
  Printer,
  ArrowLeft,
  BookOpen,
  HelpCircle,
  Sparkles,
  Calculator,
  Briefcase,
  GraduationCap,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

export const TopicDetails: React.FC = () => {
  const {
    selectedTopicId,
    setActivePage,
    completedTopics,
    toggleTopicCompletion,
    bookmarkedTopics,
    toggleBookmark,
    openTopic,
  } = useApp();

  // Find active topic across modules
  let activeTopic = null;
  let activeModule = null;

  for (const m of modulesData) {
    const found = m.topics.find(t => t.id === selectedTopicId);
    if (found) {
      activeTopic = found;
      activeModule = m;
      break;
    }
  }

  // Fallback if none selected
  if (!activeTopic) {
    activeTopic = modulesData[0].topics[0];
    activeModule = modulesData[0];
  }

  // Flat list of all topics for Next/Previous topic navigation
  const allTopics = modulesData.flatMap(m => m.topics);
  const currentIdx = allTopics.findIndex(t => t.id === activeTopic!.id);
  const prevTopic = currentIdx > 0 ? allTopics[currentIdx - 1] : null;
  const nextTopic = currentIdx < allTopics.length - 1 ? allTopics[currentIdx + 1] : null;

  const isCompleted = completedTopics.includes(activeTopic.id);
  const isBookmarked = bookmarkedTopics.includes(activeTopic.id);

  // Associated MCQs
  const topicQuestions = questionsData.filter(q => q.topicId === activeTopic!.id);

  const [activeTab, setActiveTab] = useState<'theory' | 'numerical' | 'reallife' | 'exam' | 'mcq'>('theory');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl no-print">
        <button
          onClick={() => setActivePage('subjects')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Modules
        </button>

        <div className="flex items-center gap-2">
          {/* Print / Download Notes */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition cursor-pointer"
            title="Print or Save Study Notes as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            Download Notes (PDF)
          </button>

          {/* Bookmark */}
          <button
            onClick={() => toggleBookmark(activeTopic!.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
              isBookmarked
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </button>

          {/* Mark as Completed */}
          <button
            onClick={() => toggleTopicCompletion(activeTopic!.id)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              isCompleted
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {isCompleted ? 'Completed ✓' : 'Mark as Completed'}
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
          <span>{activeModule?.code}</span>
          <span>&middot;</span>
          <span>{activeModule?.title}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black font-heading text-white tracking-tight">
          {activeTopic.title}
        </h1>

        <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed">
          {activeTopic.subtitle}
        </p>

        {/* 1. Simple Introduction */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 text-xs md:text-sm text-slate-300 leading-relaxed space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            Simple Introduction
          </div>
          <p>{activeTopic.introduction}</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 bg-slate-900/80 border border-slate-800 p-2 rounded-2xl scrollbar-none no-print">
        <button
          onClick={() => setActiveTab('theory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'theory' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Theory & Definitions
        </button>

        <button
          onClick={() => setActiveTab('numerical')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'numerical' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          Solved Numerical Examples
        </button>

        <button
          onClick={() => setActiveTab('reallife')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'reallife' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Real-Life Case Studies
        </button>

        <button
          onClick={() => setActiveTab('exam')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'exam' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          Exam Questions & Marks
        </button>

        <button
          onClick={() => setActiveTab('mcq')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'mcq' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Quick Practice MCQs ({topicQuestions.length})
        </button>
      </div>

      {/* Tab 1: Detailed Theory & Definitions */}
      {activeTab === 'theory' && (
        <div className="space-y-6">
          {/* Detailed Explanation */}
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4 shadow-xl">
            <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Detailed Theoretical Principles
            </h2>

            <div className="space-y-3 text-xs md:text-sm text-slate-300 leading-relaxed">
              {activeTopic.detailedExplanation.map((para, i) => (
                <p key={i} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Important Definitions */}
          {activeTopic.definitions.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4 shadow-xl">
              <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                Key Definitions & Terminology
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeTopic.definitions.map((def, i) => (
                  <div key={i} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-xs font-bold text-amber-300 font-mono block">
                      {def.term}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">{def.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mathematical Formulas */}
          {activeTopic.formulas.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4 shadow-xl">
              <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-cyan-400" />
                Governing Mathematical Formulas
              </h2>

              <div className="space-y-3">
                {activeTopic.formulas.map((f, i) => (
                  <div key={i} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-slate-300">{f.name}</div>
                    <div className="p-3 bg-slate-900/80 rounded-xl text-center text-cyan-300 overflow-x-auto">
                      <MathView math={f.latex} block />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                      {f.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Solved Numerical Examples */}
      {activeTab === 'numerical' && (
        <div className="space-y-6">
          {activeTopic.numericalExamples.map((ex, exIdx) => (
            <div
              key={exIdx}
              className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl"
            >
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                  Solved Numerical Example {exIdx + 1}
                </span>
                <h3 className="text-xl font-bold font-heading text-white mt-1">
                  {ex.title}
                </h3>
              </div>

              {/* Problem statement */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs md:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-mono">
                {ex.problemStatement}
              </div>

              {/* Steps */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Step-by-Step Calculation:
                </div>

                {ex.steps.map(step => (
                  <div
                    key={step.stepNumber}
                    className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800/80 space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[10px] flex items-center justify-center font-mono">
                        {step.stepNumber}
                      </span>
                      <span className="text-xs font-bold text-white font-heading">
                        {step.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 pl-7 leading-relaxed font-mono">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Final Answer */}
              <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    Final Result:
                  </span>
                  <div className="text-sm font-bold text-white font-mono mt-0.5">
                    {ex.finalAnswer}
                  </div>
                </div>

                <button
                  onClick={() => setActivePage('solvers')}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer shadow-md"
                >
                  Verify in Solver &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Real-Life Case Studies */}
      {activeTab === 'reallife' && (
        <div className="space-y-4">
          {activeTopic.realLifeExamples.map((item, i) => (
            <div
              key={i}
              className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-3 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  {item.industry}
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  Business Impact
                </span>
              </div>

              <h3 className="text-xl font-bold font-heading text-white">{item.caseTitle}</h3>

              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{item.description}</p>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs font-mono text-cyan-300">
                <strong className="text-slate-400 font-sans">Quantified Benefit:</strong> {item.benefit}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Exam Questions */}
      {activeTab === 'exam' && (
        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4 shadow-xl">
          <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-cyan-400" />
            University Semester Exam Questions
          </h2>

          <div className="space-y-4">
            {activeTopic.examQuestions.map((q, i) => (
              <div key={i} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 font-mono">Question {i + 1}</span>
                  <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    {q.marks} Marks
                  </span>
                </div>
                <div className="text-sm font-semibold text-slate-100">{q.question}</div>
                <div className="text-xs text-slate-400 font-mono pt-1">
                  <strong className="text-cyan-400">Model Answer Hint:</strong> {q.hint}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Quick Practice MCQs */}
      {activeTab === 'mcq' && (
        <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-lg font-bold font-heading text-white">
              Targeted Topic MCQs
            </h2>
            <button
              onClick={() => setActivePage('practice')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Open Full Practice Center &rarr;
            </button>
          </div>

          <div className="space-y-4">
            {topicQuestions.map((q, i) => (
              <div key={i} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Q{i + 1}</span>
                  <span className="text-cyan-400 uppercase">{q.difficulty}</span>
                </div>
                <div className="text-sm text-slate-200 font-medium">{q.question}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  {q.options.map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      className={`p-2.5 rounded-xl border ${
                        optIdx === q.correctIndex
                          ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-slate-900 border-slate-800/80 text-slate-400'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}. {opt}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-slate-400 pt-1 font-mono">
                  <strong className="text-slate-300">Explanation:</strong> {q.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Sticky Topic Navigation */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl no-print">
        {prevTopic ? (
          <button
            onClick={() => openTopic(prevTopic.id, prevTopic.moduleId)}
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 text-cyan-400" />
            <div className="text-left">
              <span className="text-[10px] text-slate-500 block uppercase">Previous Topic</span>
              <span>{prevTopic.title}</span>
            </div>
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={() => toggleTopicCompletion(activeTopic!.id)}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
            isCompleted
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md'
          }`}
        >
          {isCompleted ? 'Topic Completed ✓' : 'Mark as Completed'}
        </button>

        {nextTopic ? (
          <button
            onClick={() => openTopic(nextTopic.id, nextTopic.moduleId)}
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
          >
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block uppercase">Next Topic</span>
              <span>{nextTopic.title}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};
