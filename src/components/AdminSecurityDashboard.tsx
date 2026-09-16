import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VerificationRecord } from '../types';
import { MessagingWindow } from './MessagingWindow';

export const AdminSecurityDashboard: React.FC = () => {
  const {
    currentUser,
    verifications,
    updateVerificationStatus,
    reports,
    updateReportStatus,
    auditLogs,
    rewards,
    requestRewardClaim,
    triggerToast,
    goBack,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'verifications' | 'chats' | 'lockers' | 'rewards' | 'audit'
  >('verifications');

  if (!currentUser) return null;

  const pendingVerifications = Object.values(verifications) as VerificationRecord[];

  return (
    <div className="pb-24 pt-20 px-4 max-w-3xl mx-auto space-y-5">
      {/* Title Header with Back Button */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <button
            onClick={goBack}
            className="w-9 h-9 mt-0.5 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 hover:text-emerald-700 active:scale-95 transition-all shadow-xs cursor-pointer shrink-0"
            aria-label="Back"
            title="Back to Previous Screen"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl font-bold text-[#0b241c] tracking-tight">
                {currentUser.role === 'admin' ? 'Administrator Command Center' : 'Campus Security Custody Desk'}
              </h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {currentUser.identifier}
              </span>
            </div>
            <p className="text-xs text-[#3d4a42]">
              PES College of Engineering, Mandya • Trust & Custody Authority
            </p>
          </div>
        </div>

        {/* Verified Custody Session Badge */}
        <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-900 shadow-xs">
          <span className="material-symbols-outlined text-emerald-700 text-[16px]">verified_user</span>
          <span>Verified Authority: {currentUser.displayName.split(' ')[0]}</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div className="p-3 bg-white border border-slate-200 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400">EVIDENCE AUDITS</span>
          <p className="text-lg font-bold text-emerald-800 mt-0.5">{pendingVerifications.length}</p>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400">SAFE LOCKERS</span>
          <p className="text-lg font-bold text-blue-800 mt-0.5">16 Active</p>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400">OPEN REPORTS</span>
          <p className="text-lg font-bold text-slate-800 mt-0.5">{reports.length}</p>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-2xl">
          <span className="text-[10px] font-bold text-slate-400">DISPUTES</span>
          <p className="text-lg font-bold text-emerald-600 mt-0.5">0 Active</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold gap-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('verifications')}
          className={`flex-1 min-w-[130px] py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'verifications'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Ownership Claims ({pendingVerifications.length})
        </button>
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex-1 min-w-[140px] py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'chats'
              ? 'bg-[#008069] text-white shadow-xs'
              : 'text-emerald-800 hover:text-emerald-950 bg-emerald-50/70 border border-emerald-200'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">chat</span>
          <span>WhatsApp Monitor</span>
        </button>
        <button
          onClick={() => setActiveTab('lockers')}
          className={`flex-1 min-w-[120px] py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'lockers'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Safe Lockers
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`flex-1 min-w-[110px] py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'rewards'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Rewards
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`flex-1 min-w-[100px] py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Audit Ledger
        </button>
      </div>

      {/* TAB: WHATSAPP STUDENT CHATS MONITOR */}
      {activeTab === 'chats' && (
        <div className="space-y-3">
          <div className="p-3 bg-[#0b241c] border border-emerald-800/40 rounded-2xl text-xs text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-400">
                admin_panel_settings
              </span>
              <span>
                <strong className="text-white">Admin Observation Desk (WhatsApp Format):</strong> Real-time oversight across all student lost & found dialogues. No horizontal sliding — browse student chats with vertical list and instant verification controls.
              </span>
            </div>
          </div>
          <div className="h-[660px] rounded-3xl overflow-hidden shadow-xl border border-slate-200">
            <MessagingWindow isFullScreen={false} />
          </div>
        </div>
      )}

      {/* TAB 1: VERIFICATIONS */}
      {activeTab === 'verifications' && (
        <div className="space-y-4">
          {pendingVerifications.length === 0 ? (
            <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-xs text-slate-500">
              No pending claims requiring review.
            </div>
          ) : (
            pendingVerifications.map((v) => (
              <div
                key={v.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm text-[#0b241c]">
                        Claim on Case #{v.matchId}
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                          v.status === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : v.status === 'UNDER_REVIEW'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {v.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-slate-500 mt-0.5">
                      Claimant: <strong>{v.claimantName}</strong> ({v.claimantId})
                    </p>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono">
                    {v.createdAt}
                  </span>
                </div>

                {/* Submitted Evidence Vault Content */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1 font-bold text-indigo-900">
                    <span className="material-symbols-outlined text-[15px] text-indigo-700">
                      lock
                    </span>
                    <span>Decrypted Ownership Evidence:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700 pt-1">
                    <div>
                      <span className="text-slate-400">Claimed Serial:</span>{' '}
                      <strong className="font-mono text-emerald-800">
                        {v.submittedEvidence.serialNumberProvided || 'Not specified'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Invoice File:</span>{' '}
                      <strong className="font-mono text-slate-800">
                        {v.submittedEvidence.invoiceDocumentUrl || 'Attached'}
                      </strong>
                    </div>
                  </div>
                  {v.submittedEvidence.lockscreenOrDecalHint && (
                    <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                      <span className="text-slate-400">Distinctive Markers / Hint:</span>{' '}
                      {v.submittedEvidence.lockscreenOrDecalHint}
                    </div>
                  )}
                </div>

                {/* Officer Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      updateVerificationStatus(v.matchId, 'VERIFIED', 'Serial matches procurement invoice.');
                    }}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>Approve & Unlock Handover</span>
                  </button>

                  <button
                    onClick={() => {
                      updateVerificationStatus(v.matchId, 'NEEDS_MORE_EVIDENCE', 'Unclear invoice photo.');
                    }}
                    className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl border border-amber-200 cursor-pointer"
                  >
                    Request More Proof
                  </button>

                  <button
                    onClick={() => {
                      updateVerificationStatus(v.matchId, 'REJECTED', 'Serial mismatch.');
                    }}
                    className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200 cursor-pointer"
                  >
                    Reject Claim
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: LOCKERS */}
      {activeTab === 'lockers' && (
        <div className="space-y-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600">
            Smart safe deposit lockers across Gate 1, CS Block, and Library. Deposit logs are cryptographically sealed.
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              { id: 'B-12', loc: 'CS Block F2', item: 'Lenovo ThinkPad', status: 'Occupied' },
              { id: 'B-13', loc: 'CS Block F2', item: 'Empty', status: 'Available' },
              { id: '#04', loc: 'Cafeteria Court', item: 'Leather Wallet', status: 'Occupied' },
              { id: 'G-01', loc: 'Gate 1 Safe Hub', item: 'Scientific Calc', status: 'Occupied' },
              { id: 'G-02', loc: 'Gate 1 Safe Hub', item: 'Empty', status: 'Available' },
              { id: 'L-01', loc: 'Central Library', item: 'PESCE ID Card', status: 'Occupied' },
              { id: 'L-02', loc: 'Central Library', item: 'Empty', status: 'Available' },
              { id: 'W-01', loc: 'Workshop Bay', item: 'Empty', status: 'Available' },
            ].map((locker) => (
              <div
                key={locker.id}
                className={`p-3 rounded-2xl border text-center space-y-1 ${
                  locker.status === 'Occupied'
                    ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                    : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                }`}
              >
                <span className="font-mono font-bold text-sm block">Locker {locker.id}</span>
                <span className="text-[10px] text-slate-500 block">{locker.loc}</span>
                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block ${
                    locker.status === 'Occupied'
                      ? 'bg-amber-200 text-amber-900'
                      : 'bg-emerald-200 text-emerald-900'
                  }`}
                >
                  {locker.status}: {locker.item}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: REWARDS */}
      {activeTab === 'rewards' && (
        <div className="space-y-3">
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs text-indigo-950">
            Administrative honors management. Review and authorize Dean commendation certificates for top student finders.
          </div>

          {rewards.map((r) => (
            <div
              key={r.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
            >
              <div>
                <h4 className="font-bold text-slate-900">{r.name}</h4>
                <p className="text-slate-500">{r.description}</p>
                <p className="text-[10px] text-emerald-800 font-semibold mt-1">
                  Threshold: {r.requiredReturns} Returns ({r.requiredPoints} Points)
                </p>
              </div>

              <button
                onClick={() =>
                  triggerToast(`Honor quota updated for ${r.name}`, 'verified')
                }
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700"
              >
                Configure Quota
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: AUDIT LEDGER */}
      {activeTab === 'audit' && (
        <div className="space-y-2">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600">
            Immutable system audit trail recording every state change, match calculation, and handover seal.
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {log.action}
                  </span>
                  <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                </div>
                <p className="text-slate-800 font-medium">{log.details}</p>
                <p className="text-[10px] text-slate-400">Actor: {log.actor}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
