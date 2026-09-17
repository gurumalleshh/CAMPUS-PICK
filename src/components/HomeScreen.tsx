import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INSTITUTION_INFO } from '../mockData';
import { Report } from '../types';

export const HomeScreen: React.FC = () => {
  const {
    currentUser,
    reports,
    matches,
    setActiveTab,
    openReportModal,
    setSelectedMatch,
    triggerToast,
    openWalkthrough,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [dismissedAlert, setDismissedAlert] = useState(false);
  const [selectedReportDetail, setSelectedReportDetail] = useState<Report | null>(null);

  // Filter reports
  const filteredReports = reports.filter((r) => {
    // Search query filter
    const matchesSearch =
      searchQuery === '' ||
      r.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'all') return true;
    if (activeFilter === 'lost') return r.type === 'LOST';
    if (activeFilter === 'found') return r.type === 'FOUND';
    if (activeFilter === 'cs') return r.location.building.includes('CS');
    if (activeFilter === 'library') return r.location.building.includes('Library');
    if (activeFilter === 'cafeteria') return r.location.building.includes('Cafeteria');

    return true;
  });

  const pendingMatch = matches.find((m) => m.status === 'PENDING');

  if (!currentUser) return null;

  return (
    <div className="pb-24 md:pb-12 pt-20 px-3 sm:px-6 max-w-[1600px] mx-auto space-y-6">
      {/* 1. Header Greeting & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#222022] tracking-tight">
              Good afternoon, {currentUser.displayName.split(' ')[0]} 👋
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            {currentUser.department ? `${currentUser.department} • ` : ''}
            {currentUser.semester || currentUser.role.toUpperCase()} • {INSTITUTION_INFO.shortName}
          </p>
        </div>

        {/* Quick Civic Points Badge */}
        <button
          onClick={() => setActiveTab('heroes')}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#222022] border border-[#222022] text-[#C3D809] text-xs font-bold hover:bg-[#333033] active:scale-95 transition-all cursor-pointer shadow-2xs"
          aria-label="View Civic Points and Rank"
        >
          <span className="material-symbols-outlined text-[16px] text-[#C3D809]">military_tech</span>
          <span>Rank #{currentUser.rank || 7} • {currentUser.points} pts</span>
        </button>
      </div>

      {/* 2. Top Grid: Institutional Motto Banner + Dual Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Banner (Full width on mobile, 7 cols on tablet/desktop) */}
        <div className="md:col-span-7 lg:col-span-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#222022] via-[#2c292c] to-[#181618] text-white p-5 sm:p-6 shadow-sm border border-[#3d3a3d] flex flex-col justify-between">
          <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-[#C3D809]/10 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-black tracking-widest text-[#222022] bg-[#C3D809] px-2.5 py-0.5 rounded-full border border-[#C3D809]">
                CAMPUS RECOVERY GUARANTEE
              </span>
              <span className="text-[11px] text-[#C3D809] font-mono font-bold">
                14 ACADEMIC BLOCKS
              </span>
            </div>

            <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
              "{INSTITUTION_INFO.tagline}"
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-xl">
              Smart multi-factor item correlation and secure custody handovers monitored by Campus Security at Gate 1 Duty Desk.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 text-[11px] sm:text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5 text-[#C3D809] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C3D809] animate-pulse" />
                Live Campus Geofence Active
              </span>
              <span>•</span>
              <span>Avg Return: 42 Mins</span>
              <span>•</span>
              <span className="text-[#C3D809] font-bold">PESCE Mandya Trust Network</span>
            </div>
          </div>
        </div>

        {/* 3. Dual Quick Action Cards (Stacked or paired on tablet/desktop) */}
        <div className="md:col-span-5 lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3">
          {/* Report Lost */}
          <button
            onClick={() => openReportModal('LOST')}
            className="group relative flex flex-col justify-between p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-rose-400 hover:shadow-md transition-all text-left active:scale-[0.98] cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-400"
            aria-label="Report Lost Item"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">search</span>
              </div>
              <span className="font-heading font-bold text-[15px] text-[#222022] block">
                Report Lost
              </span>
              <span className="text-xs text-slate-600 mt-0.5 line-clamp-1 sm:line-clamp-2">
                Misplaced your calculator, ID, or laptop?
              </span>
            </div>
            <div className="mt-2.5 flex items-center text-xs font-bold text-rose-700 gap-1">
              <span>Log missing item</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </div>
          </button>

          {/* Report Found */}
          <button
            onClick={() => openReportModal('FOUND')}
            className="group relative flex flex-col justify-between p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-[#222022] hover:shadow-md transition-all text-left active:scale-[0.98] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C3D809]"
            aria-label="Report Found Item"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#222022] text-[#C3D809] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">front_hand</span>
              </div>
              <span className="font-heading font-bold text-[15px] text-[#222022] block">
                Report Found
              </span>
              <span className="text-xs text-slate-600 mt-0.5 line-clamp-1 sm:line-clamp-2">
                Spotted or picked up an item on campus?
              </span>
            </div>
            <div className="mt-2.5 flex items-center text-xs font-extrabold text-[#222022] gap-1">
              <span>Turn in & earn points</span>
              <span className="material-symbols-outlined text-[14px] text-[#222022]">arrow_forward</span>
            </div>
          </button>
        </div>
      </div>

      {/* 3b. Live Campus Dashboard Card for Student & Faculty */}
      {(() => {
        const found = reports.filter((r) => r.type === 'FOUND' && r.status !== 'RETURNED').length;
        const lost = reports.filter((r) => r.type === 'LOST' && r.status !== 'RETURNED').length;
        const returned = reports.filter((r) => r.status === 'RETURNED').length;
        const total = reports.length;
        const recovered = found + returned;
        const recoveryRate = total > 0 ? ((recovered / total) * 100).toFixed(1) : '0';

        return (
          <button
            type="button"
            onClick={() =>
              setActiveTab(
                currentUser.role === 'admin' || currentUser.role === 'security'
                  ? 'admin'
                  : 'dashboard'
              )
            }
            className="w-full text-left p-4 rounded-3xl bg-white border border-slate-200 hover:border-[#222022] hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#222022] text-[#C3D809] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">query_stats</span>
                </span>
                <div>
                  <h3 className="font-heading font-bold text-sm text-[#222022] group-hover:text-[#222022] transition-colors">
                    {currentUser.role === 'faculty'
                      ? 'Faculty Departmental & Campus Dashboard'
                      : 'Student Campus Lost & Found Dashboard'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Live breakdown of items found, lost, returned, and category metrics
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-[#222022] group-hover:translate-x-0.5 transition-all text-[20px]">
                arrow_forward
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center">
              <div className="p-2 rounded-xl bg-[#C3D809]/15 border border-[#C3D809]/30">
                <span className="text-[10px] font-bold text-[#222022] uppercase block">Found</span>
                <span className="font-heading font-extrabold text-base text-[#222022]">{found}</span>
                <span className="text-[9px] text-slate-600 block">in custody</span>
              </div>
              <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-100">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">Lost</span>
                <span className="font-heading font-extrabold text-base text-amber-900">{lost}</span>
                <span className="text-[9px] text-amber-700 block">active notices</span>
              </div>
              <div className="p-2 rounded-xl bg-blue-50/70 border border-blue-100">
                <span className="text-[10px] font-bold text-blue-800 uppercase block">Returned</span>
                <span className="font-heading font-extrabold text-base text-blue-900">{returned}</span>
                <span className="text-[9px] text-blue-700 block">reunited</span>
              </div>
              <div className="p-2 rounded-xl bg-[#222022] text-[#C3D809] border border-[#222022]">
                <span className="text-[10px] font-bold text-[#C3D809] uppercase block">Recovery</span>
                <span className="font-heading font-extrabold text-base text-white">{recoveryRate}%</span>
                <span className="text-[9px] text-slate-300 block">{recovered}/{total} secured</span>
              </div>
            </div>
          </button>
        );
      })()}

      {/* 4. Nearby Urgent Alert (Proximity Geofenced) */}
      {!dismissedAlert && (
        <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-700 text-[20px] shrink-0">
                warning
              </span>
              <div>
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                  Nearby Urgent Alert • CS-204 Window
                </span>
                <p className="text-xs text-amber-900 leading-snug mt-0.5">
                  Black Casio FX-991CW Calculator reported missing near 2nd Row Bench (15m from you).
                </p>
              </div>
            </div>
            <button
              onClick={() => setDismissedAlert(true)}
              className="text-amber-800 hover:text-amber-950 text-xs p-1"
              aria-label="Dismiss alert"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
          <div className="flex items-center gap-2 pl-7">
            <button
              onClick={() => openReportModal('FOUND')}
              className="px-3 py-1 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold active:scale-95 transition-all cursor-pointer"
            >
              I found this item
            </button>
            <button
              onClick={() => setDismissedAlert(true)}
              className="px-2.5 py-1 text-xs text-amber-800 font-medium hover:underline"
            >
              Not seen
            </button>
          </div>
        </div>
      )}

      {/* 5. Potential Match Banner (Telemetry Engine) */}
      {pendingMatch && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#222022] to-[#2d2a2d] text-white border border-[#3d3a3d] shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C3D809] animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#C3D809]">
                Potential Match Detected • {pendingMatch.confidenceScore}% Similarity
              </span>
            </div>
            <span className="text-[10px] font-black bg-[#C3D809] text-[#222022] px-2 py-0.5 rounded tracking-wide">
              MATCH ≠ OWNERSHIP
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 text-xs bg-black/30 p-2.5 rounded-xl border border-white/10">
            <div>
              <p className="font-semibold text-slate-100">
                {pendingMatch.lostReport.itemName}
              </p>
              <p className="text-[11px] text-slate-300">
                Lost in {pendingMatch.lostReport.location.room}
              </p>
            </div>
            <span className="material-symbols-outlined text-[#C3D809]">sync_alt</span>
            <div className="text-right">
              <p className="font-semibold text-slate-100">
                {pendingMatch.foundReport.itemName}
              </p>
              <p className="text-[11px] text-slate-300">
                Found at {pendingMatch.foundReport.location.areaDescription || pendingMatch.foundReport.location.room}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={() => {
                setSelectedMatch(pendingMatch);
                setActiveTab('matches');
              }}
              className="w-full py-2 bg-[#C3D809] hover:bg-[#b0c306] text-[#222022] font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <span>Review Match & Verify Ownership</span>
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. Campus Activity Feed & Filter Section */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold text-[#222022]">
              Campus Activity Feed
            </h2>
            <p className="text-xs text-slate-600">
              Live Lost & Found register across PESCE Mandya
            </p>
          </div>
          <button
            onClick={() => setActiveTab('map')}
            className="text-xs font-bold text-[#222022] hover:text-[#000000] flex items-center gap-1 cursor-pointer"
          >
            <span>View on Map</span>
            <span className="material-symbols-outlined text-[15px]">map</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-slate-400">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items, categories, rooms (e.g. ThinkPad, CS-204, Wallet)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-[#222022] placeholder:text-slate-400 focus:outline-none focus:border-[#222022] focus:ring-2 focus:ring-[#C3D809]/40 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-[16px]">cancel</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: 'all', label: `All Reports (${reports.length})` },
            { id: 'lost', label: `Lost (${reports.filter((r) => r.type === 'LOST').length})` },
            { id: 'found', label: `Found (${reports.filter((r) => r.type === 'FOUND').length})` },
            { id: 'cs', label: 'CS Wing (Block B)' },
            { id: 'library', label: 'Library' },
            { id: 'cafeteria', label: 'Cafeteria' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setActiveFilter(pill.id)}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === pill.id
                  ? 'bg-[#222022] text-[#C3D809] shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Report Cards List */}
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <span className="material-symbols-outlined text-[36px] text-slate-300">
              search_off
            </span>
            <p className="font-semibold text-sm text-[#222022] mt-2">
              No matching reports found
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Try searching for something else or submit a new report.
            </p>
            <button
              onClick={() => openReportModal('LOST')}
              className="mt-3 px-4 py-2 bg-[#222022] text-[#C3D809] rounded-xl text-xs font-bold hover:bg-[#333033] cursor-pointer"
            >
              Report Missing Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReportDetail(report)}
                className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-[#222022] hover:shadow-xs transition-all cursor-pointer flex gap-3.5 items-start group"
              >
                {/* Thumbnail / Category Icon */}
                <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center relative">
                  {report.publicPhotoUrl ? (
                    <img
                      src={report.publicPhotoUrl}
                      alt={report.itemName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-[26px] text-slate-400">
                      {report.category === 'electronics'
                        ? 'laptop_mac'
                        : report.category === 'id_card'
                        ? 'badge'
                        : report.category === 'wallet_bag'
                        ? 'account_balance_wallet'
                        : 'inventory_2'}
                    </span>
                  )}
                  <span
                    className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      report.type === 'LOST'
                        ? 'bg-rose-600 text-white'
                        : 'bg-[#222022] text-[#C3D809]'
                    }`}
                  >
                    {report.type}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-[10px] text-slate-400 font-semibold">
                      {report.ticketNumber}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {report.eventDate}, {report.eventTime}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-[15px] text-[#222022] truncate mt-0.5 group-hover:text-[#222022] transition-colors">
                    {report.itemName}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">
                    {report.description}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-600">
                    <span className="flex items-center gap-1 font-medium truncate">
                      <span className="material-symbols-outlined text-[14px] text-[#222022] shrink-0">
                        location_on
                      </span>
                      {report.location.room} • {report.location.building.split('(')[0]}
                    </span>

                    {report.status === 'RETURNED' ? (
                      <span className="px-2 py-0.5 bg-[#C3D809]/20 text-[#222022] border border-[#C3D809]/40 rounded font-black text-[10px]">
                        ✓ RETURNED
                      </span>
                    ) : report.status === 'POTENTIAL_MATCH' ? (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">
                        Match In Progress
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. Campus Heroes Leaderboard Snippet */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500 text-[22px]">
              emoji_events
            </span>
            <h2 className="font-heading font-bold text-sm text-[#222022]">
              Campus Heroes • Integrity Leaderboard
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('heroes')}
            className="text-xs font-bold text-[#222022] hover:underline cursor-pointer"
          >
            View All →
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-bold text-amber-600">🥇 1st</span>
            <p className="text-xs font-bold text-[#222022] truncate mt-0.5">Ananya K.</p>
            <p className="text-[10px] text-slate-500">18 Returns</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-bold text-slate-500">🥈 2nd</span>
            <p className="text-xs font-bold text-[#222022] truncate mt-0.5">Rahul M.</p>
            <p className="text-[10px] text-slate-500">15 Returns</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-bold text-amber-700">🥉 3rd</span>
            <p className="text-xs font-bold text-[#222022] truncate mt-0.5">Priya S.</p>
            <p className="text-[10px] text-slate-500">13 Returns</p>
          </div>
        </div>

        {/* User rank callout */}
        <div className="p-2.5 rounded-xl bg-[#222022] text-white border border-[#3d3a3d] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Your Rank: <span className="text-[#C3D809]">#7 ({currentUser.displayName})</span></span>
            <span className="text-slate-300">• {currentUser.points || 120} pts</span>
          </div>
          <button
            onClick={() => setActiveTab('heroes')}
            className="font-bold text-[#C3D809] hover:underline cursor-pointer"
          >
            View Certificate
          </button>
        </div>
      </div>

      {/* Report Detail Modal */}
      {selectedReportDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    selectedReportDetail.type === 'LOST'
                      ? 'bg-rose-600 text-white'
                      : 'bg-[#222022] text-[#C3D809]'
                  }`}
                >
                  {selectedReportDetail.type}
                </span>
                <span className="font-mono text-xs text-slate-400 font-semibold">
                  {selectedReportDetail.ticketNumber}
                </span>
              </div>
              <button
                onClick={() => setSelectedReportDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {selectedReportDetail.publicPhotoUrl && (
              <div className="rounded-2xl overflow-hidden max-h-56 bg-slate-100 border border-slate-200">
                <img
                  src={selectedReportDetail.publicPhotoUrl}
                  alt={selectedReportDetail.itemName}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div>
              <h2 className="font-heading text-lg font-bold text-[#222022]">
                {selectedReportDetail.itemName}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Reported by {selectedReportDetail.reporterName} ({selectedReportDetail.reporterDepartment || selectedReportDetail.reporterRole})
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-semibold text-slate-900 text-right">
                  {selectedReportDetail.location.building}, {selectedReportDetail.location.room}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Time & Date:</span>
                <span className="font-semibold text-slate-900">
                  {selectedReportDetail.eventDate} at {selectedReportDetail.eventTime}
                </span>
              </div>
              {selectedReportDetail.color && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Color:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedReportDetail.color}
                  </span>
                </div>
              )}
              {selectedReportDetail.identifyingFeatures && (
                <div className="flex flex-col gap-0.5 pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Identifying Features:</span>
                  <span className="font-medium text-slate-900">
                    {selectedReportDetail.identifyingFeatures}
                  </span>
                </div>
              )}
            </div>

            {/* Private Evidence Badge if available */}
            {selectedReportDetail.hasPrivateEvidence && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-2 text-xs text-indigo-900">
                <span className="material-symbols-outlined text-indigo-600 text-[18px]">
                  lock
                </span>
                <span>
                  <strong>Encrypted Vault:</strong> Serial & purchase invoice stored under AES-256 for Campus Security review.
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              {selectedReportDetail.type === 'FOUND' ? (
                <button
                  onClick={() => {
                    setSelectedReportDetail(null);
                    setActiveTab('matches');
                  }}
                  className="flex-1 py-2.5 bg-[#222022] hover:bg-[#333033] text-[#C3D809] rounded-xl text-xs font-black cursor-pointer"
                >
                  This is Mine (Claim)
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedReportDetail(null);
                    openReportModal('FOUND');
                  }}
                  className="flex-1 py-2.5 bg-[#C3D809] hover:bg-[#b0c306] text-[#222022] rounded-xl text-xs font-black cursor-pointer"
                >
                  I Found This Item
                </button>
              )}
              <button
                onClick={() => setSelectedReportDetail(null)}
                className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
