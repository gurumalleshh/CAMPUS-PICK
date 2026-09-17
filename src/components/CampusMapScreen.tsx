import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CAMPUS_BUILDINGS, INSTITUTION_INFO } from '../mockData';
import { Report } from '../types';

export const CampusMapScreen: React.FC = () => {
  const { reports, openReportModal, setActiveTab, setSelectedMatch, matches, triggerToast, goBack } = useApp();

  const [activeFloor, setActiveFloor] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'lost' | 'found' | 'safe_hubs'>('all');
  const [selectedBuilding, setSelectedBuilding] = useState<typeof CAMPUS_BUILDINGS[0] | null>(
    CAMPUS_BUILDINGS[0]
  );
  const [selectedPinReport, setSelectedPinReport] = useState<Report | null>(null);

  const getReportsInBuilding = (bldgName: string) => {
    return reports.filter((r) => r.location.building.includes(bldgName.split(' ')[0]));
  };

  return (
    <div className="pb-24 lg:pb-12 pt-20 px-3 sm:px-6 max-w-7xl mx-auto space-y-4">
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
              Interactive Campus Map
            </h1>
            <p className="text-xs text-[#3d4a42]">
              {INSTITUTION_INFO.shortName} • Geofenced Zones & Safe Exchange Hubs
            </p>
          </div>
        </div>

        <button
          onClick={() => triggerToast('GPS Geofence active within PESCE Mandya bounds', 'gps_fixed')}
          className="p-2 rounded-xl bg-white border border-slate-200 text-emerald-700 hover:bg-slate-50 flex items-center gap-1 text-xs font-bold shadow-2xs cursor-pointer"
          aria-label="Recenter Map to Campus Bounds"
        >
          <span className="material-symbols-outlined text-[18px]">my_location</span>
          <span className="hidden sm:inline">Recenter</span>
        </button>
      </div>

      {/* Desktop Two-Column Layout (Map on Left, Building Inspector & Kiosks on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Map Canvas */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-4">
          {/* Filter Chips Bar */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
        <div className="flex items-center gap-1.5">
          {(['all', 'lost', 'found', 'safe_hubs'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-full font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer ${
                filterType === type
                  ? 'bg-[#0b241c] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Floor selector */}
        <div className="flex items-center bg-white border border-slate-200 rounded-full p-0.5 shrink-0">
          {['all', 'G', 'F1', 'F2', 'F3'].map((fl) => (
            <button
              key={fl}
              onClick={() => setActiveFloor(fl)}
              className={`px-2 py-1 rounded-full font-bold text-[10px] transition-all ${
                activeFloor === fl
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {fl}
            </button>
          ))}
        </div>
      </div>

      {/* 2D Interactive SVG Campus Canvas */}
      <div className="relative w-full aspect-4/3 bg-[#0a192f] rounded-3xl border border-slate-800 overflow-hidden shadow-md select-none">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Campus Boundary Lines & Paths */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 450">
          {/* Main campus loop road */}
          <path
            d="M 50 380 Q 200 420 400 400 T 560 360 Q 580 200 520 80 T 300 50 Q 100 80 50 200 Z"
            fill="none"
            stroke="#1e293b"
            strokeWidth="24"
            strokeLinecap="round"
          />
          <path
            d="M 50 380 Q 200 420 400 400 T 560 360 Q 580 200 520 80 T 300 50 Q 100 80 50 200 Z"
            fill="none"
            stroke="#334155"
            strokeWidth="3"
            strokeDasharray="6 6"
          />

          {/* Central spine corridor */}
          <line x1="300" y1="50" x2="300" y2="400" stroke="#1e293b" strokeWidth="14" />
          <line x1="160" y1="210" x2="440" y2="210" stroke="#1e293b" strokeWidth="12" />
        </svg>

        {/* BUILDING 1: CS & Engg Wing (Block B) - Top Right */}
        <div
          onClick={() => {
            setSelectedBuilding(CAMPUS_BUILDINGS[0]);
            setSelectedPinReport(null);
          }}
          className={`absolute top-12 right-12 w-36 h-28 rounded-2xl p-2.5 transition-all cursor-pointer border flex flex-col justify-between ${
            selectedBuilding?.id === 'bldg_cs'
              ? 'bg-emerald-950/90 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-2 ring-emerald-400/50'
              : 'bg-slate-900/80 border-slate-700 hover:border-emerald-500/70'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
              BLOCK B
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-white leading-tight">CS & Engg Wing</h4>
            <p className="text-[9px] text-slate-400">Room CS-204 (AI Lab)</p>
          </div>
          <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-300">
            <span>2 Active Reports</span>
          </div>
        </div>

        {/* BUILDING 2: Main Academic Block (Block A) - Top Left */}
        <div
          onClick={() => {
            setSelectedBuilding(CAMPUS_BUILDINGS[1]);
            setSelectedPinReport(null);
          }}
          className={`absolute top-12 left-10 w-36 h-28 rounded-2xl p-2.5 transition-all cursor-pointer border flex flex-col justify-between ${
            selectedBuilding?.id === 'bldg_main'
              ? 'bg-emerald-950/90 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-2 ring-emerald-400/50'
              : 'bg-slate-900/80 border-slate-700 hover:border-emerald-500/70'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300">
              BLOCK A
            </span>
            <span className="material-symbols-outlined text-[14px] text-slate-400">domain</span>
          </div>
          <div>
            <h4 className="font-bold text-xs text-white leading-tight">Main Academic</h4>
            <p className="text-[9px] text-slate-400">Dean & Admin Desk</p>
          </div>
          <span className="text-[9px] font-bold text-slate-300">Quiet Zone</span>
        </div>

        {/* BUILDING 3: Central Library - Center */}
        <div
          onClick={() => {
            setSelectedBuilding(CAMPUS_BUILDINGS[2]);
            setSelectedPinReport(null);
          }}
          className={`absolute top-44 left-1/2 -translate-x-1/2 w-44 h-24 rounded-2xl p-2.5 transition-all cursor-pointer border flex flex-col justify-between ${
            selectedBuilding?.id === 'bldg_library'
              ? 'bg-emerald-950/90 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-2 ring-emerald-400/50'
              : 'bg-slate-900/80 border-slate-700 hover:border-emerald-500/70'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400">
              CENTRAL LIBRARY
            </span>
            <span className="material-symbols-outlined text-[14px] text-blue-400">local_library</span>
          </div>
          <div>
            <h4 className="font-bold text-xs text-white leading-tight">Reading Hall & Digital Lab</h4>
            <p className="text-[9px] text-slate-400">Security Safe-Box Drop</p>
          </div>
          <span className="text-[9px] font-bold text-blue-300">1 Item Found</span>
        </div>

        {/* BUILDING 4: Cafeteria & Food Court - Bottom Left */}
        <div
          onClick={() => {
            setSelectedBuilding(CAMPUS_BUILDINGS[5]);
            setSelectedPinReport(null);
          }}
          className={`absolute bottom-10 left-10 w-36 h-24 rounded-2xl p-2.5 transition-all cursor-pointer border flex flex-col justify-between ${
            selectedBuilding?.id === 'bldg_cafe'
              ? 'bg-emerald-950/90 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-2 ring-emerald-400/50'
              : 'bg-slate-900/80 border-slate-700 hover:border-emerald-500/70'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
              FOOD COURT
            </span>
            <span className="material-symbols-outlined text-[14px] text-amber-400">restaurant</span>
          </div>
          <div>
            <h4 className="font-bold text-xs text-white leading-tight">Student Center</h4>
            <p className="text-[9px] text-slate-400">Smart Locker #04</p>
          </div>
          <span className="text-[9px] font-bold text-amber-300">High Footfall</span>
        </div>

        {/* BUILDING 5: Gate 1 Campus Security Exchange Kiosk - Bottom Right */}
        <div
          onClick={() => {
            setSelectedBuilding(CAMPUS_BUILDINGS[4]);
            setSelectedPinReport(null);
          }}
          className={`absolute bottom-8 right-10 w-44 h-28 rounded-2xl p-2.5 transition-all cursor-pointer border flex flex-col justify-between ${
            selectedBuilding?.id === 'bldg_gate1'
              ? 'bg-emerald-950/90 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-2 ring-emerald-400/50'
              : 'bg-slate-900/80 border-slate-700 hover:border-emerald-500/70'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
              GATE 1 SAFE HUB
            </span>
            <span className="material-symbols-outlined text-[16px] text-emerald-400">security</span>
          </div>
          <div>
            <h4 className="font-bold text-xs text-white leading-tight">
              Officer Nair Security Desk
            </h4>
            <p className="text-[9px] text-slate-400">16 Smart Lockers Bank</p>
          </div>
          <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Official Custody Exchange</span>
          </div>
        </div>

        {/* FLOATING PINS: ThinkPad X1 in CS Wing */}
        {(filterType === 'all' || filterType === 'lost') && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPinReport(reports[0]);
            }}
            className="absolute top-18 right-20 w-8 h-8 rounded-full bg-rose-600 border-2 border-white text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-20 cursor-pointer animate-bounce"
            title="Lost: Lenovo ThinkPad X1"
          >
            <span className="material-symbols-outlined text-[16px]">laptop_mac</span>
          </button>
        )}

        {/* FLOATING PINS: Library ID Card */}
        {(filterType === 'all' || filterType === 'found') && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPinReport(reports[2]);
            }}
            className="absolute top-48 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-emerald-600 border-2 border-white text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-20 cursor-pointer"
            title="Found: PESCE ID Card"
          >
            <span className="material-symbols-outlined text-[16px]">badge</span>
          </button>
        )}

        {/* FLOATING PINS: Cafeteria Wallet */}
        {(filterType === 'all' || filterType === 'found') && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPinReport(reports[3]);
            }}
            className="absolute bottom-16 left-20 w-8 h-8 rounded-full bg-emerald-600 border-2 border-white text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-20 cursor-pointer"
            title="Found: Leather Wallet"
          >
            <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
          </button>
        )}
        </div>
      </div>

      {/* Right Column: Building Inspector Sheet & Safe Hubs */}
      <div className="lg:col-span-5 xl:col-span-5 space-y-4 lg:sticky lg:top-20">
          {/* Building Inspector Sheet */}
          {selectedBuilding ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs animate-in fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    SELECTED SECTOR
                  </span>
                  <h3 className="font-heading font-bold text-base text-[#0b241c] mt-1">
                    {selectedBuilding.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Rooms: {selectedBuilding.rooms.join(', ')}
                  </p>
                </div>

                <button
                  onClick={() => {
                    openReportModal('LOST');
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">pin_drop</span>
                  <span>Pin Report Here</span>
                </button>
              </div>

              {/* Sector reports */}
              <div className="border-t border-slate-100 pt-2 space-y-2">
                <span className="text-xs font-bold text-slate-700">
                  Active Reports in this Sector ({getReportsInBuilding(selectedBuilding.name).length}):
                </span>

                {getReportsInBuilding(selectedBuilding.name).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    No active reports currently logged in this sector.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {getReportsInBuilding(selectedBuilding.name).map((r) => (
                      <div
                        key={r.id}
                        onClick={() => setSelectedPinReport(r)}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              r.type === 'LOST' ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                          />
                          <span className="text-xs font-bold text-slate-900">{r.itemName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({r.location.room})</span>
                        </div>
                        <span className="text-xs text-emerald-700 font-bold hover:underline">
                          Inspect →
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Safe Hub Route CTA */}
              <div className="p-2.5 rounded-xl bg-slate-900 text-white flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400 text-[18px]">
                    directions_walk
                  </span>
                  <span>Need custody exchange? Route to <strong>Gate 1 Safe Kiosk</strong> (3 min walk)</span>
                </div>
                <button
                  onClick={() => {
                    triggerToast('Navigating route to Gate 1 Campus Security Kiosk...', 'directions');
                  }}
                  className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-bold rounded-lg text-[11px] hover:bg-emerald-400 cursor-pointer"
                >
                  Start Walk
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-xs text-center">
              <span className="material-symbols-outlined text-[36px] text-emerald-600">domain</span>
              <h3 className="font-heading font-bold text-base text-[#0b241c]">Select a Campus Zone</h3>
              <p className="text-xs text-slate-500">
                Click any building or marker on the interactive campus map to inspect rooms, active reports, and nearby safe exchange kiosks.
              </p>
            </div>
          )}

          {/* Quick Safe Hubs Reference Card */}
          <div className="bg-emerald-950 text-white rounded-2xl p-4 space-y-3 border border-emerald-900 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                OFFICIAL SAFE EXCHANGE HUBS
              </span>
              <span className="material-symbols-outlined text-[16px] text-emerald-400">lock</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-xl bg-emerald-900/60 border border-emerald-800/80 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Gate 1 Security Desk</p>
                  <p className="text-[10px] text-emerald-300/80">Officer Nair • 16 Smart Lockers</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-200 text-[10px] font-bold">Open 24/7</span>
              </div>
              <div className="p-2 rounded-xl bg-emerald-900/60 border border-emerald-800/80 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Library Main Desk</p>
                  <p className="text-[10px] text-emerald-300/80">Dean Shivakumar Wing • 8 Lockers</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-200 text-[10px] font-bold">8AM - 8PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pin Report Detail Popup */}
      {selectedPinReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-3 animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  selectedPinReport.type === 'LOST'
                    ? 'bg-rose-600 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {selectedPinReport.type}
              </span>
              <button
                onClick={() => setSelectedPinReport(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <h3 className="font-heading font-bold text-base text-[#0b241c]">
              {selectedPinReport.itemName}
            </h3>

            <p className="text-xs text-slate-600">
              {selectedPinReport.description}
            </p>

            <div className="bg-slate-50 p-2.5 rounded-xl space-y-1 text-xs text-slate-700">
              <p>📍 {selectedPinReport.location.room} • {selectedPinReport.location.building}</p>
              <p>🕒 {selectedPinReport.eventDate}, {selectedPinReport.eventTime}</p>
              <p>👤 Reported by: {selectedPinReport.reporterName} ({selectedPinReport.reporterDepartment || selectedPinReport.reporterRole})</p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedPinReport(null);
                  setActiveTab('matches');
                }}
                className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
              >
                View in Matches
              </button>
              <button
                onClick={() => setSelectedPinReport(null)}
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-600"
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
