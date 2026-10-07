import React, { useState } from 'react';
import { Report, ItemCategory, ReportStatus } from '../types';
import { useApp } from '../context/AppContext';

interface ItemsInventoryTableProps {
  reports: Report[];
  selectedCategory: ItemCategory | 'ALL';
  onSelectCategory: (category: ItemCategory | 'ALL') => void;
  selectedStatusFilter: 'ALL' | 'FOUND' | 'LOST' | 'RETURNED';
  onSelectStatusFilter: (status: 'ALL' | 'FOUND' | 'LOST' | 'RETURNED') => void;
}

export const ItemsInventoryTable: React.FC<ItemsInventoryTableProps> = ({
  reports,
  selectedCategory,
  onSelectCategory,
  selectedStatusFilter,
  onSelectStatusFilter,
}) => {
  const { currentUser, updateReportStatus, triggerToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReportForModal, setSelectedReportForModal] = useState<Report | null>(null);
  const [confirmReturnReport, setConfirmReturnReport] = useState<Report | null>(null);
  const [returnHandoverNotes, setReturnHandoverNotes] = useState('');

  // Filter reports according to status, category, and search query
  const filteredReports = reports.filter((report) => {
    // 1. Status Filter
    if (selectedStatusFilter === 'FOUND' && report.status !== 'FOUND') return false;
    if (
      selectedStatusFilter === 'LOST' &&
      report.status !== 'LOST' &&
      report.status !== 'POTENTIAL_MATCH' &&
      report.status !== 'UNDER_REVIEW'
    )
      return false;
    if (selectedStatusFilter === 'RETURNED' && report.status !== 'RETURNED') return false;

    // 2. Category Filter
    if (selectedCategory !== 'ALL' && report.category !== selectedCategory) return false;

    // 3. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = report.itemName.toLowerCase().includes(q);
      const matchTicket = report.ticketNumber.toLowerCase().includes(q);
      const matchBrand = report.brand?.toLowerCase().includes(q) || false;
      const matchReporter = report.reporterName.toLowerCase().includes(q);
      const matchBuilding = report.location?.building?.toLowerCase().includes(q) || false;
      const matchDesc = report.description?.toLowerCase().includes(q) || false;
      return matchName || matchTicket || matchBrand || matchReporter || matchBuilding || matchDesc;
    }

    return true;
  });

  const handleMarkReturned = (report: Report) => {
    updateReportStatus(report.id, 'RETURNED');
    setConfirmReturnReport(null);
    setReturnHandoverNotes('');
    triggerToast(
      `Case ${report.ticketNumber} marked as RETURNED. Handover recorded in custodial ledger.`,
      'task_alt',
      'success'
    );
  };

  const handleCopyTicket = (ticket: string) => {
    navigator.clipboard?.writeText(ticket);
    triggerToast(`Ticket ${ticket} copied to clipboard`, 'content_copy', 'info');
  };

  const exportToCSV = () => {
    const headers = [
      'Ticket Number',
      'Type',
      'Status',
      'Item Name',
      'Category',
      'Brand/Model',
      'Building',
      'Room/Area',
      'Reporter Name',
      'Reporter Role',
      'Date Reported',
    ];

    const rows = filteredReports.map((r) => [
      `"${r.ticketNumber}"`,
      `"${r.type}"`,
      `"${r.status}"`,
      `"${r.itemName.replace(/"/g, '""')}"`,
      `"${r.category}"`,
      `"${(r.brand || '') + (r.model ? ' ' + r.model : '')}"`,
      `"${r.location?.building || ''}"`,
      `"${r.location?.room || r.location?.areaDescription || ''}"`,
      `"${r.reporterName}"`,
      `"${r.reporterRole}"`,
      `"${r.eventDate} ${r.eventTime}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PESCE_CampusPick_Items_Register_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast('Custody Register exported successfully to CSV.', 'download', 'success');
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'RETURNED':
        return {
          label: 'Returned to Owner',
          bg: 'bg-teal-50 text-teal-700 border-teal-200',
          icon: 'task_alt',
        };
      case 'FOUND':
        return {
          label: 'Secured in Custody',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: 'check_circle',
        };
      case 'LOST':
        return {
          label: 'Lost / Open Search',
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: 'search',
        };
      case 'POTENTIAL_MATCH':
        return {
          label: 'Potential Match Found',
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: 'join_inner',
        };
      case 'UNDER_REVIEW':
        return {
          label: 'Verification Pending',
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: 'hourglass_top',
        };
      case 'VERIFIED':
        return {
          label: 'Ownership Verified',
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          icon: 'verified',
        };
      default:
        return {
          label: status,
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: 'info',
        };
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
      {/* 1. SECTION TITLE & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-indigo-600">
              format_list_bulleted
            </span>
            <h3 className="font-heading font-bold text-base text-slate-900">
              Campus Items Registry (Found, Lost & Returned)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time custodial registry with role-authorized status management and verification controls
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportToCSV}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            title="Download CSV log for institutional records"
          >
            <span className="material-symbols-outlined text-[16px] text-indigo-600">
              download
            </span>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. FILTER & SEARCH TOOLBAR */}
      <div className="space-y-2.5">
        {/* Top Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => onSelectStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedStatusFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>All Records</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
              {reports.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectStatusFilter('FOUND')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedStatusFilter === 'FOUND'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">verified</span>
            <span>In Custody (Found)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
              {reports.filter((r) => r.status === 'FOUND').length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectStatusFilter('LOST')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedStatusFilter === 'LOST'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-rose-800 hover:bg-rose-50'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">search</span>
            <span>Items Lost</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
              {
                reports.filter(
                  (r) =>
                    r.status === 'LOST' ||
                    r.status === 'POTENTIAL_MATCH' ||
                    r.status === 'UNDER_REVIEW'
                ).length
              }
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectStatusFilter('RETURNED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedStatusFilter === 'RETURNED'
                ? 'bg-teal-600 text-white shadow-2xs'
                : 'text-teal-800 hover:bg-teal-50'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">task_alt</span>
            <span>Reunited to Owner</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
              {reports.filter((r) => r.status === 'RETURNED').length}
            </span>
          </button>
        </div>

        {/* Search input and Category quick selector */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket # (CP-...), item name, reporter, or location..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 focus:bg-white outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="w-full sm:w-56 shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:bg-white outline-none cursor-pointer"
            >
              <option value="ALL">All Categories ({reports.length})</option>
              <option value="electronics">Electronics & Laptops</option>
              <option value="id_card">ID Cards & Smart Badges</option>
              <option value="calculator">Scientific Calculators</option>
              <option value="keys">Keys & Keychains</option>
              <option value="wallet_bag">Wallets & Bags</option>
              <option value="books_notes">Books & Lab Notes</option>
              <option value="certificate">Certificates & Documents</option>
              <option value="other">Other Essentials</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Indicators */}
      {(selectedCategory !== 'ALL' || selectedStatusFilter !== 'ALL' || searchQuery) && (
        <div className="flex items-center flex-wrap gap-1.5 text-xs text-slate-500 pt-1">
          <span className="font-semibold text-[11px]">Filtered by:</span>
          {selectedStatusFilter !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-semibold">
              Status: {selectedStatusFilter}
              <button
                onClick={() => onSelectStatusFilter('ALL')}
                className="hover:text-rose-600 cursor-pointer"
              >
                ×
              </button>
            </span>
          )}
          {selectedCategory !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-semibold">
              Category: {selectedCategory.replace('_', ' ')}
              <button
                onClick={() => onSelectCategory('ALL')}
                className="hover:text-rose-600 cursor-pointer"
              >
                ×
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
              Keyword: "{searchQuery}"
              <button
                onClick={() => setSearchQuery('')}
                className="hover:text-rose-600 cursor-pointer"
              >
                ×
              </button>
            </span>
          )}
          <button
            onClick={() => {
              onSelectCategory('ALL');
              onSelectStatusFilter('ALL');
              setSearchQuery('');
            }}
            className="text-[11px] text-rose-600 hover:underline font-semibold ml-1 cursor-pointer"
          >
            Reset All
          </button>
        </div>
      )}

      {/* 3. ITEMS LIST CARDS */}
      {filteredReports.length === 0 ? (
        <div className="p-10 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 space-y-2">
          <span className="material-symbols-outlined text-[36px] text-slate-300">
            search_off
          </span>
          <p className="text-xs font-semibold text-slate-700">No items match the chosen filters</p>
          <p className="text-[11px] text-slate-400">
            Try adjusting your search query, status selector, or category filter
          </p>
          <button
            onClick={() => {
              onSelectCategory('ALL');
              onSelectStatusFilter('ALL');
              setSearchQuery('');
            }}
            className="mt-2 px-3.5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-all cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReports.map((report) => {
            const statusInfo = getStatusBadge(report.status);
            const isReturned = report.status === 'RETURNED';

            return (
              <div
                key={report.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isReturned
                    ? 'bg-slate-50/50 border-slate-200/80 hover:border-slate-300'
                    : 'bg-white border-slate-200/80 hover:border-indigo-300 hover:shadow-2xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  {/* Left info */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    {/* Thumbnail / Category Icon */}
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                      {report.publicPhotoUrl ? (
                        <img
                          src={report.publicPhotoUrl}
                          alt={report.itemName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-[24px] text-slate-400">
                          {report.category === 'electronics'
                            ? 'laptop_chromebook'
                            : report.category === 'id_card'
                            ? 'badge'
                            : report.category === 'calculator'
                            ? 'calculate'
                            : report.category === 'keys'
                            ? 'key'
                            : report.category === 'wallet_bag'
                            ? 'account_balance_wallet'
                            : report.category === 'books_notes'
                            ? 'menu_book'
                            : report.category === 'certificate'
                            ? 'history_edu'
                            : 'category'}
                        </span>
                      )}
                    </div>

                    {/* Meta & Descriptions */}
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center flex-wrap gap-1.5">
                        {/* Ticket pill with copy */}
                        <button
                          type="button"
                          onClick={() => handleCopyTicket(report.ticketNumber)}
                          className="font-mono text-[10.5px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded cursor-pointer flex items-center gap-1"
                          title="Click to copy ticket number"
                        >
                          <span>{report.ticketNumber}</span>
                          <span className="material-symbols-outlined text-[11px]">content_copy</span>
                        </button>

                        {/* Type badge: LOST or FOUND */}
                        <span
                          className={`text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                            report.type === 'FOUND'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {report.type}
                        </span>

                        {/* Category pill */}
                        <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full capitalize">
                          {report.category.replace('_', ' ')}
                        </span>

                        {/* Status badge */}
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${statusInfo.bg}`}
                        >
                          <span className="material-symbols-outlined text-[12px]">
                            {statusInfo.icon}
                          </span>
                          <span>{statusInfo.label}</span>
                        </span>
                      </div>

                      {/* Item Name */}
                      <h4 className="font-heading font-bold text-sm text-slate-900">
                        {report.itemName}
                        {report.brand && (
                          <span className="font-normal text-slate-500 text-xs ml-1.5">
                            ({report.brand} {report.model || ''})
                          </span>
                        )}
                      </h4>

                      {/* Location & Time */}
                      <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] text-indigo-600">
                            location_on
                          </span>
                          <span className="font-medium text-slate-700">
                            {report.location?.building}
                            {report.location?.room ? ` • ${report.location.room}` : ''}
                          </span>
                        </span>

                        {report.location?.areaDescription && (
                          <span className="text-slate-500 truncate max-w-[200px]">
                            ({report.location.areaDescription})
                          </span>
                        )}

                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] text-slate-400">
                            schedule
                          </span>
                          <span>
                            {report.eventDate} at {report.eventTime}
                          </span>
                        </span>
                      </div>

                      {/* Reporter Tag */}
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-0.5">
                        <span className="text-slate-400">Reported by:</span>
                        <span className="font-semibold text-slate-700">{report.reporterName}</span>
                        <span className="text-xs uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {report.reporterRole}
                        </span>
                        {report.reporterDepartment && (
                          <span className="text-slate-400">({report.reporterDepartment})</span>
                        )}
                      </div>

                      {/* Confidential Details Preview */}
                      {report.hasPrivateEvidence && (
                        <div className="mt-1.5 p-2 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-950 flex items-start gap-2">
                          <span className="material-symbols-outlined text-[16px] text-amber-700 shrink-0 mt-0.5">
                            lock
                          </span>
                          <div className="min-w-0">
                            <span className="font-semibold text-amber-900">
                              Confidential Proof on Record:
                            </span>{' '}
                            {report.privateEvidence?.serialNumber && (
                              <span className="font-mono font-semibold bg-white/80 px-1 rounded border border-amber-200 mr-1.5">
                                S/N: {report.privateEvidence.serialNumber}
                              </span>
                            )}
                            {report.privateEvidence?.privateNotes && (
                              <span className="italic opacity-90">
                                "{report.privateEvidence.privateNotes}"
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedReportForModal(report)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-[14px]">visibility</span>
                      <span>Dossier</span>
                    </button>

                    {!isReturned && (
                      <button
                        type="button"
                        onClick={() => setConfirmReturnReport(report)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                        title="Authorize physical handover and record as RETURNED"
                      >
                        <span className="material-symbols-outlined text-[14px]">task_alt</span>
                        <span>Mark Returned</span>
                      </button>
                    )}

                    {isReturned && (
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                        <span>Handed Over</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. CONFIRM MARK RETURNED MODAL */}
      {confirmReturnReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[28px]">handshake</span>
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Confirm Return & Handover
              </h3>
              <p className="text-xs text-slate-500">
                Ticket <strong className="font-mono text-slate-800">{confirmReturnReport.ticketNumber}</strong> • {confirmReturnReport.itemName}
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Witnessing Officer:</span>
                <span className="font-semibold text-slate-800">
                  {currentUser?.displayName || 'Custody Staff'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {confirmReturnReport.category.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="font-medium text-slate-700">
                  {confirmReturnReport.location?.building}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Custody Handover Remarks (Optional)
              </label>
              <textarea
                value={returnHandoverNotes}
                onChange={(e) => setReturnHandoverNotes(e.target.value)}
                placeholder="E.g. Student ID verified, signed physical register at Gate 1 custody desk..."
                rows={2}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-600 focus:bg-white transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setConfirmReturnReport(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleMarkReturned(confirmReturnReport)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">task_alt</span>
                <span>Confirm Return</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. FULL DOSSIER / DETAILS MODAL */}
      {selectedReportForModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-semibold text-slate-500">
                  {selectedReportForModal.ticketNumber}
                </span>
                <h3 className="font-heading font-bold text-lg text-slate-900 mt-0.5">
                  {selectedReportForModal.itemName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReportForModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Photo if present */}
            {selectedReportForModal.publicPhotoUrl && (
              <div className="w-full h-48 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src={selectedReportForModal.publicPhotoUrl}
                  alt={selectedReportForModal.itemName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Basic Info Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {selectedReportForModal.status}
                </p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Category</span>
                <p className="font-semibold text-slate-800 mt-0.5 capitalize">
                  {selectedReportForModal.category.replace('_', ' ')}
                </p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Building</span>
                <p className="font-semibold text-slate-800 mt-0.5 truncate">
                  {selectedReportForModal.location?.building}
                </p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Time & Date</span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {selectedReportForModal.eventDate} at {selectedReportForModal.eventTime}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="text-xs space-y-1">
              <span className="font-semibold text-slate-700">Public Item Description:</span>
              <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                {selectedReportForModal.description || 'No description provided.'}
              </p>
            </div>

            {/* Identifying features */}
            {selectedReportForModal.identifyingFeatures && (
              <div className="text-xs space-y-1">
                <span className="font-semibold text-slate-700">Identifying Features:</span>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedReportForModal.identifyingFeatures}
                </p>
              </div>
            )}

            {/* Private Evidence (Confidential) */}
            {selectedReportForModal.hasPrivateEvidence && (
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs space-y-2">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  <span>Confidential Proof & Serial Information (Security Clearance Required)</span>
                </div>
                {selectedReportForModal.privateEvidence?.serialNumber && (
                  <div>
                    <span className="text-amber-800 font-semibold">Registered Serial / IMEI:</span>
                    <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-amber-300 ml-2">
                      {selectedReportForModal.privateEvidence.serialNumber}
                    </span>
                  </div>
                )}
                {selectedReportForModal.privateEvidence?.invoiceFileName && (
                  <div>
                    <span className="text-amber-800 font-semibold">Attached Invoice:</span>
                    <span className="font-medium text-amber-900 ml-2">
                      {selectedReportForModal.privateEvidence.invoiceFileName}
                    </span>
                  </div>
                )}
                {selectedReportForModal.privateEvidence?.privateNotes && (
                  <div>
                    <span className="text-amber-800 font-semibold">Private Verification Notes:</span>
                    <p className="mt-0.5 italic text-amber-900">
                      "{selectedReportForModal.privateEvidence.privateNotes}"
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Reporter Profile */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Reporter</span>
                <p className="font-semibold text-slate-800">{selectedReportForModal.reporterName}</p>
                <p className="text-slate-500 text-[11px] capitalize">
                  {selectedReportForModal.reporterRole} • {selectedReportForModal.reporterDepartment || 'PESCE'}
                </p>
              </div>
              <span className="text-[10px] font-mono bg-white px-2 py-1 rounded-lg border border-slate-200 text-slate-600">
                User ID: {selectedReportForModal.reporterId}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedReportForModal(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
