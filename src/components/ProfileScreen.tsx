import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { INSTITUTION_INFO } from '../mockData';

export const ProfileScreen: React.FC = () => {
  const {
    currentUser,
    logout,
    openWalkthrough,
    draftReport,
    clearDraft,
    openReportModal,
    isOffline,
    toggleOffline,
    setActiveTab,
    goBack,
  } = useApp();

  const [geofenceEnabled, setGeofenceEnabled] = useState(true);
  const [vaultShieldEnabled, setVaultShieldEnabled] = useState(true);

  if (!currentUser) return null;

  return (
    <div className="pb-24 pt-20 px-4 max-w-2xl mx-auto space-y-5">
      {/* Title Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 hover:text-emerald-700 active:scale-95 transition-all shadow-xs cursor-pointer shrink-0"
            aria-label="Back"
            title="Back to Previous Screen"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#0b241c] tracking-tight">
              User Profile & Settings
            </h1>
            <p className="text-xs text-[#3d4a42]">
              Campus verification credentials & local preferences
            </p>
          </div>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start gap-4">
          <div className="relative">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.displayName}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/30 shadow-xs"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white font-bold text-xl flex items-center justify-center">
                {currentUser.displayName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                currentUser.role === 'admin'
                  ? 'bg-indigo-600'
                  : currentUser.role === 'security'
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-bold text-lg text-[#0b241c] truncate">
                {currentUser.displayName}
              </h1>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {currentUser.role}
              </span>
            </div>

            <p className="text-xs text-[#3d4a42] font-medium mt-0.5">
              {currentUser.identifier} • {currentUser.department || 'PESCE Mandya'}
            </p>

            <p className="text-[11px] text-slate-500 mt-0.5">
              {INSTITUTION_INFO.fullName}
            </p>
          </div>
        </div>

        {/* Civic Statistics */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-center">
          <div className="p-2 rounded-xl bg-slate-50">
            <span className="text-[10px] text-slate-400 font-bold uppercase">RETURNS</span>
            <p className="text-base font-bold text-emerald-800 mt-0.5">
              {currentUser.successfullyReturnedItems}
            </p>
          </div>

          <div className="p-2 rounded-xl bg-slate-50">
            <span className="text-[10px] text-slate-400 font-bold uppercase">POINTS</span>
            <p className="text-base font-bold text-[#0b241c] mt-0.5">
              {currentUser.points}
            </p>
          </div>

          <div className="p-2 rounded-xl bg-slate-50">
            <span className="text-[10px] text-slate-400 font-bold uppercase">CAMPUS RANK</span>
            <p className="text-base font-bold text-amber-700 mt-0.5">
              {currentUser.rank ? `#${currentUser.rank}` : 'Staff'}
            </p>
          </div>
        </div>

        {/* View Leaderboard CTA */}
        <button
          onClick={() => setActiveTab('heroes')}
          className="w-full mt-3 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px] text-emerald-700">
            military_tech
          </span>
          <span>View Campus Heroes Leaderboard (Rank #{currentUser.rank || 7})</span>
        </button>
      </div>

      {/* Staff Authority Quick Access Card */}
      {(currentUser.role === 'admin' || currentUser.role === 'security') && (
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-400 text-[24px]">shield_person</span>
              <h3 className="font-heading font-bold text-sm">
                {currentUser.role === 'admin' ? 'Administrator Command Center' : 'Campus Security Custody Desk'}
              </h3>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 text-indigo-100">
              Staff Portal
            </span>
          </div>
          <p className="text-xs text-indigo-200 leading-relaxed">
            {currentUser.role === 'admin'
              ? 'Manage verification attestations, audit campus logs, review telemetry correlation parameters, and issue civic rewards.'
              : 'Execute custody handovers, inspect physical lockers at Gate 1 and Library, and mediate student claims.'}
          </p>
          <button
            onClick={() => setActiveTab('admin')}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
            <span>
              {currentUser.role === 'admin' ? 'Launch Admin Command Center' : 'Open Security Custody Desk'}
            </span>
          </button>
        </div>
      )}

      {/* Active Session & Single Identity Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-xs text-slate-500 uppercase tracking-wider">
            Active Verified Session
          </h3>
          <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">lock</span>
            Identity Protected
          </span>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
          <div>
            <p className="font-bold text-slate-900">{currentUser.displayName}</p>
            <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
              {currentUser.identifier} • {currentUser.email}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-black px-2 py-0.5 bg-slate-200 text-slate-800 rounded">
              {currentUser.role}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed">
          In accordance with PESCE Mandya integrity regulations, user identity cannot be switched during an active session. To change identity or sign in as another member, sign out below.
        </p>

        <button
          onClick={logout}
          className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          <span>Sign Out of Campus Pick</span>
        </button>
      </div>

      {/* Draft Recovery Card (if user has an unsaved draft) */}
      {draftReport && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-2 text-xs text-amber-950">
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1 text-amber-800">
              <span className="material-symbols-outlined text-[16px]">drafts</span>
              Unsubmitted Report Draft Saved
            </span>
            <button
              onClick={clearDraft}
              className="text-amber-800 hover:text-amber-950 font-bold"
            >
              Discard
            </button>
          </div>
          <p className="text-amber-900">
            Item: <strong>{draftReport.itemName || 'Untitled'}</strong> ({draftReport.type})
          </p>
          <button
            onClick={() => openReportModal(draftReport.type as any)}
            className="w-full py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold cursor-pointer"
          >
            Resume Report Form
          </button>
        </div>
      )}

      {/* Preferences & Security Shield */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 text-xs shadow-xs">
        <h3 className="font-heading font-bold text-xs text-slate-500 uppercase tracking-wider">
          Campus Pick System Preferences
        </h3>

        <div className="space-y-3 divide-y divide-slate-100">
          {/* Geofence */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="font-bold text-slate-900">PESCE Mandya GPS Geofence</p>
              <p className="text-[11px] text-slate-500">
                Receive priority alerts when items are lost within 30m of your classes
              </p>
            </div>
            <input
              type="checkbox"
              checked={geofenceEnabled}
              onChange={() => setGeofenceEnabled(!geofenceEnabled)}
              className="w-4 h-4 accent-emerald-600 rounded"
            />
          </div>

          {/* Encrypted Vault */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="font-bold text-slate-900">Private Evidence Vault (AES-256)</p>
              <p className="text-[11px] text-slate-500">
                Hide serial numbers and receipts from students until verified
              </p>
            </div>
            <input
              type="checkbox"
              checked={vaultShieldEnabled}
              onChange={() => setVaultShieldEnabled(!vaultShieldEnabled)}
              className="w-4 h-4 accent-emerald-600 rounded"
            />
          </div>

          {/* Offline Mode Cache */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="font-bold text-slate-900">Offline Report Caching</p>
              <p className="text-[11px] text-slate-500">
                Store reports locally during low connectivity in basement workshops
              </p>
            </div>
            <button
              onClick={toggleOffline}
              className={`px-3 py-1 rounded-full font-bold text-[11px] ${
                isOffline
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isOffline ? 'Offline Mode' : 'Online'}
            </button>
          </div>
        </div>
      </div>

      {/* Evaluator 8-Act Walkthrough Simulator Button */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#064e3b] via-[#043e2e] to-[#022c22] text-white space-y-2 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
          <span className="material-symbols-outlined text-[20px]">play_circle</span>
          <span>Section 75 Interactive Walkthrough</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Step through the complete 8-Act end-to-end journey: Loss report → Proximity notification → Discovery → 87% Match → AES-256 Vault Verification → Officer authorization → Gate 1 Handover → Dual Confirmation & Civic Certificate.
        </p>
        <button
          onClick={openWalkthrough}
          className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
        >
          <span>Launch 8-Act Walkthrough Simulator</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>

      {/* Institutional Footer Notice */}
      <div className="text-center text-[11px] text-slate-400 space-y-1">
        <p className="font-semibold text-slate-600">
          CAMPUS PICK • PES College of Engineering, Mandya (PESCE Mandya)
        </p>
        <p>“Lost it? Pick it back.” • Version 2.4.0</p>
        <p className="text-[10px] text-slate-400 italic">
          PESCE Mandya Community Platform. Not affiliated with PES University.
        </p>
      </div>
    </div>
  );
};
