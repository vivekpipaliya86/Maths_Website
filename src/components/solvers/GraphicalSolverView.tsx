import React, { useState, useMemo } from 'react';
import { solveGraphicalLPP, LPPConstraint } from '../../utils/solvers/graphicalLPP';
import { Plus, Trash2, Sliders, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { MathView } from '../MathView';

export const GraphicalSolverView: React.FC = () => {
  const [objectiveType, setObjectiveType] = useState<'max' | 'min'>('max');
  const [c1, setC1] = useState<number>(3);
  const [c2, setC2] = useState<number>(5);

  const [constraints, setConstraints] = useState<LPPConstraint[]>([
    { id: '1', a1: 1, a2: 2, operator: '<=', b: 20 },
    { id: '2', a1: 1, a2: 1, operator: '<=', b: 15 },
  ]);

  const [sliderZ, setSliderZ] = useState<number | null>(null);

  const solution = useMemo(() => {
    return solveGraphicalLPP({
      objectiveType,
      c1,
      c2,
      constraints,
    });
  }, [objectiveType, c1, c2, constraints]);

  const addConstraint = () => {
    const nextId = (constraints.length + 1).toString();
    setConstraints([
      ...constraints,
      { id: nextId, a1: 2, a2: 1, operator: '<=', b: 18 },
    ]);
  };

  const updateConstraint = (id: string, field: keyof LPPConstraint, value: unknown) => {
    setConstraints(constraints.map(c => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const removeConstraint = (id: string) => {
    if (constraints.length <= 1) return;
    setConstraints(constraints.filter(c => c.id !== id));
  };

  // SVG dimensions & scaling
  const svgWidth = 520;
  const svgHeight = 440;
  const padding = 50;
  const plotWidth = svgWidth - padding * 2;
  const plotHeight = svgHeight - padding * 2;

  const maxDomainX = Math.max(solution.maxRangeX, 15);
  const maxDomainY = Math.max(solution.maxRangeY, 15);

  const scaleX = (x: number) => padding + (x / maxDomainX) * plotWidth;
  const scaleY = (y: number) => svgHeight - padding - (y / maxDomainY) * plotHeight;

  // Active contour Z
  const activeZ = sliderZ !== null ? sliderZ : (solution.optimalValue || 30);

  // Quick preset loader
  const loadPreset = (type: string) => {
    if (type === 'unique') {
      setObjectiveType('max');
      setC1(3);
      setC2(5);
      setConstraints([
        { id: '1', a1: 1, a2: 2, operator: '<=', b: 20 },
        { id: '2', a1: 1, a2: 1, operator: '<=', b: 15 },
      ]);
    } else if (type === 'multiple') {
      setObjectiveType('max');
      setC1(2);
      setC2(4);
      setConstraints([
        { id: '1', a1: 1, a2: 2, operator: '<=', b: 10 },
        { id: '2', a1: 1, a2: 1, operator: '<=', b: 8 },
      ]);
    } else if (type === 'infeasible') {
      setObjectiveType('max');
      setC1(4);
      setC2(3);
      setConstraints([
        { id: '1', a1: 1, a2: 1, operator: '<=', b: 6 },
        { id: '2', a1: 1, a2: 1, operator: '>=', b: 12 },
      ]);
    } else if (type === 'diet') {
      setObjectiveType('min');
      setC1(6);
      setC2(8);
      setConstraints([
        { id: '1', a1: 2, a2: 4, operator: '>=', b: 40 },
        { id: '2', a1: 3, a2: 2, operator: '>=', b: 50 },
      ]);
    }
    setSliderZ(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Presets */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
            <span>Graphical LPP Solver</span>
            <span className="text-xs bg-cyan-500/20 text-cyan-300 font-mono px-2 py-0.5 rounded-full border border-cyan-500/30">
              2 Variables
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Formulate two-variable linear programs, inspect corner points, and drag the Iso-Profit line across the feasible convex region.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Load Example:</span>
          <button
            onClick={() => loadPreset('unique')}
            className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            Unique Optimum
          </button>
          <button
            onClick={() => loadPreset('multiple')}
            className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            Alternate Optima
          </button>
          <button
            onClick={() => loadPreset('infeasible')}
            className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            Infeasible Case
          </button>
          <button
            onClick={() => loadPreset('diet')}
            className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            Minimization (Diet)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Formulation Controls */}
        <div className="lg:col-span-5 space-y-5">
          {/* Objective Function Card */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Objective Function</span>
              <span className="font-mono text-cyan-400">
                {objectiveType.toUpperCase()} Z = {c1}x₁ + {c2}x₂
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setObjectiveType('max')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                    objectiveType === 'max' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Maximize
                </button>
                <button
                  onClick={() => setObjectiveType('min')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                    objectiveType === 'min' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Minimize
                </button>
              </div>

              <div className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-1 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex-1">
                  <span className="text-xs text-slate-500 font-mono">c₁:</span>
                  <input
                    type="number"
                    value={c1}
                    onChange={e => setC1(Number(e.target.value) || 0)}
                    className="w-full bg-transparent text-sm font-mono text-white focus:outline-none"
                  />
                  <span className="text-xs text-slate-400 font-mono">x₁</span>
                </div>

                <span className="text-slate-500 font-bold">+</span>

                <div className="flex items-center gap-1 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex-1">
                  <span className="text-xs text-slate-500 font-mono">c₂:</span>
                  <input
                    type="number"
                    value={c2}
                    onChange={e => setC2(Number(e.target.value) || 0)}
                    className="w-full bg-transparent text-sm font-mono text-white focus:outline-none"
                  />
                  <span className="text-xs text-slate-400 font-mono">x₂</span>
                </div>
              </div>
            </div>
          </div>

          {/* Constraints Card */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                System Constraints
              </span>
              <button
                onClick={addConstraint}
                className="flex items-center gap-1.5 text-xs px-3 py-1 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 rounded-lg transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Constraint
              </button>
            </div>

            <div className="space-y-3">
              {constraints.map((c, index) => (
                <div
                  key={c.id}
                  className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80"
                >
                  <span className="text-[10px] font-mono text-slate-500 w-5">C{index + 1}</span>

                  <input
                    type="number"
                    value={c.a1}
                    onChange={e => updateConstraint(c.id, 'a1', Number(e.target.value) || 0)}
                    className="w-14 bg-slate-900 border border-slate-800 px-2 py-1 rounded text-xs font-mono text-white text-center"
                    title="a1 coefficient"
                  />
                  <span className="text-xs text-slate-400 font-mono">x₁ +</span>

                  <input
                    type="number"
                    value={c.a2}
                    onChange={e => updateConstraint(c.id, 'a2', Number(e.target.value) || 0)}
                    className="w-14 bg-slate-900 border border-slate-800 px-2 py-1 rounded text-xs font-mono text-white text-center"
                    title="a2 coefficient"
                  />
                  <span className="text-xs text-slate-400 font-mono">x₂</span>

                  <select
                    value={c.operator}
                    onChange={e => updateConstraint(c.id, 'operator', e.target.value)}
                    className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-xs font-mono text-cyan-300"
                  >
                    <option value="<=">&le;</option>
                    <option value=">=">&ge;</option>
                    <option value="=">=</option>
                  </select>

                  <input
                    type="number"
                    value={c.b}
                    onChange={e => updateConstraint(c.id, 'b', Number(e.target.value) || 0)}
                    className="w-16 bg-slate-900 border border-slate-800 px-2 py-1 rounded text-xs font-mono text-white text-center"
                    title="RHS b value"
                  />

                  {constraints.length > 1 && (
                    <button
                      onClick={() => removeConstraint(c.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition"
                      title="Delete constraint"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}

              <div className="text-xs text-slate-500 font-mono px-2 pt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Non-negativity restrictions applied: x₁ ≥ 0, x₂ ≥ 0
              </div>
            </div>
          </div>

          {/* Interactive Contour Slider */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Iso-Profit / Iso-Cost Line Sweep
              </span>
              <span className="font-mono text-amber-300 font-bold">
                Z = {Number(activeZ).toFixed(1)}
              </span>
            </div>

            <input
              type="range"
              min="0"
              max={Math.max((solution.optimalValue || 30) * 1.6, 60)}
              step="0.5"
              value={activeZ}
              onChange={e => setSliderZ(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>Z = 0</span>
              <span>Drag to observe contour line sweeping across vertices</span>
              <span>Max</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Plot & Solution Analysis */}
        <div className="lg:col-span-7 space-y-5">
          {/* Solution Status Banner */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between ${
              solution.status === 'optimal'
                ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                : solution.status === 'multiple_optimal'
                ? 'bg-amber-950/40 border-amber-800/80 text-amber-300'
                : solution.status === 'infeasible'
                ? 'bg-red-950/40 border-red-800/80 text-red-300'
                : 'bg-purple-950/40 border-purple-800/80 text-purple-300'
            }`}
          >
            <div className="flex items-center gap-3">
              {solution.status === 'optimal' ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-6 h-6" />
              )}
              <div>
                <div className="font-bold text-sm uppercase tracking-wide">
                  {solution.status === 'optimal' && 'Unique Optimal Solution'}
                  {solution.status === 'multiple_optimal' && 'Multiple (Alternate) Optimal Solutions'}
                  {solution.status === 'infeasible' && 'Infeasible Solution (Empty Region)'}
                  {solution.status === 'unbounded' && 'Unbounded Feasible Solution'}
                </div>
                <div className="text-xs opacity-80">
                  {solution.optimalValue !== null
                    ? `Optimal Value Z* = ${solution.optimalValue} at (${solution.optimalPoints.map(p => `${p.x}, ${p.y}`).join(') and (')})`
                    : 'No finite optimal solution exists for this system.'}
                </div>
              </div>
            </div>

            {solution.optimalValue !== null && (
              <div className="text-right font-mono">
                <span className="text-xs text-slate-400">Optimal Z</span>
                <div className="text-2xl font-black text-white">{solution.optimalValue}</div>
              </div>
            )}
          </div>

          {/* SVG Plot */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl overflow-hidden relative">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-2">
              <span className="font-semibold">Feasible Region & Constraint Graph</span>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500/50 inline-block border border-cyan-400" />
                  Feasible Area
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-amber-400 inline-block" />
                  Contour Z
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                  Optimal Point
                </span>
              </div>
            </div>

            <div className="w-full flex justify-center bg-slate-950 rounded-xl p-2 border border-slate-800/80">
              <svg width={svgWidth} height={svgHeight} className="overflow-visible select-none">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(51, 65, 85, 0.3)" strokeWidth="1" />
                  </pattern>
                </defs>

                {/* Grid */}
                <rect x={padding} y={padding} width={plotWidth} height={plotHeight} fill="url(#grid)" />

                {/* Axes */}
                <line
                  x1={padding}
                  y1={svgHeight - padding}
                  x2={svgWidth - padding + 15}
                  y2={svgHeight - padding}
                  stroke="#64748b"
                  strokeWidth="2"
                />
                <line
                  x1={padding}
                  y1={svgHeight - padding}
                  x2={padding}
                  y2={padding - 15}
                  stroke="#64748b"
                  strokeWidth="2"
                />

                {/* Axis Labels */}
                <text x={svgWidth - padding + 15} y={svgHeight - padding + 18} fill="#94a3b8" fontSize="11" fontFamily="monospace">
                  x₁
                </text>
                <text x={padding - 18} y={padding - 15} fill="#94a3b8" fontSize="11" fontFamily="monospace">
                  x₂
                </text>

                {/* Axis Ticks */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                  const valX = Math.round(maxDomainX * pct);
                  const valY = Math.round(maxDomainY * pct);
                  const xPos = scaleX(valX);
                  const yPos = scaleY(valY);

                  return (
                    <g key={i}>
                      {/* X tick */}
                      <line x1={xPos} y1={svgHeight - padding} x2={xPos} y2={svgHeight - padding + 5} stroke="#64748b" />
                      <text x={xPos} y={svgHeight - padding + 18} fill="#64748b" fontSize="10" textAnchor="middle" fontFamily="monospace">
                        {valX}
                      </text>

                      {/* Y tick */}
                      {i > 0 && (
                        <>
                          <line x1={padding - 5} y1={yPos} x2={padding} y2={yPos} stroke="#64748b" />
                          <text x={padding - 8} y={yPos + 3} fill="#64748b" fontSize="10" textAnchor="end" fontFamily="monospace">
                            {valY}
                          </text>
                        </>
                      )}
                    </g>
                  );
                })}

                {/* Feasible Polygon Fill */}
                {solution.feasiblePolygon.length > 2 && (
                  <polygon
                    points={solution.feasiblePolygon.map(p => `${scaleX(p.x)},${scaleY(p.y)}`).join(' ')}
                    fill="rgba(14, 165, 233, 0.25)"
                    stroke="rgba(56, 189, 248, 0.8)"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                )}

                {/* Constraint Boundary Lines */}
                {constraints.map((c, i) => {
                  const strokeColors = ['#ec4899', '#8b5cf6', '#10b981', '#f97316'];
                  const color = strokeColors[i % strokeColors.length];

                  // Points on boundary line a1*x1 + a2*x2 = b
                  // x1 = 0 -> x2 = b / a2
                  // x2 = 0 -> x1 = b / a1
                  let x1_start = 0;
                  let y1_start = c.a2 !== 0 ? c.b / c.a2 : 0;
                  let x2_end = c.a1 !== 0 ? c.b / c.a1 : 0;
                  let y2_end = 0;

                  if (c.a2 === 0 && c.a1 !== 0) {
                    // Vertical line x1 = b / a1
                    x1_start = c.b / c.a1;
                    y1_start = 0;
                    x2_end = c.b / c.a1;
                    y2_end = maxDomainY;
                  } else if (c.a1 === 0 && c.a2 !== 0) {
                    // Horizontal line x2 = b / a2
                    x1_start = 0;
                    y1_start = c.b / c.a2;
                    x2_end = maxDomainX;
                    y2_end = c.b / c.a2;
                  }

                  return (
                    <g key={c.id}>
                      <line
                        x1={scaleX(x1_start)}
                        y1={scaleY(y1_start)}
                        x2={scaleX(x2_end)}
                        y2={scaleY(y2_end)}
                        stroke={color}
                        strokeWidth="2"
                        opacity={0.85}
                      />
                    </g>
                  );
                })}

                {/* Active Iso-Profit / Iso-Cost Line: c1*x1 + c2*x2 = activeZ */}
                {c2 !== 0 && (
                  <line
                    x1={scaleX(0)}
                    y1={scaleY(activeZ / c2)}
                    x2={scaleX(c1 !== 0 ? activeZ / c1 : maxDomainX)}
                    y2={scaleY(0)}
                    stroke="#facc15"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                  />
                )}

                {/* Corner Points */}
                {solution.cornerPoints.map((pt, i) => {
                  const px = scaleX(pt.x);
                  const py = scaleY(pt.y);

                  return (
                    <g key={i}>
                      {pt.isOptimal ? (
                        <>
                          <circle cx={px} cy={py} r="9" fill="#10b981" opacity={0.3} className="animate-ping" />
                          <circle cx={px} cy={py} r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                          <text
                            x={px}
                            y={py - 12}
                            fill="#34d399"
                            fontSize="11"
                            fontWeight="bold"
                            textAnchor="middle"
                            fontFamily="monospace"
                          >
                            Optimum ({pt.x}, {pt.y}) Z={pt.z}
                          </text>
                        </>
                      ) : (
                        <>
                          <circle cx={px} cy={py} r="4.5" fill="#38bdf8" stroke="#0f172a" strokeWidth="1.5" />
                          <text
                            x={px + 8}
                            y={py - 6}
                            fill="#94a3b8"
                            fontSize="9"
                            fontFamily="monospace"
                          >
                            ({pt.x}, {pt.y})
                          </text>
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Corner Points Evaluation Table */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <span>Extreme Corner Points Evaluation</span>
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            </h3>

            {solution.cornerPoints.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Vertex Point</th>
                      <th className="py-2.5 px-3 font-semibold font-mono">x₁</th>
                      <th className="py-2.5 px-3 font-semibold font-mono">x₂</th>
                      <th className="py-2.5 px-3 font-semibold font-mono">Z = {c1}x₁ + {c2}x₂</th>
                      <th className="py-2.5 px-3 font-semibold">Evaluation Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {solution.cornerPoints.map((pt, index) => (
                      <tr
                        key={index}
                        className={`transition ${
                          pt.isOptimal ? 'bg-emerald-950/30 text-emerald-200' : 'text-slate-300 hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-2 px-3 font-bold font-sans">
                          Point {String.fromCharCode(65 + index)} ({pt.x}, {pt.y})
                        </td>
                        <td className="py-2 px-3">{pt.x}</td>
                        <td className="py-2 px-3">{pt.y}</td>
                        <td className="py-2 px-3 font-bold text-amber-300">
                          {c1}({pt.x}) + {c2}({pt.y}) = {pt.z}
                        </td>
                        <td className="py-2 px-3 font-sans">
                          {pt.isOptimal ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              OPTIMAL VERTEX
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Feasible Corner</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-xs text-slate-500 py-4 text-center">
                No feasible vertices found. The constraint set is infeasible.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
