import React from 'react';
import { useApp } from '../../context/AppContext';
import { modulesData } from '../../data/syllabus';
import { questionsData } from '../../data/questionBank';
import {
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  BookOpen,
  Calendar,
  RotateCcw,
} from 'lucide-react';

export const ProgressTrackerView: React.FC = () => {
  const { completedTopics, examHistory, openTopic, setActivePage, resetAllProgress } = useApp();

  const allTopics = modulesData.flatMap(m => m.topics);
  const totalTopics = allTopics.length;
  const completedCount = completedTopics.length;
  const overallPercentage = Math.round((completedCount / totalTopics) * 100);

  // Identify weak topics based on exam history
  const weakTopicsMap: { [topic: string]: { total: number; incorrect: number } } = {};
  examHistory.forEach(ex => {
    ex.userAnswers.forEach(ua => {
      const q = questionsData.find(item => item.id === ua.questionId);
      if (q) {
        if (!weakTopicsMap[q.topicTitle]) {
          weakTopicsMap[q.topicTitle] = { total: 0, incorrect: 0 };
        }
        weakTopicsMap[q.topicTitle].total++;
        if (!ua.isCorrect) {
          weakTopicsMap[q.topicTitle].incorrect++;
        }
      }
    });
  });

  const weakTopicList = Object.keys(weakTopicsMap)
    .map(t => ({
      title: t,
      errorRate: Math.round((weakTopicsMap[t].incorrect / weakTopicsMap[t].total) * 100),
      incorrect: weakTopicsMap[t].incorrect,
      total: weakTopicsMap[t].total,
    }))
    .filter(t => t.total >= 2 && t.errorRate >= 40)
    .sort((a, b) => b.errorRate - a.errorRate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl flex flex-wrap items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            Academic Performance Analytics
          </span>
          <h1 className="text-2xl md:text-3xl font-black font-heading text-white">
            Student Progress Tracker
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Monitor syllabus completion rates, track university examination scores over time, and target weak conceptual areas.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center font-mono">
          <div className="text-3xl font-black text-cyan-400">{overallPercentage}%</div>
          <div className="text-[11px] text-slate-400 font-sans font-semibold mt-0.5">
            Syllabus Mastery
          </div>
        </div>
      </div>

      {/* Module Progress Grid */}
      <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
        <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <span>Curriculum Module Completion</span>
        </h2>

        <div className="space-y-4">
          {modulesData.map(mod => {
            const modCompleted = mod.topics.filter(t => completedTopics.includes(t.id)).length;
            const pct = Math.round((modCompleted / mod.topics.length) * 100);

            return (
              <div key={mod.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-white">
                    {mod.code}: {mod.title}
                  </span>
                  <span className="font-mono text-cyan-400">
                    {modCompleted} of {mod.topics.length} Topics ({pct}%)
                  </span>
                </div>

                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weak Areas & Revision Recommendations */}
      <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4 shadow-xl">
        <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          <span>Recommended Topics to Review</span>
        </h2>
        <p className="text-xs text-slate-400">
          Topics where your mock exam mistake rate exceeded 40%. Revisiting these topics will boost your university score.
        </p>

        {weakTopicList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {weakTopicList.map((wt, i) => (
              <div
                key={i}
                className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-200">{wt.title}</div>
                  <div className="text-[11px] text-rose-400 font-mono mt-0.5">
                    {wt.errorRate}% error rate ({wt.incorrect}/{wt.total} incorrect)
                  </div>
                </div>

                <button
                  onClick={() => {
                    const found = allTopics.find(t => t.title === wt.title);
                    if (found) openTopic(found.id, found.moduleId);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs rounded-xl transition cursor-pointer"
                >
                  Review &rarr;
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-center text-xs text-slate-500 font-mono">
            No weak topic clusters detected yet. Take mock examinations to generate diagnostic feedback!
          </div>
        )}
      </div>

      {/* Historical Examination Logs */}
      <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span>Examination Performance History</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {examHistory.length} Recorded Tests
          </span>
        </div>

        {examHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold">
                  <th className="py-3 px-4">Exam Title</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4 font-mono">Questions</th>
                  <th className="py-3 px-4 font-mono">Score (%)</th>
                  <th className="py-3 px-4 font-mono">Duration</th>
                  <th className="py-3 px-4 text-right">Result Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {examHistory.map((ex, i) => (
                  <tr key={i} className="hover:bg-slate-800/20 transition">
                    <td className="py-3 px-4 font-sans font-bold text-white">{ex.examTitle}</td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(ex.timestamp).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-slate-300">{ex.totalQuestions} MCQs</td>
                    <td
                      className={`py-3 px-4 font-bold text-sm ${
                        ex.percentage >= 75
                          ? 'text-emerald-400'
                          : ex.percentage >= 50
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {ex.percentage}%
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {Math.floor(ex.timeTakenSeconds / 60)}m {ex.timeTakenSeconds % 60}s
                    </td>
                    <td className="py-3 px-4 text-right font-sans">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ex.percentage >= 60
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {ex.percentage >= 60 ? 'PASSED' : 'RETAKE SUGGESTED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 space-y-3 font-mono">
            <p>No exams recorded in student history.</p>
            <button
              onClick={() => setActivePage('mock-exam')}
              className="px-5 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow"
            >
              Start First Examination
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
