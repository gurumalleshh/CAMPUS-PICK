import React from 'react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none w-[90%] max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${
            toast.type === 'success'
              ? 'bg-[#222022] text-[#C3D809] border-[#C3D809]/50 shadow-[#222022]/30'
              : toast.type === 'error'
              ? 'bg-rose-900 text-white border-rose-700 shadow-rose-950/20'
              : toast.type === 'warning'
              ? 'bg-amber-900 text-amber-50 border-amber-700 shadow-amber-950/20'
              : 'bg-[#222022] text-white border-white/20 shadow-slate-900/30'
          }`}
        >
          {toast.icon && (
            <span className="material-symbols-outlined text-[20px] text-[#C3D809] shrink-0">
              {toast.icon}
            </span>
          )}
          <span className="leading-snug">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
