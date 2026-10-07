import React from 'react';
import { useApp } from '../context/AppContext';
import { INSTITUTION_INFO } from '../mockData';

export const CertificateModal: React.FC = () => {
  const { isCertModalOpen, closeCertModal, userCertificate, triggerToast } = useApp();

  if (!isCertModalOpen) return null;

  const handleDownload = () => {
    triggerToast('Official Certificate PDF generated with embedded cryptographic hash', 'download', 'success');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText?.(
      `PES College of Engineering, Mandya (PESCE) Civic Integrity Certificate #${userCertificate.certificateNumber} — Verified 8 returns on Campus Pick.`
    );
    triggerToast('Cryptographic verification link copied to clipboard!', 'share', 'success');
  };

  // Close on Escape key
  React.useEffect(() => {
    if (!isCertModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCertModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCertModalOpen, closeCertModal]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-modal-title"
      onClick={closeCertModal}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0B101D] border-2 border-amber-400/50 rounded-3xl max-w-xl w-full max-h-[95vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#0E1527]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-amber-400 text-[22px]">
              workspace_premium
            </span>
            <span id="cert-modal-title" className="font-heading font-black text-sm text-white">
              Dean of Student Welfare • Civic Integrity Credential
            </span>
          </div>
          <button
            onClick={closeCertModal}
            aria-label="Close certificate dialog"
            className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.15] flex items-center justify-center text-slate-300 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Certificate Display Canvas */}
        <div className="p-6 overflow-y-auto bg-[#070B14] flex-1 flex justify-center">
          <div className="w-full bg-[#0D1322] border-4 border-double border-amber-400/60 rounded-3xl p-6 sm:p-8 text-center relative shadow-2xl flex flex-col justify-between space-y-5">
            {/* Top College Crest & Header */}
            <div>
              <div className="w-16 h-16 mx-auto mb-3 rounded-full border-2 border-amber-400 p-1 flex items-center justify-center bg-white shadow-lg shadow-amber-400/20">
                <img
                  alt="PESCE Crest"
                  className="w-full h-full object-contain"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1UTb0Cfq_rqJaqIAUxgqqhhYLGaQGeyfYXpf1yEBHrdHL-gcAG5AC5ZdrCsRf_lKdyL7lM_OYH6kyKOqVKWbyO6INHedHnUQWXDxyHMJo67LY6LxoBBlo6OMX2qHXcyOU4KzehBwZbhn1euC5eN8TpDdmIsJ6dnb--HIqB65vXT42IZMt6_jzq0beXrwN7Mkxfd20xArxPe3Q_Fdq_jVvcdAMa6KPAcF94lCi8eE9P5Hff8fwHIBC4NYg"
                />
              </div>

              <h2 className="font-heading font-black text-base sm:text-lg tracking-wider text-white uppercase">
                {INSTITUTION_INFO.fullName}
              </h2>
              <p className="text-[10px] text-amber-400/90 uppercase tracking-widest font-mono mt-0.5">
                Mandya, Karnataka • Estd. {INSTITUTION_INFO.established} • Autonomous Institution
              </p>
            </div>

            {/* Achievement Text */}
            <div className="space-y-2.5 py-4 border-y border-amber-400/30 bg-amber-400/5 rounded-2xl px-4">
              <span className="text-[10px] font-mono font-black text-amber-300 uppercase tracking-widest bg-amber-500/20 border border-amber-400/30 px-3 py-0.5 rounded-full inline-block">
                OFFICIAL HONORS CERTIFICATION
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-black text-amber-300">
                {userCertificate.achievement}
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto pt-1 leading-relaxed">
                This document certifies that{' '}
                <strong className="text-white font-black text-sm">
                  {userCertificate.userName}
                </strong>{' '}
                ({userCertificate.userDepartment}) has demonstrated extraordinary civic honesty and campus leadership by successfully restoring{' '}
                <strong className="text-amber-300 font-black">
                  {userCertificate.returnCountMilestone} verified lost items
                </strong>{' '}
                to fellow students under the PESCE Chain-of-Custody Trust Protocol.
              </p>
            </div>

            {/* Signatures & Security Seals */}
            <div className="pt-2 grid grid-cols-2 gap-4 items-end text-center">
              <div className="space-y-1">
                <div className="font-serif italic text-sm text-slate-200 font-semibold border-b border-white/[0.1] pb-1">
                  Dr. N. Shivakumar
                </div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">
                  Dean of Student Welfare
                </p>
              </div>

              <div className="space-y-1">
                <div className="font-serif italic text-sm text-slate-200 font-semibold border-b border-white/[0.1] pb-1">
                  Capt. R. Deshmukh
                </div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">
                  Chief Security Officer
                </p>
              </div>
            </div>

            {/* Verification Watermark */}
            <div className="pt-2 text-[10px] font-mono text-slate-400 flex items-center justify-between border-t border-white/[0.06]">
              <span>NO. #{userCertificate.certificateNumber}</span>
              <span className="text-emerald-400">CRYPTOGRAPHIC SEAL VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#0E1527] border-t border-white/[0.08] flex items-center justify-between gap-3">
          <button
            onClick={handleShare}
            className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">share</span>
            <span>Share Link</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Download Official PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
