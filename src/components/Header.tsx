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
        return 'CAMPUS HEROES';
      case 'admin':
        return 'ADMIN & SECURITY';
      case 'profile':
        return 'PROFILE';
      default:
        return 'PESCE MANDYA';
    }
  };

  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-[#f4f7f5]/90 backdrop-blur-xl border-b border-[#064e3b]/8 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="h-16 px-4 max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand & Crest with Back button when not on Home */}
        <div className="flex items-center gap-2 min-w-0">
          {activeTab !== 'home' && (
            <button
              onClick={goBack}
              className="w-9 h-9 -ml-1 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-slate-700 hover:text-emerald-700 hover:border-emerald-400 active:scale-95 transition-all cursor-pointer shrink-0"
              aria-label="Back to Previous Screen"
              title="Back"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer focus:outline-none"
          >
            <CampusPickLogo size="sm" />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-[#0b241c] text-[16px] leading-tight tracking-tight">
                  Campus Pick
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                  {INSTITUTION_INFO.shortName}
                </span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3d4a42]/80 truncate">
                {getSubTitle()}
              </span>
            </div>
          </button>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {/* Offline indicator / toggle */}
          {isOffline && (
            <button
              onClick={toggleOffline}
              className="px-2 py-1 bg-amber-100 text-amber-900 rounded-full text-[11px] font-bold flex items-center gap-1"
              title="You are offline. Tap to reconnect"
            >
              <span className="material-symbols-outlined text-[14px]">wifi_off</span>
              <span className="hidden sm:inline">Offline</span>
            </button>
          )}

          {/* Interactive Walkthrough Guide CTA */}
          <button
            onClick={openWalkthrough}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-[11px] font-bold active:scale-95 transition-all shadow-xs"
            title="Step through complete 8-Act end-to-end journey"
          >
            <span className="material-symbols-outlined text-[15px] text-emerald-600">route</span>
            <span>8-Act Demo</span>
          </button>

          {/* Map Shortcut */}
          <button
            onClick={() => setActiveTab('map')}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              activeTab === 'map'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/50 border border-slate-200 shadow-xs'
            }`}
            title="Campus Map"
            aria-label="Campus Map"
          >
            <span className="material-symbols-outlined text-[20px]">map</span>
          </button>

          {/* Student Messaging Window Shortcut */}
          <button
            onClick={() => setActiveTab('messages')}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/50 border border-slate-200 shadow-xs'
            }`}
            title="Messaging Window & Coordination"
            aria-label="Messaging Window"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={() => setActiveTab('notifications')}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/50 border border-slate-200 shadow-xs'
            }`}
            title="Notifications"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Admin / Security Desk Quick Access for Staff */}
          {currentUser && (currentUser.role === 'admin' || currentUser.role === 'security') && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-indigo-700 text-white shadow-sm ring-2 ring-indigo-300'
                  : 'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200 shadow-xs'
              }`}
              title={currentUser.role === 'admin' ? 'Administrator Command Center' : 'Campus Security Custody Desk'}
              aria-label="Staff Custody Center"
            >
              <span className="material-symbols-outlined text-[20px]">shield_person</span>
            </button>
          )}

          {/* Role & User Avatar Button */}
          {currentUser && (
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-1.5 p-1 rounded-full transition-all focus:outline-none shadow-xs group cursor-pointer ${
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
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-emerald-600/30"
                    src={currentUser.avatarUrl}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
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
              <span className="hidden md:inline text-xs font-semibold text-[#0b241c] pr-1.5 truncate max-w-[110px]">
                {currentUser.displayName}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
