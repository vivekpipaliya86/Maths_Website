import React, { useState, useMemo } from 'react';
import { solveSimplex, SimplexInput } from '../../utils/solvers/simplexSolver';
import { ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { MathView } from '../MathView';

export const SimplexSolverView: React.FC = () => {
  const [problemType, setProblemType] = useState<'max' | 'min'>('max');
  const [c1, setC1] = useState<number>(3);
  const [c2, setC2] = useState<number>(2);

  const [constraints, setConstraints] = useState<{ a1: number; a2: number; op: '<=' | '>=' | '='; rhs: number }[]>([
    { a1: 2, a2: 1, op: '<=', rhs: 10 },
    { a1: 1, a2: 3, op: '<=', rhs: 15 },
  ]);

  const [activeIterationIndex, setActiveIterationIndex] = useState<number>(0);

  const simplexInput: SimplexInput = useMemo(() => {
    return {
      type: problemType,
      objective: [c1, c2],
      constraints: constraints.map(c => ({
        coefficients: [c.a1, c.a2],
        operator: c.op,
        rhs: c.rhs,
      })),
    };
  }, [problemType, c1, c2, constraints]);

  const solution = useMemo(() => {
    return solveSimplex(simplexInput);
  }, [simplexInput]);

  const currentTableau = solution.tableaus[activeIterationIndex] || solution.tableaus[0];

  const loadPreset = (type: string) => {
    if (type === 'standard') {
      setProblemType('max');
      setC1(3);
      setC2(2);
      setConstraints([
        { a1: 2, a2: 1, op: '<=', rhs: 10 },
        { a1: 1, a2: 3, op: '<=', rhs: 15 },
      ]);
    } else if (type === 'three_vars') {
      setProblemType('max');
      setC1(5);
      setC2(4);
      setConstraints([
        { a1: 6, a2: 4, op: '<=', rhs: 24 },
        { a1: 1, a2: 2, op: '<=', rhs: 6 },
        { a1: -1, a2: 1, op: '<=', rhs: 1 },
      ]);
    } else if (type === 'unbounded') {
      setProblemType('max');
      setC1(2);
      setC2(1);
      setConstraints([
        { a1: 1, a2: -1, op: '<=', rhs: 10 },
        { a1: 2, a2: 0, op: '<=', rhs: 40 },
      ]);
    }
    setActiveIterationIndex(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
            <span>Simplex Tableau Solver</span>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 font-mono px-2 py-0.5 rounded-full border border-indigo-500/30">
              Gauss-Jordan Iterative Pivot
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Step through canonical tableau transformations, observe Net Evaluation (C_j - Z_j), minimum ratio θ tests, and pivot operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Presets:</span>
          <button
            onClick={() => loadPreset('standard')}
            className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            Standard 2-Step
          </button>
          <button
            onClick={() => loadPreset('three_vars')}
            className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            3 Constraints
          </button>
          <button
            onClick={() => loadPreset('unbounded')}
            className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            Unbounded Test
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Problem Input */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Formulate Model
            </div>

            <div className="flex items-center gap-2">
              <select
                value={problemType}
                onChange={e => setProblemType(e.target.value as 'max' | 'min')}
                className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold text-cyan-400"
              >
                <option value="max">Maximize Z</option>
                <option value="min">Minimize Z</option>
              </select>

              <div className="flex items-center gap-1.5 font-mono text-sm text-slate-300">
                <span>=</span>
                <input
                  type="number"
                  value={c1}
                  onChange={e => setC1(Number(e.target.value) || 0)}
                  className="w-14 bg-slate-950 border border-slate-800 px-2 py-1 rounded text-center text-xs"
                />
                <span className="text-xs text-slate-400">x₁ +</span>
                <input
                  type="number"
                  value={c2}
                  onChange={e => setC2(Number(e.target.value) || 0)}
                  className="w-14 bg-slate-950 border border-slate-800 px-2 py-1 rounded text-center text-xs"
                />
                <span className="text-xs text-slate-400">x₂</span>
              </div>
            </div>

            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider pt-2">
              Constraints:
            </div>

            {constraints.map((c, i) => (
              <div key={i} className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs font-mono">
                <span className="text-slate-500">C{i + 1}:</span>
                <input
                  type="number"
                  value={c.a1}
                  onChange={e => {
                    const next = [...constraints];
                    next[i].a1 = Number(e.target.value) || 0;
                    setConstraints(next);
                  }}
                  className="w-12 bg-slate-900 border border-slate-800 px-1 py-1 rounded text-center"
                />
                <span className="text-slate-400">x₁ +</span>
                <input
                  type="number"
                  value={c.a2}
                  onChange={e => {
                    const next = [...constraints];
                    next[i].a2 = Number(e.target.value) || 0;
                    setConstraints(next);
                  }}
                  className="w-12 bg-slate-900 border border-slate-800 px-1 py-1 rounded text-center"
                />
                <span className="text-slate-400">x₂</span>
                <span className="text-cyan-400 font-bold">&le;</span>
                <input
                  type="number"
                  value={c.rhs}
                  onChange={e => {
                    const next = [...constraints];
                    next[i].rhs = Number(e.target.value) || 0;
                    setConstraints(next);
                  }}
                  className="w-14 bg-slate-900 border border-slate-800 px-1 py-1 rounded text-center"
                />
              </div>
            ))}

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
              <div className="font-semibold text-slate-300 mb-1">Standard Canonical Form:</div>
              <p className="font-mono text-[11px] text-cyan-300">
                Slack variables s₁, s₂ added to convert inequalities to equalities.
              </p>
            </div>
          </div>

          {/* Solution Summary Card */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Final Optimal Values
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-sm">
              <div className="flex justify-between items-center text-emerald-400 font-bold">
                <span>Maximum Z:</span>
                <span className="text-lg">{solution.finalZ}</span>
              </div>
              <div className="border-t border-slate-800/80 pt-2 flex justify-between text-xs text-slate-300">
                <span>x₁:</span>
                <span className="font-bold text-white">{solution.solutionVariables['x1'] || 0}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>x₂:</span>
                <span className="font-bold text-white">{solution.solutionVariables['x2'] || 0}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Status:</span>
                <span className="uppercase text-[11px] font-bold text-cyan-400">{solution.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Step-by-Step Tableau */}
        <div className="lg:col-span-8 space-y-4">
          {/* Tableau Stepper Navigation */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                disabled={activeIterationIndex === 0}
                onClick={() => setActiveIterationIndex(prev => Math.max(0, prev - 1))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-white transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="text-xs font-bold text-slate-300 font-mono px-3 py-1 bg-slate-950 rounded-lg border border-slate-800">
                Tableau {activeIterationIndex + 1} of {solution.tableaus.length}
              </div>

              <button
                disabled={activeIterationIndex === solution.tableaus.length - 1}
                onClick={() => setActiveIterationIndex(prev => Math.min(solution.tableaus.length - 1, prev + 1))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-white transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              {currentTableau?.isOptimal ? (
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Optimality Criterion Met!
                </span>
              ) : (
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                  {currentTableau?.notes}
                </span>
              )}
            </div>
          </div>

          {/* Simplex Tableau Table */}
          {currentTableau && (
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                {/* Header row 1: C_j values */}
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="py-2 px-3"></th>
                    <th className="py-2 px-3">C_j &rarr;</th>
                    <th className="py-2 px-3"></th>
                    {currentTableau.cValues.map((cj, i) => (
                      <th
                        key={i}
                        className={`py-2 px-3 ${
                          currentTableau.pivotCol === i ? 'bg-emerald-950/40 text-emerald-300 font-bold' : ''
                        }`}
                      >
                        {cj}
                      </th>
                    ))}
                    <th className="py-2 px-3">Ratio &theta;</th>
                  </tr>

                  {/* Header row 2: Variable Names */}
                  <tr className="bg-slate-950 text-slate-300 border-b border-slate-800 font-semibold">
                    <th className="py-2.5 px-3">Basis</th>
                    <th className="py-2.5 px-3">C_B</th>
                    <th className="py-2.5 px-3">X_B (RHS)</th>
                    {currentTableau.variableNames.map((vName, i) => (
                      <th
                        key={i}
                        className={`py-2.5 px-3 font-mono ${
                          currentTableau.pivotCol === i ? 'bg-emerald-950/60 text-emerald-300' : ''
                        }`}
                      >
                        {vName}
                        {currentTableau.pivotCol === i && (
                          <span className="block text-[9px] text-emerald-400 font-normal">&darr; Entering</span>
                        )}
                      </th>
                    ))}
                    <th className="py-2.5 px-3">X_B / a_ir</th>
                  </tr>
                </thead>

                {/* Table Body: Rows */}
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {currentTableau.rows.map((row, rIdx) => {
                    const isPivotRow = currentTableau.pivotRow === rIdx;

                    return (
                      <tr
                        key={rIdx}
                        className={`transition ${isPivotRow ? 'bg-amber-950/30 text-amber-200' : 'text-slate-300 hover:bg-slate-800/30'}`}
                      >
                        <td className="py-2.5 px-3 font-bold text-white bg-slate-950/50">
                          {row.basisVar}
                          {isPivotRow && (
                            <span className="block text-[9px] text-amber-400 font-normal">&rarr; Leaving</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">{row.cb}</td>
                        <td className="py-2.5 px-3 font-bold text-cyan-300">{row.rhs}</td>

                        {row.values.map((val, cIdx) => {
                          const isPivotElem = isPivotRow && currentTableau.pivotCol === cIdx;

                          return (
                            <td
                              key={cIdx}
                              className={`py-2.5 px-3 ${
                                isPivotElem
                                  ? 'bg-amber-500/20 text-amber-300 font-bold border-2 border-amber-400 rounded'
                                  : currentTableau.pivotCol === cIdx
                                  ? 'bg-emerald-950/30 text-emerald-200'
                                  : ''
                              }`}
                            >
                              {val}
                            </td>
                          );
                        })}

                        <td className="py-2.5 px-3 text-slate-400">
                          {row.ratio !== null ? (
                            <span className={isPivotRow ? 'text-amber-400 font-bold' : ''}>
                              {row.ratio} {isPivotRow && '(Min)'}
                            </span>
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Z_j Row */}
                  <tr className="bg-slate-950/70 border-t border-slate-800 text-slate-400">
                    <td colSpan={2} className="py-2 px-3 font-semibold text-right">
                      Z_j = &sum; C_B &middot; a_ij
                    </td>
                    <td className="py-2 px-3 font-bold text-white">{currentTableau.currentZ}</td>
                    {currentTableau.zj.map((zVal, i) => (
                      <td key={i} className="py-2 px-3">
                        {zVal}
                      </td>
                    ))}
                    <td></td>
                  </tr>

                  {/* Net Evaluation (C_j - Z_j) Row */}
                  <tr className="bg-slate-950 border-t border-slate-800 text-slate-200 font-bold">
                    <td colSpan={2} className="py-2.5 px-3 text-right text-cyan-400">
                      C_j - Z_j
                    </td>
                    <td className="py-2.5 px-3 text-cyan-400">Z = {currentTableau.currentZ}</td>
                    {currentTableau.cjMinusZj.map((evalVal, i) => (
                      <td
                        key={i}
                        className={`py-2.5 px-3 ${
                          currentTableau.pivotCol === i
                            ? 'bg-emerald-900/40 text-emerald-300 font-black'
                            : evalVal > 0
                            ? 'text-cyan-300'
                            : 'text-slate-400'
                        }`}
                      >
                        {evalVal}
                      </td>
                    ))}
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Explanation Step Note */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-xs space-y-2">
            <div className="font-bold text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Algorithmic Interpretation for Tableau {activeIterationIndex + 1}:
            </div>
            <p className="text-slate-400 leading-relaxed font-mono">
              {solution.summarySteps[activeIterationIndex] ||
                'Pivoting complete. All net evaluation entries indicate that no further improvement is possible.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
