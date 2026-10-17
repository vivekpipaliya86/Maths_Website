import React, { useState, useMemo } from 'react';
import {
  solveNorthWestCorner,
  solveLeastCostMethod,
  evaluateMODIMethod,
  TransportationInput,
} from '../../utils/solvers/transportationSolvers';
import { CheckCircle2, AlertTriangle, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';

export const TransportationSolverView: React.FC = () => {
  const [method, setMethod] = useState<'nwcr' | 'lcm' | 'modi'>('nwcr');

  const [supply, setSupply] = useState<number[]>([5, 8, 7]);
  const [demand, setDemand] = useState<number[]>([7, 9, 4]);
  const [costs, setCosts] = useState<number[][]>([
    [2, 7, 4],
    [3, 3, 1],
    [5, 4, 7],
  ]);

  const input: TransportationInput = useMemo(() => {
    return {
      supply,
      demand,
      costs,
    };
  }, [supply, demand, costs]);

  const nwcrResult = useMemo(() => solveNorthWestCorner(input), [input]);
  const lcmResult = useMemo(() => solveLeastCostMethod(input), [input]);

  const activeResult = method === 'nwcr' ? nwcrResult : lcmResult;

  const modiResult = useMemo(() => {
    return evaluateMODIMethod(input, activeResult.allocations);
  }, [input, activeResult]);

  const totalSupply = supply.reduce((a, b) => a + b, 0);
  const totalDemand = demand.reduce((a, b) => a + b, 0);
  const isBalanced = totalSupply === totalDemand;

  const updateCost = (r: number, c: number, val: number) => {
    const next = costs.map(row => [...row]);
    next[r][c] = val;
    setCosts(next);
  };

  const updateSupply = (r: number, val: number) => {
    const next = [...supply];
    next[r] = val;
    setSupply(next);
  };

  const updateDemand = (c: number, val: number) => {
    const next = [...demand];
    next[c] = val;
    setDemand(next);
  };

  const loadPreset = (type: string) => {
    if (type === 'standard') {
      setSupply([5, 8, 7]);
      setDemand([7, 9, 4]);
      setCosts([
        [2, 7, 4],
        [3, 3, 1],
        [5, 4, 7],
      ]);
    } else if (type === 'textbook') {
      setSupply([20, 28, 17]);
      setDemand([15, 19, 13, 18]);
      setCosts([
        [3, 6, 8, 5],
        [6, 1, 2, 5],
        [7, 8, 3, 9],
      ]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
            <span>Transportation Problem Solver</span>
            <span className="text-xs bg-teal-500/20 text-teal-300 font-mono px-2 py-0.5 rounded-full border border-teal-500/30">
              NWCR &middot; LCM &middot; MODI Optimality
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Calculate Initial Basic Feasible Solutions, inspect row/column allocations, and test optimality using MODI dual potentials (u_i, v_j).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Examples:</span>
          <button
            onClick={() => loadPreset('standard')}
            className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            3x3 Standard
          </button>
          <button
            onClick={() => loadPreset('textbook')}
            className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            3x4 Textbook Problem
          </button>
        </div>
      </div>

      {/* Controls & Method Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMethod('nwcr')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              method === 'nwcr' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            North-West Corner Rule
          </button>
          <button
            onClick={() => setMethod('lcm')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              method === 'lcm' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Least Cost Method (LCM)
          </button>
          <button
            onClick={() => setMethod('modi')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              method === 'modi' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            MODI (u-v) Optimality Test
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className={isBalanced ? 'text-emerald-400' : 'text-amber-400'}>
            Supply: {totalSupply} | Demand: {totalDemand} ({isBalanced ? 'Balanced' : 'Unbalanced'})
          </span>
        </div>
      </div>

      {/* Main Grid: Cost Matrix & Allocation View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Transportation Tableau (Unit Freight Costs & Allocations)
            </span>
            <span className="text-xs text-slate-500 font-mono">Editable Inputs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <th className="py-2.5 px-3 font-semibold text-left">Origin / Destination</th>
                  {demand.map((_, j) => (
                    <th key={j} className="py-2.5 px-3 font-mono font-semibold">
                      D{j + 1}
                      {method === 'modi' && modiResult && (
                        <span className="block text-[10px] text-emerald-400">
                          v{j + 1} = {modiResult.v[j]}
                        </span>
                      )}
                    </th>
                  ))}
                  <th className="py-2.5 px-3 font-semibold text-cyan-400">Available Supply (a_i)</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/60 font-mono">
                {supply.map((sVal, i) => (
                  <tr key={i} className="hover:bg-slate-800/20 transition">
                    <td className="py-3 px-3 font-bold text-left text-slate-300 bg-slate-950/40">
                      S{i + 1}
                      {method === 'modi' && modiResult && (
                        <span className="block text-[10px] text-emerald-400">
                          u{i + 1} = {modiResult.u[i]}
                        </span>
                      )}
                    </td>

                    {demand.map((_, j) => {
                      const costVal = costs[i][j];
                      const alloc = activeResult.allocations[i][j];
                      const delta = modiResult?.opportunityCosts[i][j];

                      return (
                        <td key={j} className="py-2.5 px-2 relative group">
                          <div
                            className={`p-2 rounded-xl border transition flex flex-col items-center justify-center min-w-[70px] ${
                              alloc > 0
                                ? 'bg-cyan-950/50 border-cyan-500/50 shadow-inner'
                                : 'bg-slate-950/60 border-slate-800/80'
                            }`}
                          >
                            {/* Cost Input (top right) */}
                            <div className="w-full flex justify-between items-center text-[10px] text-slate-500 mb-1">
                              <span>cost:</span>
                              <input
                                type="number"
                                value={costVal}
                                onChange={e => updateCost(i, j, Number(e.target.value) || 0)}
                                className="w-9 bg-slate-900 border border-slate-700/60 rounded px-1 text-center text-[10px] text-slate-200"
                              />
                            </div>

                            {/* Allocation badge */}
                            {alloc > 0 ? (
                              <div className="font-bold text-sm text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-md border border-cyan-500/30">
                                {alloc} units
                              </div>
                            ) : method === 'modi' && delta !== null && delta !== undefined ? (
                              <div
                                className={`text-[10px] font-bold ${
                                  delta < 0 ? 'text-red-400 animate-pulse' : 'text-slate-500'
                                }`}
                              >
                                &Delta; = {delta}
                              </div>
                            ) : (
                              <div className="text-slate-600 text-xs">-</div>
                            )}
                          </div>
                        </td>
                      );
                    })}

                    <td className="py-3 px-3">
                      <input
                        type="number"
                        value={sVal}
                        onChange={e => updateSupply(i, Number(e.target.value) || 0)}
                        className="w-16 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-center font-bold text-cyan-300"
                      />
                    </td>
                  </tr>
                ))}

                {/* Bottom Row: Demand inputs */}
                <tr className="bg-slate-950 text-slate-300 border-t border-slate-800">
                  <td className="py-3 px-3 font-bold text-left text-cyan-400">
                    Required Demand (b_j)
                  </td>
                  {demand.map((dVal, j) => (
                    <td key={j} className="py-2.5 px-2">
                      <input
                        type="number"
                        value={dVal}
                        onChange={e => updateDemand(j, Number(e.target.value) || 0)}
                        className="w-16 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-center font-bold text-cyan-300 font-mono"
                      />
                    </td>
                  ))}
                  <td className="py-3 px-3 font-bold text-slate-400 font-mono">
                    Total: {totalSupply}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Cost Evaluation & MODI Notes */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Total Transportation Cost
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-sm font-bold text-emerald-400 font-mono">
                <span>Total Freight:</span>
                <span className="text-2xl font-black">${activeResult.totalCost}</span>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 font-mono">
                Allocations: {activeResult.allocationCount} / {activeResult.requiredBasicCells} required
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Condition:{' '}
                {activeResult.isDegenerate ? (
                  <span className="text-amber-400 font-bold">Degenerate Solution (&lt; m+n-1)</span>
                ) : (
                  <span className="text-emerald-400 font-bold">Non-Degenerate (m+n-1 satisfied)</span>
                )}
              </div>
            </div>
          </div>

          {/* Method Notes */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Step-by-Step Explanation</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto text-xs text-slate-400 font-mono">
              {method === 'modi' && modiResult ? (
                modiResult.notes.map((note, idx) => (
                  <div key={idx} className="p-2 bg-slate-950 rounded-lg border border-slate-800/60 leading-relaxed">
                    {note}
                  </div>
                ))
              ) : (
                activeResult.steps.map((st, idx) => (
                  <div key={idx} className="p-2 bg-slate-950 rounded-lg border border-slate-800/60 leading-relaxed">
                    <span className="text-cyan-400 font-bold">Step {st.step}:</span> {st.description}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
