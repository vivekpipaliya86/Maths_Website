import React, { useState } from 'react';
import { GraphicalSolverView } from './GraphicalSolverView';
import { SimplexSolverView } from './SimplexSolverView';
import { PrimalDualView } from './PrimalDualView';
import { TransportationSolverView } from './TransportationSolverView';
import { HungarianSolverView } from './HungarianSolverView';
import { GameTheorySolverView } from './GameTheorySolverView';
import { TrendingUp, Table, ArrowRightLeft, Truck, UserCheck, Swords } from 'lucide-react';

export const NumericalSolversHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'graphical' | 'simplex' | 'primaldual' | 'transportation' | 'hungarian' | 'gametheory'
  >('graphical');

  const solverTabs = [
    { id: 'graphical', label: 'Graphical LPP', icon: TrendingUp, color: 'text-cyan-400' },
    { id: 'simplex', label: 'Simplex Tableau', icon: Table, color: 'text-indigo-400' },
    { id: 'primaldual', label: 'Primal-Dual', icon: ArrowRightLeft, color: 'text-blue-400' },
    { id: 'transportation', label: 'Transportation (TP)', icon: Truck, color: 'text-teal-400' },
    { id: 'hungarian', label: 'Hungarian (AP)', icon: UserCheck, color: 'text-amber-400' },
    { id: 'gametheory', label: 'Game Theory', icon: Swords, color: 'text-purple-400' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Solver Nav Tabs */}
      <div className="flex overflow-x-auto gap-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl scrollbar-none">
        {solverTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-white shadow-md border border-slate-700'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? tab.color : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Solver View */}
      <div>
        {activeTab === 'graphical' && <GraphicalSolverView />}
        {activeTab === 'simplex' && <SimplexSolverView />}
        {activeTab === 'primaldual' && <PrimalDualView />}
        {activeTab === 'transportation' && <TransportationSolverView />}
        {activeTab === 'hungarian' && <HungarianSolverView />}
        {activeTab === 'gametheory' && <GameTheorySolverView />}
      </div>
    </div>
  );
};
