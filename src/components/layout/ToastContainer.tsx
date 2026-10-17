import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-16 lg:bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => {
        let icon = <Info className="w-4 h-4 text-cyan-400 shrink-0" />;
        let borderClass = 'border-cyan-500/30 bg-slate-900/90 text-slate-200';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
          borderClass = 'border-emerald-500/40 bg-slate-900/90 text-emerald-200';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
          borderClass = 'border-rose-500/40 bg-slate-900/90 text-rose-200';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border shadow-xl backdrop-blur-md text-xs font-semibold animate-slide-up max-w-sm ${borderClass}`}
          >
            {icon}
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};
