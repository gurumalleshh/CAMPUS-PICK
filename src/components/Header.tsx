import React from 'react';
import { useApp } from '../context/AppContext';
import { CampusPickLogo } from './CampusPickLogo';
import { INSTITUTION_INFO } from '../mockData';

export const Header: React.FC = () => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    goBack,
    unreadCount,
    openWalkthrough,
    isOffline,
    toggleOffline,
    matches,
    openReportModal,
  } = useApp();

  const getSubTitle = () => {
    switch (activeTab) {
      case 'home':
        return 'HOME';
      case 'matches':
        return 'MATCHES';
      case 'map':
        return 'CAMPUS MAP';
      case 'notifications':
        return 'NOTIFICATIONS';
      case 'messages':
        return 'MESSAGES & CHAT';
      case 'heroes':
        return 'CAMPUS RANKING';
      case 'dashboard':
        return currentUser?.role === 'faculty' ? 'FACULTY DASHBOARD' : 'STUDENT DASHBOARD';
      case 'admin':
        return currentUser?.role === 'admin' ? 'ADMIN DASHBOARD' : 'SECURITY DASHBOARD';
      case 'profile':
        return 'PROFILE';
      default:
        return 'PESCE MANDYA';
    }
  };

  const pendingMatchesCount = matches.filter((m) => m.status === 'PENDING').length;

  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-[#f4f7f5]/95 backdrop-blur-xl border-b border-[#064e3b]/10 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="h-16 px-3 sm:px-6 lg:px-8 max-w-[1600px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Crest with Back button when not on Home */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1 sm:flex-initial">
          {activeTab !== 'home' && (
            <button
              onClick={goBack}
              className="w-8 h-8 sm:w-9 sm:h-9 -ml-0.5 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-slate-700 hover:text-emerald-700 hover:border-emerald-400 active:scale-95 transition-all cursor-pointer shrink-0"
              aria-label="Back to Previous Screen"
              title="Back"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">arrow_back</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 min-w-0 text-left cursor-pointer focus:outline-none"
          >
            <CampusPickLogo size="sm" />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-heading font-bold text-[#0b241c] text-sm sm:text-base leading-tight tracking-tight truncate">
                  Campus Pick
                </span>
                <span className="text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 shrink-0">
                  {INSTITUTION_INFO.shortName}
                </span>
              </div>
              <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-[#3d4a42]/80 truncate hidden md:block">
                {getSubTitle()}
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Bar (Visible on lg and above to prevent tablet cramping) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 px-2 py-1 rounded-2xl bg-white/80 border border-slate-200/80 shadow-2xs">
          {/* 1. Home */}
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-emerald-800 hover:bg-slate-100/70'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">home</span>
            <span>Home</span>
          </button>

          {/* 2. Dashboard */}
          {currentUser && (currentUser.role === 'admin' || currentUser.role === 'security') ? (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-indigo-800 hover:bg-indigo-50/70'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">shield_person</span>
              <span>Custody Desk</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-emerald-800 hover:bg-slate-100/70'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">dashboard</span>
              <span>Dashboard</span>
            </button>
          )}

          {/* 3. Matches */}
          <button
            onClick={() => setActiveTab('matches')}
            className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'matches'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-emerald-800 hover:bg-slate-100/70'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">join_inner</span>
            <span>Matches</span>
            {pendingMatchesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950">
                {pendingMatchesCount}
              </span>
            )}
          </button>

          {/* 4. Campus Ranking */}
          <button
            onClick={() => setActiveTab('heroes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'heroes'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-emerald-800 hover:bg-slate-100/70'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">military_tech</span>
            <span>Ranking</span>
          </button>

          {/* 5. Map */}
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'map'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-emerald-800 hover:bg-slate-100/70'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">map</span>
            <span>Map</span>
          </button>

          {/* 6. Messages */}
          <button
            onClick={() => setActiveTab('messages')}
            className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-emerald-800 hover:bg-slate-100/70'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">chat</span>
            <span>Chat</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </button>
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick "+ Report" CTA button on tablet & desktop */}
          <button
            onClick={() => openReportModal('LOST')}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer shrink-0"
            title="Report a Lost or Found item"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span className="hidden md:inline">Report Item</span>
            <span className="md:hidden">Report</span>
          </button>

          {/* Offline indicator / toggle */}
          {isOffline && (
            <button
              onClick={toggleOffline}
              className="px-2 py-1 bg-amber-100 text-amber-900 rounded-full text-[11px] font-bold flex items-center gap-1 shrink-0"
              title="You are offline. Tap to reconnect"
            >
              <span className="material-symbols-outlined text-[14px]">wifi_off</span>
              <span className="hidden sm:inline">Offline</span>
            </button>
          )}

          {/* Interactive Walkthrough Guide CTA */}
          <button
            onClick={openWalkthrough}
            className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-[11px] font-bold active:scale-95 transition-all shadow-2xs shrink-0"
            title="Step through complete 8-Act end-to-end journey"
          >
            <span className="material-symbols-outlined text-[15px] text-emerald-600">route</span>
            <span>8-Act Demo</span>
          </button>

          {/* Chat Shortcut on tablet only (on mobile it is in dashboard/matches) */}
          <button
            onClick={() => setActiveTab('messages')}
            className={`hidden sm:flex lg:hidden relative w-9 h-9 rounded-full items-center justify-center transition-all cursor-pointer shrink-0 ${
              activeTab === 'messages'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/50 border border-slate-200 shadow-xs'
            }`}
            title="Messaging Window & Coordination"
            aria-label="Messaging Window"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-white" />
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={() => setActiveTab('notifications')}
            className={`relative w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
              activeTab === 'notifications'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/50 border border-slate-200 shadow-xs'
            }`}
            title="Notifications"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[19px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-0.5 bg-rose-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Role & User Avatar Button */}
          {currentUser && (
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-1.5 p-0.5 sm:p-1 rounded-full transition-all focus:outline-none shadow-xs group cursor-pointer shrink-0 ${
                activeTab === 'profile'
                  ? 'bg-emerald-50 border-2 border-emerald-600 ring-2 ring-emerald-500/20'
                  : 'bg-white border border-slate-200 hover:border-emerald-300'
              }`}
              title={`Logged in as ${currentUser.displayName} (${currentUser.role.toUpperCase()}) • View Profile & Settings`}
              aria-label="User Profile"
            >
              <div className="relative">
                {currentUser.avatarUrl ? (
                  <img
                    alt={currentUser.displayName}
                    className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full object-cover ring-1 ring-emerald-600/30"
                    src={currentUser.avatarUrl}
                  />
                ) : (
                  <div className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                    {currentUser.displayName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                    currentUser.role === 'admin'
                      ? 'bg-indigo-600'
                      : currentUser.role === 'security'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                />
              </div>
              <div className="hidden xl:flex flex-col text-left pr-1.5 min-w-0">
                <span className="text-xs font-semibold text-[#0b241c] truncate max-w-[110px] leading-none">
                  {currentUser.displayName}
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider mt-0.5">
                  {currentUser.role}
                </span>
              </div>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
