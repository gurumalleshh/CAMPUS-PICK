import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ItemCategory, Report } from '../types';
import { CAMPUS_BUILDINGS, INSTITUTION_INFO } from '../mockData';
import { ReportDetailModal } from './ReportDetailModal';

export const SearchBrowseScreen: React.FC = () => {
  const { reports, openReportModal, setActiveTab, triggerToast, setSelectedMatch, matches } = useApp();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'LOST' | 'FOUND' | 'RETURNED'>('ALL');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'editorial' | 'table'>('editorial');
  const [inspectReport, setInspectReport] = useState<Report | null>(null);

  // Natural query suggestions
  const suggestedQueries = [
    'ThinkPad X1',
    'ID Card USN',
    'Casio Calculator',
    'Gate 1 Vault',
    'AI Lab CS-204',
    'Keys with fob',
  ];

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesQuery =
          r.itemName.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.location.building.toLowerCase().includes(q) ||
          r.location.room.toLowerCase().includes(q) ||
          (r.brand && r.brand.toLowerCase().includes(q)) ||
          (r.color && r.color.toLowerCase().includes(q)) ||
          r.ticketNumber.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      if (selectedCategory !== 'ALL' && r.category !== selectedCategory) return false;
      if (selectedStatus === 'LOST' && r.type !== 'LOST') return false;
      if (selectedStatus === 'FOUND' && (r.type !== 'FOUND' || r.status === 'RETURNED')) return false;
      if (selectedStatus === 'RETURNED' && r.status !== 'RETURNED') return false;

      if (selectedBuilding !== 'ALL') {
        const b = r.location.building.toLowerCase();
        const sel = selectedBuilding.toLowerCase();
        if (sel === 'mechanical' || sel === 'workshop') {
          if (!b.includes('mech') && !b.includes('workshop')) return false;
        } else if (!b.includes(sel)) {
          return false;
        }
      }

      return true;
    });
  }, [reports, query, selectedCategory, selectedStatus, selectedBuilding]);

  const categories: { id: ItemCategory | 'ALL'; label: string; icon: string }[] = [
    { id: 'ALL', label: 'All Items', icon: 'grid_view' },
    { id: 'electronics', label: 'Laptops & Tech', icon: 'laptop_mac' },
    { id: 'id_card', label: 'Student IDs', icon: 'badge' },
    { id: 'keys', label: 'Keys & Fobs', icon: 'key' },
    { id: 'wallet_bag', label: 'Wallets & Bags', icon: 'account_balance_wallet' },
    { id: 'calculator', label: 'Calculators', icon: 'calculate' },
    { id: 'certificate', label: 'Certificates', icon: 'description' },
    { id: 'other', label: 'Other', icon: 'category' },
  ];

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
    <div className="min-h-screen pb-28 lg:pb-16 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-12 max-w-[1700px] mx-auto space-y-6 font-sans select-none">
      {/* ─────────────────────────────────────────────────────────────────────────────
          1. OMNI-SEARCH COMMAND TERMINAL (NATURAL LANGUAGE QUERY)
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-black uppercase text-indigo-400 bg-indigo-500/15 border border-indigo-400/25 px-2.5 py-0.5 rounded-full">
              GLOBAL INTEL REGISTRY
            </span>
            <span className="text-xs font-mono text-slate-500">
              {filteredReports.length} results indexed across PESCE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
            Campus Belonging Search & Intelligence
          </h1>
        </div>

        {/* Command Search Box */}
        <div className="relative">
          <div className="relative flex items-center bg-[#0E1626] border-2 border-white/[0.1] focus-within:border-indigo-500 rounded-3xl p-2 transition-all shadow-xl shadow-black/60">
            <span className="material-symbols-outlined text-[24px] text-indigo-400 pl-3 pr-2">
              search
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search natural keywords: e.g. 'black HP laptop', 'wallet in library', 'casio', '4PS23CS'..."
              className="w-full bg-transparent text-white text-sm sm:text-base placeholder-slate-500 outline-none px-2 py-2"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search query"
                className="p-1.5 rounded-full hover:bg-white/[0.08] text-slate-400 hover:text-white mr-2"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
            <button
              onClick={() => openReportModal('LOST')}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>+ New Report</span>
            </button>
          </div>

          {/* Quick Query Suggestion Chips */}
          <div className="flex items-center gap-2 pt-2.5 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-mono text-slate-500 shrink-0">Try searching:</span>
            {suggestedQueries.map((sq) => (
              <button
                key={sq}
                onClick={() => setQuery(sq)}
                className="px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-slate-300 text-xs font-medium whitespace-nowrap transition-colors cursor-pointer"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. FACET FILTER CONTROLS & VIEW MODE TOGGLE
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="p-4 rounded-3xl bg-[#090E1A] border border-white/[0.08] space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                    : 'bg-[#0E1626] text-slate-400 hover:text-white border border-white/[0.05]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Line: Status + Building + View Mode */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/[0.06]">
          {/* Status Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            {[
              { id: 'ALL', label: 'All States' },
              { id: 'LOST', label: 'Active Lost' },
              { id: 'FOUND', label: 'In Custody' },
              { id: 'RETURNED', label: 'Safely Returned' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedStatus === st.id
                    ? 'bg-white/[0.12] text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Sector Select */}
            <select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              className="bg-[#0E1626] border border-white/[0.1] text-xs text-slate-200 rounded-xl px-3 py-1.5 focus-ring cursor-pointer"
            >
              <option value="ALL">All Campus Buildings</option>
              <option value="CS">CS & Engineering Wing</option>
              <option value="Library">Central Library</option>
              <option value="Main">Main Academic Block</option>
              <option value="Mechanical">Mechanical Workshop (Block D)</option>
              <option value="Gate 1">Gate 1 Security Post</option>
              <option value="Cafe">Student Center & Cafeteria</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#0E1626] p-0.5 rounded-xl border border-white/[0.08]">
              <button
                onClick={() => setViewMode('editorial')}
                className={`p-1.5 rounded-lg text-xs cursor-pointer ${
                  viewMode === 'editorial' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
                title="Editorial Split View"
              >
                <span className="material-symbols-outlined text-[17px] block">view_agenda</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs cursor-pointer ${
                  viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
                title="Dense Data Table"
              >
                <span className="material-symbols-outlined text-[17px] block">table_rows</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          3. SEARCH RESULTS STAGE (EDITORIAL SPLIT OR DENSE TABLE)
      ───────────────────────────────────────────────────────────────────────────── */}
      {filteredReports.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-[#090E1A] border border-white/[0.08] space-y-3">
          <span className="material-symbols-outlined text-[48px] text-slate-600">manage_search</span>
          <h3 className="text-base font-bold text-white">No belongings match your search query</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try checking for alternate spelling, removing filters, or file a loss report so security can scan for it.
          </p>
          <button
            onClick={() => {
              setQuery('');
              setSelectedCategory('ALL');
              setSelectedStatus('ALL');
              setSelectedBuilding('ALL');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'editorial' ? (
        /* EDITORIAL SPLIT VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReports.map((report) => {
            const isLost = report.type === 'LOST';
            const isReturned = report.status === 'RETURNED';
            const photo =
              report.publicPhotoUrl ||
              report.imageUrl ||
              'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400&auto=format&fit=crop&q=80';

            return (
              <article
                key={report.id}
                onClick={() => setInspectReport(report)}
                className="group relative rounded-3xl bg-[#090E1A] hover:bg-[#0D1527] border border-white/[0.08] hover:border-indigo-500/40 p-5 space-y-4 transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-xl"
              >
                <div className="space-y-3">
                  {/* Photo & Category Icon */}
                  <div className="relative rounded-2xl overflow-hidden aspect-video bg-black/40 ring-1 ring-white/[0.08]">
                    <img src={photo} alt={report.itemName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span
                      className={`absolute top-2.5 left-2.5 text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-full shadow-md ${
                        isReturned
                          ? 'bg-emerald-500 text-white'
                          : isLost
                          ? 'bg-rose-500 text-white'
                          : 'bg-teal-500 text-white'
                      }`}
                    >
                      {isReturned ? 'RETURNED' : isLost ? 'LOST' : 'IN VAULT'}
                    </span>
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-white text-[10px] font-mono">
                      #{report.ticketNumber}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-heading font-black text-white group-hover:text-indigo-200 transition-colors truncate">
                      {report.itemName}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {report.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/[0.06]">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300 truncate">
                      <span className="material-symbols-outlined text-[15px] text-indigo-400">location_on</span>
                      <span className="truncate">{report.location.room}</span>
                    </span>
                    <span className="text-[10.5px] font-mono text-slate-500 shrink-0">
                      {report.eventTime || 'Today'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <img
                        src={report.reporterAvatarUrl}
                        alt={report.reporterName}
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-700"
                      />
                      <span className="text-[11px] text-slate-300 font-semibold">{report.reporterName}</span>
                    </div>

                    <span className="text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center">
                      <span>Dossier</span>
                      <span className="material-symbols-outlined text-[15px]">chevron_right</span>
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* DENSE DATA TABLE VIEW */
        <div className="rounded-3xl bg-[#090E1A] border border-white/[0.08] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0E1626] border-b border-white/[0.08] text-slate-400 font-mono text-[10.5px] uppercase">
                <tr>
                  <th className="p-4">Ticket</th>
                  <th className="p-4">Item Name</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Building & Lab</th>
                  <th className="p-4">Reporter</th>
                  <th className="p-4">Logged Time</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredReports.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setInspectReport(r)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer"
                  >
                    <td className="p-4 font-mono text-indigo-300 font-bold">#{r.ticketNumber}</td>
                    <td className="p-4 font-bold text-white max-w-[200px] truncate">{r.itemName}</td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-mono font-bold uppercase px-2 py-0.5 rounded ${
                          r.status === 'RETURNED'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : r.type === 'LOST'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-teal-500/20 text-teal-300'
                        }`}
                      >
                        {r.type}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 truncate max-w-[180px]">
                      {r.location.building} • {r.location.room}
                    </td>
                    <td className="p-4 text-slate-400">{r.reporterName}</td>
                    <td className="p-4 font-mono text-slate-400">{r.eventTime || 'Today'}</td>
                    <td className="p-4 text-right">
                      <span className="text-indigo-400 hover:text-indigo-300 font-bold">Inspect →</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Consolidated Reusable Report Detail Modal */}
      <ReportDetailModal
        report={inspectReport}
        onClose={() => setInspectReport(null)}
      />
    </div>
  );
};
