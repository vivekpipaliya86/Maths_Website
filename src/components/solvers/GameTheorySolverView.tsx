import React, { useState, useMemo } from 'react';
import {
  findSaddlePoint,
  solve2x2MixedStrategy,
  solveDominance,
  solveGraphicalGame,
} from '../../utils/solvers/gameTheorySolvers';
import { Swords, CheckCircle2, AlertTriangle, ArrowRight, TrendingUp } from 'lucide-react';
import { MathView } from '../MathView';

export const GameTheorySolverView: React.FC = () => {
  const [subTool, setSubTool] = useState<'saddle' | 'mixed2x2' | 'dominance' | 'graphical'>('saddle');

  const [matrix, setMatrix] = useState<number[][]>([
    [3, 2, 4, 0],
    [3, 4, 2, 4],
    [4, 2, 4, 0],
    [0, 4, 0, 8],
  ]);

  const [mixedMatrix, setMixedMatrix] = useState<number[][]>([
    [5, 1],
    [3, 4],
  ]);

  const [graphicalMatrix, setGraphicalMatrix] = useState<number[][]>([
    [1, 3, 11],
    [8, 5, 2],
  ]);

  const saddleResult = useMemo(() => findSaddlePoint(matrix), [matrix]);
  const mixedResult = useMemo(() => solve2x2MixedStrategy(mixedMatrix), [mixedMatrix]);
  const dominanceResult = useMemo(() => solveDominance(matrix), [matrix]);
  const graphicalResult = useMemo(() => solveGraphicalGame(graphicalMatrix), [graphicalMatrix]);

  const updateMatrixCell = (r: number, c: number, val: number) => {
    const next = matrix.map(row => [...row]);
    next[r][c] = val;
    setMatrix(next);
  };

  const updateMixedCell = (r: number, c: number, val: number) => {
    const next = mixedMatrix.map(row => [...row]);
    next[r][c] = val;
    setMixedMatrix(next);
  };

  const loadPreset = (type: string) => {
    if (type === 'saddle_true') {
      setMatrix([
        [1, 7, 3, 4],
        [5, 6, 4, 5],
        [7, 2, 0, 3],
      ]);
    } else if (type === 'saddle_false') {
      setMatrix([
        [3, 2, 4, 0],
        [3, 4, 2, 4],
        [4, 2, 4, 0],
        [0, 4, 0, 8],
      ]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
            <span>Game Theory Suite</span>
            <span className="text-xs bg-purple-500/20 text-purple-300 font-mono px-2 py-0.5 rounded-full border border-purple-500/30">
              Two-Person Zero-Sum
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Analyze payoff matrices, evaluate Maximin & Minimax principles, solve 2x2 mixed strategies, reduce via Dominance, and plot graphical envelopes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Presets:</span>
          <button
            onClick={() => loadPreset('saddle_true')}
            className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            Pure Saddle Exists
          </button>
          <button
            onClick={() => loadPreset('saddle_false')}
            className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            No Saddle (Mixed Required)
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 border border-slate-800 p-2 rounded-2xl">
        <button
          onClick={() => setSubTool('saddle')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
            subTool === 'saddle' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Saddle Point Calculator
        </button>
        <button
          onClick={() => setSubTool('mixed2x2')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
            subTool === 'mixed2x2' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          2×2 Mixed Strategy Solver
        </button>
        <button
          onClick={() => setSubTool('dominance')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
            subTool === 'dominance' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          Dominance Principle Reducer
        </button>
        <button
          onClick={() => setSubTool('graphical')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
            subTool === 'graphical' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          2×N Graphical Method Solver
        </button>
      </div>

      {/* 1. Saddle Point Calculator Tab */}
      {subTool === 'saddle' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
              <span>Payoff Matrix (Player A vs Player B)</span>
              <span className="font-mono text-[11px] text-cyan-400">Click cells to edit values</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <th className="p-2.5 text-left font-semibold">Player A \ Player B</th>
                    {matrix[0].map((_, j) => (
                      <th key={j} className="p-2.5 font-mono font-semibold">
                        Strategy B{j + 1}
                      </th>
                    ))}
                    <th className="p-2.5 font-semibold text-amber-400">Row Minimum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {matrix.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-800/20 transition">
                      <td className="p-2.5 font-bold text-left text-slate-300 bg-slate-950/40">
                        Strategy A{i + 1}
                      </td>

                      {row.map((val, j) => {
                        const isSaddle = saddleResult.saddlePoints.some(sp => sp.row === i && sp.col === j);

                        return (
                          <td key={j} className="p-2">
                            <input
                              type="number"
                              value={val}
                              onChange={e => updateMatrixCell(i, j, Number(e.target.value) || 0)}
                              className={`w-14 border rounded px-2 py-1 text-center font-bold text-sm ${
                                isSaddle
                                  ? 'bg-emerald-950 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/50'
                                  : 'bg-slate-950 border-slate-800 text-white'
                              }`}
                            />
                          </td>
                        );
                      })}

                      <td className="p-2.5 font-bold text-amber-300 bg-slate-950/30">
                        {saddleResult.rowMinima[i]}
                      </td>
                    </tr>
                  ))}

                  {/* Column Maxima row */}
                  <tr className="bg-slate-950 border-t border-slate-800 text-cyan-400 font-bold">
                    <td className="p-2.5 text-left">Column Maximum</td>
                    {saddleResult.colMaxima.map((maxVal, j) => (
                      <td key={j} className="p-2.5">
                        {maxVal}
                      </td>
                    ))}
                    <td className="p-2.5 text-amber-400 text-sm">
                      Maximin = {saddleResult.maximin}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div
              className={`p-5 rounded-2xl border ${
                saddleResult.hasSaddlePoint
                  ? 'bg-emerald-950/40 border-emerald-800/80'
                  : 'bg-amber-950/40 border-amber-800/80'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {saddleResult.hasSaddlePoint ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-400" />
                )}
                <div>
                  <h3 className="font-bold text-base text-white">
                    {saddleResult.hasSaddlePoint ? 'Saddle Point Found!' : 'No Pure Saddle Point'}
                  </h3>
                  <p className="text-xs text-slate-300 opacity-90">
                    Maximin = {saddleResult.maximin} &middot; Minimax = {saddleResult.minimax}
                  </p>
                </div>
              </div>

              {saddleResult.hasSaddlePoint ? (
                <div className="text-xs text-emerald-200 space-y-1 font-mono pt-2 border-t border-emerald-800/60">
                  <div>Value of the Game (V) = {saddleResult.gameValue}</div>
                  <div>
                    Saddle Coordinate(s):{' '}
                    {saddleResult.saddlePoints.map(sp => `(Row ${sp.row + 1}, Col ${sp.col + 1})`).join(', ')}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-amber-200 pt-2 border-t border-amber-800/60 leading-relaxed">
                  Because Maximin ({saddleResult.maximin}) &ne; Minimax ({saddleResult.minimax}), neither player will stick to a pure strategy. Randomize choices via mixed strategies!
                </div>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2 text-xs font-mono text-slate-400">
              <div className="font-bold text-slate-300 font-sans text-xs uppercase tracking-wider mb-2">
                Detailed Analysis:
              </div>
              {saddleResult.explanation.map((line, i) => (
                <div key={i} className="p-2 bg-slate-950 rounded-lg border border-slate-800/60 leading-relaxed">
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. 2x2 Mixed Strategy Solver Tab */}
      {subTool === 'mixed2x2' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              2×2 Payoff Matrix Inputs
            </span>

            <div className="grid grid-cols-2 gap-3 font-mono">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 block mb-1">a₁₁ (A1 vs B1)</span>
                <input
                  type="number"
                  value={mixedMatrix[0][0]}
                  onChange={e => updateMixedCell(0, 0, Number(e.target.value) || 0)}
                  className="w-full bg-slate-900 text-center font-bold text-white text-lg rounded p-1"
                />
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 block mb-1">a₁₂ (A1 vs B2)</span>
                <input
                  type="number"
                  value={mixedMatrix[0][1]}
                  onChange={e => updateMixedCell(0, 1, Number(e.target.value) || 0)}
                  className="w-full bg-slate-900 text-center font-bold text-white text-lg rounded p-1"
                />
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 block mb-1">a₂₁ (A2 vs B1)</span>
                <input
                  type="number"
                  value={mixedMatrix[1][0]}
                  onChange={e => updateMixedCell(1, 0, Number(e.target.value) || 0)}
                  className="w-full bg-slate-900 text-center font-bold text-white text-lg rounded p-1"
                />
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 block mb-1">a₂₂ (A2 vs B2)</span>
                <input
                  type="number"
                  value={mixedMatrix[1][1]}
                  onChange={e => updateMixedCell(1, 1, Number(e.target.value) || 0)}
                  className="w-full bg-slate-900 text-center font-bold text-white text-lg rounded p-1"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
              <div className="text-cyan-300 font-bold">
                Player A Probabilities:
              </div>
              <div>p₁ = {mixedResult.p1} ({(mixedResult.p1 * 100).toFixed(1)}%)</div>
              <div>p₂ = {mixedResult.p2} ({(mixedResult.p2 * 100).toFixed(1)}%)</div>

              <div className="text-amber-300 font-bold pt-2 border-t border-slate-800/80">
                Player B Probabilities:
              </div>
              <div>q₁ = {mixedResult.q1} ({(mixedResult.q1 * 100).toFixed(1)}%)</div>
              <div>q₂ = {mixedResult.q2} ({(mixedResult.q2 * 100).toFixed(1)}%)</div>

              <div className="text-emerald-400 font-bold text-sm pt-2 border-t border-slate-800/80">
                Value of Game V = {mixedResult.gameValue}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Algebraic Step-by-Step Derivation
            </span>

            <div className="space-y-2 text-xs font-mono text-slate-400">
              {mixedResult.algebraicSteps.map((step, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 leading-relaxed">
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Dominance Principle Reducer Tab */}
      {subTool === 'dominance' && (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Dominance Method Reduction History
            </span>
            <span className="text-xs text-cyan-400 font-mono">{dominanceResult.statusMessage}</span>
          </div>

          {dominanceResult.steps.length > 0 ? (
            <div className="space-y-3">
              {dominanceResult.steps.map((st, i) => (
                <div key={i} className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-200">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px]">
                      Step {st.step}
                    </span>
                    <span className="text-cyan-400">{st.reason}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 text-center text-xs text-slate-500">
              No row or column strictly dominates another in this matrix without mixed combination testing.
            </div>
          )}
        </div>
      )}

      {/* 4. Graphical Method for 2xN Games Tab */}
      {subTool === 'graphical' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              2×3 Game Payoff Matrix
            </span>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <th className="p-2">Player A \ B</th>
                    <th className="p-2">B1</th>
                    <th className="p-2">B2</th>
                    <th className="p-2">B3</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr>
                    <td className="p-2 text-left font-bold text-slate-400">A1 (p₁)</td>
                    <td className="p-2 font-bold text-white">1</td>
                    <td className="p-2 font-bold text-white">3</td>
                    <td className="p-2 font-bold text-white">11</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-left font-bold text-slate-400">A2 (1-p₁)</td>
                    <td className="p-2 font-bold text-white">8</td>
                    <td className="p-2 font-bold text-white">5</td>
                    <td className="p-2 font-bold text-white">2</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono space-y-2">
              <div className="text-cyan-400 font-bold">Line Equations (Expected Payoff E):</div>
              <div>Line B1: E₁ = (1 - 8)p₁ + 8 = -7p₁ + 8</div>
              <div>Line B2: E₂ = (3 - 5)p₁ + 5 = -2p₁ + 5</div>
              <div>Line B3: E₃ = (11 - 2)p₁ + 2 = 9p₁ + 2</div>

              {graphicalResult.criticalIntersection && (
                <div className="pt-2 border-t border-slate-800/80 text-emerald-400 font-bold">
                  Apex Maximin Intersection: p₁* = {graphicalResult.criticalIntersection.p}, Game Value V = {graphicalResult.criticalIntersection.gameValue}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Expected Payoff Lines & Lower Envelope
            </span>

            {/* SVG Plot */}
            <div className="w-full flex justify-center bg-slate-950 rounded-xl p-3 border border-slate-800">
              <svg width="440" height="260" className="overflow-visible select-none">
                {/* Axes */}
                <line x1="60" y1="220" x2="380" y2="220" stroke="#64748b" strokeWidth="2" />
                <line x1="60" y1="220" x2="60" y2="30" stroke="#64748b" strokeWidth="2" />
                <line x1="380" y1="220" x2="380" y2="30" stroke="#64748b" strokeWidth="2" />

                <text x="60" y="240" fill="#94a3b8" fontSize="11" textAnchor="middle" fontFamily="monospace">
                  p₁ = 0
                </text>
                <text x="380" y="240" fill="#94a3b8" fontSize="11" textAnchor="middle" fontFamily="monospace">
                  p₁ = 1
                </text>

                {/* Scale helper */}
                {/* Line B1: at p1=0 -> y=8; at p1=1 -> y=1 */}
                <line x1="60" y1={220 - 8 * 16} x2="380" y2={220 - 1 * 16} stroke="#38bdf8" strokeWidth="2" />
                <text x="70" y={220 - 8 * 16 - 6} fill="#38bdf8" fontSize="10" fontFamily="monospace">B1</text>

                {/* Line B2: at p1=0 -> y=5; at p1=1 -> y=3 */}
                <line x1="60" y1={220 - 5 * 16} x2="380" y2={220 - 3 * 16} stroke="#facc15" strokeWidth="2" />
                <text x="70" y={220 - 5 * 16 - 6} fill="#facc15" fontSize="10" fontFamily="monospace">B2</text>

                {/* Line B3: at p1=0 -> y=2; at p1=1 -> y=11 */}
                <line x1="60" y1={220 - 2 * 16} x2="380" y2={220 - 11 * 16} stroke="#ec4899" strokeWidth="2" />
                <text x="360" y={220 - 11 * 16 - 6} fill="#ec4899" fontSize="10" fontFamily="monospace">B3</text>

                {/* Maximin Peak point */}
                <circle cx={60 + 0.272 * 320} cy={220 - 4.45 * 16} r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                <text
                  x={60 + 0.272 * 320}
                  y={220 - 4.45 * 16 - 12}
                  fill="#34d399"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  Maximin Apex (p₁=0.27, V=4.45)
                </text>
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
