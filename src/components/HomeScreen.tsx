import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { INSTITUTION_INFO, normalizeBuildingId } from '../mockData';
import { Report } from '../types';
import { ReportDetailModal } from './ReportDetailModal';

interface HomeScreenProps {
  onOpenCommandPalette?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenCommandPalette }) => {
  const {
    currentUser,
    reports,
    matches,
    setActiveTab,
    openReportModal,
    setSelectedMatch,
    unreadCount,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'lost' | 'found' | 'returned' | 'my'>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [activeDossierReport, setActiveDossierReport] = useState<Report | null>(null);

  // Active correlated match with high confidence
  const activeCorrelatedMatch = useMemo(() => {
    return matches.find((m) => (m.status === 'PENDING' || m.confidenceScore >= 75) && m.status !== 'RESOLVED');
  }, [matches]);

  // Compute campus metrics
  const totalReportsCount = reports.length;
  const inVaultCount = reports.filter((r) => r.type === 'FOUND' && r.status !== 'RETURNED').length;
  const returnedCount = reports.filter((r) => r.status === 'RETURNED').length;
  const recoveryRate = Math.round((returnedCount / (totalReportsCount || 1)) * 100);

  // Filtered reports stream with robust sector matching
  const filteredStream = useMemo(() => {
    return reports.filter((r) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          r.itemName.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.location.building.toLowerCase().includes(q) ||
          r.location.room.toLowerCase().includes(q) ||
          r.ticketNumber.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      if (activeFilter === 'lost' && r.type !== 'LOST') return false;
      if (activeFilter === 'found' && (r.type !== 'FOUND' || r.status === 'RETURNED')) return false;
      if (activeFilter === 'returned' && r.status !== 'RETURNED') return false;
      if (activeFilter === 'my' && r.reporterId !== currentUser?.id) return false;

      if (selectedSector !== 'all') {
        const bldg = r.location.building.toLowerCase();
        if (selectedSector === 'cs' && !bldg.includes('cs') && !bldg.includes('computer')) return false;
        if (selectedSector === 'library' && !bldg.includes('library')) return false;
        if (selectedSector === 'main' && !bldg.includes('main') && !bldg.includes('academic')) return false;
        if (
          (selectedSector === 'mech' || selectedSector === 'bldg_mech' || selectedSector === 'workshop') &&
          !bldg.includes('mech') &&
          !bldg.includes('workshop')
        )
          return false;
        if (selectedSector === 'gate1' && !bldg.includes('gate 1') && !bldg.includes('security')) return false;
        if (selectedSector === 'cafe' && !bldg.includes('cafe') && !bldg.includes('student center') && !bldg.includes('cafeteria'))
          return false;
      }

      return true;
    });
  }, [reports, searchQuery, activeFilter, selectedSector, currentUser]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'electronics':
        return 'laptop_mac';
      case 'id_card':
        return 'badge';
      case 'wallet_bag':
        return 'account_balance_wallet';
      case 'keys':
        return 'key';
      case 'certificate':
        return 'description';
      case 'calculator':
        return 'calculate';
      default:
        return 'inventory_2';
    }
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-16 select-none font-sans space-y-8">
      {/* ─────────────────────────────────────────────────────────────────────────────
          1. COMPACT WELCOME & CONTEXTUAL HEADER AREA
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="border-b border-white/[0.08] bg-gradient-to-b from-[#090F1E] via-[#070B14] to-[#070B14] px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-8">
        <div className="max-w-[1700px] mx-auto space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  GATE 1 VAULT ACTIVE
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {INSTITUTION_INFO.shortName} • {inVaultCount} items in custody
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-white tracking-tight">
                Welcome back, {currentUser?.displayName?.split(' ')[0] || 'Student'} 👋
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
                Smart Lost & Found network across PESCE Mandya classrooms, laboratories, and grounds.
              </p>
            </div>

            {/* Quick Search & Command Palette Button */}
            <div className="flex items-center gap-2.5 self-start md:self-auto">
              <button
                type="button"
                onClick={onOpenCommandPalette}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0E1626] hover:bg-[#152036] border border-white/[0.1] text-slate-300 text-xs sm:text-sm font-medium transition-all shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-indigo-400">search</span>
                <span>Quick search or jump...</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-black/50 text-[10px] font-mono border border-white/10 text-slate-400 ml-1">
                  ⌘K
                </kbd>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10 space-y-8">
        {/* ─────────────────────────────────────────────────────────────────────────────
            2. PRIMARY ACTION AREA: "WHAT CAN I DO RIGHT NOW?"
        ───────────────────────────────────────────────────────────────────────────── */}
        <section aria-label="Primary Actions">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Action 1: Report Lost */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#1A101C] to-[#0D1220] border border-rose-500/30 hover:border-rose-500/50 transition-all duration-200 shadow-xl flex flex-col justify-between group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
                    I MISPLACED AN ITEM
                  </span>
                  <span className="material-symbols-outlined text-rose-400 text-[26px]">search_off</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-heading font-black text-white">
                  Report Lost Belonging
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Broadcast immediate alerts to faculty, security checkpoints, and peers in your building.
                </p>
              </div>

              <div className="pt-5">
                <button
                  onClick={() => openReportModal('LOST')}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>File Loss Report</span>
                </button>
              </div>
            </div>

            {/* Action 2: Report Found */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#0F2228] to-[#0A161E] border border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-200 shadow-xl flex flex-col justify-between group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                    I SPOTTED OR RECOVERED AN ITEM
                  </span>
                  <span className="material-symbols-outlined text-emerald-400 text-[26px]">volunteer_activism</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-heading font-black text-white">
                  Report Found Belonging
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Log an item into security custody at Gate 1 or arrange a verified peer handover.
                </p>
              </div>

              <div className="pt-5">
                <button
                  onClick={() => openReportModal('FOUND')}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>Log Found Item</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            3. QUICK NAVIGATION / DISCOVERY CARDS
        ───────────────────────────────────────────────────────────────────────────── */}
        <section aria-label="Campus Quick Discovery">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Discover: Matches */}
            <button
              onClick={() => setActiveTab('matches')}
              className="p-4 rounded-2xl bg-[#0E1626]/80 hover:bg-[#131F34] border border-white/[0.08] hover:border-indigo-400/40 text-left transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">hub</span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-white group-hover:text-indigo-200 transition-colors">
                    Correlations
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {matches.length} automated pairings
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-500 group-hover:text-indigo-300 text-[18px]">
                chevron_right
              </span>
            </button>

            {/* Discover: Living Map */}
            <button
              onClick={() => setActiveTab('map')}
              className="p-4 rounded-2xl bg-[#0E1626]/80 hover:bg-[#131F34] border border-white/[0.08] hover:border-indigo-400/40 text-left transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">map</span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-white group-hover:text-cyan-200 transition-colors">
                    Living Campus Map
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    6 campus sectors mapped
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-500 group-hover:text-cyan-300 text-[18px]">
                chevron_right
              </span>
            </button>

            {/* Discover: Notifications / Alerts */}
            <button
              onClick={() => setActiveTab('notifications')}
              className="p-4 rounded-2xl bg-[#0E1626]/80 hover:bg-[#131F34] border border-white/[0.08] hover:border-indigo-400/40 text-left transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 relative">
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                  {unreadCount > 0 && (
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-[#0E1626] absolute -top-0.5 -right-0.5 animate-pulse" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-white group-hover:text-rose-200 transition-colors">
                    Dispatches & Alerts
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {unreadCount > 0 ? `${unreadCount} unread notices` : 'All alerts read'}
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-500 group-hover:text-rose-300 text-[18px]">
                chevron_right
              </span>
            </button>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            4. IMPORTANT ACTIVITY: HIGH-CONFIDENCE MATCH & INCIDENTS FEED
        ───────────────────────────────────────────────────────────────────────────── */}
        {/* Active High-Confidence Match Spotlight (Compact Banner) */}
        {activeCorrelatedMatch && (
          <section aria-label="High Confidence Correlation Spotlight">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#111933] via-[#0D152A] to-[#0A1020] border-2 border-indigo-500/40 p-4 sm:p-5 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-500/25 border border-indigo-400/40 text-indigo-300 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">hub</span>
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        {activeCorrelatedMatch.confidenceScore}% MATCH
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        Custody at Gate 1
                      </span>
                    </div>

                    <h3 className="font-heading font-black text-base sm:text-lg text-white truncate">
                      Potential Match: {activeCorrelatedMatch.lostReport.itemName}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 truncate">
                      Correlated between {activeCorrelatedMatch.lostReport.location.room} and Gate 1 Security Vault.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedMatch(activeCorrelatedMatch);
                    setActiveTab('matches');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 self-start sm:self-auto"
                >
                  <span>Inspect Correlation</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Main Incident Feed Section */}
        <section aria-label="Recent Incidents Feed" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight">
                Recent Campus Incidents
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Chronological lost and found feed across all departments.
              </p>
            </div>

            {/* Quick Stream Filter Search Input */}
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[16px] text-slate-400">
                search
              </span>
              <input
                type="text"
                placeholder="Filter incidents (e.g. ThinkPad)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0E1626] border border-white/[0.1] text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus-ring"
              />
            </div>
          </div>

          {/* Filter Pills & Sector Dropdown Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-[#0E1626]/80 border border-white/[0.08]">
            {/* Status Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All', count: reports.length },
                { id: 'lost', label: 'Active Lost', count: reports.filter((r) => r.type === 'LOST').length },
                { id: 'found', label: 'In Custody', count: inVaultCount },
                { id: 'returned', label: 'Returned', count: returnedCount },
                { id: 'my', label: 'My Cases', count: reports.filter((r) => r.reporterId === currentUser?.id).length },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeFilter === f.id
                      ? 'bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <span>{f.label}</span>
                  <span className="text-xs font-mono opacity-80 font-bold">({f.count})</span>
                </button>
              ))}
            </div>

            {/* Sector / Building Dropdown with canonical bldg_mech support */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs text-slate-400 font-medium">Sector:</span>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="bg-[#090E1A] border border-white/[0.1] text-xs sm:text-sm text-slate-200 rounded-xl px-3 py-1.5 focus-ring cursor-pointer"
              >
                <option value="all">All Campus Sectors</option>
                <option value="cs">CS & Engineering Wing</option>
                <option value="library">Central Library</option>
                <option value="main">Main Academic Block</option>
                <option value="mech">Mechanical Workshop (Block D)</option>
                <option value="gate1">Gate 1 Security Post</option>
                <option value="cafe">Student Center & Cafeteria</option>
              </select>
            </div>
          </div>

          {/* Incident Stream Cards */}
          <div className="space-y-3">
            {filteredStream.length === 0 ? (
              <div className="p-10 text-center rounded-3xl bg-[#0E1626]/40 border border-white/[0.06] space-y-3">
                <span className="material-symbols-outlined text-[36px] text-slate-600">inventory_2</span>
                <h4 className="text-base font-bold text-white">No incidents match active filters</h4>
                <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
                  Try broadening your search term or select "All" to inspect all campus records.
                </p>
                <button
                  onClick={() => {
                    setActiveFilter('all');
                    setSelectedSector('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-bold hover:bg-indigo-500 cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredStream.map((report) => {
                const isLost = report.type === 'LOST';
                const isReturned = report.status === 'RETURNED';

                return (
                  <article
                    key={report.id}
                    onClick={() => setActiveDossierReport(report)}
                    className="group relative p-4 sm:p-5 rounded-2xl bg-[#0E1626]/70 hover:bg-[#121B2F] border border-white/[0.08] hover:border-indigo-500/40 transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    {/* Left Block: Thumbnail & Primary Metadata */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={
                            report.publicPhotoUrl ||
                            report.imageUrl ||
                            'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=300&auto=format&fit=crop&q=80'
                          }
                          alt={report.itemName}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-1 ring-white/10 group-hover:ring-indigo-500/40 transition-all"
                        />
                        <span
                          className={`absolute -top-1.5 -left-1.5 p-1 rounded-lg text-white shadow-md ${
                            isReturned
                              ? 'bg-emerald-600'
                              : isLost
                              ? 'bg-rose-600'
                              : 'bg-teal-600'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px] block">
                            {getCategoryIcon(report.category)}
                          </span>
                        </span>
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-xs font-mono font-bold px-2 py-0.5 rounded uppercase ${
                              isReturned
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : isLost
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                            }`}
                          >
                            {isReturned ? 'RETURNED TO OWNER' : isLost ? 'LOST REPORT' : 'IN VAULT CUSTODY'}
                          </span>
                          <span className="text-xs font-mono text-slate-400">#{report.ticketNumber}</span>
                          <span className="text-xs text-slate-400">• {report.eventTime || 'Today'}</span>
                        </div>

                        <h3 className="text-base sm:text-lg font-heading font-black text-white group-hover:text-indigo-200 transition-colors truncate">
                          {report.itemName}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-300 line-clamp-1 max-w-xl">
                          {report.description}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-slate-300 pt-0.5">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px] text-indigo-400">
                              location_on
                            </span>
                            <span className="truncate">
                              {report.location.building} • {report.location.room}
                            </span>
                          </span>
                          {report.hasPrivateEvidence && (
                            <span className="text-indigo-300 text-xs font-mono flex items-center gap-1 font-semibold">
                              <span className="material-symbols-outlined text-[13px]">lock</span>
                              Serial on file
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Block: Action & Reporter Identity */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.05]">
                      <div className="flex items-center gap-2 text-right">
                        <img
                          src={
                            report.reporterAvatarUrl ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                          }
                          alt={report.reporterName}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700"
                        />
                        <div className="text-left sm:text-right">
                          <span className="text-xs sm:text-sm font-bold text-slate-200 block leading-tight">
                            {report.reporterName}
                          </span>
                          <span className="text-xs text-slate-400 uppercase tracking-wider block">
                            {report.reporterRole}
                          </span>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-indigo-400 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-all">
                        <span>Inspect Details</span>
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                      </span>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            5. SUPPORTING INFORMATION: CAMPUS TRUST & SECURITY PROTOCOL
        ───────────────────────────────────────────────────────────────────────────── */}
        <section aria-label="Campus Custody Protocol" className="pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gate 1 Security Desk */}
            <div className="p-5 rounded-3xl bg-gradient-to-b from-[#0F1E29] to-[#0A161E] border border-emerald-500/25 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">
                    GATE 1 CUSTODY POST
                  </span>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  OFFICER ON DUTY
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-white">Officer R. Nair (Badge #CS-409)</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Turned-in items are logged into secure lockers. Physical returns require USN ID verification and matching serial credentials.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs sm:text-sm border-t border-emerald-500/20">
                <span className="text-slate-400">Vault Hold Period:</span>
                <span className="font-mono text-emerald-300 font-bold">14 Days Maximum</span>
              </div>
            </div>

            {/* Safe Handover Guarantee */}
            <div className="p-5 rounded-3xl bg-[#0E1626]/80 border border-white/[0.08] space-y-3">
              <div className="flex items-center gap-2 text-indigo-400">
                <span className="material-symbols-outlined text-[22px]">shield</span>
                <h3 className="font-heading font-black text-sm uppercase tracking-wider text-white">
                  Safe Campus Handover Protocol
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Direct exchanges for electronics and valuables occur at designated Safe Exchange Kiosks under officer supervision. Confidential proofs remain encrypted.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-semibold text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-400 text-[16px]">check</span>
                  <span>Escrow Messaging</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-400 text-[16px]">check</span>
                  <span>Serial Verification</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-400 text-[16px]">check</span>
                  <span>Officer Witness</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-400 text-[16px]">check</span>
                  <span>Tamper-Proof Receipt</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Reusable Consolidated Report Detail Modal */}
      <ReportDetailModal
        report={activeDossierReport}
        onClose={() => setActiveDossierReport(null)}
      />
    </div>
  );
};
