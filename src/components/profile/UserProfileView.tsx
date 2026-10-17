import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, School, BookOpen, Calendar, Save, RotateCcw, Award, CheckCircle2 } from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const { user, updateProfile, completedTopics, examHistory, resetAllProgress, addToast } = useApp();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [college, setCollege] = useState(user?.college || '');
  const [targetExam, setTargetExam] = useState(user?.targetExam || '');
  const [semester, setSemester] = useState(user?.semester || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      college,
      targetExam,
      semester,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Profile Card */}
      <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl flex flex-wrap items-center gap-6 shadow-xl">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-2xl font-mono shadow-lg">
          {name.charAt(0).toUpperCase() || 'S'}
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            Verified Student Profile
          </span>
          <h1 className="text-2xl font-black font-heading text-white">{name || 'Student Name'}</h1>
          <p className="text-xs text-slate-400">{email || 'student@university.edu'}</p>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center font-mono">
            <span className="text-[10px] text-slate-500 block uppercase">Topics Done</span>
            <span className="text-emerald-400 font-bold text-lg">{completedTopics.length}</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center font-mono">
            <span className="text-[10px] text-slate-500 block uppercase">Tests Taken</span>
            <span className="text-cyan-400 font-bold text-lg">{examHistory.length}</span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
        <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
          <User className="w-5 h-5 text-cyan-400" />
          <span>Academic Information</span>
        </h2>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-400 uppercase tracking-wider">
                Full Student Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none font-medium"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-400 uppercase tracking-wider">
                Email Address:
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none font-medium"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-400 uppercase tracking-wider">
                College / University:
              </label>
              <input
                type="text"
                value={college}
                onChange={e => setCollege(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-400 uppercase tracking-wider">
                Target Examination:
              </label>
              <input
                type="text"
                value={targetExam}
                onChange={e => setTargetExam(e.target.value)}
                placeholder="e.g. B.Tech Semester Exam, MBA OR, GATE"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-400 uppercase tracking-wider">
                Semester / Year:
              </label>
              <input
                type="text"
                value={semester}
                onChange={e => setSemester(e.target.value)}
                placeholder="e.g. Semester 5, Year 3"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:border-cyan-500 focus:outline-none font-medium"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all learning progress? This cannot be undone.')) {
                  resetAllProgress();
                }
              }}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
            >
              Reset All Learning Progress
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
