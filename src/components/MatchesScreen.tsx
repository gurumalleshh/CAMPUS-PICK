import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PotentialMatch } from '../types';
import { evaluateReportCorrelation, extractBrand } from '../utils/matchingEngine';

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
    requestChatApproval,
    updateVerificationStatus,
    goBack,
  } = useApp();

  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [evidenceSerial, setEvidenceSerial] = useState('PF-284920-X1');
  const [evidenceHint, setEvidenceHint] = useState('Linux Tux sticker on palmrest, matrix wallpaper with USN 4PS23CS084');
  const [evidenceFile, setEvidenceFile] = useState('PESCE_Computer_Procurement_Receipt.pdf');

  const currentMatch: PotentialMatch | undefined = selectedMatch || matches[0];
  const currentVerification = currentMatch ? verifications[currentMatch.id] : undefined;

  const isVerified = currentVerification?.status === 'VERIFIED';
  const isRejected = currentVerification?.status === 'REJECTED';
  const isUnderReview = currentVerification?.status === 'UNDER_REVIEW';
  const needsMore = currentVerification?.status === 'NEEDS_MORE_EVIDENCE';

  // Strict ownership & finder checks: only owner (loser) or finder can submit proof
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

  const canSubmitProof = isOwner || isFinder;
  const isSecurityOrAdmin = currentUser?.role === 'security' || currentUser?.role === 'admin';

  const isApprovedByAdmin =
    isVerified &&
    (currentVerification?.approverRole === 'ADMIN' ||
      currentVerification?.reviewedBy?.toLowerCase().includes('admin') ||
      currentVerification?.reviewedBy?.toLowerCase().includes('dean') ||
      currentVerification?.reviewedBy?.toLowerCase().includes('shivakumar'));

  const isApprovedByOfficer = isVerified && !isApprovedByAdmin;

  const currentEvaluation = useMemo(() => {
    if (!currentMatch?.lostReport || !currentMatch?.foundReport) return null;
    return evaluateReportCorrelation(
      currentMatch.lostReport,
      currentMatch.foundReport,
      isSecurityOrAdmin,
      currentVerification?.submittedEvidence.serialNumberProvided
    );
  }, [currentMatch, isSecurityOrAdmin, currentVerification?.submittedEvidence.serialNumberProvided]);

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
  };

  if (!currentUser) return null;

  return (
    <div className="pb-24 lg:pb-12 pt-20 px-3 sm:px-6 max-w-[1600px] mx-auto space-y-6">
      {/* Screen Title with Back Button */}
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
              Potential Matches
            </h1>
            <p className="text-xs text-[#3d4a42]">
              Telemetry-driven item correlation across PESCE Mandya
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
          {matches.length} Detected
        </span>
      </div>

      {matches.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
          <span className="material-symbols-outlined text-[48px] text-slate-300">
            handshake
          </span>
          <h3 className="font-heading font-bold text-base text-[#0b241c]">
            No Pending Matches Found
          </h3>
          <p className="text-xs text-[#3d4a42] max-w-sm mx-auto">
            When a deposited found item correlates with your lost report, the AI Telemetry matching engine will list it here for ownership verification.
          </p>
        </div>
      ) : (
        <>
          {/* Active Matches Switcher if multiple */}
          {matches.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {matches.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMatch(m)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                    currentMatch?.id === m.id
                      ? 'bg-[#0b241c] text-white border-[#0b241c]'
                      : 'bg-white text-[#3d4a42] border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {m.lostReport.itemName} ({m.confidenceScore}% Match)
                </button>
              ))}
            </div>
          )}

          {currentMatch && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Correlation Telemetry & Item Matrix */}
              <div className="lg:col-span-7 space-y-5">
              {/* Match Header Alert Banner */}
              <div className="p-4 rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#043e2e] to-[#022c22] text-white border border-emerald-800/60 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      TELEMETRY CORRELATION • {currentEvaluation?.confidenceScore ?? currentMatch.confidenceScore}% SIMILARITY
                    </span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-amber-950">
                    MATCH ≠ OWNERSHIP
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  A machine correlation has evaluated physical and temporal proximity. Physical custody remains protected at{' '}
                  <strong className="text-white font-semibold">
                    {currentMatch.foundReport.location.building}
                  </strong>{' '}
                  pending official verification.
                </p>

                {/* 4-Stage Verification Progress */}
                <div className="pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-300 mb-2">
                    <span>1. Report</span>
                    <span className={isUnderReview || isVerified ? 'text-emerald-400 font-bold' : ''}>
                      2. Evidence
                    </span>
                    <span className={isVerified ? 'text-emerald-400 font-bold' : ''}>
                      3. Officer / Admin Auth
                    </span>
                    <span className={isVerified ? 'text-emerald-400 font-bold' : ''}>
                      4. Release
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden flex">
                    <div className="w-1/4 bg-emerald-400 h-full" />
                    <div className={`w-1/4 h-full ${isUnderReview || isVerified ? 'bg-emerald-400' : 'bg-white/10'}`} />
                    <div className={`w-1/4 h-full ${isVerified ? 'bg-emerald-400' : 'bg-white/10'}`} />
                    <div className={`w-1/4 h-full ${isVerified ? 'bg-emerald-400' : 'bg-white/10'}`} />
                  </div>
                </div>
              </div>

              {/* Algorithmic Discrepancy Alert Banner */}
              {currentEvaluation?.hasSignificantDiscrepancies && (
                <div className="p-4 rounded-2xl bg-rose-50/95 border border-rose-200 text-rose-950 space-y-2.5 shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-rose-900">
                    <span className="material-symbols-outlined text-[20px] text-rose-600">warning</span>
                    <span>Algorithmic Correlation Discrepancy Detected</span>
                  </div>
                  <p className="text-xs text-rose-800 leading-relaxed">
                    Critical attribute differences were identified between Case #{currentMatch.lostReport.ticketNumber} and Case #{currentMatch.foundReport.ticketNumber}. Automatic verification is restricted:
                  </p>
                  <ul className="space-y-1 text-xs text-rose-900 font-medium pl-1">
                    {currentEvaluation.discrepancies.map((discrepancy, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-1.5">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{discrepancy}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Side-by-Side Telemetry Comparison Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                <h3 className="font-heading font-bold text-sm text-[#0b241c] flex items-center justify-between">
                  <span>Side-by-Side Report Matrix</span>
                  <span className="text-xs font-mono font-normal text-slate-500">
                    Case #{currentMatch.lostReport.ticketNumber} vs #{currentMatch.foundReport.ticketNumber}
                  </span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  {/* Left: Your Lost Report */}
                  <div className="space-y-2 sm:pr-3 sm:border-r border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200/60">
                        YOUR LOST REPORT
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        #{currentMatch.lostReport.ticketNumber}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900">
                      {currentMatch.lostReport.itemName}
                    </h4>
                    <div className="space-y-1 text-[11px] text-slate-600">
                      <p className="flex items-center justify-between">
                        <span className="text-slate-500">Brand:</span>
                        <span className="font-semibold text-slate-800">
                          {extractBrand(currentMatch.lostReport)?.toUpperCase() || currentMatch.lostReport.brand || 'Unspecified'}
                        </span>
                      </p>
                      <p className="flex items-center justify-between">
                        <span className="text-slate-500">Color:</span>
                        <span className="font-medium text-slate-700">{currentMatch.lostReport.color || 'Unspecified'}</span>
                      </p>
                      <p className="flex items-center justify-between">
                        <span className="text-slate-500">Location:</span>
                        <span className="font-medium text-slate-700">{currentMatch.lostReport.location.room}</span>
                      </p>
                      <p className="flex items-center justify-between">
                        <span className="text-slate-500">Event Time:</span>
                        <span className="font-medium text-slate-700">{currentMatch.lostReport.eventTime}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right: Turned In Found Report */}
                  <div className="space-y-2 sm:pl-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                        TURNED IN ITEM
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        #{currentMatch.foundReport.ticketNumber}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900">
                      {currentMatch.foundReport.itemName}
                    </h4>
                    <div className="space-y-1 text-[11px] text-slate-600">
                      <p className="flex items-center justify-between">
                        <span className="text-slate-500">Brand:</span>
                        <span className="font-semibold text-slate-800">
                          {extractBrand(currentMatch.foundReport)?.toUpperCase() || currentMatch.foundReport.brand || 'Unspecified'}
                        </span>
                      </p>
                      <p className="flex items-center justify-between">
                        <span className="text-slate-500">Color:</span>
                        <span className="font-medium text-slate-700">{currentMatch.foundReport.color || 'Unspecified'}</span>
                      </p>
                      <p className="flex items-center justify-between">
                        <span className="text-slate-500">Location:</span>
                        <span className="font-medium text-slate-700">{currentMatch.foundReport.location.room}</span>
                      </p>
                      <p className="flex items-center justify-between">
                        <span className="text-slate-500">Event Time:</span>
                        <span className="font-medium text-slate-700">{currentMatch.foundReport.eventTime}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Telemetry Factors Checklist */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Algorithmic Correlation Factors
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      Rule-based verification score
                    </span>
                  </div>
                  <div className="space-y-2">
                    {(currentEvaluation?.matchingFactors || currentMatch.matchingFactors).map((factor, idx) => {
                      const isMismatch = factor.status === 'MISMATCH' || (!factor.match && factor.status !== 'PARTIAL' && factor.status !== 'PENDING');
                      const isPending = factor.status === 'PENDING';
                      const isPartial = factor.status === 'PARTIAL';
                      const isMatch = factor.status === 'MATCH' || (factor.match && !isMismatch && !isPending && !isPartial);

                      return (
                        <div
                          key={idx}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs py-2 px-3 rounded-xl border ${
                            isMismatch
                              ? 'bg-rose-50/60 border-rose-200'
                              : isMatch
                              ? 'bg-emerald-50/50 border-emerald-200'
                              : isPartial
                              ? 'bg-amber-50/50 border-amber-200'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`material-symbols-outlined text-[18px] shrink-0 ${
                                isMismatch
                                  ? 'text-rose-600'
                                  : isMatch
                                  ? 'text-emerald-600'
                                  : isPartial
                                  ? 'text-amber-500'
                                  : 'text-slate-400'
                              }`}
                            >
                              {isMismatch
                                ? 'cancel'
                                : isMatch
                                ? 'check_circle'
                                : isPartial
                                ? 'info'
                                : 'lock'}
                            </span>
                            <span className="font-semibold text-slate-800 truncate">
                              {factor.name}
                            </span>
                            <span
                              className={`text-[9.5px] font-black uppercase px-1.5 py-0.5 rounded shrink-0 ${
                                isMismatch
                                  ? 'bg-rose-100 text-rose-800'
                                  : isMatch
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isPartial
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {isMismatch ? 'MISMATCH' : isMatch ? 'MATCH' : isPartial ? 'PARTIAL' : 'VAULT SECURED'}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-600 font-mono sm:text-right pl-6 sm:pl-0">
                            {factor.description}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CONFIDENTIAL CUSTODY DETAILS (Visible ONLY to Officer and Admin) */}
                {isSecurityOrAdmin ? (
                  <div className="mt-3 p-3.5 bg-slate-900 text-white rounded-2xl border border-slate-700 space-y-2.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-400 text-[20px]">
                          vpn_key
                        </span>
                        <div>
                          <h4 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                            <span>Confidential Details Vault</span>
                            <span className="text-[9px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded font-mono">
                              OFFICER & ADMIN ONLY
                            </span>
                          </h4>
                          <p className="text-[10px] text-slate-400">
                            Clearance granted to {currentUser.role === 'admin' ? 'Administrator' : 'Campus Security Officer'}. Shielded from students.
                          </p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-emerald-400 text-[18px]">
                        lock_open
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 space-y-1">
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                          Hardware Serial / IMEI
                        </span>
                        <span className="font-mono text-emerald-400 font-bold text-xs block">
                          {currentVerification?.submittedEvidence.serialNumberProvided ||
                            currentMatch.lostReport.privateEvidence?.serialNumber ||
                            'PF-284920-X1'}
                        </span>
                      </div>

                      <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 space-y-1">
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                          Procurement Proof / Invoice
                        </span>
                        <span className="font-mono text-blue-300 text-xs truncate block">
                          {currentVerification?.submittedEvidence.invoiceDocumentUrl ||
                            currentMatch.lostReport.privateEvidence?.invoiceFileName ||
                            'PESCE_Computer_Procurement_Receipt.pdf'}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 space-y-1 text-xs">
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                        Private Lockscreen / Decal / Marking Notes
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {currentVerification?.submittedEvidence.lockscreenOrDecalHint ||
                          currentMatch.lostReport.privateEvidence?.privateNotes ||
                          'Lockscreen wallpaper is dark matrix code with student ID 4PS23CS084 engraved on base corner. Linux Tux penguin decal near left USB-C.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 p-3 bg-slate-100/90 border border-slate-200 rounded-2xl flex items-start gap-2.5 text-xs text-slate-600">
                    <span className="material-symbols-outlined text-slate-500 text-[18px] shrink-0 mt-0.5">
                      lock
                    </span>
                    <div>
                      <span className="font-bold text-slate-800 block text-xs">
                        Confidential Details Shielded (AES-256)
                      </span>
                      <span className="text-[11px] text-slate-500 leading-snug block">
                        Hardware serial numbers, purchase invoices, and private owner markings are stored in the institutional encrypted vault. Only authorized Campus Security Officers and Administrators can inspect confidential details to protect owner privacy and prevent fraudulent claims.
                      </span>
                    </div>
                  </div>
                )}
              </div>
              </div>

              {/* Right Column: Verification Authority, Handover & Actions */}
              <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
                {/* Ownership Verification Card & Actions */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                {/* Ownership Verification & Authority Approval Card Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-700 text-[22px]">
                      security
                    </span>
                    <h3 className="font-heading font-bold text-sm text-[#0b241c]">
                      Ownership Verification & Authority Approval
                    </h3>
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isApprovedByAdmin
                        ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                        : isApprovedByOfficer
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        : isUnderReview
                        ? 'bg-amber-100 text-amber-800'
                        : needsMore
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {isApprovedByAdmin
                      ? 'APPROVED BY ADMIN'
                      : isApprovedByOfficer
                      ? 'APPROVED BY OFFICER'
                      : isUnderReview
                      ? 'APPROVAL PENDING'
                      : 'VERIFICATION REQUIRED'}
                  </span>
                </div>

                {isApprovedByAdmin ? (
                  <div className="p-3.5 bg-indigo-50 border border-indigo-300 rounded-2xl space-y-1.5 text-xs text-indigo-950">
                    <div className="flex items-center justify-between">
                      <p className="font-bold flex items-center gap-1.5 text-indigo-950">
                        <span className="material-symbols-outlined text-[18px] text-indigo-700">verified</span>
                        <span>Certified & Approved by Admin ({currentVerification?.reviewedBy || 'Dr. N. Shivakumar, Dean of Student Welfare'})</span>
                      </p>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-900">
                        STATUS: APPROVED
                      </span>
                    </div>
                    <p className="text-indigo-900 leading-relaxed">
                      Official administrative verification approved by Campus Administration. Student ownership credentials attested under Dean of Student Welfare records. Direct messaging access is unlocked.
                    </p>
                  </div>
                ) : isApprovedByOfficer ? (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-1.5 text-xs text-emerald-950">
                    <div className="flex items-center justify-between">
                      <p className="font-bold flex items-center gap-1.5 text-emerald-950">
                        <span className="material-symbols-outlined text-[18px] text-emerald-700">verified</span>
                        <span>Certified & Approved by Officer ({currentVerification?.reviewedBy || 'Officer R. Nair, Badge #CS-409'})</span>
                      </p>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                        STATUS: APPROVED
                      </span>
                    </div>
                    <p className="text-emerald-900 leading-relaxed">
                      Physical security verification completed at Gate 1 post. Hardware markings, serial number, and student credentials verified by on-duty officer. Direct messaging access is unlocked.
                    </p>
                  </div>
                ) : isRejected ? (
                  <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-2xl space-y-2 text-xs text-rose-950">
                    <div className="flex items-center justify-between">
                      <p className="font-bold flex items-center gap-1.5 text-rose-900">
                        <span className="material-symbols-outlined text-[18px] text-rose-700">cancel</span>
                        <span>Verification Rejected by {currentVerification?.reviewedBy || 'Officer R. Nair'}</span>
                      </p>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-200 text-rose-900">
                        STATUS: REJECTED
                      </span>
                    </div>
                    <p className="text-rose-900 leading-relaxed">
                      This chat verification request was reviewed and rejected. Claimed proof did not match official custody records. Direct student chat remains disabled.
                    </p>
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        onClick={() => requestChatApproval(currentMatch.id)}
                        className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[14px]">send</span>
                        <span>Re-Submit Chat Request to Officers</span>
                      </button>
                    </div>
                  </div>
                ) : isUnderReview ? (
                  <div className="p-3.5 bg-amber-50/90 border border-amber-300 rounded-2xl space-y-1.5 text-xs text-amber-950">
                    <div className="flex items-center justify-between">
                      <p className="font-bold flex items-center gap-1.5 text-amber-900">
                        <span className="material-symbols-outlined text-[18px] text-amber-700">hourglass_top</span>
                        <span>Chat Request Sent to Officers • Decision Pending</span>
                      </p>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                        PENDING DECISION
                      </span>
                    </div>
                    <p className="text-amber-900 leading-relaxed">
                      Chat request sent to <strong>Officer R. Nair (Badge #CS-409)</strong> & <strong>Admin Dr. N. Shivakumar</strong>. Per campus protocol, chat does NOT approve automatically. If approved, status will display Approved. If rejected, status will display Rejected.
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-2xl space-y-2 text-xs text-slate-900">
                    <div className="flex items-center justify-between">
                      <p className="font-bold flex items-center gap-1.5 text-slate-800">
                        <span className="material-symbols-outlined text-[18px] text-slate-600">lock</span>
                        <span>Officer Verification Required</span>
                      </p>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                        MESSAGING LOCKED
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      To protect student privacy and avoid fraud, chat requests are sent to Gate 1 security officers and campus admins for manual review.
                    </p>
                    <button
                      onClick={() => requestChatApproval(currentMatch.id)}
                      className="px-3 py-1.5 bg-[#008069] hover:bg-[#006e59] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer w-fit"
                    >
                      <span className="material-symbols-outlined text-[15px]">send</span>
                      <span>Send Chat Request to Officers</span>
                    </button>
                  </div>
                )}

                {/* TAKE APPROVAL FROM ADMIN OR VERIFICATION OFFICER ACTION PANEL */}
                {!isVerified ? (
                  <div className="p-4 bg-gradient-to-br from-[#064e3b] via-[#043e2e] to-[#022c22] text-white rounded-2xl space-y-3.5 shadow-md border border-emerald-800/40">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-400 text-[20px]">
                          how_to_reg
                        </span>
                        <div>
                          <h4 className="font-bold text-sm text-white">
                            {currentUser.role === 'admin'
                              ? 'Administrator Verification Attestation'
                              : currentUser.role === 'security'
                              ? 'Campus Security Verification Attestation'
                              : 'Authorized Authority Sign-off Pending'}
                          </h4>
                          <p className="text-[11px] text-slate-300">
                            {currentUser.role === 'admin'
                              ? 'You are logged in as Administrator. Review evidence and issue administrative sign-off.'
                              : currentUser.role === 'security'
                              ? 'You are logged in as Campus Security Officer. Inspect physical custody and issue officer sign-off.'
                              : 'Direct messaging and handover require official sign-off from on-duty Campus Security or Administration.'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded whitespace-nowrap">
                        {isUnderReview ? 'Review Pending' : isRejected ? 'Rejected' : 'Action Required'}
                      </span>
                    </div>

                    {/* Role-Specific Approver UI: ONLY Admin for admin, ONLY Officer for officer */}
                    {currentUser.role === 'admin' ? (
                      /* Admin Only Card */
                      <div className="p-3.5 rounded-xl border bg-indigo-950/70 border-indigo-500/60 ring-1 ring-indigo-500/40 transition-all flex flex-col justify-between">
                        <div>
                          <div className="flex items-start gap-2.5">
                            <img
                              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                              alt="Dr. N. Shivakumar"
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-400 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
                                  Campus Administrator Desk
                                </span>
                                <span className="text-[9px] bg-indigo-500 text-white font-black px-1.5 py-0.2 rounded">
                                  YOUR AUTHORITY
                                </span>
                              </div>
                              <h5 className="font-bold text-xs text-white truncate">
                                Dr. N. Shivakumar
                              </h5>
                              <p className="text-[10px] text-slate-300 truncate">
                                Dean of Student Welfare • EMP-ADM-012
                              </p>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-300 mt-2 line-clamp-2">
                            Attest official institutional ownership via student registry and procurement ledger.
                          </p>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <button
                            onClick={() => {
                              updateVerificationStatus(
                                currentMatch.id,
                                'VERIFIED',
                                'Hardware markings and purchase invoice attested under Dean of Student Welfare records.',
                                'Admin Dr. N. Shivakumar (Dean of Student Welfare)',
                                'ADMIN'
                              );
                            }}
                            className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">verified_user</span>
                            <span>Approve as Admin</span>
                          </button>
                          <button
                            onClick={() => {
                              updateVerificationStatus(
                                currentMatch.id,
                                'REJECTED',
                                'Procurement ledger does not match student ownership claim.',
                                'Admin Dr. N. Shivakumar (Dean of Student Welfare)',
                                'ADMIN'
                              );
                            }}
                            className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
                            title="Reject this match verification as Admin"
                          >
                            <span className="material-symbols-outlined text-[16px]">cancel</span>
                            <span>Reject as Admin</span>
                          </button>
                        </div>
                      </div>
                    ) : currentUser.role === 'security' ? (
                      /* Officer Only Card */
                      <div className="p-3.5 rounded-xl border bg-emerald-950/70 border-emerald-500/60 ring-1 ring-emerald-500/40 transition-all flex flex-col justify-between">
                        <div>
                          <div className="flex items-start gap-2.5">
                            <img
                              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
                              alt="Officer R. Nair"
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-400 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                                  Campus Security Custody Post
                                </span>
                                <span className="text-[9px] bg-emerald-500 text-white font-black px-1.5 py-0.2 rounded">
                                  YOUR AUTHORITY
                                </span>
                              </div>
                              <h5 className="font-bold text-xs text-white truncate">
                                Officer R. Nair
                              </h5>
                              <p className="text-[10px] text-slate-300 truncate">
                                Badge #CS-409 • Gate 1 Security Desk
                              </p>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-300 mt-2 line-clamp-2">
                            Verify physical device serial #PF-284920-X1 and hardware markings at Gate 1 post.
                          </p>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <button
                            onClick={() => {
                              updateVerificationStatus(
                                currentMatch.id,
                                'VERIFIED',
                                'Hardware markings, serial number PF-284920-X1, and invoice receipt attested at Gate 1 post.',
                                'Verification Officer R. Nair (Badge #CS-409)',
                                'OFFICER'
                              );
                            }}
                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">verified</span>
                            <span>Approve as Officer</span>
                          </button>
                          <button
                            onClick={() => {
                              updateVerificationStatus(
                                currentMatch.id,
                                'REJECTED',
                                'Evidence provided does not match verified device records at Gate 1 custody post.',
                                'Verification Officer R. Nair (Badge #CS-409)',
                                'OFFICER'
                              );
                            }}
                            className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
                            title="Reject this match verification as Officer"
                          >
                            <span className="material-symbols-outlined text-[16px]">cancel</span>
                            <span>Reject as Officer</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Regular Student / User View (NO approve or reject buttons) */
                      <div className="p-3.5 rounded-xl border bg-white/5 border-white/10 space-y-2.5">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[18px]">verified_user</span>
                          </div>
                          <div className="text-xs space-y-1 flex-1">
                            <p className="font-bold text-white">
                              Official Verification Authority Required
                            </p>
                            <p className="text-[11px] text-slate-300 leading-relaxed">
                              Match verification and handover unlocking can only be authorized by either <strong>Verification Officer R. Nair</strong> (Gate 1 Security Desk) or <strong>Admin Dr. N. Shivakumar</strong> (Dean of Student Welfare).
                            </p>
                          </div>
                        </div>

                        <div className="pt-1 flex items-center justify-between border-t border-white/10 text-[11px]">
                          <span className="text-slate-400">
                            Current Case Status:{' '}
                            <strong className="text-amber-300 font-mono">
                              {isUnderReview
                                ? 'UNDER REVIEW'
                                : isRejected
                                ? 'REJECTED'
                                : 'AWAITING DISPATCH'}
                            </strong>
                          </span>

                          {!isUnderReview && !isRejected && (
                            <button
                              onClick={() => {
                                requestChatApproval(currentMatch.id);
                                triggerToast('Verification review request dispatched to Campus Security & Admin.', 'send');
                              }}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[14px]">send</span>
                              <span>Send Request to Officers</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 border-t border-slate-100">
                    <span
                      className={`text-[11px] font-semibold flex items-center gap-1 ${
                        isApprovedByAdmin ? 'text-indigo-900' : 'text-emerald-900'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[16px] ${
                          isApprovedByAdmin ? 'text-indigo-700' : 'text-emerald-600'
                        }`}
                      >
                        verified
                      </span>
                      <span>
                        {isApprovedByAdmin
                          ? 'Approved by Admin (Dr. N. Shivakumar, Dean of Student Welfare)'
                          : 'Approved by Officer (Officer R. Nair, Badge #CS-409)'}
                      </span>
                    </span>

                    {/* Reset button only for testing/authorities */}
                    {(currentUser.role === 'admin' || currentUser.role === 'security') && (
                      <button
                        onClick={() => {
                          updateVerificationStatus(currentMatch.id, 'UNDER_REVIEW', 'Re-locked to test approval flow.');
                          triggerToast('Verification status reset to UNDER_REVIEW.', 'lock', 'info');
                        }}
                        className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                      >
                        Reset Status to Under Review
                      </button>
                    )}
                  </div>
                )}

                {/* Authority Quick Verification Controls (Only if logged in as Officer/Admin) */}
                {(currentUser.role === 'security' || currentUser.role === 'admin') && (
                  <div
                    className={`p-3 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs border ${
                      currentUser.role === 'admin'
                        ? 'bg-indigo-50 border-indigo-300'
                        : 'bg-emerald-50 border-emerald-300'
                    }`}
                  >
                    <div>
                      <p
                        className={`font-bold flex items-center gap-1.5 ${
                          currentUser.role === 'admin' ? 'text-indigo-950' : 'text-emerald-950'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {currentUser.role === 'admin' ? 'admin_panel_settings' : 'shield_person'}
                        </span>
                        <span>
                          {currentUser.role === 'admin'
                            ? 'Logged in as Admin (Dr. N. Shivakumar)'
                            : 'Logged in as Verification Officer (Officer R. Nair)'}
                        </span>
                      </p>
                      <p
                        className={`text-[11px] mt-0.5 ${
                          currentUser.role === 'admin' ? 'text-indigo-900' : 'text-emerald-900'
                        }`}
                      >
                        {currentUser.role === 'admin'
                          ? 'Admin authority active. You can approve or request proof directly as Admin.'
                          : 'Officer Nair authority active. You can approve or request proof directly as Officer.'}
                      </p>
                    </div>
                    <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                      <button
                        onClick={() =>
                          updateVerificationStatus(
                            currentMatch.id,
                            'VERIFIED',
                            currentUser.role === 'admin'
                              ? 'Attested by Admin Dr. N. Shivakumar under Dean of Student Welfare records.'
                              : 'Attested by Officer R. Nair at Gate 1 post.',
                            currentUser.role === 'admin'
                              ? 'Admin Dr. N. Shivakumar (Dean of Student Welfare)'
                              : 'Verification Officer R. Nair (Badge #CS-409)',
                            currentUser.role === 'admin' ? 'ADMIN' : 'OFFICER'
                          )
                        }
                        className={`flex-1 sm:flex-initial px-3 py-2 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
                          currentUser.role === 'admin'
                            ? 'bg-indigo-700 hover:bg-indigo-800'
                            : 'bg-emerald-700 hover:bg-emerald-800'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        <span className="whitespace-nowrap">
                          {currentUser.role === 'admin' ? 'Direct Approve as Admin' : 'Direct Approve as Officer'}
                        </span>
                      </button>
                      <button
                        onClick={() => updateVerificationStatus(currentMatch.id, 'NEEDS_MORE_EVIDENCE')}
                        className="px-3 py-2 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-xs cursor-pointer whitespace-nowrap"
                      >
                        Request Proof
                      </button>
                    </div>
                  </div>
                )}

                {/* Primary Action Buttons & Verification Flow */}
                <div className="space-y-3 pt-2">
                  {/* Proof Submission: strictly visible to Finder and Loser (Owner) */}
                  {canSubmitProof && !isVerified && (
                    <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                          <span className="material-symbols-outlined text-emerald-700 text-[18px]">verified_user</span>
                          <span>
                            {isOwner
                              ? 'Owner Evidence Verification'
                              : 'Finder Custody & Turn-In Proof'}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {isOwner ? 'Owner Proof' : 'Finder Proof'}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-900 leading-relaxed">
                        {isOwner
                          ? `As the owner of this lost item, submit private proof (serial number, purchase receipt, or unique stickers) to authenticate ownership.`
                          : `As the finder, verify physical custody, condition notes, or handover location at Campus Security.`}
                      </p>
                      <button
                        onClick={() => setIsEvidenceModalOpen(true)}
                        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">upload_file</span>
                        <span>
                          {currentVerification?.submittedEvidence
                            ? 'Update Submitted Evidence Documents'
                            : isOwner
                            ? 'Submit Private Ownership Proof'
                            : 'Submit Finder Custody Turn-In Proof'}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Privacy Restriction Banner: Visible to other students (neither owner nor finder) */}
                  {!canSubmitProof && !isSecurityOrAdmin && !isVerified && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-xs flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-slate-400 text-[20px] shrink-0 mt-0.5">
                        lock
                      </span>
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-800">Proof Submission Restricted</p>
                        <p className="text-[11px] text-slate-600 leading-snug">
                          Custody proof can only be submitted by the registered owner (
                          <strong className="text-slate-900">{currentMatch.lostReport.reporterName}</strong>) or the finder (
                          <strong className="text-slate-900">{currentMatch.foundReport.reporterName}</strong>).
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Messaging Access Control */}
                  {isVerified ? (
                    <button
                      onClick={() => openChatModal(currentMatch.id)}
                      className="w-full py-3 bg-[#008069] hover:bg-[#00705b] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">forum</span>
                      <span>
                        Open WhatsApp Campus Chat • {currentMatch.foundReport.reporterName} ({isApprovedByAdmin ? 'Admin Approved ✓' : 'Officer Approved ✓'})
                      </span>
                    </button>
                  ) : isRejected ? (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-rose-600 text-[20px] shrink-0">cancel</span>
                        <div>
                          <p className="font-bold text-rose-900">
                            Status: <span className="uppercase font-black text-rose-700">REJECTED</span>
                          </p>
                          <p className="text-[11px] text-rose-700">
                            Chat request declined by Officer R. Nair. Messaging input disabled.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => requestChatApproval(currentMatch.id)}
                          className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs transition-colors"
                        >
                          Re-Send to Officers
                        </button>
                        <button
                          onClick={() => openChatModal('chat_officer')}
                          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs transition-colors"
                        >
                          Chat with Officer
                        </button>
                      </div>
                    </div>
                  ) : isUnderReview ? (
                    <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-600 text-[20px] shrink-0">hourglass_top</span>
                        <div>
                          <p className="font-bold text-amber-900">
                            Status: <span className="uppercase font-black text-amber-800">PENDING REVIEW</span>
                          </p>
                          <p className="text-[11px] text-amber-700">
                            Chat request sent to Officers. Waiting for decision (Does not auto-approve)...
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => openChatModal('chat_officer')}
                        className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs transition-colors shrink-0"
                      >
                        Follow up with Officer
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400 text-[20px] shrink-0">lock</span>
                        <p className="text-[11px] text-slate-600">
                          Chat is locked. Submit request to Security Officers for manual verification.
                        </p>
                      </div>
                      <button
                        onClick={() => requestChatApproval(currentMatch.id)}
                        className="px-3 py-1.5 bg-[#008069] hover:bg-[#006e59] text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs transition-colors shrink-0"
                      >
                        Request Chat from Officers
                      </button>
                    </div>
                  )}

                  {/* Secondary Actions: Mediation & Dismiss */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 text-xs gap-2">
                    <button
                      onClick={() => {
                        triggerToast('Dispatched mediation request to Officer Nair (Gate 1 Safe Hub)', 'support_agent');
                      }}
                      className="w-full sm:w-auto px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">support_agent</span>
                      <span>Request Officer Mediation</span>
                    </button>

                    <button
                      onClick={() => dismissMatch(currentMatch.id)}
                      className="w-full sm:w-auto px-3 py-2 rounded-xl text-rose-600 hover:text-rose-800 hover:bg-rose-50 font-semibold transition-colors cursor-pointer text-center"
                    >
                      Not Mine • Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
            </div>
          )}
        </>
      )}

      {/* Verification Evidence Modal */}
      {isEvidenceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-700 text-[24px]">
                  encrypted
                </span>
                <h2 className="font-heading font-bold text-base text-[#0b241c]">
                  {isOwner ? 'Owner Proof of Loss & Ownership' : 'Finder Custody & Turn-In Verification'}
                </h2>
              </div>
              <button
                onClick={() => setIsEvidenceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-[#3d4a42] leading-relaxed">
              {isOwner
                ? 'To ensure safe recovery and protect your privacy, provide unique identifiers known only to you as the owner. Campus Security Officer Nair and Admin will attest this evidence.'
                : 'As the finder, confirm identifying markings, physical condition, and turn-in deposit kiosk details to assist Campus Security in matching.'}
            </p>

            <form onSubmit={handleEvidenceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isOwner ? 'Serial Number or IMEI (Confidential)' : 'Visible Model / Serial / Markings (if found)'}
                </label>
                <input
                  type="text"
                  value={evidenceSerial}
                  onChange={(e) => setEvidenceSerial(e.target.value)}
                  placeholder="e.g. PF-284920-X1"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Unique Distinguishing Features / Password / Stickers
                </label>
                <textarea
                  rows={2}
                  value={evidenceHint}
                  onChange={(e) => setEvidenceHint(e.target.value)}
                  placeholder="e.g. Linux Tux decal, scratch on left corner, lockscreen photo description"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Procurement Invoice or Box Photo
                </label>
                <div className="p-3 border-2 border-dashed border-emerald-200 rounded-xl bg-emerald-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-emerald-700 text-[20px]">
                      description
                    </span>
                    <span className="font-mono text-emerald-950 truncate max-w-[200px]">
                      {evidenceFile}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Attached
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer transition-all"
                >
                  Submit for Officer Review
                </button>
                <button
                  type="button"
                  onClick={() => setIsEvidenceModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
