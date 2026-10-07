import React, { useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Report } from '../types';

export interface ReportDetailModalProps {
  report: Report | null;
  isOpen?: boolean;
  onClose: () => void;
  onClaim?: (report: Report) => void;
  onViewMatch?: () => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  isOpen = true,
  onClose,
  onClaim,
  onViewMatch,
}) => {
  const { currentUser, matches, setSelectedMatch, setActiveTab, triggerToast } = useApp();

  // Close on Escape key
  useEffect(() => {
    if (!report || !isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [report, isOpen, onClose]);

  // Check if there is an active correlated match for this report
  const correlatedMatch = useMemo(() => {
    if (!report) return null;
    return matches.find(
      (m) => m.lostReportId === report.id || m.foundReportId === report.id
    );
  }, [report, matches]);

  if (!isOpen || !report) return null;

  const isLost = report.type === 'LOST';
  const isReturned = report.status === 'RETURNED';

  // Authorization check for confidential proof of ownership
  const isAuthorized =
    currentUser?.id === report.reporterId ||
    currentUser?.role === 'admin' ||
    currentUser?.role === 'security';

  const handleClaim = () => {
    if (onClaim) {
      onClaim(report);
    } else {
      triggerToast(
        `Logged claim interest for #${report.ticketNumber}. Security notified.`,
        'verified_user',
        'success'
      );
      onClose();
    }
  };

  const handleNavigateToMatch = () => {
    if (correlatedMatch) {
      setSelectedMatch(correlatedMatch);
      setActiveTab('matches');
      onClose();
      if (onViewMatch) onViewMatch();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#0B101D] border border-white/[0.12] rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto relative my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span
              className={`text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                isReturned
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : isLost
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
              }`}
            >
              {isReturned ? 'RETURNED TO OWNER' : isLost ? 'LOST REPORT' : 'IN VAULT CUSTODY'}
            </span>
            <span className="text-xs font-mono text-slate-400">
              #{report.ticketNumber}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-400 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Visual Identification Photo */}
        <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/[0.1] aspect-video bg-black/40">
          <img
            src={
              report.publicPhotoUrl ||
              report.imageUrl ||
              'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80'
            }
            alt={report.itemName}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md text-white text-xs font-mono flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider">{report.category}</span>
            {report.color && <span>• {report.color}</span>}
          </div>
        </div>

        {/* Item Title & Core Specs */}
        <div className="space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="report-modal-title" className="text-xl sm:text-2xl font-heading font-black text-white">
                {report.itemName}
              </h2>
              {(report.brand || report.model) && (
                <p className="text-sm font-medium text-indigo-300 mt-0.5">
                  {[report.brand, report.model].filter(Boolean).join(' • ')}
                </p>
              )}
            </div>
            <span className="text-xs font-mono text-slate-400 whitespace-nowrap pt-1">
              {report.eventDate} {report.eventTime ? `• ${report.eventTime}` : ''}
            </span>
          </div>

          <p className="text-sm sm:text-[15px] text-slate-200 leading-relaxed font-normal">
            {report.description}
          </p>

          {report.identifyingFeatures && (
            <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-400/20 text-xs sm:text-sm text-indigo-200">
              <span className="font-bold text-white block mb-0.5">Distinct Identifying Features:</span>
              <span>{report.identifyingFeatures}</span>
            </div>
          )}
        </div>

        {/* Spatial Coordinates & Campus Location Log */}
        <div className="p-4 rounded-2xl bg-[#080D1A] border border-white/[0.08] space-y-2.5">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
            CAMPUS SPATIAL LOG
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div>
              <span className="text-slate-400 block text-xs">Building:</span>
              <span className="font-semibold text-white">{report.location.building}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs">Specific Room / Lab:</span>
              <span className="font-semibold text-white">{report.location.room}</span>
            </div>
            {report.location.floor && (
              <div>
                <span className="text-slate-400 block text-xs">Floor / Level:</span>
                <span className="font-semibold text-white">{report.location.floor}</span>
              </div>
            )}
            <div>
              <span className="text-slate-400 block text-xs">Precision:</span>
              <span className="font-mono text-emerald-400 font-semibold">
                {report.location.precision || 'EXACT LAB LOG'}
              </span>
            </div>
          </div>
          {report.location.areaDescription && (
            <div className="pt-1 border-t border-white/[0.05] text-xs text-slate-300">
              <span className="text-slate-400">Area Note: </span>
              {report.location.areaDescription}
            </div>
          )}
        </div>

        {/* Private Confidential Evidence (Protected) */}
        {report.hasPrivateEvidence && (
          <div className="p-4 rounded-2xl bg-[#0E1626] border border-indigo-500/20 space-y-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-indigo-400">lock</span>
              <span className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider">
                CONFIDENTIAL OWNERSHIP PROOF
              </span>
            </div>

            {isAuthorized ? (
              <div className="space-y-1.5 text-xs text-slate-200">
                {report.privateEvidence?.serialNumber && (
                  <p>
                    <span className="text-slate-400 font-medium">Serial Number: </span>
                    <span className="font-mono font-bold text-white">
                      {report.privateEvidence.serialNumber}
                    </span>
                  </p>
                )}
                {report.privateEvidence?.invoiceFileName && (
                  <p>
                    <span className="text-slate-400 font-medium">Invoice Document: </span>
                    <span className="text-indigo-300 font-mono">
                      {report.privateEvidence.invoiceFileName}
                    </span>
                  </p>
                )}
                {report.privateEvidence?.privateNotes && (
                  <p>
                    <span className="text-slate-400 font-medium">Private Note: </span>
                    <span>{report.privateEvidence.privateNotes}</span>
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 leading-relaxed">
                Encrypted sensitive ownership credentials (serial number & procurement documents) are securely held in custody. Only verified owner and Gate 1 campus security officers have access during handover.
              </p>
            )}
          </div>
        )}

        {/* Reporter Info Card */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-center gap-3">
            <img
              src={
                report.reporterAvatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
              }
              alt={report.reporterName}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700"
            />
            <div>
              <p className="font-bold text-sm text-white">{report.reporterName}</p>
              <p className="text-xs text-slate-400">
                {report.reporterDepartment || 'PESCE Mandya'} • {report.reporterRole.toUpperCase()}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20 font-semibold">
            Verified PESCE
          </span>
        </div>

        {/* Correlated Match Notice Banner if active match exists */}
        {correlatedMatch && (
          <div className="p-4 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-indigo-400 text-[22px]">hub</span>
              <div>
                <p className="text-xs font-bold text-white">
                  Potential Match Correlated ({correlatedMatch.confidenceScore}%)
                </p>
                <p className="text-[11px] text-slate-300">
                  {isLost
                    ? `Correlated with item found by ${correlatedMatch.foundReport.reporterName}`
                    : `Correlated with loss report by ${correlatedMatch.lostReport.reporterName}`}
                </p>
              </div>
            </div>
            <button
              onClick={handleNavigateToMatch}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-md shadow-indigo-600/30"
            >
              Inspect Match
            </button>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-white/[0.08]">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>

          {!isReturned && !isLost && (
            <button
              onClick={handleClaim}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Claim Belonging</span>
            </button>
          )}

          {!isReturned && isLost && (
            <button
              onClick={() => {
                triggerToast(
                  `Noted interest in #${report.ticketNumber}. If found, please log custody at Gate 1.`,
                  'volunteer_activism',
                  'info'
                );
                onClose();
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
              <span>I Found This Belonging</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
