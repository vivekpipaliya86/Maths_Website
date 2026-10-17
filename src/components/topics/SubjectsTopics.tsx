import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { modulesData } from '../../data/syllabus';
import {
  TrendingUp,
  Truck,
  UserCheck,
  Swords,
  Building2,
  Search,
  CheckCircle2,
  Bookmark,
  ChevronRight,
  BookOpen,
  Clock,
} from 'lucide-react';

export const SubjectsTopics: React.FC = () => {
  const { openTopic, completedTopics, bookmarkedTopics, toggleBookmark } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('all');

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp':
        return TrendingUp;
      case 'Truck':
        return Truck;
      case 'UserCheck':
        return UserCheck;
      case 'Swords':
        return Swords;
      case 'Building2':
        return Building2;
      default:
        return BookOpen;
    }
  };

  const filteredModules = modulesData
    .map(mod => {
      const matchModule = selectedModuleFilter === 'all' || mod.id === selectedModuleFilter;
      if (!matchModule) return null;

      const filteredTopics = mod.topics.filter(t => {
        const query = searchQuery.toLowerCase();
        return (
          t.title.toLowerCase().includes(query) ||
          t.subtitle.toLowerCase().includes(query) ||
          t.introduction.toLowerCase().includes(query)
        );
      });

      if (filteredTopics.length === 0 && searchQuery) return null;

      return {
        ...mod,
        topics: filteredTopics,
      };
    })
    .filter(Boolean) as typeof modulesData;

  const totalTopicsCount = modulesData.reduce((acc, m) => acc + m.topics.length, 0);
  const completedCount = completedTopics.length;
  const overallPercentage = Math.round((completedCount / totalTopicsCount) * 100);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl flex flex-wrap items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            Operations Research Curriculum
          </span>
          <h1 className="text-2xl md:text-3xl font-black font-heading text-white">
            All Modules & Syllabi
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Five comprehensive modules covering Linear Programming, Transportation Problems, Assignment Modeling, Game Theory, and Industrial Enterprise Applications.
          </p>
        </div>

        {/* Progress Badge */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-mono font-black text-cyan-400 text-lg">
            {overallPercentage}%
          </div>
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">Syllabus Progress</div>
            <div className="text-xs text-slate-400 font-mono">
              {completedCount} of {totalTopicsCount} Topics Completed
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
        {/* Search Input */}
        <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search topics (e.g., Simplex, Hungarian, Duality, Saddle Point)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Module Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setSelectedModuleFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedModuleFilter === 'all'
                ? 'bg-cyan-500 text-slate-950'
                : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
            }`}
          >
            All Modules
          </button>
          {modulesData.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedModuleFilter(m.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedModuleFilter === m.id
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
              }`}
            >
              {m.code}
            </button>
          ))}
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-8">
        {filteredModules.map(mod => {
          const Icon = getModuleIcon(mod.iconName);
          const modCompleted = mod.topics.filter(t => completedTopics.includes(t.id)).length;
          const modPct = Math.round((modCompleted / mod.topics.length) * 100);

          return (
            <div
              key={mod.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl"
            >
              {/* Module Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${mod.color} flex items-center justify-center text-white shadow-lg`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-cyan-400">
                      {mod.code} &middot; {mod.topics.length} In-Depth Topics
                    </div>
                    <h2 className="text-xl md:text-2xl font-black font-heading text-white">
                      {mod.title}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right font-mono text-xs">
                    <span className="text-slate-400">Progress:</span>{' '}
                    <span className="font-bold text-cyan-400">{modCompleted}/{mod.topics.length}</span>
                  </div>
                  <div className="w-24 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-500"
                      style={{ width: `${modPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Topics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mod.topics.map(topic => {
                  const isDone = completedTopics.includes(topic.id);
                  const isSaved = bookmarkedTopics.includes(topic.id);

                  return (
                    <div
                      key={topic.id}
                      onClick={() => openTopic(topic.id, mod.id)}
                      className={`group p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-lg ${
                        isDone
                          ? 'bg-slate-950/80 border-slate-800/80'
                          : 'bg-slate-950/50 border-slate-800/60'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                            <Clock className="w-3.5 h-3.5 text-cyan-400" />
                            {topic.readingTimeMinutes} min read
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                toggleBookmark(topic.id);
                              }}
                              className={`p-1 rounded-lg transition ${
                                isSaved ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                              }`}
                              title="Bookmark Topic"
                            >
                              <Bookmark className="w-4 h-4 fill-current" />
                            </button>

                            {isDone && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                            {topic.title}
                          </h3>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {topic.subtitle}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-800/60 mt-4 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                        <span>Study Topic</span>
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
