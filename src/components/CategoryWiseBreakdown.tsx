import React from 'react';
import { Report, ItemCategory } from '../types';

interface CategoryWiseBreakdownProps {
  reports: Report[];
  selectedCategory: ItemCategory | 'ALL';
  onSelectCategory: (category: ItemCategory | 'ALL') => void;
  selectedStatusFilter: 'ALL' | 'FOUND' | 'LOST' | 'RETURNED';
  onSelectStatusFilter: (status: 'ALL' | 'FOUND' | 'LOST' | 'RETURNED') => void;
}

interface CategoryMeta {
  id: ItemCategory;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  barColor: string;
}

const CATEGORIES: CategoryMeta[] = [
  {
    id: 'electronics',
    name: 'Electronics & Gadgets',
    icon: 'laptop_chromebook',
    color: 'emerald',
    bgColor: 'bg-[#C3D809]/20',
    borderColor: 'border-[#C3D809]',
    textColor: 'text-[#222022]',
    barColor: 'bg-[#C3D809]',
  },
  {
    id: 'id_card',
    name: 'ID Cards & Badges',
    icon: 'badge',
    color: 'blue',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-900',
    barColor: 'bg-blue-600',
  },
  {
    id: 'calculator',
    name: 'Scientific Calculators',
    icon: 'calculate',
    color: 'teal',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    textColor: 'text-teal-900',
    barColor: 'bg-teal-600',
  },
  {
    id: 'keys',
    name: 'Keys & Lanyards',
    icon: 'key',
    color: 'amber',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-900',
    barColor: 'bg-amber-600',
  },
  {
    id: 'wallet_bag',
    name: 'Wallets & Bags',
    icon: 'account_balance_wallet',
    color: 'purple',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-900',
    barColor: 'bg-purple-600',
  },
  {
    id: 'books_notes',
    name: 'Books & Lab Notes',
    icon: 'menu_book',
    color: 'indigo',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-900',
    barColor: 'bg-indigo-600',
  },
  {
    id: 'certificate',
    name: 'Certificates & Documents',
    icon: 'history_edu',
    color: 'rose',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-900',
    barColor: 'bg-rose-600',
  },
  {
    id: 'other',
    name: 'Other Campus Items',
    icon: 'category',
    color: 'slate',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-300',
    textColor: 'text-slate-800',
    barColor: 'bg-slate-600',
  },
];

export const CategoryWiseBreakdown: React.FC<CategoryWiseBreakdownProps> = ({
  reports,
  selectedCategory,
  onSelectCategory,
  selectedStatusFilter,
  onSelectStatusFilter,
}) => {
  // Aggregate items by status correctly based on r.type and r.status
  const totalCount = reports.length;
  const foundReports = reports.filter((r) => r.type === 'FOUND' && r.status !== 'RETURNED');
  const lostReports = reports.filter((r) => r.type === 'LOST' && r.status !== 'RETURNED');
  const returnedReports = reports.filter((r) => r.status === 'RETURNED');

  const recoveredCount = foundReports.length + returnedReports.length;
  const overallRecoveryRate = totalCount > 0 ? ((recoveredCount / totalCount) * 100).toFixed(1) : '0';
  const overallReturnRate = totalCount > 0 ? Math.round((returnedReports.length / totalCount) * 100) : 0;

  // Aggregate stats per category
  const categoryStats = CATEGORIES.map((cat) => {
    const catReports = reports.filter((r) => r.category === cat.id);
    const catTotal = catReports.length;
    const catFound = catReports.filter((r) => r.type === 'FOUND' && r.status !== 'RETURNED').length;
    const catLost = catReports.filter((r) => r.type === 'LOST' && r.status !== 'RETURNED').length;
    const catReturned = catReports.filter((r) => r.status === 'RETURNED').length;
    const catRecovered = catFound + catReturned;
    const recoveryRate = catTotal > 0 ? Math.round((catRecovered / catTotal) * 100) : 0;
    const returnRate = catTotal > 0 ? Math.round((catReturned / catTotal) * 100) : 0;

    return {
      ...cat,
      total: catTotal,
      found: catFound,
      lost: catLost,
      returned: catReturned,
      recovered: catRecovered,
      recoveryRate,
      returnRate,
    };
  });

  return (
    <div className="space-y-4">
      {/* 1. TOP METRIC CARDS: FOUND, LOST, RETURNED & TOTAL */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* TOTAL */}
        <div
          onClick={() => {
            onSelectStatusFilter('ALL');
            onSelectCategory('ALL');
          }}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            selectedStatusFilter === 'ALL' && selectedCategory === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-800/30'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold uppercase tracking-wider opacity-75">
              Total Logged
            </span>
            <span className="material-symbols-outlined text-[18px] opacity-60">inventory_2</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-heading font-black">{totalCount}</span>
            <span className="text-[11px] opacity-75">registered items</span>
          </div>
          <div className="text-[10px] opacity-70 mt-1">Campus-wide register</div>
        </div>

        {/* FOUND */}
        <div
          onClick={() => onSelectStatusFilter(selectedStatusFilter === 'FOUND' ? 'ALL' : 'FOUND')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            selectedStatusFilter === 'FOUND'
              ? 'bg-[#222022] text-[#C3D809] border-[#222022] shadow-md ring-2 ring-[#C3D809]/40'
              : 'bg-[#C3D809]/20 text-[#222022] border-[#C3D809] hover:border-[#222022] shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#222022]/90 dark:text-white/90">
              Items Found
            </span>
            <span className="material-symbols-outlined text-[18px] text-[#222022] dark:text-white">
              verified
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-heading font-black">{foundReports.length}</span>
            <span className="text-[11px] font-semibold opacity-85">
              {totalCount > 0 ? `${Math.round((foundReports.length / totalCount) * 100)}%` : '0%'}
            </span>
          </div>
          <div className="text-[10px] font-medium opacity-80 mt-1">In campus custody</div>
        </div>

        {/* LOST */}
        <div
          onClick={() => onSelectStatusFilter(selectedStatusFilter === 'LOST' ? 'ALL' : 'LOST')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            selectedStatusFilter === 'LOST'
              ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-500/40'
              : 'bg-amber-50/70 text-amber-950 border-amber-200 hover:border-amber-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-amber-800/90 dark:text-white/90">
              Items Lost
            </span>
            <span className="material-symbols-outlined text-[18px] text-amber-600 dark:text-white">
              search
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-heading font-black">{lostReports.length}</span>
            <span className="text-[11px] font-semibold opacity-85">
              {totalCount > 0 ? `${Math.round((lostReports.length / totalCount) * 100)}%` : '0%'}
            </span>
          </div>
          <div className="text-[10px] font-medium opacity-80 mt-1">Active match search</div>
        </div>

        {/* RETURNED */}
        <div
          onClick={() => onSelectStatusFilter(selectedStatusFilter === 'RETURNED' ? 'ALL' : 'RETURNED')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            selectedStatusFilter === 'RETURNED'
              ? 'bg-teal-700 text-white border-teal-700 shadow-md ring-2 ring-teal-600/40'
              : 'bg-teal-50/70 text-teal-950 border-teal-200 hover:border-teal-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-teal-800/90 dark:text-white/90">
              Items Returned
            </span>
            <span className="material-symbols-outlined text-[18px] text-teal-600 dark:text-white">
              task_alt
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl font-heading font-black">{returnedReports.length}</span>
            <span className="text-[11px] font-semibold opacity-85">
              {overallReturnRate}% reunited
            </span>
          </div>
          <div className="text-[10px] font-medium opacity-80 mt-1">
            {overallRecoveryRate}% total secured ({returnedReports.length} reunited + {foundReports.length} in custody)
          </div>
        </div>
      </div>

      {/* 2. CATEGORY-WISE ANALYTICS SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#222022]">
                pie_chart
              </span>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Category-Wise Distribution & Resolution
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of Found, Lost, and Returned items categorized across campus facilities
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSelectCategory('ALL')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-[#222022] text-[#C3D809] shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              All Categories
            </button>
            {selectedCategory !== 'ALL' && (
              <span className="text-[11px] font-medium text-slate-500">
                Filtered: <strong className="text-[#222022] capitalize">{selectedCategory.replace('_', ' ')}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {categoryStats.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? 'ALL' : cat.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer group text-left ${
                  isSelected
                    ? 'border-[#222022] ring-2 ring-[#C3D809]/40 shadow-md bg-[#C3D809]/20'
                    : 'border-slate-200 hover:border-[#C3D809] hover:bg-slate-50/70 shadow-2xs'
                }`}
              >
                {/* Header: Icon & Category Name */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${cat.bgColor} ${cat.borderColor} border`}
                    >
                      <span className={`material-symbols-outlined text-[18px] ${cat.textColor}`}>
                        {cat.icon}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-heading font-bold text-xs text-slate-900 truncate">
                        {cat.name}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {cat.total} {cat.total === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded shrink-0 ${
                      cat.recoveryRate >= 60
                        ? 'bg-[#C3D809]/30 text-[#222022] border border-[#C3D809]'
                        : cat.recoveryRate >= 40
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {cat.recoveryRate}% rec
                  </span>
                </div>

                {/* Sub-counts: Found, Lost, Returned */}
                <div className="grid grid-cols-3 gap-1 mt-3 pt-2.5 border-t border-slate-100 text-center">
                  <div className="bg-[#C3D809]/20 rounded-lg p-1">
                    <span className="block text-[9px] font-bold text-[#222022] uppercase">Found</span>
                    <span className="text-xs font-black text-[#222022]">{cat.found}</span>
                  </div>
                  <div className="bg-amber-50/70 rounded-lg p-1">
                    <span className="block text-[9px] font-bold text-amber-700 uppercase">Lost</span>
                    <span className="text-xs font-black text-amber-900">{cat.lost}</span>
                  </div>
                  <div className="bg-teal-50/70 rounded-lg p-1">
                    <span className="block text-[9px] font-bold text-teal-700 uppercase">Returned</span>
                    <span className="text-xs font-black text-teal-900">{cat.returned}</span>
                  </div>
                </div>

                {/* Resolution Progress Bar */}
                <div className="mt-2.5 space-y-1">
                  <div className="flex items-center justify-between text-[9.5px] text-slate-500 font-medium">
                    <span>Secured / Recovered</span>
                    <span className="font-bold text-slate-700">{cat.recovered} of {cat.total} ({cat.recoveryRate}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${cat.barColor}`}
                      style={{ width: `${Math.min(100, Math.max(8, cat.recoveryRate))}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
