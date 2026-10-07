import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CAMPUS_BUILDINGS, INSTITUTION_INFO, normalizeBuildingId, getBuildingById } from '../mockData';
import { Report } from '../types';
import { ReportDetailModal } from './ReportDetailModal';

interface BuildingPinPosition {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  code: string;
  icon: string;
  fullName: string;
}

const BUILDING_COORDS: Record<string, BuildingPinPosition> = {
  bldg_cs: { x: 74, y: 28, code: 'BLOCK B', icon: 'terminal', fullName: 'CS & Engineering' },
  bldg_main: { x: 26, y: 26, code: 'BLOCK A', icon: 'account_balance', fullName: 'Main Academic' },
  bldg_library: { x: 50, y: 46, code: 'LIBRARY', icon: 'local_library', fullName: 'Central Library' },
  bldg_mech: { x: 78, y: 64, code: 'BLOCK D', icon: 'precision_manufacturing', fullName: 'Mech Workshop' },
  bldg_workshop: { x: 78, y: 64, code: 'BLOCK D', icon: 'precision_manufacturing', fullName: 'Mech Workshop' }, // alias to bldg_mech
  bldg_gate1: { x: 26, y: 80, code: 'GATE 1', icon: 'local_police', fullName: 'Security Post' },
  bldg_cafe: { x: 52, y: 76, code: 'CAFE', icon: 'restaurant', fullName: 'Campus Center' },
};

export const CampusMapScreen: React.FC = () => {
  const { reports, openReportModal, triggerToast } = useApp();

  const [activeLayer, setActiveLayer] = useState<'all' | 'lost' | 'found' | 'vault' | 'safe'>('all');
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('bldg_cs');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [radarActive, setRadarActive] = useState<boolean>(true);

  // Normalize building selection safely
  const canonicalBuildingId = normalizeBuildingId(selectedBuildingId);
  const selectedBuilding = useMemo(() => {
    return getBuildingById(canonicalBuildingId);
  }, [canonicalBuildingId]);

  // Robust count of reports per building using canonical ID matching
  const getBuildingStats = (bldgId: string, bldgName: string) => {
    const canonicalId = normalizeBuildingId(bldgId);
    const bReports = reports.filter((r) => {
      const b = r.location.building.toLowerCase();
      if (canonicalId === 'bldg_mech') return b.includes('mech') || b.includes('workshop');
      if (canonicalId === 'bldg_cs') return b.includes('cs') || b.includes('computer');
      if (canonicalId === 'bldg_library') return b.includes('library');
      if (canonicalId === 'bldg_main') return b.includes('main') || b.includes('academic');
      if (canonicalId === 'bldg_gate1') return b.includes('gate 1') || b.includes('security');
      if (canonicalId === 'bldg_cafe') return b.includes('cafe') || b.includes('student center') || b.includes('cafeteria');
      return b.includes(bldgName.toLowerCase().split(' ')[0]);
    });

    const lost = bReports.filter((r) => r.type === 'LOST').length;
    const found = bReports.filter((r) => r.type === 'FOUND').length;
    return { total: bReports.length, lost, found, reports: bReports };
  };

  // Compute reports in selected building
  const selectedBuildingStats = useMemo(() => {
    return getBuildingStats(selectedBuilding.id, selectedBuilding.name);
  }, [selectedBuilding, reports]);

  const buildingReports = selectedBuildingStats.reports;
  const inVaultTotal = reports.filter((r) => r.type === 'FOUND' && r.status !== 'RETURNED').length;

  return (
    <div className="min-h-screen pb-28 lg:pb-16 pt-5 sm:pt-8 px-3 sm:px-6 lg:px-10 max-w-[1700px] mx-auto space-y-6 font-sans select-none">
      {/* ─────────────────────────────────────────────────────────────────────────────
          1. MAP HEADER & TACTICAL CONTROLS
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              LIVE SPATIAL TELEMETRY
            </span>
            <span className="text-xs font-mono text-slate-400">• {INSTITUTION_INFO.shortName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
            Campus Architectural Blueprint & Incident Radar
          </h1>
          <p className="text-sm text-slate-300 mt-0.5">
            Real-time sector density and secure custody nodes across PESCE Mandya.
          </p>
        </div>

        {/* Layer Filters */}
        <div className="flex items-center gap-1.5 bg-[#0E1626] p-1.5 rounded-2xl border border-white/[0.08] overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Incidents' },
            { id: 'lost', label: 'Lost Items' },
            { id: 'vault', label: 'Gate 1 Vault' },
            { id: 'safe', label: 'Safe Zones' },
          ].map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeLayer === layer.id
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {layer.label}
            </button>
          ))}

          <button
            onClick={() => setRadarActive(!radarActive)}
            className={`px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
              radarActive ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500'
            }`}
            title="Toggle Radar Sweep Animation"
          >
            <span className={`material-symbols-outlined text-[16px] ${radarActive ? 'animate-spin' : ''}`}>
              radar
            </span>
            <span className="hidden sm:inline">Radar</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. RESPONSIVE MAP CANVAS vs CONTEXTUAL BUILDING DOSSIER
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT / CENTER: INTERACTIVE ARCHITECTURAL CANVAS (65%) */}
        <div className="lg:col-span-8 rounded-3xl bg-[#080D1A] border border-white/[0.1] relative overflow-hidden flex flex-col justify-between shadow-2xl min-h-[480px]">
          {/* Blueprint Grid Pattern Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(99, 102, 241, 0.2) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(99, 102, 241, 0.2) 1px, transparent 1px)
              `,
              backgroundSize: '36px 36px',
            }}
          />

          {/* Radar Sweep Circle Overlay */}
          {radarActive && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-indigo-500/15 pointer-events-none overflow-hidden">
              <div className="w-full h-full rounded-full border border-indigo-500/10 scale-75" />
              <div className="w-full h-full rounded-full border border-indigo-500/10 scale-50" />
              <div className="absolute top-0 left-0 w-full h-full rounded-full animate-radar bg-gradient-to-tr from-indigo-500/15 via-transparent to-transparent pointer-events-none" />
            </div>
          )}

          {/* Top Map HUD Bar */}
          <div className="relative z-10 p-3.5 sm:p-5 flex items-center justify-between gap-3 bg-gradient-to-b from-[#080D1A] via-[#080D1A]/80 to-transparent">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-xs font-mono text-slate-300 border border-white/[0.08]">
                LAT: 12.522° N • LNG: 76.895° E
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 backdrop-blur-md text-xs font-mono text-emerald-300 border border-emerald-500/30 font-bold hidden sm:inline">
                {inVaultTotal} IN CUSTODY
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Lost</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Vault</span>
              </span>
            </div>
          </div>

          {/* RESPONSIVE BLUEPRINT CANVAS: Maintains aspect ratio and coordinates across all screens */}
          <div className="relative z-10 w-full aspect-[4/3] sm:aspect-[16/10] max-h-[580px] my-auto">
            {/* SVG Vector Blueprint: Pathways and building contours */}
            <svg
              viewBox="0 0 1000 650"
              preserveAspectRatio="xMidYMid meet"
              className="absolute inset-0 w-full h-full pointer-events-none"
            >
              {/* Campus Walkways & Circulation Pathways */}
              <g stroke="rgba(99, 102, 241, 0.22)" strokeWidth="6" strokeLinecap="round" strokeDasharray="8 8">
                {/* Gate 1 to Main Academic Block A */}
                <line x1="260" y1="520" x2="260" y2="170" />
                {/* Main Academic Block A to Central Library */}
                <line x1="260" y1="170" x2="500" y2="300" />
                {/* Library to CS Block B */}
                <line x1="500" y1="300" x2="740" y2="180" />
                {/* Library to Cafeteria / Center */}
                <line x1="500" y1="300" x2="520" y2="490" />
                {/* Cafeteria to Mech Workshop Block D */}
                <line x1="520" y1="490" x2="780" y2="415" />
                {/* Gate 1 to Cafeteria */}
                <line x1="260" y1="520" x2="520" y2="490" />
                {/* CS Block B to Mech Workshop Block D */}
                <line x1="740" y1="180" x2="780" y2="415" />
              </g>

              {/* Central Courtyard & Green Zones */}
              <circle cx="500" cy="300" r="140" fill="rgba(16, 185, 129, 0.04)" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1.5" />
              <rect x="360" y="240" width="80" height="60" rx="12" fill="rgba(99, 102, 241, 0.05)" />
            </svg>

            {/* Responsive Building Node Overlay Pins */}
            {CAMPUS_BUILDINGS.map((bldg) => {
              const canonicalId = normalizeBuildingId(bldg.id);
              const coords = BUILDING_COORDS[canonicalId] || {
                x: 50,
                y: 50,
                code: 'BLDG',
                icon: 'apartment',
                fullName: bldg.name,
              };
              const stats = getBuildingStats(bldg.id, bldg.name);
              const isSelected = selectedBuilding.id === canonicalId;
              const isVault = canonicalId === 'bldg_gate1';

              return (
                <div
                  key={bldg.id}
                  onClick={() => {
                    setSelectedBuildingId(canonicalId);
                    triggerToast(`Selected ${bldg.name}`, 'apartment', 'info');
                  }}
                  style={{
                    left: `${coords.x}%`,
                    top: `${coords.y}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 z-20 focus-ring rounded-2xl ${
                    isSelected ? 'z-30 scale-105' : 'hover:scale-105'
                  }`}
                >
                  {/* Pulse Ring if active reports exist */}
                  {stats.total > 0 && (
                    <span
                      className={`absolute -inset-1.5 rounded-2xl animate-ping opacity-35 ${
                        isVault ? 'bg-emerald-500' : 'bg-indigo-500'
                      }`}
                    />
                  )}

                  {/* Building Node Pill */}
                  <div
                    className={`relative px-2.5 sm:px-3.5 py-1.5 sm:py-2.5 rounded-2xl border transition-all duration-300 flex items-center gap-2 sm:gap-2.5 shadow-2xl ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-[#C3D809] ring-4 ring-[#C3D809]/30 shadow-indigo-600/50'
                        : isVault
                        ? 'bg-[#0F1E29] text-emerald-300 border-emerald-500/40 hover:border-emerald-400'
                        : 'bg-[#0E1626]/90 text-slate-200 border-white/[0.12] hover:border-indigo-400/50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[17px] sm:text-[20px] shrink-0">
                      {coords.icon}
                    </span>

                    <div className="text-left min-w-0">
                      <span className="text-xs sm:text-sm font-bold block leading-tight whitespace-nowrap">
                        {coords.code}
                      </span>
                      <span className="text-[10px] sm:text-xs font-mono opacity-80 block whitespace-nowrap hidden sm:inline">
                        {stats.total} {stats.total === 1 ? 'case' : 'cases'}
                      </span>
                    </div>

                    {stats.total > 0 && (
                      <span
                        className={`text-xs font-mono font-bold px-1.5 py-0.2 rounded-md ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : isVault
                            ? 'bg-emerald-500/30 text-emerald-200'
                            : 'bg-rose-500/30 text-rose-200'
                        }`}
                      >
                        {stats.total}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Coordinates & Quick Map Footer */}
          <div className="relative z-10 p-3.5 sm:p-4 bg-gradient-to-t from-[#080D1A] to-transparent flex items-center justify-between text-xs sm:text-sm text-slate-400 font-mono border-t border-white/[0.04]">
            <span>MANDYA CAMPUS GRID V2.0</span>
            <span className="text-right">CLICK ANY NODE TO INSPECT SECTOR</span>
          </div>
        </div>

        {/* RIGHT: CONTEXTUAL BUILDING DOSSIER DRAWER (35%) */}
        <div className="lg:col-span-4 rounded-3xl bg-[#0E1626]/90 border border-white/[0.1] p-5 sm:p-6 space-y-6 flex flex-col justify-between shadow-2xl">
          <div className="space-y-5">
            {/* Header with Sector Info */}
            <div className="space-y-1.5 border-b border-white/[0.08] pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                  ACTIVE SECTOR DOSSIER
                </span>
                <span className="text-xs sm:text-sm font-mono text-slate-400">
                  {buildingReports.length} {buildingReports.length === 1 ? 'incident' : 'incidents'}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-heading font-black text-white">
                {selectedBuilding.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Official PESCE faculty, laboratory & student sector.
              </p>
            </div>

            {/* Rooms in this Building */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Monitored Rooms & Labs
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedBuilding.rooms.map((room) => (
                  <span
                    key={room}
                    className="px-2.5 py-1 rounded-xl bg-[#090E1A] border border-white/[0.06] text-xs sm:text-sm font-semibold text-slate-200"
                  >
                    {room}
                  </span>
                ))}
              </div>
            </div>

            {/* Incidents logged in this sector */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Belongings Logged Here
                </span>
              </div>

              {buildingReports.length === 0 ? (
                <div className="p-6 text-center rounded-2xl bg-[#090E1A] border border-white/[0.04] space-y-2">
                  <span className="material-symbols-outlined text-[32px] text-slate-600">check_circle</span>
                  <p className="text-sm font-bold text-slate-300">No active incidents in this building</p>
                  <p className="text-xs text-slate-400">All belongings recovered or reported in other sectors.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {buildingReports.map((r) => {
                    const isLost = r.type === 'LOST';
                    const isReturned = r.status === 'RETURNED';

                    return (
                      <div
                        key={r.id}
                        onClick={() => setSelectedReport(r)}
                        className="p-3 rounded-2xl bg-[#090E1A] hover:bg-[#121B2F] border border-white/[0.05] hover:border-indigo-500/30 flex items-center justify-between gap-3 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={
                              r.publicPhotoUrl ||
                              r.imageUrl ||
                              'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=200&auto=format&fit=crop&q=80'
                            }
                            alt={r.itemName}
                            className="w-11 h-11 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-sm text-white truncate block group-hover:text-indigo-200">
                              {r.itemName}
                            </span>
                            <span className="text-xs text-slate-400 truncate block">
                              {r.location.room} • {r.eventTime || 'Today'}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full shrink-0 uppercase ${
                            isReturned
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : isLost
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-teal-500/20 text-teal-300'
                          }`}
                        >
                          {r.type}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Action Trigger for this Building */}
          <div className="pt-4 border-t border-white/[0.08] space-y-2.5">
            <button
              onClick={() => openReportModal('LOST', selectedBuilding.name as any)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-600/30 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">search_off</span>
              <span>Report Loss in {selectedBuilding.name.split(' ')[0]}</span>
            </button>
            <button
              onClick={() => openReportModal('FOUND', selectedBuilding.name as any)}
              className="w-full py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 text-xs sm:text-sm font-semibold cursor-pointer"
            >
              Log Found Belonging in this Sector
            </button>
          </div>
        </div>
      </div>

      {/* Reusable Consolidated Report Detail Modal */}
      <ReportDetailModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </div>
  );
};
