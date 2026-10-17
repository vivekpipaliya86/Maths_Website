import React, { useState, useMemo } from 'react';
import { convertPrimalToDual, PrimalInput } from '../../utils/solvers/primalDual';
import { RefreshCw, ArrowRightLeft, Sparkles } from 'lucide-react';
import { MathView } from '../MathView';

export const PrimalDualView: React.FC = () => {
  const [primalType, setPrimalType] = useState<'max' | 'min'>('max');
  const [c1, setC1] = useState<number>(40);
  const [c2, setC2] = useState<number>(30);

  const [constraints, setConstraints] = useState([
    { coeffs: [2, 1], operator: '<=' as const, rhs: 40 },
    { coeffs: [1, 2], operator: '<=' as const, rhs: 50 },
    { coeffs: [1, 1], operator: '<=' as const, rhs: 30 },
  ]);

  const primalInput: PrimalInput = useMemo(() => {
    return {
      type: primalType,
      objectiveCoeffs: [c1, c2],
      constraints,
    };
  }, [primalType, c1, c2, constraints]);

  const dualResult = useMemo(() => {
    return convertPrimalToDual(primalInput);
  }, [primalInput]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
          <span>Primal-Dual LPP Conversion Engine</span>
          <span className="text-xs bg-indigo-500/20 text-indigo-300 font-mono px-2 py-0.5 rounded-full border border-indigo-500/30">
            Duality & Shadow Prices
          </span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Transposes coefficient matrices, inverts objective goals, derives shadow prices y_i, and explains complementary slackness.
        </p>
      </div>

      {/* Side-by-Side Primal vs Dual comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primal Card */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Primal Problem (P)
            </span>
            <span className="text-xs font-mono text-slate-400">Direct Physical System</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
            <div className="text-white font-bold text-sm">
              {primalType === 'max' ? 'Maximize' : 'Minimize'} Z = {c1}x₁ + {c2}x₂
            </div>

            <div className="text-slate-300 space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="text-slate-400 font-sans text-[11px] uppercase font-bold">Constraints:</div>
              {constraints.map((c, i) => (
                <div key={i}>
                  {c.coeffs[0]}x₁ + {c.coeffs[1]}x₂ {c.operator} {c.rhs}
                </div>
              ))}
              <div className="text-slate-500 pt-1">x₁, x₂ &ge; 0</div>
            </div>
          </div>

          <div className="text-xs text-slate-400 leading-relaxed">
            The primal problem solves for physical production quantities x₁ and x₂ to maximize total profit subject to resource capacities.
          </div>
        </div>

        {/* Dual Card */}
        <div className="bg-slate-900 border border-indigo-900/60 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Dual Problem (D)
            </span>
            <span className="text-xs font-mono text-slate-400">Economic Valuation / Shadow Prices</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-indigo-900/50 space-y-3 font-mono text-xs">
            <div className="text-white font-bold text-sm">
              {dualResult.dualType === 'max' ? 'Maximize' : 'Minimize'} W ={' '}
              {dualResult.dualObjectiveCoeffs.map((c, i) => `${c}y${i + 1}`).join(' + ')}
            </div>

            <div className="text-slate-300 space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="text-slate-400 font-sans text-[11px] uppercase font-bold">Dual Constraints:</div>
              {dualResult.dualConstraints.map((dc, i) => (
                <div key={i}>
                  {dc.coeffs.map((val, idx) => `${val}y${idx + 1}`).join(' + ')} {dc.operator} {dc.rhs}
                </div>
              ))}
              <div className="text-slate-500 pt-1">
                {dualResult.dualVariables.map(v => `${v.name} &ge; 0`).join(', ')}
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 leading-relaxed">
            The dual problem computes the marginal economic value (shadow price y_i) of each resource to minimize imputed valuation.
          </div>
        </div>
      </div>

      {/* Conversion Rules Breakdown */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Symmetric Duality Transformation Rules Applied:</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono text-slate-400">
          {dualResult.explanationSteps.map((step, idx) => (
            <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 leading-relaxed">
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
