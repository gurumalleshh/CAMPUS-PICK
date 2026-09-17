import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Report, ItemCategory } from '../types';
import { INSTITUTION_INFO, DEMO_USERS } from '../mockData';

const CATEGORY_META: Record<
  ItemCategory,
  { label: string; icon: string; color: string; bg: string }
> = {
  electronics: {
    label: 'Electronics',
    icon: 'devices',
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
  },
  id_card: {
    label: 'IDs & Keys',
    icon: 'badge',
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
  },
  wallet_bag: {
    label: 'Wallets & Money',
    icon: 'account_balance_wallet',
    color: 'text-[#222022]',
    bg: 'bg-[#C3D809]/20 border-[#C3D809]',
  },
  books_notes: {
    label: 'Books & Notes',
    icon: 'menu_book',
    color: 'text-purple-700',
    bg: 'bg-purple-50 border-purple-200',
  },
  keys: {
    label: 'Keys & Fobs',
    icon: 'key',
    color: 'text-orange-700',
    bg: 'bg-orange-50 border-orange-200',
  },
  calculator: {
    label: 'Lab & Engineering',
    icon: 'calculate',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50 border-indigo-200',
  },
  certificate: {
    label: 'Certificates & Docs',
    icon: 'description',
    color: 'text-rose-700',
    bg: 'bg-rose-50 border-rose-200',
  },
  other: {
    label: 'Other Belongings',
    icon: 'inventory_2',
    color: 'text-slate-700',
    bg: 'bg-slate-50 border-slate-200',
  },
};

export const StudentFacultyDashboard: React.FC = () => {
  const {
    currentUser,
    reports,
    login,
    openReportModal,
    setActiveTab,
    triggerToast,
    goBack,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'FOUND' | 'LOST' | 'RETURNED'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<ItemCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewScope, setViewScope] = useState<'ALL' | 'MY_REPORTS'>('ALL');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('ALL');

  if (!currentUser) return null;

  const isFaculty = currentUser.role === 'faculty';

  // Overall Statistics Calculations
  const stats = useMemo(() => {
    const total = reports.length;
    const found = reports.filter((r) => r.type === 'FOUND' && r.status !== 'RETURNED').length;
    const lost = reports.filter(
      (r) => r.type === 'LOST' && r.status !== 'RETURNED'
    ).length;
    const returned = reports.filter((r) => r.status === 'RETURNED').length;
    
    // Proper recovery calculation: items recovered and secured (currently held safely in custody or already returned to owner)
    const recovered = found + returned;
    const recoveryRate = total > 0 ? Math.round((recovered / total) * 100) : 0;
    const recoveryRateDecimal = total > 0 ? ((recovered / total) * 100).toFixed(1) : '0';

    // Lost cases resolution rate: items returned out of total lost items reported (lost + returned)
    const totalLostCases = lost + returned;
    const lostResolutionRate = totalLostCases > 0 ? Math.round((returned / totalLostCases) * 100) : 0;

    return { 
      total, 
      found, 
      lost, 
      returned, 
      recovered,
      recoveryRate, 
      recoveryRateDecimal,
      totalLostCases,
      lostResolutionRate
    };
  }, [reports]);

  // Category Breakdown Calculations
  const categoryStats = useMemo(() => {
    const catKeys = Object.keys(CATEGORY_META) as ItemCategory[];
    return catKeys.map((cat) => {
      const catReports = reports.filter((r) => r.category === cat);
      const catFound = catReports.filter((r) => r.type === 'FOUND' && r.status !== 'RETURNED').length;
      const catLost = catReports.filter((r) => r.type === 'LOST' && r.status !== 'RETURNED').length;
      const catReturned = catReports.filter((r) => r.status === 'RETURNED').length;
      const total = catReports.length;
      
      // Category items recovered = held in custody + reunited to owner
      const catRecovered = catFound + catReturned;
      const recoveryPct = total > 0 ? Math.round((catRecovered / total) * 100) : 0;

      return {
        key: cat,
        meta: CATEGORY_META[cat],
        total,
        found: catFound,
        lost: catLost,
        returned: catReturned,
        recovered: catRecovered,
        recoveryPct,
      };
    });
  }, [reports]);

  // Filtered reports list for interactive browser
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      // 1. Scope filter
      if (viewScope === 'MY_REPORTS') {
        const isMine =
          report.userId === currentUser.id ||
          report.matchedUserId === currentUser.id;
        if (!isMine) return false;
      }

      // 2. Status filter
      if (statusFilter === 'FOUND') {
        if (report.type !== 'FOUND' || report.status === 'RETURNED') return false;
      } else if (statusFilter === 'LOST') {
        if (report.type !== 'LOST' || report.status === 'RETURNED') return false;
      } else if (statusFilter === 'RETURNED') {
        if (report.status !== 'RETURNED') return false;
      }

      // 3. Category filter
      if (categoryFilter !== 'ALL' && report.category !== categoryFilter) {
        return false;
      }

      // 4. Building filter
      if (
        selectedBuilding !== 'ALL' &&
        !report.location.building.toLowerCase().includes(selectedBuilding.toLowerCase())
      ) {
        return false;
      }

      // 5. Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = report.itemName.toLowerCase().includes(q);
        const matchesDesc = report.description.toLowerCase().includes(q);
        const matchesTicket = report.ticketNumber.toLowerCase().includes(q);
        const matchesBuilding = report.location.building.toLowerCase().includes(q);
        const matchesRoom = (report.location.room || '').toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesTicket && !matchesBuilding && !matchesRoom) {
          return false;
        }
      }

      return true;
    });
  }, [reports, viewScope, statusFilter, categoryFilter, selectedBuilding, searchQuery, currentUser]);

  const myReportsCount = reports.filter(
    (r) => r.userId === currentUser.id || r.matchedUserId === currentUser.id
  ).length;

  return (
    <div className="pb-24 md:pb-12 pt-20 px-3 sm:px-6 max-w-[1600px] mx-auto space-y-6">
      {/* 1. Header with Role Switcher & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            onClick={goBack}
            className="w-9 h-9 mt-0.5 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 hover:text-[#222022] active:scale-95 transition-all shadow-xs cursor-pointer shrink-0"
            aria-label="Back"
            title="Back to Previous Screen"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h1 className="font-heading text-2xl font-bold text-[#222022] tracking-tight">
                {isFaculty ? 'Faculty Departmental Dashboard' : 'Student Campus Dashboard'}
              </h1>
              <span
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  isFaculty ? 'bg-purple-100 text-purple-900' : 'bg-[#C3D809]/30 text-[#222022] border border-[#C3D809]'
                }`}
              >
                {currentUser.identifier}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {INSTITUTION_INFO.fullName} • {isFaculty ? 'Classroom & Academic Block Monitoring' : 'Live Campus Item Tracking'}
            </p>
          </div>
        </div>

        {/* Quick Demo Switcher (Student Sarah vs Student Rahul vs Faculty Divya) */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto bg-white p-1 rounded-2xl border border-slate-200 shadow-xs text-xs max-w-full overflow-x-auto">
          <span className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wider">
            Switch:
          </span>
          <button
            type="button"
            onClick={() => {
              login(DEMO_USERS.student_sarah);
              triggerToast('Active as Sarah J. (Student - CS)', 'school', 'info');
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              currentUser.id === DEMO_USERS.student_sarah.id
                ? 'bg-[#222022] text-[#C3D809] shadow-xs'
                : 'text-slate-600 hover:text-[#222022]'
            }`}
          >
            <span>Sarah (Student)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              login(DEMO_USERS.student_rahul);
              triggerToast('Active as Rahul K. (Student - Mech)', 'school', 'info');
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              currentUser.id === DEMO_USERS.student_rahul.id
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-teal-900'
            }`}
          >
            <span>Rahul (Student)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              login(DEMO_USERS.faculty_divya);
              triggerToast('Active as Prof. Divya R. (Faculty)', 'psychology', 'info');
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              currentUser.id === DEMO_USERS.faculty_divya.id
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-purple-900'
            }`}
          >
            <span>Prof. Divya (Faculty)</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards: Items Found, Lost, Returned & Recovery Rate */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Found Items */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'FOUND' ? 'ALL' : 'FOUND')}
          className={`p-4 rounded-3xl border transition-all cursor-pointer shadow-xs ${
            statusFilter === 'FOUND'
              ? 'bg-[#C3D809]/20 border-[#C3D809] ring-2 ring-[#C3D809]/40'
              : 'bg-white border-slate-200 hover:border-[#C3D809]'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-heading font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              Items Found
            </span>
            <span className="material-symbols-outlined text-[18px] text-[#222022]">
              check_circle
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-3xl font-extrabold text-[#222022]">
              {stats.found}
            </span>
            <span className="text-[11px] font-bold text-[#222022] bg-[#C3D809]/30 border border-[#C3D809] px-1.5 py-0.5 rounded">
              In Custody
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Awaiting owner verification on campus
          </p>
        </div>

        {/* Lost Items */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'LOST' ? 'ALL' : 'LOST')}
          className={`p-4 rounded-3xl border transition-all cursor-pointer shadow-xs ${
            statusFilter === 'LOST'
              ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400/40'
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-heading font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              Items Lost
            </span>
            <span className="material-symbols-outlined text-[18px] text-amber-600">search</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-3xl font-extrabold text-amber-800">
              {stats.lost}
            </span>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
              Active Notices
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Student & faculty searches across campus
          </p>
        </div>

        {/* Returned Items */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'RETURNED' ? 'ALL' : 'RETURNED')}
          className={`p-4 rounded-3xl border transition-all cursor-pointer shadow-xs ${
            statusFilter === 'RETURNED'
              ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-400/40'
              : 'bg-white border-slate-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-heading font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              Items Returned
            </span>
            <span className="material-symbols-outlined text-[18px] text-blue-600">
              verified
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-3xl font-extrabold text-blue-800">
              {stats.returned}
            </span>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
              Reunited
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Handed back via Gate 1 Security Desk
          </p>
        </div>

        {/* Campus Recovery Rate */}
        <div className="p-4 rounded-3xl border bg-[#222022] text-white shadow-xs border-white/10">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-heading font-bold text-[#C3D809] uppercase tracking-wider text-[11px]">
              Recovery Rate
            </span>
            <span className="material-symbols-outlined text-[18px] text-[#C3D809]">
              trending_up
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-3xl font-extrabold text-white">
              {stats.recoveryRateDecimal}%
            </span>
            <span className="text-[11px] font-bold text-[#222022] bg-[#C3D809] px-1.5 py-0.5 rounded">
              {stats.recoveryRate >= 60 ? 'High' : stats.recoveryRate >= 40 ? 'Moderate' : 'Developing'}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1">
            {stats.recovered} of {stats.total} items recovered ({stats.found} in custody + {stats.returned} reunited)
          </p>
          <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
            <span>Reunited to owner:</span>
            <span className="font-bold text-white">{stats.lostResolutionRate}% ({stats.returned}/{stats.totalLostCases} lost)</span>
          </div>
        </div>
      </div>

      {/* 3. Category-Wise Distribution Breakdown */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-heading text-base font-bold text-[#222022] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#222022] text-[20px]">category</span>
              <span>Category-Wise Item Distribution</span>
            </h2>
            <p className="text-xs text-slate-500">
              Click any category card below to filter the live directory
            </p>
          </div>

          {categoryFilter !== 'ALL' && (
            <button
              onClick={() => setCategoryFilter('ALL')}
              className="text-xs font-bold text-[#222022] bg-[#C3D809]/30 px-3 py-1 rounded-xl border border-[#C3D809] hover:bg-[#C3D809]/40 cursor-pointer self-start sm:self-auto flex items-center gap-1"
            >
              <span>Reset to All Categories</span>
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {categoryStats.map((c) => {
            const isSelected = categoryFilter === c.key;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setCategoryFilter(isSelected ? 'ALL' : c.key)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#222022] text-white border-[#222022] shadow-md ring-2 ring-[#C3D809]/50'
                    : 'bg-slate-50/70 border-slate-200 hover:border-[#C3D809] hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isSelected ? 'text-[#C3D809]' : c.meta.color
                    }`}
                  >
                    {c.meta.icon}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-[#C3D809] text-[#222022]'
                        : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    {c.total} items
                  </span>
                </div>

                <div className="font-heading font-bold text-xs truncate">
                  {c.meta.label}
                </div>

                <div
                  className={`flex items-center justify-between text-[10px] mt-1.5 ${
                    isSelected ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  <span>{c.found} in custody • {c.lost} lost</span>
                  <span className="font-bold">{c.recoveryPct}% rec</span>
                </div>

                {/* Progress bar */}
                <div
                  className={`w-full h-1.5 rounded-full overflow-hidden mt-2 ${
                    isSelected ? 'bg-black/50' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`h-full rounded-full ${
                      isSelected ? 'bg-[#C3D809]' : 'bg-[#222022]'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(8, c.recoveryPct))}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Interactive Live Item Directory */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-heading text-base font-bold text-[#222022] flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-700 text-[20px]">list_alt</span>
              <span>Live Campus Directory ({filteredReports.length} Items)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Browse lost and found logs across PESCE blocks. Confidential serial numbers are masked for security.
            </p>
          </div>

          {/* Quick Action: Report Lost or Found */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => openReportModal('LOST')}
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-heading font-bold text-xs cursor-pointer flex items-center gap-1 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">search</span>
              <span>Report Lost</span>
            </button>
            <button
              onClick={() => openReportModal('FOUND')}
              className="px-3 py-1.5 rounded-xl bg-[#222022] hover:bg-black text-[#C3D809] font-heading font-bold text-xs cursor-pointer flex items-center gap-1 shadow-xs transition-all border border-[#222022]"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>I Found an Item</span>
            </button>
          </div>
        </div>

        {/* Scope Toggle (All Campus vs My Reports) & Search */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          {/* Search bar */}
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by item name, location, ticket #..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C3D809] focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Scope Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setViewScope('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewScope === 'ALL'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Campus ({reports.length})
            </button>
            <button
              type="button"
              onClick={() => setViewScope('MY_REPORTS')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                viewScope === 'MY_REPORTS'
                  ? 'bg-[#222022] text-[#C3D809] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>My Items</span>
              <span className="text-[10px] bg-white/20 text-[#C3D809] px-1 rounded-full">
                {myReportsCount}
              </span>
            </button>
          </div>
        </div>

        {/* Filter Pills: Status & Building */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider mr-1">Status:</span>
            {(['ALL', 'FOUND', 'LOST', 'RETURNED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer ${
                  statusFilter === st
                    ? st === 'FOUND'
                      ? 'bg-[#222022] text-[#C3D809]'
                      : st === 'LOST'
                      ? 'bg-amber-600 text-white'
                      : st === 'RETURNED'
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#222022] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'ALL' ? 'All Status' : st}
              </button>
            ))}
          </div>

          {/* Building Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Block:
            </span>
            <select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Academic Blocks</option>
              <option value="CS">CS Block</option>
              <option value="Library">Central Library</option>
              <option value="Mechanical">Mechanical Bay</option>
              <option value="Cafeteria">Cafeteria / Food Court</option>
              <option value="Gate 1">Gate 1 Security Post</option>
              <option value="Basic Sciences">Science Block</option>
            </select>
          </div>
        </div>

        {/* Items Grid / Cards */}
        {filteredReports.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 space-y-2">
            <span className="material-symbols-outlined text-[32px] text-slate-400 block mx-auto">
              search_off
            </span>
            <p className="font-bold text-slate-700">No matching items found</p>
            <p className="text-[11px] text-slate-400">
              Try adjusting your search terms or clearing status filters.
            </p>
            <button
              onClick={() => {
                setStatusFilter('ALL');
                setCategoryFilter('ALL');
                setSelectedBuilding('ALL');
                setSearchQuery('');
                setViewScope('ALL');
              }}
              className="mt-2 px-3 py-1 bg-white border border-slate-200 rounded-xl text-[#222022] font-bold hover:bg-slate-100 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
            {filteredReports.map((item) => {
              const meta = CATEGORY_META[item.category] || CATEGORY_META.other;
              const isMine =
                item.userId === currentUser.id || item.matchedUserId === currentUser.id;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all text-xs space-y-2.5 ${
                    item.status === 'RETURNED'
                      ? 'bg-blue-50/40 border-blue-200/80'
                      : item.type === 'FOUND'
                      ? 'bg-white border-slate-200 hover:border-[#C3D809] hover:shadow-xs'
                      : 'bg-white border-slate-200 hover:border-amber-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${meta.bg}`}
                      >
                        <span className={`material-symbols-outlined text-[16px] ${meta.color}`}>
                          {meta.icon}
                        </span>
                      </span>
                      <div>
                        <h4 className="font-heading font-bold text-sm text-[#222022] line-clamp-1">
                          {item.itemName}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400">
                          #{item.ticketNumber}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded shrink-0 ${
                        item.status === 'RETURNED'
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : item.type === 'FOUND'
                          ? 'bg-[#C3D809]/30 text-[#222022] border border-[#C3D809]'
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}
                    >
                      {item.status === 'RETURNED' ? 'RETURNED' : item.type}
                    </span>
                  </div>

                  <p className="text-slate-600 text-[11px] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Location & Time Stamp */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1 font-medium truncate max-w-[200px]">
                      <span className="material-symbols-outlined text-[13px] text-slate-400 shrink-0">
                        location_on
                      </span>
                      <span className="truncate">
                        {item.location.building} {item.location.room ? `• ${item.location.room}` : ''}
                      </span>
                    </span>
                    <span className="font-mono text-slate-400 shrink-0">{item.createdAt}</span>
                  </div>

                  {/* Confidential Evidence Shield Notice for Student / Faculty */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-[10px] text-slate-500 flex items-center justify-between gap-1">
                    <span className="flex items-center gap-1 text-slate-600 font-medium">
                      <span className="material-symbols-outlined text-[14px] text-slate-400">
                        shield
                      </span>
                      <span>Serial & Invoices Protected</span>
                    </span>
                    <span className="text-[9px] text-[#222022] font-bold bg-[#C3D809]/30 px-1.5 py-0.5 rounded border border-[#C3D809]">
                      Gate 1 Verified
                    </span>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center gap-2 pt-1">
                    {item.status !== 'RETURNED' ? (
                      <button
                        onClick={() => {
                          setActiveTab('matches');
                          triggerToast(`Checking potential matches for ${item.itemName}`, 'join_inner', 'info');
                        }}
                        className="flex-1 py-1.5 bg-[#C3D809]/20 hover:bg-[#C3D809]/30 text-[#222022] border border-[#C3D809]/40 rounded-xl font-heading font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-all"
                      >
                        <span className="material-symbols-outlined text-[14px]">join_inner</span>
                        <span>{isMine ? 'View Matches' : 'Claim or Match'}</span>
                      </button>
                    ) : (
                      <div className="flex-1 py-1.5 bg-blue-50 text-blue-900 rounded-xl font-heading font-bold text-[11px] text-center">
                        ✓ Safely Returned to Owner
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Institutional Handover & Custody Notice */}
      <div className="p-4 rounded-3xl bg-[#222022] border border-white/10 text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 text-[#C3D809] flex items-center justify-center shrink-0 border border-white/10">
            <span className="material-symbols-outlined text-[20px]">local_police</span>
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-white">Gate 1 Campus Security Post</h4>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Items can be deposited or claimed with verified ID at Gate 1 Campus Security (Mon–Sat, 8:30 AM – 6:00 PM).
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('map')}
          className="px-3.5 py-2 bg-[#C3D809] hover:bg-[#b0c408] text-[#222022] font-heading font-bold text-xs rounded-xl shadow-xs cursor-pointer shrink-0 transition-all flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">near_me</span>
          <span>View Campus Map</span>
        </button>
      </div>
    </div>
  );
};
