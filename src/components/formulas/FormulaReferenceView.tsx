import React, { useState } from 'react';
import { formulasData } from '../../data/formulaBank';
import { modulesData } from '../../data/syllabus';
import { MathView } from '../MathView';
import { useApp } from '../../context/AppContext';
import { Copy, Check, Search, BookOpen, Calculator, Sparkles } from 'lucide-react';

export const FormulaReferenceView: React.FC = () => {
  const { addToast } = useApp();
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredFormulas = formulasData.filter(f => {
    const matchMod = selectedModule === 'all' || f.moduleId === selectedModule;
    const matchQuery =
      searchQuery === '' ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      f.example.toLowerCase().includes(searchQuery.toLowerCase());
    return matchMod && matchQuery;
  });

  const handleCopy = (id: string, latex: string) => {
    navigator.clipboard.writeText(latex);
    setCopiedId(id);
    addToast('LaTeX formula copied to clipboard! 📋', 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl flex flex-wrap items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            Quick Reference Compendium
          </span>
          <h1 className="text-2xl md:text-3xl font-black font-heading text-white">
            Operations Research Formula Reference
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Essential mathematical equations, symbol meanings, and application examples organized by curriculum modules.
          </p>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Calculator className="w-8 h-8" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
        <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search formulas by name or tag (e.g. Simplex, MODI, Hungarian, Duality)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setSelectedModule('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedModule === 'all'
                ? 'bg-cyan-500 text-slate-950'
                : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
            }`}
          >
            All Modules
          </button>
          {modulesData.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedModule(m.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedModule === m.id
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
              }`}
            >
              {m.code}
            </button>
          ))}
        </div>
      </div>

      {/* Formulas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFormulas.map(formula => (
          <div
            key={formula.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                  {formula.moduleName}
                </span>

                <button
                  onClick={() => handleCopy(formula.id, formula.latex)}
                  className="flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                  title="Copy LaTeX String"
                >
                  {copiedId === formula.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy LaTeX</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <h3 className="text-base font-bold text-white font-heading">{formula.name}</h3>
              </div>

              {/* Formula Display */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center text-cyan-300 overflow-x-auto">
                <MathView math={formula.latex} block />
              </div>

              {/* Symbols Explanation */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Symbol Definitions:
                </div>
                <div className="grid grid-cols-1 gap-1 font-mono text-[11px] text-slate-300">
                  {formula.symbols.map((sym, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-2 bg-slate-950/40 p-1.5 rounded-lg border border-slate-800/40">
                      <span className="font-bold text-cyan-400 shrink-0">{sym.symbol}:</span>
                      <span className="text-slate-300 font-sans">{sym.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Usage Example */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs font-mono text-slate-300 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400 font-sans block">
                  Example Usage:
                </span>
                <p className="leading-relaxed">{formula.example}</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
              {formula.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
