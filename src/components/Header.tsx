import React from 'react';
import { useApp } from '../context/AppContext';
import { CampusPickLogo } from './CampusPickLogo';
import { INSTITUTION_INFO } from '../mockData';

interface HeaderProps {
  onOpenCommandPalette?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCommandPalette }) => {
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
    reports,
    openReportModal,
  } = useApp();

  const getSubTitle = () => {
    switch (activeTab) {
      case 'home':
        return 'Campus Lost & Found';
      case 'matches':
        return 'Correlation Matrix';
      case 'map':
        return 'Living Campus Map';
      case 'notifications':
        return 'Notification Center';
      case 'messages':
        return 'Handover Coordination & Chat';
      case 'heroes':
        return 'Campus Heroes & Civic Ranks';
      case 'dashboard':
        return currentUser?.role === 'faculty' ? 'Faculty Departmental Console' : 'Student Lost & Found Portal';
      case 'admin':
        return currentUser?.role === 'admin' ? 'Administrative Command Center' : 'Campus Security Custody Desk';
      case 'profile':
        return 'User Profile & Settings';
      default:
        return 'PESCE Mandya';
    }
  };

  const pendingMatchesCount = matches.filter((m) => m.status === 'PENDING').length;
  const itemsInCustodyCount = reports.filter((r) => r.type === 'FOUND' && r.status !== 'RETURNED').length;

  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="h-16 px-3 sm:px-6 lg:px-8 max-w-[1600px] mx-auto flex items-center justify-between gap-3 sm:gap-4">
        {/* Brand & Institution Badge with Back button when navigated away */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 shrink-0">
          {activeTab !== 'home' && (
            <button
              onClick={goBack}
              className="w-8.5 h-8.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all shadow-2xs flex items-center justify-center cursor-pointer shrink-0"
              aria-label="Back to Previous Screen"
              title="Back"
            >
              <span className="material-symbols-outlined text-[19px]">arrow_back</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer focus:outline-none group"
          >
            <CampusPickLogo size="sm" animate={true} />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-slate-900 text-sm sm:text-base leading-tight tracking-tight truncate group-hover:text-indigo-600 transition-colors">
                  Campus Pick
                </span>
                <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 shrink-0 hidden xs:inline-block">
                  {INSTITUTION_INFO.shortName}
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 truncate hidden md:block">
                {getSubTitle()}
              </span>
            </div>
          </button>
        </div>

        {/* Center: Command Palette Trigger Button (⌘K) */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="hidden md:flex items-center justify-between gap-3 px-3.5 py-1.5 rounded-2xl bg-slate-100/80 hover:bg-slate-100 border border-slate-200/80 text-slate-500 hover:text-slate-800 text-xs font-medium transition-all max-w-xs xl:max-w-sm w-full cursor-pointer shadow-2xs"
          title="Search items, locations, reports, or commands (⌘K / Ctrl+K)"
        >
          <div className="flex items-center gap-2 truncate">
            <span className="material-symbols-outlined text-indigo-600 text-[18px]">search</span>
            <span className="truncate">Search items, locations, or commands...</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-white border border-slate-200 text-slate-500 rounded shadow-2xs">
              ⌘K
            </kbd>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 px-1.5 py-1 rounded-2xl bg-slate-100/70 border border-slate-200/70 shadow-2xs">
          {/* 1. Home */}
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">home</span>
            <span>Feed</span>
          </button>

          {/* 2. Matches */}
          <button
            onClick={() => setActiveTab('matches')}
            className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'matches'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">hub</span>
            <span>Matches</span>
            {pendingMatchesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                {pendingMatchesCount}
              </span>
            )}
          </button>

          {/* 3. Map */}
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'map'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">map</span>
            <span>Map</span>
          </button>

          {/* 4. Heroes */}
          <button
            onClick={() => setActiveTab('heroes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'heroes'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">military_tech</span>
            <span>Heroes</span>
          </button>

          {/* 5. Messages / Coordination */}
          <button
            onClick={() => setActiveTab('messages')}
            className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">chat</span>
            <span>Chat</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          </button>
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile search trigger */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="md:hidden w-8.5 h-8.5 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 cursor-pointer shadow-2xs"
            title="Search (⌘K)"
          >
            <span className="material-symbols-outlined text-[19px]">search</span>
          </button>

          {/* Quick "+ Report" CTA button */}
          <button
            onClick={() => openReportModal('LOST')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-2xs active:scale-95 transition-all cursor-pointer shrink-0"
            title="Report a Lost or Found item"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>Report Item</span>
          </button>

          {/* Live Gate 1 Custody Status Pill */}
          <button
            onClick={() => {
              if (currentUser?.role === 'admin' || currentUser?.role === 'security') {
                setActiveTab('admin');
              } else {
                setActiveTab('map');
              }
            }}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-semibold hover:bg-emerald-100/70 transition-all cursor-pointer shrink-0 shadow-2xs"
            title="Gate 1 Security Custody Live Count"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Gate 1: {itemsInCustodyCount} in custody</span>
          </button>

          {/* Offline indicator */}
          {isOffline && (
            <button
              onClick={toggleOffline}
              className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-semibold flex items-center gap-1 shrink-0"
              title="You are offline. Tap to reconnect"
            >
              <span className="material-symbols-outlined text-[14px]">wifi_off</span>
              <span className="hidden sm:inline">Offline</span>
            </button>
          )}

          {/* Interactive Walkthrough Guide CTA */}
          <button
            onClick={openWalkthrough}
            className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 text-xs font-medium active:scale-95 transition-all shadow-2xs shrink-0 cursor-pointer"
            title="Step through complete 8-Act end-to-end journey"
          >
            <span className="material-symbols-outlined text-[16px] text-indigo-600">route</span>
            <span>8-Act Demo</span>
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={() => setActiveTab('notifications')}
            className={`relative w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
              activeTab === 'notifications'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-2xs'
            }`}
            title="Notifications & Alerts"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[19px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Role & User Avatar Button */}
          {currentUser && (
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-full sm:rounded-xl transition-all focus:outline-none cursor-pointer shrink-0 ${
                activeTab === 'profile'
                  ? 'bg-indigo-50 border border-indigo-200'
                  : 'bg-white border border-slate-200 hover:border-slate-300'
              }`}
              title={`Logged in as ${currentUser.displayName} (${currentUser.role.toUpperCase()}) • View Profile & Settings`}
              aria-label="User Profile"
            >
              <div className="relative">
                {currentUser.avatarUrl ? (
                  <img
                    alt={currentUser.displayName}
                    className="w-7.5 h-7.5 rounded-full object-cover ring-1 ring-slate-200"
                    src={currentUser.avatarUrl}
                  />
                ) : (
                  <div className="w-7.5 h-7.5 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {currentUser.displayName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                    currentUser.role === 'admin'
                      ? 'bg-slate-900'
                      : currentUser.role === 'security'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                />
              </div>
              <div className="hidden xl:flex flex-col text-left pr-1 min-w-0">
                <span className="text-xs font-semibold text-slate-900 truncate max-w-[110px] leading-tight">
                  {currentUser.displayName}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
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
