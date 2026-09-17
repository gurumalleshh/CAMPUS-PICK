import React from 'react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    matches,
    unreadCount,
    openReportModal,
    currentUser,
  } = useApp();

  const pendingMatchesCount = matches.filter((m) => m.status === 'PENDING').length;

  if (!currentUser) return null;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 w-full z-40 bg-[#f4f7f5]/95 backdrop-blur-xl border-t border-[#064e3b]/10 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="h-16 max-w-xl mx-auto flex items-center justify-between px-2">
        {/* 1. HOME */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex-1 min-w-0 flex flex-col items-center justify-center h-full py-1 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl ${
            activeTab === 'home'
              ? 'text-emerald-700 font-bold scale-102'
              : 'text-slate-600 hover:text-[#0b241c]'
          }`}
          title="Home Dashboard"
          aria-label="Home"
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: activeTab === 'home' ? "'FILL' 1" : "'FILL' 0" }}
          >
            home
          </span>
          <span className="text-[10px] tracking-tight font-medium truncate w-full text-center mt-0.5">
            Home
          </span>
        </button>

        {/* 2. DASHBOARD (ROLE SPECIFIC: ADMIN/SECURITY DESK OR STUDENT/FACULTY GENERAL DASHBOARD) */}
        {currentUser.role === 'admin' || currentUser.role === 'security' ? (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex-1 min-w-0 flex flex-col items-center justify-center h-full py-1 transition-all cursor-pointer relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl ${
              activeTab === 'admin'
                ? 'text-indigo-700 font-bold scale-102'
                : 'text-slate-600 hover:text-indigo-900'
            }`}
            title="Institutional & Custodial Dashboard"
            aria-label="Dashboard"
          >
            <div className="relative">
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: activeTab === 'admin' ? "'FILL' 1" : "'FILL' 0" }}
              >
                dashboard
              </span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-600 rounded-full ring-1 ring-white" />
            </div>
            <span className="text-[10px] tracking-tight font-medium truncate w-full text-center mt-0.5">
              Dashboard
            </span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 min-w-0 flex flex-col items-center justify-center h-full py-1 transition-all cursor-pointer relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl ${
              activeTab === 'dashboard'
                ? 'text-emerald-700 font-bold scale-102'
                : 'text-slate-600 hover:text-[#0b241c]'
            }`}
            title={currentUser.role === 'faculty' ? 'Faculty Departmental Dashboard' : 'Student Campus Dashboard'}
            aria-label="Dashboard"
          >
            <div className="relative">
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: activeTab === 'dashboard' ? "'FILL' 1" : "'FILL' 0" }}
              >
                dashboard
              </span>
            </div>
            <span className="text-[10px] tracking-tight font-medium truncate w-full text-center mt-0.5">
              Dashboard
            </span>
          </button>
        )}

        {/* 3. CENTER ACTION: REPORT */}
        <button
          onClick={() => openReportModal('LOST')}
          className="flex-1 min-w-0 flex flex-col items-center justify-center h-full py-1 group transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl"
          title="Report Lost or Found Item"
          aria-label="Report Item"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-sm group-hover:scale-105 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[20px]">add</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-800 tracking-tight truncate w-full text-center mt-0.5">
            Report
          </span>
        </button>

        {/* 4. MATCHES */}
        <button
          onClick={() => setActiveTab('matches')}
          className={`flex-1 min-w-0 flex flex-col items-center justify-center h-full py-1 transition-all cursor-pointer relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl ${
            activeTab === 'matches'
              ? 'text-emerald-700 font-bold scale-102'
              : 'text-slate-600 hover:text-[#0b241c]'
          }`}
          title="Potential Matches"
          aria-label="Matches"
        >
          <div className="relative">
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: activeTab === 'matches' ? "'FILL' 1" : "'FILL' 0" }}
            >
              join_inner
            </span>
            {pendingMatchesCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] px-0.5 bg-emerald-600 text-white rounded-full text-[8.5px] font-bold flex items-center justify-center shadow-xs">
                {pendingMatchesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight font-medium truncate w-full text-center mt-0.5">
            Matches
          </span>
        </button>

        {/* 5. RANKING */}
        <button
          onClick={() => setActiveTab('heroes')}
          className={`flex-1 min-w-0 flex flex-col items-center justify-center h-full py-1 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl ${
            activeTab === 'heroes'
              ? 'text-emerald-700 font-bold scale-102'
              : 'text-slate-600 hover:text-[#0b241c]'
          }`}
          title="Campus Ranking & Leaderboard"
          aria-label="Ranking"
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: activeTab === 'heroes' ? "'FILL' 1" : "'FILL' 0" }}
          >
            leaderboard
          </span>
          <span className="text-[10px] tracking-tight font-medium truncate w-full text-center mt-0.5">
            Ranking
          </span>
        </button>
      </div>
    </nav>
  );
};
