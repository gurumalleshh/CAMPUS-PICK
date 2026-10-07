import React from 'react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none w-[92%] max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs sm:text-sm font-medium transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${
            toast.type === 'success'
              ? 'bg-slate-900 text-white border-slate-700/90 shadow-slate-950/20'
              : toast.type === 'error'
              ? 'bg-rose-950 text-rose-100 border-rose-800 shadow-rose-950/20'
              : toast.type === 'warning'
              ? 'bg-amber-950 text-amber-100 border-amber-800 shadow-amber-950/20'
              : 'bg-slate-900 text-white border-slate-700/90 shadow-slate-950/20'
          }`}
        >
          {toast.icon && (
            <span
              className={`material-symbols-outlined text-[20px] shrink-0 ${
                toast.type === 'success'
                  ? 'text-emerald-400'
                  : toast.type === 'error'
                  ? 'text-rose-400'
                  : toast.type === 'warning'
                  ? 'text-amber-400'
                  : 'text-indigo-400'
              }`}
            >
              {toast.icon}
            </span>
          )}
          <span className="leading-snug">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
