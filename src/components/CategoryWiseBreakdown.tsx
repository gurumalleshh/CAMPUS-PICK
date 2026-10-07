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
    color: 'indigo',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-700',
    barColor: 'bg-indigo-600',
  },
  {
    id: 'id_card',
    name: 'ID Cards & Badges',
    icon: 'badge',
    color: 'blue',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    barColor: 'bg-blue-600',
  },
  {
    id: 'calculator',
    name: 'Scientific Calculators',
    icon: 'calculate',
    color: 'teal',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    textColor: 'text-teal-700',
    barColor: 'bg-teal-600',
  },
  {
    id: 'keys',
    name: 'Keys & Lanyards',
    icon: 'key',
    color: 'amber',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    barColor: 'bg-amber-600',
  },
  {
    id: 'wallet_bag',
    name: 'Wallets & Bags',
    icon: 'account_balance_wallet',
    color: 'purple',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    barColor: 'bg-purple-600',
  },
  {
    id: 'books_notes',
    name: 'Books & Lab Notes',
    icon: 'menu_book',
    color: 'sky',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-700',
    barColor: 'bg-sky-600',
  },
  {
    id: 'certificate',
    name: 'Certificates & Documents',
    icon: 'history_edu',
    color: 'rose',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-700',
    barColor: 'bg-rose-600',
  },
  {
    id: 'other',
    name: 'Other Campus Items',
    icon: 'category',
    color: 'slate',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-200',
    textColor: 'text-slate-700',
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
  const totalCount = reports.length;
  const foundReports = reports.filter((r) => r.type === 'FOUND' && r.status !== 'RETURNED');
  const lostReports = reports.filter((r) => r.type === 'LOST' && r.status !== 'RETURNED');
  const returnedReports = reports.filter((r) => r.status === 'RETURNED');

  const recoveredCount = foundReports.length + returnedReports.length;
  const overallRecoveryRate = totalCount > 0 ? ((recoveredCount / totalCount) * 100).toFixed(1) : '0';
  const overallReturnRate = totalCount > 0 ? Math.round((returnedReports.length / totalCount) * 100) : 0;

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
      {/* 1. TOP METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* TOTAL */}
        <div
          onClick={() => {
            onSelectStatusFilter('ALL');
            onSelectCategory('ALL');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatusFilter === 'ALL' && selectedCategory === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-800/30'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-semibold uppercase tracking-wider opacity-75">
              Total Logged
            </span>
            <span className="material-symbols-outlined text-[18px] opacity-60">inventory_2</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-heading font-bold">{totalCount}</span>
            <span className="text-[11px] opacity-75">registered</span>
          </div>
          <div className="text-[10.5px] opacity-70 mt-1">PESCE Campus Registry</div>
        </div>

        {/* FOUND */}
        <div
          onClick={() => onSelectStatusFilter(selectedStatusFilter === 'FOUND' ? 'ALL' : 'FOUND')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatusFilter === 'FOUND'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/30'
              : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              In Custody (Found)
            </span>
            <span className="material-symbols-outlined text-[18px] text-emerald-600">
              check_circle
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-heading font-bold text-slate-900 group-hover:text-emerald-700">
              {foundReports.length}
            </span>
            <span className="text-[11px] font-semibold text-emerald-700">
              {totalCount > 0 ? `${Math.round((foundReports.length / totalCount) * 100)}%` : '0%'}
            </span>
          </div>
          <div className="text-[10.5px] text-slate-500 mt-1">Secured at Gate 1 / Desks</div>
        </div>

        {/* LOST */}
        <div
          onClick={() => onSelectStatusFilter(selectedStatusFilter === 'LOST' ? 'ALL' : 'LOST')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatusFilter === 'LOST'
              ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-500/30'
              : 'bg-white text-slate-800 border-slate-200 hover:border-rose-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-semibold uppercase tracking-wider text-rose-800">
              Open Lost Reports
            </span>
            <span className="material-symbols-outlined text-[18px] text-rose-600">
              search
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-heading font-bold text-slate-900">
              {lostReports.length}
            </span>
            <span className="text-[11px] font-semibold text-rose-700">
              {totalCount > 0 ? `${Math.round((lostReports.length / totalCount) * 100)}%` : '0%'}
            </span>
          </div>
          <div className="text-[10.5px] text-slate-500 mt-1">Active student searches</div>
        </div>

        {/* RETURNED */}
        <div
          onClick={() => onSelectStatusFilter(selectedStatusFilter === 'RETURNED' ? 'ALL' : 'RETURNED')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedStatusFilter === 'RETURNED'
              ? 'bg-teal-600 text-white border-teal-600 shadow-md ring-2 ring-teal-500/30'
              : 'bg-white text-slate-800 border-slate-200 hover:border-teal-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-semibold uppercase tracking-wider text-teal-800">
              Reunited to Owner
            </span>
            <span className="material-symbols-outlined text-[18px] text-teal-600">
              task_alt
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-heading font-bold text-slate-900">
              {returnedReports.length}
            </span>
            <span className="text-[11px] font-semibold text-teal-700">
              {overallReturnRate}% reunited
            </span>
          </div>
          <div className="text-[10.5px] text-slate-500 mt-1">
            {overallRecoveryRate}% total resolved rate
          </div>
        </div>
      </div>

      {/* 2. CATEGORY-WISE ANALYTICS SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-indigo-600">
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectCategory('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              All Categories
            </button>
            {selectedCategory !== 'ALL' && (
              <span className="text-[11px] font-medium text-slate-500">
                Filtered: <strong className="text-indigo-600 capitalize">{selectedCategory.replace('_', ' ')}</strong>
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
                className={`p-4 rounded-2xl border transition-all cursor-pointer group text-left ${
                  isSelected
                    ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md bg-indigo-50/40'
                    : 'border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50/50 shadow-2xs'
                }`}
              >
                {/* Header: Icon & Category Name */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
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
                      <span className="text-[10px] text-slate-500 font-medium">
                        {cat.total} {cat.total === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 ${
                      cat.recoveryRate >= 60
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : cat.recoveryRate >= 40
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {cat.recoveryRate}% rec
                  </span>
                </div>

                {/* Sub-counts: Found, Lost, Returned */}
                <div className="grid grid-cols-3 gap-1 mt-3 pt-2.5 border-t border-slate-100 text-center">
                  <div className="bg-emerald-50/70 rounded-lg p-1">
                    <span className="block text-[10px] font-semibold text-emerald-700 uppercase">Found</span>
                    <span className="text-xs font-bold text-emerald-900">{cat.found}</span>
                  </div>
                  <div className="bg-rose-50/70 rounded-lg p-1">
                    <span className="block text-[10px] font-semibold text-rose-700 uppercase">Lost</span>
                    <span className="text-xs font-bold text-rose-900">{cat.lost}</span>
                  </div>
                  <div className="bg-teal-50/70 rounded-lg p-1">
                    <span className="block text-[10px] font-semibold text-teal-700 uppercase">Returned</span>
                    <span className="text-xs font-bold text-teal-900">{cat.returned}</span>
                  </div>
                </div>

                {/* Resolution Progress Bar */}
                <div className="mt-2.5 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Secured / Recovered</span>
                    <span className="font-semibold text-slate-700">{cat.recovered} of {cat.total} ({cat.recoveryRate}%)</span>
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
