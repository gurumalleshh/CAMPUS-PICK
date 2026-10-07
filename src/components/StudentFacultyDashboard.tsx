import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Report, ItemCategory } from '../types';
import { INSTITUTION_INFO, DEMO_USERS } from '../mockData';
import { ReportDetailModal } from './ReportDetailModal';

const CATEGORY_META: Record<
  ItemCategory,
  { label: string; icon: string; color: string; bg: string }
> = {
  electronics: {
    label: 'Electronics',
    icon: 'devices',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/30',
  },
  id_card: {
    label: 'IDs & Keys',
    icon: 'badge',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/30',
  },
  wallet_bag: {
    label: 'Wallets & Money',
    icon: 'account_balance_wallet',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/30',
  },
  books_notes: {
    label: 'Books & Notes',
    icon: 'menu_book',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10 border-sky-500/30',
  },
  keys: {
    label: 'Keys & Fobs',
    icon: 'key',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/30',
  },
  calculator: {
    label: 'Lab & Engineering',
    icon: 'calculate',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10 border-teal-500/30',
  },
  certificate: {
    label: 'Certificates & Docs',
    icon: 'description',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/30',
  },
  other: {
    label: 'Other Belongings',
    icon: 'inventory_2',
    color: 'text-slate-400',
    bg: 'bg-white/[0.05] border-white/[0.1]',
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
  const [selectedReportDetail, setSelectedReportDetail] = useState<Report | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string>('ALL');

  if (!currentUser) return null;

  const isFaculty = currentUser.role === 'faculty';

  // Overall Statistics Calculations
  const stats = useMemo(() => {
    const total = reports.length;
    const found = reports.filter((r) => r.type === 'FOUND' && r.status !== 'RETURNED').length;
    const lost = reports.filter((r) => r.type === 'LOST' && r.status !== 'RETURNED').length;
    const returned = reports.filter((r) => r.status === 'RETURNED').length;
    const recovered = found + returned;
    const recoveryRate = total > 0 ? Math.round((recovered / total) * 100) : 0;
    return { total, found, lost, returned, recovered, recoveryRate };
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

  // Filtered reports list
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      if (viewScope === 'MY_REPORTS' && report.reporterId !== currentUser.id) return false;
      if (statusFilter === 'FOUND' && report.status !== 'FOUND') return false;
      if (statusFilter === 'LOST' && report.status !== 'LOST' && report.status !== 'POTENTIAL_MATCH') return false;
      if (statusFilter === 'RETURNED' && report.status !== 'RETURNED') return false;
      if (categoryFilter !== 'ALL' && report.category !== categoryFilter) return false;
      if (selectedBuilding !== 'ALL' && !report.location?.building?.toLowerCase().includes(selectedBuilding.toLowerCase())) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = report.itemName.toLowerCase().includes(q);
        const matchDesc = report.description?.toLowerCase().includes(q);
        const matchRoom = report.location?.room?.toLowerCase().includes(q);
        return matchName || matchDesc || matchRoom;
      }
      return true;
    });
  }, [reports, viewScope, currentUser.id, statusFilter, categoryFilter, selectedBuilding, searchQuery]);

  return (
    <div className="min-h-screen pb-28 lg:pb-16 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-12 max-w-[1700px] mx-auto space-y-6 font-sans select-none">
      {/* 1. Header with Persona Selector */}
      <div className="rounded-3xl bg-[#090E1A] border border-white/[0.08] p-5 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-2xl">
        <div className="flex items-center gap-4">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-heading font-black text-white">
                {isFaculty ? 'Faculty Departmental Intelligence' : 'Student Campus Analytics'}
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                {currentUser.identifier}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {INSTITUTION_INFO.fullName} • Academic Telemetry & Resolution Rates
            </p>
          </div>
        </div>

        {/* Demo Switcher */}
        <div className="flex items-center gap-1.5 bg-[#0E1626] p-1 rounded-2xl border border-white/[0.08] overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-mono text-slate-500 px-2 uppercase">Switch:</span>
          <button
            onClick={() => login(DEMO_USERS.student_sarah)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              currentUser.id === DEMO_USERS.student_sarah.id ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
            }`}
          >
            Sarah (Student)
          </button>
          <button
            onClick={() => login(DEMO_USERS.student_rahul)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              currentUser.id === DEMO_USERS.student_rahul.id ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
            }`}
          >
            Rahul (Student)
          </button>
          <button
            onClick={() => login(DEMO_USERS.faculty_divya)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
              currentUser.id === DEMO_USERS.faculty_divya.id ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'
            }`}
          >
            Prof. Divya (Faculty)
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'In Custody Vault', count: stats.found, color: 'text-emerald-400', border: 'border-emerald-500/30', status: 'FOUND' },
          { label: 'Active Loss Broadcasts', count: stats.lost, color: 'text-rose-400', border: 'border-rose-500/30', status: 'LOST' },
          { label: 'Verified Recoveries', count: stats.returned, color: 'text-cyan-400', border: 'border-cyan-500/30', status: 'RETURNED' },
          { label: 'Campus Recovery Rate', count: `${stats.recoveryRate}%`, color: 'text-indigo-300', border: 'border-indigo-500/30', status: 'ALL' },
        ].map((m) => (
          <div
            key={m.label}
            onClick={() => setStatusFilter(m.status as any)}
            className={`p-5 rounded-3xl bg-[#090E1A] border ${m.border} transition-all cursor-pointer shadow-xl hover:scale-[1.02]`}
          >
            <span className="text-xs text-slate-400 font-medium block">{m.label}</span>
            <span className={`text-2xl sm:text-3xl font-heading font-black font-mono mt-1 block ${m.color}`}>
              {m.count}
            </span>
          </div>
        ))}
      </div>

      {/* 3. Category Breakdown Grid */}
      <div className="rounded-3xl bg-[#090E1A] border border-white/[0.08] p-6 space-y-4 shadow-2xl">
        <h3 className="text-base font-heading font-black text-white">Category Recovery Matrix</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categoryStats.map((cs) => (
            <div
              key={cs.key}
              onClick={() => setCategoryFilter(categoryFilter === cs.key ? 'ALL' : cs.key)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                categoryFilter === cs.key
                  ? 'bg-indigo-600/20 border-indigo-400'
                  : 'bg-[#0E1626] border-white/[0.06] hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className={`font-bold ${cs.meta.color}`}>{cs.meta.label}</span>
                <span className="font-mono text-slate-400 font-bold">{cs.total}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${cs.recoveryPct}%` }} />
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                {cs.recoveryPct}% resolved
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Filterable List View */}
      <div className="rounded-3xl bg-[#090E1A] border border-white/[0.08] p-6 space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-base font-heading font-black text-white">
            Monitored Incidents ({filteredReports.length})
          </h3>
          <input
            type="text"
            placeholder="Search within incidents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3.5 py-1.5 rounded-xl bg-[#0E1626] border border-white/[0.1] text-xs text-slate-200 placeholder-slate-500 focus-ring"
          />
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredReports.map((r) => (
            <div
              key={r.id}
              onClick={() => setSelectedReportDetail(r)}
              className="p-3.5 rounded-2xl bg-[#0E1626] hover:bg-[#121B2F] border border-white/[0.05] hover:border-indigo-500/40 flex items-center justify-between gap-4 text-xs transition-all cursor-pointer group"
            >
              <div className="min-w-0">
                <span className="font-mono font-bold text-indigo-300">#{r.ticketNumber}</span>
                <span className="text-white font-bold ml-2 group-hover:text-indigo-200 transition-colors">{r.itemName}</span>
                <span className="text-slate-400 ml-2">({r.location.room})</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    r.status === 'RETURNED'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : r.type === 'LOST'
                      ? 'bg-rose-500/20 text-rose-300'
                      : 'bg-teal-500/20 text-teal-300'
                  }`}
                >
                  {r.type}
                </span>
                <span className="material-symbols-outlined text-[16px] text-slate-500 group-hover:text-indigo-300 transition-colors">
                  chevron_right
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reusable Consolidated Report Detail Modal */}
      <ReportDetailModal
        report={selectedReportDetail}
        onClose={() => setSelectedReportDetail(null)}
      />
    </div>
  );
};
