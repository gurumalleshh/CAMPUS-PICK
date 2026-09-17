import React from 'react';
import { useApp } from '../context/AppContext';
import { INSTITUTION_INFO } from '../mockData';

export const CertificateModal: React.FC = () => {
  const { isCertModalOpen, closeCertModal, userCertificate, triggerToast } = useApp();

  if (!isCertModalOpen) return null;

  const handleDownload = () => {
    triggerToast('Certificate PDF generated for campus placement dossier', 'download', 'success');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(
      `PES College of Engineering, Mandya (PESCE) Civic Integrity Certificate #${userCertificate.certificateNumber} — Verified 8 returns on Campus Pick.`
    );
    triggerToast('Verification link copied to clipboard!', 'share', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[95vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95">
        {/* Header Bar */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-600 text-[20px]">
              workspace_premium
            </span>
            <span className="font-heading font-bold text-sm text-[#222022]">
              Official PESCE Civic Credential
            </span>
          </div>
          <button
            onClick={closeCertModal}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Certificate Display Canvas */}
        <div className="p-6 overflow-y-auto bg-slate-50 flex-1 flex justify-center">
          <div className="w-full bg-[#fffefc] border-8 border-double border-[#222022]/30 rounded-2xl p-6 sm:p-8 text-center relative shadow-md flex flex-col justify-between space-y-4">
            {/* Top Ornamental College Crest */}
            <div>
              <div className="w-14 h-14 mx-auto mb-2 rounded-full border-2 border-[#222022]/30 p-1 flex items-center justify-center bg-[#C3D809]/15">
                <img
                  alt="PESCE Crest"
                  className="w-full h-full object-contain"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1UTb0Cfq_rqJaqIAUxgqqhhYLGaQGeyfYXpf1yEBHrdHL-gcAG5AC5ZdrCsRf_lKdyL7lM_OYH6kyKOqVKWbyO6INHedHnUQWXDxyHMJo67LY6LxoBBlo6OMX2qHXcyOU4KzehBwZbhn1euC5eN8TpDdmIsJ6dnb--HIqB65vXT42IZMt6_jzq0beXrwN7Mkxfd20xArxPe3Q_Fdq_jVvcdAMa6KPAcF94lCi8eE9P5Hff8fwHIBC4NYg"
                />
              </div>

              <h2 className="font-heading font-extrabold text-sm sm:text-base tracking-wider text-[#222022] uppercase">
                {INSTITUTION_INFO.fullName}
              </h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                Mandya, Karnataka • Estd. {INSTITUTION_INFO.established}
              </p>
            </div>

            {/* Achievement Text */}
            <div className="space-y-1.5 py-2 border-y border-[#222022]/10">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">
                CIVIC RECOGNITION OF INTEGRITY
              </span>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#222022]">
                {userCertificate.achievement}
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto pt-1 leading-relaxed">
                This certifies that{' '}
                <strong className="text-slate-950 font-bold text-sm">
                  {userCertificate.userName}
                </strong>{' '}
                ({userCertificate.userDepartment}) has demonstrated extraordinary civic honesty by successfully returning{' '}
                <strong className="text-[#222022] font-bold">
                  {userCertificate.returnCountMilestone} verified lost items
                </strong>{' '}
                to fellow students under the Campus Pick Trust Protocol.
              </p>
            </div>

            {/* Signatures & Tamper-Proof Stamp */}
            <div className="pt-2 grid grid-cols-2 gap-4 items-end text-center">
              <div className="space-y-1">
                <div className="font-serif italic text-xs text-slate-700 font-semibold border-b border-slate-300 pb-1">
                  Dr. N. Shivakumar
                </div>
                <p className="text-[9px] text-slate-500 uppercase font-medium">
                  Dean of Student Welfare
                </p>
              </div>

              <div className="space-y-1">
                <div className="font-serif italic text-xs text-slate-700 font-semibold border-b border-slate-300 pb-1">
                  Capt. R. Deshmukh
                </div>
                <p className="text-[9px] text-slate-500 uppercase font-medium">
                  Chief Security Officer
                </p>
              </div>
            </div>

            {/* Certificate ID & Verification Stamp */}
            <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-slate-100">
              <span>CERT ID: {userCertificate.certificateNumber}</span>
              <span className="text-[#222022] font-bold">SHA-256: {userCertificate.hash.slice(0, 10)}...</span>
              <span>{userCertificate.issueDate}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={handleShare}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">share</span>
            <span>Share Credential</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-5 py-2.5 bg-[#222022] hover:bg-[#1a191a] text-[#C3D809] border border-[#222022] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Download Official PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
