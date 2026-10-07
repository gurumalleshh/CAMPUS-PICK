import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VerificationRecord, ItemCategory, Report } from '../types';
import { DEMO_USERS, INSTITUTION_INFO } from '../mockData';
import { ReportDetailModal } from './ReportDetailModal';

export const AdminSecurityDashboard: React.FC = () => {
  const {
    currentUser,
    login,
    verifications,
    updateVerificationStatus,
    reports,
    auditLogs,
    rewards,
    triggerToast,
    updateReportStatus,
    setActiveTab,
  } = useApp();

  const [activeTab, setActiveTabState] = useState<'vault' | 'verifications' | 'inventory' | 'audit'>('vault');
  const [selectedReportDetail, setSelectedReportDetail] = useState<Report | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  if (!currentUser) return null;

  const pendingVerifications = Object.values(verifications) as VerificationRecord[];
  const inCustodyReports = reports.filter((r) => r.type === 'FOUND' && r.status !== 'RETURNED');
  const returnedCount = reports.filter((r) => r.status === 'RETURNED').length;

  return (
    <div className="min-h-screen pb-28 lg:pb-16 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-12 max-w-[1700px] mx-auto space-y-8 font-sans select-none">
      {/* ─────────────────────────────────────────────────────────────────────────────
          1. TACTICAL COMMAND HEADER (OFFICER / DEAN DESK)
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="rounded-3xl bg-[#090E1A] border-2 border-emerald-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {currentUser.role === 'admin' ? 'ADMINISTRATIVE GOVERNANCE' : 'GATE 1 CUSTODY POST'}
              </span>
              <span className="text-xs font-mono text-slate-400">
                OFFICER DISPATCH: {currentUser.displayName} ({currentUser.identifier})
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-heading font-black text-white tracking-tight">
              Campus Security & Custody Dispatch Desk
            </h1>

            <p className="text-xs sm:text-sm text-slate-300">
              {INSTITUTION_INFO.fullName} • Chain-of-custody logging, physical locker vault, and verified handovers.
            </p>
          </div>

          {/* Quick Stats & Perspective Switcher */}
          <div className="flex flex-wrap items-center gap-4 bg-[#0E1626] p-4 rounded-2xl border border-white/[0.08] shrink-0">
            <div className="text-center px-3 border-r border-white/[0.08]">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">In Vault</span>
              <span className="text-xl font-mono font-black text-emerald-400">{inCustodyReports.length}</span>
            </div>
            <div className="text-center px-3 border-r border-white/[0.08]">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Verifications</span>
              <span className="text-xl font-mono font-black text-amber-400">{pendingVerifications.length}</span>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Resolved</span>
              <span className="text-xl font-mono font-black text-indigo-300">{returnedCount}</span>
            </div>

            <div className="flex items-center gap-1.5 pl-2 border-l border-white/[0.08]">
              <button
                onClick={() => {
                  login(DEMO_USERS.security_nair);
                  triggerToast('Perspective: Officer R. Nair (Gate 1)', 'local_police', 'info');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  currentUser.role === 'security'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white/[0.05] text-slate-400 hover:text-white'
                }`}
              >
                Officer Nair
              </button>
              <button
                onClick={() => {
                  login(DEMO_USERS.admin_shivakumar);
                  triggerToast('Perspective: Dr. N. Shivakumar (Dean)', 'shield', 'info');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  currentUser.role === 'admin'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white/[0.05] text-slate-400 hover:text-white'
                }`}
              >
                Dean Shivakumar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. OPERATIONAL TABS
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-4 overflow-x-auto no-scrollbar">
        {[
          { id: 'vault', label: `Gate 1 Physical Vault (${inCustodyReports.length})`, icon: 'inventory' },
          { id: 'verifications', label: `Verification Queue (${pendingVerifications.length})`, icon: 'verified_user' },
          { id: 'inventory', label: `Master Registry (${reports.length})`, icon: 'list_alt' },
          { id: 'audit', label: `Security Audit Trail (${auditLogs.length})`, icon: 'security' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabState(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-[#0E1626] text-slate-400 hover:text-white border border-white/[0.05]'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          3. TAB 1: GATE 1 PHYSICAL VAULT & LOCKERS
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'vault' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-heading font-black text-white">Physical Vault Inventory (Lockers #01-#14)</h2>
              <p className="text-xs text-slate-400">Belongings physically secured at Gate 1 post awaiting verified claimants</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {inCustodyReports.map((report, idx) => {
              const lockerNum = String(idx + 1).padStart(2, '0');
              const photo =
                report.publicPhotoUrl ||
                report.imageUrl ||
                'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400&auto=format&fit=crop&q=80';

              return (
                <div
                  key={report.id}
                  className="rounded-3xl bg-[#090E1A] border border-emerald-500/25 p-5 space-y-4 shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        LOCKER #{lockerNum}
                      </span>
                      <span className="text-xs font-mono text-slate-400">#{report.ticketNumber}</span>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden aspect-video bg-black/40">
                      <img src={photo} alt={report.itemName} className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-mono">
                        {report.location.room}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white">{report.itemName}</h3>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{report.description}</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#0E1626] border border-white/[0.04] text-xs font-mono space-y-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Surrendered By:</span>
                        <span className="text-white font-bold">{report.reporterName}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Intake Date:</span>
                        <span className="text-white">{report.eventTime || 'Today'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => {
                        updateReportStatus(report.id, 'RETURNED');
                        triggerToast(`Item #${report.ticketNumber} released & marked returned`, 'check_circle', 'success');
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 cursor-pointer transition-all"
                    >
                      Witness Release & Handover
                    </button>
                    <button
                      onClick={() => setSelectedReportDetail(report)}
                      className="px-3 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold cursor-pointer"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          4. TAB 2: VERIFICATION QUEUE
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'verifications' && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-xl font-heading font-black text-white">Confidential Proof Verification Queue</h2>
            <p className="text-xs text-slate-400">Inspect claimant serial numbers, invoices, and private decal hints</p>
          </div>

          <div className="space-y-4">
            {pendingVerifications.map((v) => {
              const match = useApp().matches.find((m) => m.id === v.matchId);
              if (!match) return null;

              return (
                <div
                  key={v.id}
                  className="rounded-3xl bg-[#090E1A] border-2 border-indigo-500/40 p-6 space-y-5 shadow-2xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                          STATUS: {v.status}
                        </span>
                        <span className="text-xs font-mono text-slate-400">Claimant: {v.claimantName}</span>
                      </div>
                      <h3 className="text-lg font-heading font-black text-white mt-1">
                        Claim for: {match.lostReport.itemName}
                      </h3>
                    </div>

                    <div className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-400/20">
                      Match Confidence: {match.confidenceScore}%
                    </div>
                  </div>

                  {/* Private Evidence Review Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-[#0E1626] border border-white/[0.06] space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Claimant Serial Input</span>
                      <span className="font-mono text-emerald-400 font-bold text-sm block">
                        {v.submittedEvidence.serialNumberProvided || 'Not specified'}
                      </span>
                      <span className="text-[11px] text-slate-500">Vault Match: PF-284920-X1 (Exact)</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0E1626] border border-white/[0.06] space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Private Hint / Wallpaper</span>
                      <span className="text-slate-200 block">
                        {v.submittedEvidence.lockscreenOrDecalHint || 'No hint provided'}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#0E1626] border border-white/[0.06] space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Procurement Document</span>
                      <span className="font-mono text-indigo-300 font-bold block truncate">
                        {v.submittedEvidence.invoiceDocumentUrl || 'PESCE_Computer_Receipt.pdf'}
                      </span>
                      <span className="text-[11px] text-emerald-400">✓ Digital Stamp Verified</span>
                    </div>
                  </div>

                  {/* Officer Decision Bar */}
                  <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1 max-w-md">
                      <input
                        type="text"
                        placeholder="Officer verification notes..."
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#080D1A] border border-white/[0.1] text-xs text-white"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          updateVerificationStatus(v.matchId, 'NEEDS_MORE_EVIDENCE', 'Supplementary invoice requested');
                          triggerToast('Requested additional evidence from claimant', 'info');
                        }}
                        className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold cursor-pointer"
                      >
                        Request More Proof
                      </button>
                      <button
                        onClick={() => {
                          updateVerificationStatus(
                            v.matchId,
                            'VERIFIED',
                            reviewNotes || 'Attested by Officer R. Nair (Badge #CS-409)',
                            'Officer R. Nair',
                            'OFFICER'
                          );
                          triggerToast('Ownership confirmed & certified by Security Desk', 'verified', 'success');
                        }}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 cursor-pointer"
                      >
                        ✓ Attest & Approve Ownership
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          5. TAB 3: MASTER REGISTRY
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'inventory' && (
        <div className="rounded-3xl bg-[#090E1A] border border-white/[0.08] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0E1626] border-b border-white/[0.08] text-slate-400 font-mono text-[10.5px] uppercase">
                <tr>
                  <th className="p-4">Ticket</th>
                  <th className="p-4">Item Name</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Campus Sector</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Reporter</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {reports.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02]">
                    <td className="p-4 font-mono font-bold text-indigo-300">#{r.ticketNumber}</td>
                    <td className="p-4 font-bold text-white max-w-[200px] truncate">{r.itemName}</td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          r.type === 'LOST' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {r.type}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 truncate max-w-[180px]">
                      {r.location.building} • {r.location.room}
                    </td>
                    <td className="p-4 font-mono text-xs">{r.status}</td>
                    <td className="p-4 text-slate-400">{r.reporterName}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedReportDetail(r)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-bold hover:bg-indigo-600 hover:text-white text-xs transition-colors cursor-pointer"
                        >
                          Inspect
                        </button>
                        {r.status !== 'RETURNED' && (
                          <button
                            onClick={() => {
                              updateReportStatus(r.id, 'RETURNED');
                              triggerToast(`Report #${r.ticketNumber} marked RETURNED`, 'check_circle', 'success');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-bold hover:bg-emerald-600 hover:text-white text-xs transition-colors cursor-pointer"
                          >
                            Mark Returned
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────────
          6. TAB 4: IMMUTABLE AUDIT TRAIL
      ───────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'audit' && (
        <div className="rounded-3xl bg-[#090E1A] border border-white/[0.08] p-6 space-y-4 shadow-2xl">
          <div>
            <h3 className="text-lg font-heading font-black text-white">Immutable Security Audit Log</h3>
            <p className="text-xs text-slate-400">Cryptographically ordered security events, officer attestations, and custody transfers</p>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-[#0E1626] border border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 font-bold">[{log.timestamp}]</span>
                  <span className="text-indigo-300 font-semibold">{log.actor}</span>
                  <span className="text-white">{log.action}: {log.details}</span>
                </div>
                {log.caseId && <span className="text-slate-500 text-[11px]">CASE #{log.caseId}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reusable Consolidated Report Detail Modal */}
      <ReportDetailModal
        report={selectedReportDetail}
        onClose={() => setSelectedReportDetail(null)}
      />
    </div>
  );
};
