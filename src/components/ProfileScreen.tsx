import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { INSTITUTION_INFO } from '../mockData';

type ProfileTab = 'cases' | 'matches' | 'history' | 'security';

export const ProfileScreen: React.FC = () => {
  const {
    currentUser,
    logout,
    reports,
    matches,
    setSelectedMatch,
    openCertModal,
    setActiveTab,
    triggerToast,
    switchUserRole,
    isOffline,
    toggleOffline,
  } = useApp();

  const [activeTab, setActiveTabState] = useState<ProfileTab>('cases');

  if (!currentUser) return null;

  // Filter reports belonging to current user
  const userReports = useMemo(() => {
    return reports.filter((r) => r.reporterId === currentUser.id);
  }, [reports, currentUser]);

  // Filter matches involving current user
  const userMatches = useMemo(() => {
    return matches.filter(
      (m) =>
        m.lostReport.reporterId === currentUser.id ||
        m.foundReport.reporterId === currentUser.id
    );
  }, [matches, currentUser]);

  // Historical verified returns
  const userVerifiedReturns = useMemo(() => {
    return reports.filter(
      (r) =>
        (r.reporterId === currentUser.id || r.id === 'rep_001') &&
        (r.status === 'RETURNED' || r.status === 'OWNER_CONFIRMED')
    );
  }, [reports, currentUser]);

  return (
    <div className="min-h-screen pb-28 lg:pb-16 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-12 max-w-[1700px] mx-auto space-y-8 font-sans select-none">
      {/* ─────────────────────────────────────────────────────────────────────────────
          1. DIGITAL CAMPUS PASSPORT DOSSIER (HERO CARD)
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#0D1B2A] to-[#0A1128] border-2 border-indigo-500/35 p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.displayName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-2 ring-indigo-400 shadow-2xl"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0F172A] flex items-center justify-center text-white text-[12px]">
                <span className="material-symbols-outlined text-[14px]">check</span>
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  {currentUser.role.toUpperCase()} PASSPORT
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  ✓ VERIFIED USN
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
                {currentUser.displayName}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 font-mono">
                {currentUser.identifier} • {currentUser.department}
              </p>
              <p className="text-[11px] text-slate-400">{INSTITUTION_INFO.fullName}</p>
            </div>
          </div>

          {/* Civic Standing Metrics */}
          <div className="flex items-center gap-3 bg-[#080D1A]/90 p-4 rounded-2xl border border-white/[0.08] shadow-xl">
            <div className="text-center px-3 border-r border-white/[0.08]">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Returns</span>
              <span className="text-xl font-mono font-black text-emerald-400">
                {currentUser.successfullyReturnedItems}
              </span>
            </div>
            <div className="text-center px-3 border-r border-white/[0.08]">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Points</span>
              <span className="text-xl font-mono font-black text-amber-400">{currentUser.points}</span>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Civic Rank</span>
              <span className="text-xl font-mono font-black text-indigo-300">#{currentUser.rank}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons on Passport */}
        <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => openCertModal()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
              <span>View Dean's Commendation Certificate</span>
            </button>
            <button
              onClick={() => setActiveTab('heroes')}
              className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 text-xs font-semibold cursor-pointer"
            >
              Inspect Honor Roll
            </button>
          </div>

          <button
            onClick={() => {
              logout();
              triggerToast('Signed out of Campus Pick session', 'logout', 'info');
            }}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. DOSSIER TABS
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-4">
        {[
          { id: 'cases', label: `My Active Cases (${userReports.length})`, icon: 'folder_open' },
          { id: 'matches', label: `Correlations (${userMatches.length})`, icon: 'hub' },
          { id: 'history', label: `Return Ledger (${userVerifiedReturns.length})`, icon: 'history' },
          { id: 'security', label: 'Persona & System Settings', icon: 'tune' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabState(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-[#0E1626] text-slate-400 hover:text-white border border-white/[0.05]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          3. TAB 1: MY ACTIVE CASES
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'cases' && (
        <div className="space-y-4 animate-in fade-in">
          {userReports.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#090E1A] border border-white/[0.06] space-y-2">
              <span className="material-symbols-outlined text-[40px] text-slate-600">inbox</span>
              <h3 className="text-sm font-bold text-white">No active cases registered</h3>
              <p className="text-xs text-slate-400">All your reported belongings have been safely resolved.</p>
            </div>
          ) : (
            userReports.map((report) => {
              const isLost = report.type === 'LOST';
              return (
                <div
                  key={report.id}
                  className="p-5 rounded-3xl bg-[#090E1A] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={
                        report.publicPhotoUrl ||
                        report.imageUrl ||
                        'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=300&auto=format&fit=crop&q=80'
                      }
                      alt={report.itemName}
                      className="w-16 h-16 rounded-2xl object-cover ring-1 ring-white/10 shrink-0"
                    />
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-mono font-bold uppercase px-2 py-0.5 rounded ${
                            isLost ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {report.type} REPORT #{report.ticketNumber}
                        </span>
                        <span className="text-xs text-slate-500">• {report.eventTime || 'Today'}</span>
                      </div>
                      <h4 className="text-base font-bold text-white truncate">{report.itemName}</h4>
                      <p className="text-xs text-slate-400 truncate">
                        {report.location.building} • {report.location.room}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => {
                        const m = matches.find(
                          (match) => match.lostReportId === report.id || match.foundReportId === report.id
                        );
                        if (m) {
                          setSelectedMatch(m);
                          setActiveTab('matches');
                        } else {
                          triggerToast('No active match correlations yet', 'search', 'info');
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Track Radar Status
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          4. TAB 2: CORRELATIONS
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'matches' && (
        <div className="space-y-4 animate-in fade-in">
          {userMatches.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#090E1A] border border-white/[0.06] space-y-2">
              <span className="material-symbols-outlined text-[40px] text-slate-600">hub</span>
              <h3 className="text-sm font-bold text-white">No active correlations in queue</h3>
              <p className="text-xs text-slate-400">The radar scans automatically when new items are logged.</p>
            </div>
          ) : (
            userMatches.map((m) => (
              <div
                key={m.id}
                className="p-5 rounded-3xl bg-[#090E1A] border-2 border-indigo-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                      {m.confidenceScore}% HIGH CORRELATION
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Case #{m.lostReport.ticketNumber}</span>
                  </div>
                  <h4 className="text-lg font-heading font-black text-white mt-1">
                    {m.lostReport.itemName} ⇄ Gate 1 Vault Custody
                  </h4>
                  <p className="text-xs text-slate-400">
                    Physical correlation logged between CS-204 AI Lab and Gate 1 Post.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedMatch(m);
                    setActiveTab('matches');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 cursor-pointer shrink-0"
                >
                  Open Forensic Inspector →
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          5. TAB 3: VERIFIED RETURN HISTORY
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'history' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200">
            <span className="font-bold text-white block mb-0.5">Immutable Return Attestation:</span>
            Every return recorded below was physically verified by campus security and confirmed by both owner and finder.
          </div>

          {userVerifiedReturns.map((r) => (
            <div
              key={r.id}
              className="p-4 sm:p-5 rounded-3xl bg-[#090E1A] border border-white/[0.08] flex items-center justify-between gap-4 shadow-xl"
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-[32px] text-emerald-400">
                  task_alt
                </span>
                <div>
                  <h4 className="font-bold text-sm text-white">{r.itemName}</h4>
                  <p className="text-xs text-slate-400">
                    Returned via Gate 1 Security Kiosk • Witnessed by Officer R. Nair
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300">
                +10 HERO POINTS
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          6. TAB 4: PERSONA SWITCHER & SYSTEM SIMULATOR
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'security' && (
        <div className="rounded-3xl bg-[#090E1A] border border-white/[0.08] p-6 space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-lg font-heading font-black text-white">Campus Perspective Switcher</h3>
            <p className="text-xs text-slate-400">
              Select any role to test Campus Pick workflows from that persona's vantage point:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { key: 'student_sarah', name: 'Sarah J.', desc: 'Student Owner (CS Lab)', role: 'student' },
              { key: 'student_rahul', name: 'Rahul K.', desc: 'Student Finder (Campus Hero)', role: 'student' },
              { key: 'security_nair', name: 'Officer R. Nair', desc: 'Gate 1 Custody Officer', role: 'security' },
              { key: 'admin_shivakumar', name: 'Dr. N. Shivakumar', desc: 'Dean of Student Welfare', role: 'admin' },
              { key: 'faculty_divya', name: 'Prof. Divya R.', desc: 'Basic Science Faculty', role: 'faculty' },
            ].map((p) => (
              <button
                key={p.key}
                onClick={() => {
                  switchUserRole(p.key);
                  triggerToast(`Switched active persona to ${p.name}`, 'verified_user', 'success');
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  currentUser.displayName === p.name
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                    : 'bg-[#0E1626] text-slate-300 border-white/[0.06] hover:bg-white/[0.05]'
                }`}
              >
                <span className="font-bold text-xs block">{p.name}</span>
                <span className="text-[11px] opacity-80 block mt-0.5">{p.desc}</span>
                <span className="text-[10px] font-mono uppercase mt-2 inline-block px-1.5 py-0.2 rounded bg-white/10 font-semibold">
                  {p.role}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Offline Edge Resilience Simulator</span>
              <span className="text-[11px] text-slate-400">Simulate intermittent Wi-Fi in remote basement labs</span>
            </div>
            <button
              onClick={toggleOffline}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                isOffline ? 'bg-amber-500 text-black' : 'bg-white/[0.06] text-slate-300'
              }`}
            >
              {isOffline ? 'Offline Mode Active' : 'Toggle Offline Mode'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
