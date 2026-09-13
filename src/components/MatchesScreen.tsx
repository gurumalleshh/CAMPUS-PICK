import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PotentialMatch } from '../types';

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
    goBack,
  } = useApp();

  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [evidenceSerial, setEvidenceSerial] = useState('PF-284920-X1');
  const [evidenceHint, setEvidenceHint] = useState('Linux Tux sticker on palmrest, matrix wallpaper with USN 4PS23CS084');
  const [evidenceFile, setEvidenceFile] = useState('PESCE_Computer_Procurement_Receipt.pdf');

  const currentMatch: PotentialMatch | undefined = selectedMatch || matches[0];
  const currentVerification = currentMatch ? verifications[currentMatch.id] : undefined;

  const isVerified = currentVerification?.status === 'VERIFIED';
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
    <div className="pb-24 pt-20 px-4 max-w-2xl mx-auto space-y-5">
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
            <h1 className="font-heading text-2xl font-bold text-[#0b1c30] tracking-tight">
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
          <h3 className="font-heading font-bold text-base text-[#0b1c30]">
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
                      ? 'bg-[#0b1c30] text-white border-[#0b1c30]'
                      : 'bg-white text-[#3d4a42] border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {m.lostReport.itemName} ({m.confidenceScore}% Match)
                </button>
              ))}
            </div>
          )}

          {currentMatch && (
            <div className="space-y-4">
              {/* Match Header Alert Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0c3123] to-[#0b1c30] text-white border border-emerald-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      TELEMETRY CORRELATION • {currentMatch.confidenceScore}% SIMILARITY
                    </span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-amber-950">
                    MATCH ≠ OWNERSHIP
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  A machine correlation has identified high physical and temporal proximity. Physical custody remains protected at{' '}
                  <strong className="text-white font-semibold">
                    {currentMatch.foundReport.location.building}
                  </strong>{' '}
                  pending verification.
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

              {/* Side-by-Side Telemetry Comparison Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                <h3 className="font-heading font-bold text-sm text-[#0b1c30] flex items-center justify-between">
                  <span>Side-by-Side Report Matrix</span>
                  <span className="text-xs font-mono font-normal text-slate-500">
                    Case #{currentMatch.lostReport.ticketNumber} vs #{currentMatch.foundReport.ticketNumber}
                  </span>
                </h3>

                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  {/* Left: Your Lost Report */}
                  <div className="space-y-1.5 pr-2 border-r border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                      YOUR LOST REPORT
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 mt-1">
                      {currentMatch.lostReport.itemName}
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Color: {currentMatch.lostReport.color || 'Matte Black'}
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Loc: {currentMatch.lostReport.location.room}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Time: {currentMatch.lostReport.eventTime}
                    </p>
                  </div>

                  {/* Right: Turned In Found Report */}
                  <div className="space-y-1.5 pl-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      TURNED IN ITEM
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 mt-1">
                      {currentMatch.foundReport.itemName}
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Color: {currentMatch.foundReport.color || 'Dark Charcoal'}
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Loc: {currentMatch.foundReport.location.room}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Time: {currentMatch.foundReport.eventTime}
                    </p>
                  </div>
                </div>

                {/* Telemetry Factors Checklist */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Algorithmic Correlation Factors
                  </span>
                  <div className="space-y-1.5">
                    {currentMatch.matchingFactors.map((factor, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-slate-50 border border-slate-100"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`material-symbols-outlined text-[16px] ${
                              factor.match ? 'text-emerald-600' : 'text-amber-500'
                            }`}
                          >
                            {factor.match ? 'check_circle' : 'lock'}
                          </span>
                          <span className="font-medium text-slate-800">
                            {factor.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {factor.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ownership Verification Card & Actions */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                {/* Ownership Verification & Authority Approval Card Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-700 text-[22px]">
                      security
                    </span>
                    <h3 className="font-heading font-bold text-sm text-[#0b1c30]">
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
                        MESSAGING UNLOCKED
                      </span>
                    </div>
                    <p className="text-indigo-900 leading-relaxed">
                      Official administrative verification approved by Campus Administration. Student ownership and procurement credentials attested under Dean of Student Welfare records. Direct messaging access is unlocked.
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
                        MESSAGING UNLOCKED
                      </span>
                    </div>
                    <p className="text-emerald-900 leading-relaxed">
                      Physical security verification completed at Gate 1 post. Hardware markings, serial number PF-284920-X1, and student credentials verified by on-duty officer. Direct messaging access is unlocked.
                    </p>
                  </div>
                ) : isUnderReview ? (
                  <div className="p-3.5 bg-amber-50/90 border border-amber-300 rounded-2xl space-y-1.5 text-xs text-amber-950">
                    <div className="flex items-center justify-between">
                      <p className="font-bold flex items-center gap-1.5 text-amber-900">
                        <span className="material-symbols-outlined text-[18px] text-amber-700">lock</span>
                        <span>Messaging Access Locked • Admin or Officer Approval Required</span>
                      </p>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                        APPROVAL REQUIRED
                      </span>
                    </div>
                    <p className="text-amber-900 leading-relaxed">
                      Match telemetry detected (87% confidence). In accordance with campus safety rules, direct messaging between students is locked until an on-duty <strong>Verification Officer</strong> or campus <strong>Admin</strong> reviews and approves this claim. Either authority can approve.
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 bg-slate-50 border border-slate-300 rounded-2xl space-y-1.5 text-xs text-slate-900">
                    <div className="flex items-center justify-between">
                      <p className="font-bold flex items-center gap-1.5 text-slate-800">
                        <span className="material-symbols-outlined text-[18px] text-slate-600">lock</span>
                        <span>Verification & Authority Approval Required</span>
                      </p>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                        MESSAGING LOCKED
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      To protect against fraudulent claims, matching verification must be approved by either an Admin or Verification Officer before messaging access is granted.
                    </p>
                  </div>
                )}

                {/* TAKE APPROVAL FROM ADMIN OR VERIFICATION OFFICER ACTION PANEL */}
                {!isVerified ? (
                  <div className="p-4 bg-gradient-to-br from-slate-900 to-[#0b1c30] text-white rounded-2xl space-y-3.5 shadow-md border border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-400 text-[20px]">
                          how_to_reg
                        </span>
                        <div>
                          <h4 className="font-bold text-sm text-white">
                            Authorized Match Approvers
                          </h4>
                          <p className="text-[11px] text-slate-300">
                            Admin or Verification Officer: either authority can verify and grant messaging access
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded whitespace-nowrap">
                        Sign-off Pending
                      </span>
                    </div>

                    {/* Dual Approver Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Approver 1: Verification Officer */}
                      <div
                        className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                          currentUser.role === 'security'
                            ? 'bg-emerald-950/60 border-emerald-500/50 ring-1 ring-emerald-500/30'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                      >
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
                                  Verification Officer
                                </span>
                                {currentUser.role === 'security' && (
                                  <span className="text-[9px] bg-emerald-500 text-white font-black px-1.5 py-0.2 rounded">
                                    YOU
                                  </span>
                                )}
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
                            Verifies physical device serial #PF-284920-X1 and hardware markings at Gate 1 post.
                          </p>
                        </div>

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
                          className="w-full mt-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">verified</span>
                          <span>
                            {currentUser.role === 'security'
                              ? 'Approve as Officer (You)'
                              : 'Take Approval from Officer'}
                          </span>
                        </button>
                      </div>

                      {/* Approver 2: Campus Admin */}
                      <div
                        className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                          currentUser.role === 'admin'
                            ? 'bg-indigo-950/60 border-indigo-500/50 ring-1 ring-indigo-500/30'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                      >
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
                                  Campus Admin
                                </span>
                                {currentUser.role === 'admin' && (
                                  <span className="text-[9px] bg-indigo-500 text-white font-black px-1.5 py-0.2 rounded">
                                    YOU
                                  </span>
                                )}
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
                            Attests official ownership via student registry and college procurement ledger.
                          </p>
                        </div>

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
                          className="w-full mt-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">verified_user</span>
                          <span>
                            {currentUser.role === 'admin'
                              ? 'Approve as Admin (You)'
                              : 'Take Approval from Admin'}
                          </span>
                        </button>
                      </div>
                    </div>
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

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          if (isApprovedByAdmin) {
                            updateVerificationStatus(
                              currentMatch.id,
                              'VERIFIED',
                              'Hardware markings, serial number PF-284920-X1, and invoice receipt attested at Gate 1 post.',
                              'Verification Officer R. Nair (Badge #CS-409)',
                              'OFFICER'
                            );
                          } else {
                            updateVerificationStatus(
                              currentMatch.id,
                              'VERIFIED',
                              'Hardware markings and purchase invoice attested under Dean of Student Welfare records.',
                              'Admin Dr. N. Shivakumar (Dean of Student Welfare)',
                              'ADMIN'
                            );
                          }
                        }}
                        className="text-[11px] text-slate-600 hover:text-slate-900 font-medium underline cursor-pointer"
                      >
                        Switch to {isApprovedByAdmin ? 'Approved by Officer' : 'Approved by Admin'}
                      </button>

                      <button
                        onClick={() => {
                          updateVerificationStatus(currentMatch.id, 'UNDER_REVIEW', 'Re-locked to test approval flow.');
                          triggerToast('Verification re-locked to UNDER_REVIEW for testing.', 'lock', 'info');
                        }}
                        className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                      >
                        Re-test Both Approvals
                      </button>
                    </div>
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
                    <div className="flex gap-2 shrink-0">
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
                        className={`px-3 py-1.5 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs cursor-pointer ${
                          currentUser.role === 'admin'
                            ? 'bg-indigo-700 hover:bg-indigo-800'
                            : 'bg-emerald-700 hover:bg-emerald-800'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        <span>
                          {currentUser.role === 'admin' ? 'Direct Approve as Admin' : 'Direct Approve as Officer'}
                        </span>
                      </button>
                      <button
                        onClick={() => updateVerificationStatus(currentMatch.id, 'NEEDS_MORE_EVIDENCE')}
                        className="px-2.5 py-1.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-xs cursor-pointer"
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
                  ) : (
                    <div className="p-3 bg-slate-100 border border-slate-200 text-slate-500 rounded-xl text-xs flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-slate-400 text-[18px] shrink-0">lock</span>
                      <span className="text-[11px] leading-snug">
                        Messaging access is locked pending Officer Nair or Admin attestation to protect student privacy.
                      </span>
                    </div>
                  )}

                  {/* Secondary Actions: Mediation & Dismiss */}
                  <div className="flex items-center justify-between pt-1 text-xs gap-2">
                    <button
                      onClick={() => {
                        triggerToast('Dispatched mediation request to Officer Nair (Gate 1 Safe Hub)', 'support_agent');
                      }}
                      className="px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">support_agent</span>
                      <span>Request Officer Mediation</span>
                    </button>

                    <button
                      onClick={() => dismissMatch(currentMatch.id)}
                      className="px-3 py-2 rounded-xl text-rose-600 hover:text-rose-800 hover:bg-rose-50 font-semibold transition-colors cursor-pointer"
                    >
                      Not Mine • Dismiss
                    </button>
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
                <h2 className="font-heading font-bold text-base text-[#0b1c30]">
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
