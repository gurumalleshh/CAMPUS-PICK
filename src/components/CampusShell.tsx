import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { INSTITUTION_INFO } from '../mockData';
import { BottomNav } from './BottomNav';

interface CampusShellProps {
  children: React.ReactNode;
  onOpenCommandPalette: () => void;
}

export const CampusShell: React.FC<CampusShellProps> = ({
  children,
  onOpenCommandPalette,
}) => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    unreadCount,
    reports,
    openReportModal,
    switchUserRole,
    triggerToast,
    matches,
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const inCustodyCount = reports.filter((r) => r.type === 'FOUND' && r.status !== 'RETURNED').length;
  const highConfidenceMatchesCount = matches.filter((m) => m.confidenceScore >= 75 && m.status !== 'RESOLVED').length;

  const primaryNavItems = [
    { id: 'home', label: 'Campus Radar', icon: 'radar', badge: null },
    { id: 'search', label: 'Intel & Search', icon: 'search', badge: null },
    {
      id: 'matches',
      label: 'Correlations',
      icon: 'hub',
      badge: highConfidenceMatchesCount > 0 ? `${highConfidenceMatchesCount} MATCH` : null,
      highlight: highConfidenceMatchesCount > 0,
    },
    { id: 'map', label: 'Spatial Blueprint', icon: 'map', badge: 'LIVE' },
    { id: 'heroes', label: 'Honor Roll', icon: 'military_tech', badge: null },
    { id: 'messages', label: 'Handover Escrow', icon: 'handshake', badge: null },
  ];

  if (currentUser?.role === 'admin' || currentUser?.role === 'security') {
    primaryNavItems.push({
      id: 'admin',
      label: 'Custody Desk',
      icon: 'local_police',
      badge: `${inCustodyCount} VAULT`,
      highlight: true,
    });
  }

  const roleList = [
    { key: 'student_sarah' as const, name: 'Sarah J.', sub: 'Student Owner (CS Lab)', role: 'student', id: 'usr_sarah', dept: 'CS & Eng' },
    { key: 'student_rahul' as const, name: 'Rahul K.', sub: 'Student Finder (Campus Hero)', role: 'student', id: 'usr_rahul', dept: 'Mechanical' },
    { key: 'security_nair' as const, name: 'Officer R. Nair', sub: 'Gate 1 Custody Officer', role: 'security', id: 'usr_nair', dept: 'Campus Security' },
    { key: 'admin_shivakumar' as const, name: 'Dr. N. Shivakumar', sub: 'Dean Student Welfare', role: 'admin', id: 'usr_admin', dept: 'Administration' },
    { key: 'faculty_divya' as const, name: 'Prof. Divya R.', sub: 'Faculty Custodian', role: 'faculty', id: 'usr_divya', dept: 'Basic Sciences' },
  ];

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col font-sans selection:bg-indigo-600/30 selection:text-white relative">
      {/* Dynamic Ambient Mesh Light Overlays */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-cyan-600/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-rose-600/6 rounded-full blur-[140px] pointer-events-none" />
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          1. TOP PRECISION COMMAND DECK (DESKTOP / LAPTOP / TABLET)
      ───────────────────────────────────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#090E1A]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl shadow-black/60 py-2.5'
            : 'bg-[#070B14]/80 backdrop-blur-md border-b border-white/[0.05] py-3.5'
        }`}
      >
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left Brand & Institutional Telemetry */}
          <div className="flex items-center gap-3.5 shrink-0">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-3 group text-left cursor-pointer focus-ring rounded-2xl"
              title="Return to Campus Radar"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-600/25 group-hover:shadow-indigo-500/40 transition-all duration-300">
                  <div className="w-full h-full bg-[#090E1A] rounded-[15px] flex items-center justify-center font-black text-white text-base tracking-wider">
                    CP
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#090E1A] animate-pulse" />
              </div>

              <div className="min-w-0 hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-black text-sm tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                    CAMPUS PICK
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-400/20 font-bold uppercase tracking-wider">
                    PESCE
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 font-medium">
                  <span className="truncate">{INSTITUTION_INFO.shortName}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span className="text-emerald-400 font-mono text-xs font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    {inCustodyCount} In Vault
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Center Precision Segmented Navigation Deck (Desktop & Tablet) */}
          <nav className="hidden lg:flex items-center p-1 rounded-2xl bg-[#0E1626]/90 border border-white/[0.08] shadow-inner shadow-black/40">
            {primaryNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[18px] transition-transform ${
                      isActive ? 'scale-110 text-white' : 'text-slate-400'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.highlight
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/25'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Cluster & Persona Hub */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Command Search Trigger Button */}
            <button
              onClick={onOpenCommandPalette}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0E1626]/80 hover:bg-[#152036] border border-white/[0.07] text-slate-400 hover:text-slate-200 text-xs transition-all cursor-pointer shadow-xs"
              title="Global Command Palette (Ctrl+K or ⌘K)"
            >
              <span className="material-symbols-outlined text-[16px] text-indigo-400">search</span>
              <span className="text-[11px] font-medium hidden xl:inline">Search / Jump</span>
              <kbd className="text-[10px] font-mono bg-black/40 px-1.5 py-0.5 rounded border border-white/10 text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Dual Primary Intent Launchers */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => openReportModal('LOST')}
                className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500/20 to-rose-600/10 hover:from-rose-500 hover:to-rose-600 text-rose-300 hover:text-white border border-rose-500/35 hover:border-rose-400 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer group"
                title="Report a lost item on campus"
              >
                <span className="material-symbols-outlined text-[17px] text-rose-400 group-hover:text-white transition-colors">
                  search_off
                </span>
                <span className="hidden sm:inline">Report Lost</span>
                <span className="sm:hidden">Lost</span>
              </button>

              <button
                onClick={() => openReportModal('FOUND')}
                className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-600/10 hover:from-emerald-500 hover:to-teal-600 text-emerald-300 hover:text-white border border-emerald-500/35 hover:border-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer group"
                title="Surrender or report a found item"
              >
                <span className="material-symbols-outlined text-[17px] text-emerald-400 group-hover:text-white transition-colors">
                  volunteer_activism
                </span>
                <span className="hidden sm:inline">Report Found</span>
                <span className="sm:hidden">Found</span>
              </button>
            </div>

            {/* Notifications Trigger */}
            <button
              onClick={() => setActiveTab('notifications')}
              aria-label={unreadCount > 0 ? `Campus Broadcasts & Alerts (${unreadCount} unread notices)` : 'Campus Broadcasts & Alerts'}
              className={`p-2 rounded-xl border transition-all cursor-pointer relative ${
                activeTab === 'notifications'
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                  : 'bg-[#0E1626]/80 hover:bg-[#152036] border-white/[0.08] text-slate-300'
              }`}
              title="Campus Broadcasts & Alerts"
            >
              <span className="material-symbols-outlined text-[19px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white rounded-full text-xs font-mono font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Persona Switcher Pill / Profile Button */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl bg-[#0E1626]/80 hover:bg-[#152036] border border-white/[0.08] transition-all cursor-pointer select-none"
                title="Active Profile & Role Switcher"
              >
                <div className="relative shrink-0">
                  <img
                    src={currentUser?.avatarUrl}
                    alt={currentUser?.displayName}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1 ring-indigo-400/40"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#070B14]" />
                </div>
                <div className="hidden md:block text-left min-w-0 pr-1">
                  <p className="font-bold text-xs sm:text-sm text-white truncate leading-tight">
                    {currentUser?.displayName}
                  </p>
                  <p className="text-xs font-mono text-indigo-300 truncate">
                    {currentUser?.identifier || currentUser?.role.toUpperCase()}
                  </p>
                </div>
                <span className="material-symbols-outlined text-[16px] text-slate-400">
                  {isRoleDropdownOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {/* Persona Switcher Flyout Modal / Popover */}
              {isRoleDropdownOpen && (
                <div className="absolute right-0 top-12 w-72 sm:w-80 bg-[#0E1626] border border-white/[0.12] rounded-3xl p-3 shadow-2xl shadow-black/80 space-y-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-white/[0.06]">
                    <div>
                      <span className="text-xs font-black uppercase text-indigo-400 tracking-wider block">
                        CAMPUS IDENTITY HUB
                      </span>
                      <span className="text-xs text-slate-400">Switch Active Demo Role</span>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setIsRoleDropdownOpen(false);
                      }}
                      className="text-xs text-indigo-300 hover:text-white font-bold underline cursor-pointer"
                    >
                      View Passport
                    </button>
                  </div>

                  <div className="space-y-1">
                    {roleList.map((r) => {
                      const isCurrent = currentUser?.id === r.id;
                      return (
                        <button
                          key={r.key}
                          onClick={() => {
                            switchUserRole(r.key);
                            setIsRoleDropdownOpen(false);
                            triggerToast(`Switched active perspective to ${r.name}`, 'verified_user', 'success');
                          }}
                          className={`w-full p-2.5 rounded-2xl text-left flex items-center justify-between transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                              : 'hover:bg-white/[0.05] text-slate-300'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs sm:text-sm truncate">{r.name}</span>
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold uppercase ${
                                  isCurrent ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'
                                }`}
                              >
                                {r.role}
                              </span>
                            </div>
                            <p
                              className={`text-xs truncate mt-0.5 ${
                                isCurrent ? 'text-indigo-200' : 'text-slate-400'
                              }`}
                            >
                              {r.sub}
                            </p>
                          </div>
                          {isCurrent && (
                            <span className="material-symbols-outlined text-[18px] text-white shrink-0">
                              check_circle
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#0E1626] border border-white/[0.08] text-slate-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Expandable Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#0A0F1D] border-b border-white/[0.08] px-4 py-4 space-y-3 animate-in fade-in">
            <div className="grid grid-cols-2 gap-2 pb-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openReportModal('LOST');
                }}
                className="py-3 px-3 rounded-2xl bg-rose-600/20 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">search_off</span>
                <span>Report Lost</span>
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openReportModal('FOUND');
                }}
                className="py-3 px-3 rounded-2xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
                <span>Report Found</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {primaryNavItems.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    setActiveTab(n.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-xl flex items-center justify-between text-xs font-semibold ${
                    activeTab === n.id
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-white/[0.03] text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">{n.icon}</span>
                    <span>{n.label}</span>
                  </div>
                  {n.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20 text-white font-bold">
                      {n.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. MAIN CONTENT STAGE (FULL VIEWPORT CANVAS)
      ───────────────────────────────────────────────────────────────────────────── */}
      <main className="flex-1 w-full relative z-10 pb-20 lg:pb-0">
        {children}
      </main>

      {/* ─────────────────────────────────────────────────────────────────────────────
          3. ERGONOMIC BOTTOM DOCK (MOBILE & TABLET VIEWPORT)
      ───────────────────────────────────────────────────────────────────────────── */}
      <BottomNav onOpenCommandPalette={onOpenCommandPalette} />
    </div>
  );
};
