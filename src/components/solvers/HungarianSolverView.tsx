import React, { useState, useMemo } from 'react';
import { solveHungarian, HungarianInput } from '../../utils/solvers/hungarianSolver';
import { CheckCircle2, ChevronRight, ChevronLeft, Sparkles, UserCheck } from 'lucide-react';

export const HungarianSolverView: React.FC = () => {
  const [problemType, setProblemType] = useState<'min' | 'max'>('min');
  const [matrix, setMatrix] = useState<number[][]>([
    [10, 12, 19, 11],
    [5, 10, 7, 8],
    [12, 14, 13, 11],
    [8, 15, 11, 9],
  ]);

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const input: HungarianInput = useMemo(() => {
    return {
      type: problemType,
      matrix,
    };
  }, [problemType, matrix]);

  const solution = useMemo(() => {
    return solveHungarian(input);
  }, [input]);

  const currentStep = solution.steps[activeStepIndex] || solution.steps[0];

  const updateCell = (r: number, c: number, val: number) => {
    const next = matrix.map(row => [...row]);
    next[r][c] = val;
    setMatrix(next);
  };

  const loadPreset = (type: string) => {
    if (type === 'standard') {
      setProblemType('min');
      setMatrix([
        [10, 12, 19, 11],
        [5, 10, 7, 8],
        [12, 14, 13, 11],
        [8, 15, 11, 9],
      ]);
    } else if (type === 'max_sales') {
      setProblemType('max');
      setMatrix([
        [40, 42, 38],
        [35, 45, 40],
        [44, 48, 42],
      ]);
    }
    setActiveStepIndex(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
            <span>Hungarian Method Assignment Solver</span>
            <span className="text-xs bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded-full border border-amber-500/30">
              O(n³) Kuhn-Munkres
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Solve bipartite worker-to-task matching, step through row/column reduction, minimum line covering, and optimal assignment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Presets:</span>
          <button
            onClick={() => loadPreset('standard')}
            className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            4x4 Minimization
          </button>
          <button
            onClick={() => loadPreset('max_sales')}
            className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            3x3 Maximization (Sales)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Matrix Input */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Cost Matrix Input
              </span>

              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setProblemType('min')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                    problemType === 'min' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Min Cost
                </button>
                <button
                  onClick={() => setProblemType('max')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                    problemType === 'max' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Max Profit
                </button>
              </div>
            </div>

            {/* Matrix Input Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <th className="p-2"></th>
                    {matrix[0].map((_, j) => (
                      <th key={j} className="p-2 font-mono font-semibold">
                        Job {j + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {matrix.map((row, i) => (
                    <tr key={i}>
                      <td className="p-2 font-bold text-slate-400">Worker {i + 1}</td>
                      {row.map((val, j) => (
                        <td key={j} className="p-1.5">
                          <input
                            type="number"
                            value={val}
                            onChange={e => updateCell(i, j, Number(e.target.value) || 0)}
                            className="w-14 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-center font-bold text-white focus:border-cyan-400"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Final Optimal Assignment Summary */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Optimal One-to-One Matchings</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
              {solution.assignments.map((a, idx) => (
                <div key={idx} className="flex justify-between items-center text-slate-300">
                  <span>
                    Worker {a.row + 1} &rarr; <strong className="text-cyan-300">Job {a.col + 1}</strong>
                  </span>
                  <span className="font-bold text-amber-300">Cost: {a.originalCost}</span>
                </div>
              ))}

              <div className="border-t border-slate-800/80 pt-2 flex justify-between items-center text-sm font-bold text-emerald-400">
                <span>Total {problemType === 'max' ? 'Profit' : 'Cost'}:</span>
                <span className="text-xl font-black">${solution.totalOptimalCost}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Step-by-Step Hungarian Matrix Visualizer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                disabled={activeStepIndex === 0}
                onClick={() => setActiveStepIndex(prev => Math.max(0, prev - 1))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-white transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="text-xs font-bold text-slate-300 font-mono px-3 py-1 bg-slate-950 rounded-lg border border-slate-800">
                Step {activeStepIndex + 1} of {solution.steps.length}
              </div>

              <button
                disabled={activeStepIndex === solution.steps.length - 1}
                onClick={() => setActiveStepIndex(prev => Math.min(solution.steps.length - 1, prev + 1))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-white transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs font-bold text-cyan-300">
              {currentStep.title}
            </div>
          </div>

          {/* Render Step Matrix with Line Covering Overlays */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl overflow-x-auto relative">
            <div className="text-xs text-slate-400 mb-3 leading-relaxed">
              {currentStep.description}
            </div>

            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <th className="p-2.5"></th>
                  {currentStep.matrix[0].map((_, j) => {
                    const isColCovered = currentStep.lines?.cols.includes(j);
                    return (
                      <th
                        key={j}
                        className={`p-2.5 font-mono font-semibold ${
                          isColCovered ? 'bg-cyan-950/60 text-cyan-300' : ''
                        }`}
                      >
                        Job {j + 1}
                        {isColCovered && <span className="block text-[9px] text-cyan-400 font-normal">Covered Line &darr;</span>}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60 font-mono text-sm">
                {currentStep.matrix.map((row, i) => {
                  const isRowCovered = currentStep.lines?.rows.includes(i);

                  return (
                    <tr
                      key={i}
                      className={`transition ${isRowCovered ? 'bg-rose-950/30 text-rose-200' : 'text-slate-300'}`}
                    >
                      <td className="p-3 font-bold text-slate-400 bg-slate-950/50">
                        Worker {i + 1}
                        {isRowCovered && <span className="block text-[9px] text-rose-400 font-normal">Covered Line &rarr;</span>}
                      </td>

                      {row.map((val, j) => {
                        const isColCovered = currentStep.lines?.cols.includes(j);
                        const isIntersection = isRowCovered && isColCovered;
                        const isAssigned =
                          activeStepIndex === solution.steps.length - 1 &&
                          solution.assignments.some(a => a.row === i && a.col === j);

                        return (
                          <td
                            key={j}
                            className={`p-3 relative ${
                              isAssigned
                                ? 'bg-emerald-500/25 text-emerald-300 font-black border-2 border-emerald-400 rounded-lg'
                                : isIntersection
                                ? 'bg-purple-950/40 text-purple-200 font-bold'
                                : val === 0
                                ? 'bg-cyan-500/10 text-cyan-300 font-bold'
                                : ''
                            }`}
                          >
                            {val}
                            {isAssigned && (
                              <span className="block text-[9px] text-emerald-400 font-bold uppercase tracking-wider">
                                Assigned
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
