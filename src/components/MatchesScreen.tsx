import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PotentialMatch } from '../types';
import { evaluateReportCorrelation } from '../utils/matchingEngine';

export const MatchesScreen: React.FC = () => {
  const {
    matches,
    selectedMatch,
    setSelectedMatch,
    verifications,
    submitVerification,
    dismissMatch,
    openChatModal,
    triggerToast,
    currentUser,
    updateVerificationStatus,
    handovers,
    scheduleHandover,
    confirmReturnParty,
    setActiveTab,
  } = useApp();

  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [evidenceSerial, setEvidenceSerial] = useState('PF-284920-X1');
  const [evidenceHint, setEvidenceHint] = useState('Linux Tux sticker on palmrest, dark matrix wallpaper with USN 4PS23CS084');
  const [evidenceFile, setEvidenceFile] = useState('PESCE_Computer_Procurement_Receipt.pdf');

  const currentMatch: PotentialMatch | undefined = selectedMatch || matches[0];
  const currentVerification = currentMatch ? verifications[currentMatch.id] : undefined;
  const currentHandover = currentMatch ? handovers[currentMatch.id] : undefined;

  const isVerified = currentVerification?.status === 'VERIFIED';
  const isRejected = currentVerification?.status === 'REJECTED';
  const isUnderReview = currentVerification?.status === 'UNDER_REVIEW' || currentVerification?.status === 'SUBMITTED';
  const needsMore = currentVerification?.status === 'NEEDS_MORE_EVIDENCE';

  // Role privileges
  const isSecurityOrAdmin = currentUser?.role === 'security' || currentUser?.role === 'admin';
  const isOwner = Boolean(
    currentMatch &&
      currentUser &&
      (currentUser.id === currentMatch.lostReport.reporterId ||
        currentUser.displayName?.toLowerCase() === currentMatch.lostReport.reporterName?.toLowerCase() ||
        currentUser.identifier === '4PS23CS084')
  );

  const isFinder = Boolean(
    currentMatch &&
      currentUser &&
      (currentUser.id === currentMatch.foundReport.reporterId ||
        currentUser.displayName?.toLowerCase() === currentMatch.foundReport.reporterName?.toLowerCase() ||
        currentUser.identifier === '4PS22ME049')
  );

  const evaluation = useMemo(() => {
    if (!currentMatch?.lostReport || !currentMatch?.foundReport) return null;
    return evaluateReportCorrelation(
      currentMatch.lostReport,
      currentMatch.foundReport,
      isSecurityOrAdmin,
      currentVerification?.submittedEvidence?.serialNumberProvided
    );
  }, [currentMatch, isSecurityOrAdmin, currentVerification]);

  const handleEvidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMatch) return;

    submitVerification(currentMatch.id, {
      serialNumberProvided: evidenceSerial,
      lockscreenOrDecalHint: evidenceHint,
      invoiceDocumentUrl: evidenceFile,
      additionalNotes: 'Submitted via Campus Pick Ownership Verification Protocol.',
    });

    setIsEvidenceModalOpen(false);
    triggerToast('Confidential evidence transmitted to Gate 1 security review', 'verified_user', 'success');
  };

  if (!currentUser) return null;

  if (!currentMatch) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <span className="material-symbols-outlined text-[54px] text-slate-600">hub</span>
        <h2 className="text-xl font-heading font-black text-white">No Active Correlations In Queue</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          The correlation radar scans all active lost and found reports 24/7. When items logged in custody share similar features, they will appear here.
        </p>
        <button
          onClick={() => setActiveTab('home')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 cursor-pointer"
        >
          Return to Radar Feed
        </button>
      </div>
    );
  }

  const lostPhoto =
    currentMatch.lostReport.publicPhotoUrl ||
    currentMatch.lostReport.imageUrl ||
    'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80';
  const foundPhoto =
    currentMatch.foundReport.publicPhotoUrl ||
    currentMatch.foundReport.imageUrl ||
    'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80';

  return (
    <div className="min-h-screen pb-28 lg:pb-16 pt-6 sm:pt-8 px-4 sm:px-6 lg:px-12 max-w-[1700px] mx-auto space-y-8 font-sans select-none">
      {/* ─────────────────────────────────────────────────────────────────────────────
          1. HEADER & CORRELATION DISCLAIMER
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="space-y-3 border-b border-white/[0.08] pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                FORENSIC COMPARISON CONSOLE
              </span>
              <span className="text-xs font-mono text-slate-500">
                Case #{currentMatch.lostReport.ticketNumber} ⇄ #{currentMatch.foundReport.ticketNumber}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
              Potential Match Correlation Radar
            </h1>
          </div>

          {/* Critical Legal Disclaimer */}
          <div className="px-3.5 py-2 rounded-2xl bg-[#0E1626] border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 shrink-0">
            <span className="material-symbols-outlined text-amber-400 text-[18px]">warning</span>
            <span className="font-mono text-[11px] font-bold">
              MATCH ≠ OWNERSHIP • SENSITIVE EVIDENCE REMAINS ENCRYPTED
            </span>
          </div>
        </div>

        {/* Multiple Matches Switcher Pills */}
        {matches.length > 1 && (
          <div className="flex items-center gap-2 pt-2 overflow-x-auto no-scrollbar">
            <span className="text-xs text-slate-400 font-medium">Select Match Case:</span>
            {matches.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMatch(m)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  currentMatch.id === m.id
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white'
                }`}
              >
                <span>{m.lostReport.itemName}</span>
                <span className="ml-1.5 text-[10px] font-mono font-bold opacity-80">({m.confidenceScore}%)</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. FORENSIC SPLIT COMPARATOR (LOST CLAIM vs CORRELATION vs FOUND VAULT)
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT COLUMN (40%): LOST ITEM CLAIM */}
        <div className="lg:col-span-4 rounded-3xl bg-[#0E1626]/80 border border-rose-500/30 p-5 sm:p-6 space-y-5 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 rounded-full">
                LOST ITEM CLAIM
              </span>
              <span className="text-xs font-mono text-slate-400">#{currentMatch.lostReport.ticketNumber}</span>
            </div>

            {/* Photo */}
            <div className="relative rounded-2xl overflow-hidden ring-1 ring-rose-500/30 aspect-video bg-black/40">
              <img src={lostPhoto} alt="Lost Claim" className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[11px] font-mono">
                Reported by {currentMatch.lostReport.reporterName}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-heading font-black text-white">{currentMatch.lostReport.itemName}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{currentMatch.lostReport.description}</p>
            </div>

            {/* Specs Grid */}
            <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Brand / Model:</span>
                <span className="font-semibold text-slate-200">
                  {currentMatch.lostReport.brand || 'Unspecified'} {currentMatch.lostReport.model || ''}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Color Spec:</span>
                <span className="font-semibold text-slate-200">{currentMatch.lostReport.color || 'Matte Black'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Incident Sector:</span>
                <span className="font-semibold text-slate-200">
                  {currentMatch.lostReport.location.building} • {currentMatch.lostReport.location.room}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Decals / Marks:</span>
                <span className="font-semibold text-indigo-300">
                  {currentMatch.lostReport.identifyingFeatures || 'None logged'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200">
            <span className="font-bold block">Claimant Identity:</span>
            <span>{currentMatch.lostReport.reporterName} ({currentMatch.lostReport.reporterDepartment})</span>
          </div>
        </div>

        {/* CENTER COLUMN (40%): MATCH CORRELATION MATRIX */}
        <div className="lg:col-span-4 rounded-3xl bg-[#090E1A] border-2 border-indigo-500/40 p-5 sm:p-6 space-y-6 flex flex-col justify-between shadow-2xl shadow-indigo-950/50">
          <div className="space-y-5">
            {/* Center Gauge */}
            <div className="text-center space-y-1.5 border-b border-white/[0.08] pb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 block font-bold">
                CORRELATION INDEX
              </span>
              <div className="text-5xl font-heading font-black font-mono text-transparent bg-gradient-to-r from-indigo-300 via-sky-200 to-emerald-300 bg-clip-text">
                {currentMatch.confidenceScore}%
              </div>
              <p className="text-xs text-slate-400">
                Algorithm evaluated 5 distinct physical & spatial dimensions
              </p>
            </div>

            {/* Factor by factor matching rows */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Verification Factors
              </span>

              {[
                { factor: 'Hardware Category', status: 'MATCH', desc: 'Exact classification: Electronics / Laptop', strength: '100%' },
                { factor: 'Brand & Model', status: 'STRONG', desc: 'Lenovo ThinkPad X1 correlation', strength: '95%' },
                { factor: 'Spatial Proximity', status: 'CORRELATED', desc: 'CS-204 AI Lab to Gate 1 Transit', strength: '88%' },
                { factor: 'Decals & Vinyl Stickers', status: 'PENDING', desc: 'Linux Tux decal requires physical inspection', strength: '80%' },
                {
                  factor: 'Hardware Serial Number',
                  status: isVerified ? 'VERIFIED MATCH' : 'ENCRYPTED',
                  desc: isVerified ? 'PF-284920-X1 verified by Officer Nair' : 'Protected in Confidential Vault',
                  strength: isVerified ? '100%' : 'LOCKED',
                },
              ].map((f) => (
                <div key={f.factor} className="p-3 rounded-2xl bg-[#0E1626] border border-white/[0.05] space-y-1">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-bold text-white">{f.factor}</span>
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        f.status.includes('VERIFIED') || f.status === 'MATCH'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : f.status === 'ENCRYPTED'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30'
                      }`}
                    >
                      {f.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-snug">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Checkpoint Action */}
          <div className="pt-2">
            {!isVerified ? (
              <button
                onClick={() => setIsEvidenceModalOpen(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/40 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[17px]">security</span>
                <span>Open Verification Checkpoint</span>
              </button>
            ) : (
              <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Ownership Verified by Security Desk</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN (40%): FOUND ITEM IN VAULT */}
        <div className="lg:col-span-4 rounded-3xl bg-[#0E1626]/80 border border-emerald-500/30 p-5 sm:p-6 space-y-5 flex flex-col justify-between shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span className="text-[10px] font-mono font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                GATE 1 VAULT CUSTODY
              </span>
              <span className="text-xs font-mono text-slate-400">#{currentMatch.foundReport.ticketNumber}</span>
            </div>

            {/* Photo */}
            <div className="relative rounded-2xl overflow-hidden ring-1 ring-emerald-500/30 aspect-video bg-black/40">
              <img src={foundPhoto} alt="Found Vault Item" className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[11px] font-mono">
                Logged into Security Locker #04
              </div>
            </div>

            <div>
              <h3 className="text-lg font-heading font-black text-white">{currentMatch.foundReport.itemName}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{currentMatch.foundReport.description}</p>
            </div>

            {/* Specs Grid */}
            <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Brand / Model:</span>
                <span className="font-semibold text-slate-200">
                  {currentMatch.foundReport.brand || 'Lenovo'} {currentMatch.foundReport.model || ''}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Color Spec:</span>
                <span className="font-semibold text-slate-200">{currentMatch.foundReport.color || 'Matte Black'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Surrendered By:</span>
                <span className="font-semibold text-slate-200">
                  {currentMatch.foundReport.reporterName} (Campus Hero)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Custody Officer:</span>
                <span className="font-semibold text-emerald-400">Officer R. Nair (Badge #CS-409)</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200">
            <span className="font-bold block">Physical Vault Status:</span>
            <span>Secured in Tamper-Evident Locker at Gate 1 Main Entrance</span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          3. COMPLETE 4-STAGE RETURN JOURNEY PIPELINE
      ───────────────────────────────────────────────────────────────────────────── */}
      <section className="p-6 sm:p-8 rounded-3xl bg-[#090E1A] border border-white/[0.08] space-y-6">
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-wider text-indigo-400 block mb-1">
            SAFE HANDOVER PROTOCOL
          </span>
          <h2 className="text-xl font-heading font-black text-white">Full Return Journey Pipeline</h2>
          <p className="text-xs text-slate-400">Track item progression from correlation to verified safe return</p>
        </div>

        {/* 4 Pipeline Stages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stage 1: Potential Match */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Stage 1</span>
              <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
            </div>
            <h4 className="font-bold text-sm text-white">Potential Match</h4>
            <p className="text-[11px] text-slate-300">
              Algorithm correlated incident #142 with custody vault #148 with 87% confidence.
            </p>
          </div>

          {/* Stage 2: Verification Checkpoint */}
          <div
            className={`p-4 rounded-2xl border space-y-2 ${
              isVerified
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-indigo-500/10 border-indigo-400/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">Stage 2</span>
              <span className="material-symbols-outlined text-[18px] text-indigo-400">
                {isVerified ? 'check_circle' : 'security'}
              </span>
            </div>
            <h4 className="font-bold text-sm text-white">Verification Checkpoint</h4>
            <p className="text-[11px] text-slate-300">
              {isVerified
                ? 'Ownership verified via serial number & purchase order by Officer Nair.'
                : 'Claimant transmits confidential serial proof to security desk.'}
            </p>
          </div>

          {/* Stage 3: Safe Handover Exchange */}
          <div
            className={`p-4 rounded-2xl border space-y-2 ${
              currentHandover?.status === 'COMPLETED'
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : isVerified
                ? 'bg-indigo-500/10 border-indigo-400/30'
                : 'bg-white/[0.02] border-white/[0.06] opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Stage 3</span>
              <span className="material-symbols-outlined text-[18px] text-slate-400">handshake</span>
            </div>
            <h4 className="font-bold text-sm text-white">Safe Handover</h4>
            <p className="text-[11px] text-slate-300">
              Exchange coordinated at Gate 1 Campus Exchange Kiosk under officer witness.
            </p>
          </div>

          {/* Stage 4: Return Confirmed & Hero Points */}
          <div
            className={`p-4 rounded-2xl border space-y-2 ${
              currentHandover?.status === 'COMPLETED'
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-white/[0.02] border-white/[0.06] opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Stage 4</span>
              <span className="material-symbols-outlined text-[18px] text-slate-400">military_tech</span>
            </div>
            <h4 className="font-bold text-sm text-white">This Item Made It Home</h4>
            <p className="text-[11px] text-slate-300">
              Both parties attest physical return. Hero points credited to Rahul K.
            </p>
          </div>
        </div>

        {/* Action Bar for Verification / Chat / Handover */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEvidenceModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>{isVerified ? 'View Verified Credentials' : 'Submit Ownership Proof'}</span>
            </button>

            {isVerified && (
              <button
                onClick={() => openChatModal(currentMatch.id)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all cursor-pointer flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>Open Escrow Handover Chat</span>
              </button>
            )}

            {isSecurityOrAdmin && !isVerified && (
              <button
                onClick={() => {
                  updateVerificationStatus(currentMatch.id, 'VERIFIED', 'Attested by Officer Nair', 'Officer R. Nair', 'OFFICER');
                  triggerToast('Ownership confirmed & certified by Security Desk', 'verified', 'success');
                }}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs cursor-pointer"
              >
                Officer Attestation: Verify Ownership
              </button>
            )}
          </div>

          <button
            onClick={() => {
              dismissMatch(currentMatch.id);
              triggerToast('Match dismissed from active radar', 'info');
            }}
            className="text-xs text-slate-400 hover:text-rose-400 font-medium transition-colors cursor-pointer"
          >
            Dismiss Match Correlation
          </button>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          4. EVIDENCE SUBMISSION MODAL
      ───────────────────────────────────────────────────────────────────────────── */}
      {isEvidenceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0B101D] border border-white/[0.12] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-indigo-400 text-[22px]">security</span>
                <div>
                  <h3 className="font-heading font-black text-base text-white">Ownership Checkpoint</h3>
                  <p className="text-[11px] text-slate-400">Encrypted transmission to Gate 1 security desk</p>
                </div>
              </div>
              <button
                onClick={() => setIsEvidenceModalOpen(false)}
                className="p-1 rounded-lg bg-white/[0.05] text-slate-400 hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleEvidenceSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase block">
                  Serial Number / Device IMEI *
                </label>
                <input
                  type="text"
                  value={evidenceSerial}
                  onChange={(e) => setEvidenceSerial(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#080D1A] border border-white/[0.1] text-white font-mono text-xs focus-ring"
                  placeholder="e.g. PF-284920-X1"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase block">
                  Confidential Identifying Hint
                </label>
                <textarea
                  rows={3}
                  value={evidenceHint}
                  onChange={(e) => setEvidenceHint(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#080D1A] border border-white/[0.1] text-white text-xs focus-ring"
                  placeholder="e.g. Lockscreen wallpaper, sticker placement, inside pocket contents..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase block">
                  Procurement Invoice / Student Order Slip
                </label>
                <input
                  type="text"
                  value={evidenceFile}
                  onChange={(e) => setEvidenceFile(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#080D1A] border border-white/[0.1] text-white font-mono text-xs focus-ring"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsEvidenceModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  Transmit Proof for Attestation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
