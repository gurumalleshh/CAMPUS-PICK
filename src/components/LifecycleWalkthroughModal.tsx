import React from 'react';
import { useApp } from '../context/AppContext';

export const LifecycleWalkthroughModal: React.FC = () => {
  const {
    isWalkthroughOpen,
    closeWalkthrough,
    walkthroughStep,
    setWalkthroughStep,
    nextWalkthroughStep,
    prevWalkthroughStep,
    setActiveTab,
    openChatModal,
    openReportModal,
    updateVerificationStatus,
    confirmReturnParty,
  } = useApp();

  if (!isWalkthroughOpen) return null;

  const acts = [
    {
      act: 1,
      title: 'Act 1: Report Lost High-Value Item',
      desc: 'Student Sarah J. (CS Dept) logs a lost Lenovo ThinkPad X1 in CS-204 (AI Lab). Encrypted AES-256 vault captures private serial and invoice.',
      role: 'Sarah J. (Student)',
      roleStyle: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
      actionText: 'Open Report Flow',
      onAction: () => {
        closeWalkthrough();
        openReportModal('LOST');
      },
    },
    {
      act: 2,
      title: 'Act 2: Proximity Geofence Alert Broadcast',
      desc: 'System dispatches general notification to all students and a special priority alert to individuals with scheduled classes in CS-204.',
      role: 'System / Push Dispatch',
      roleStyle: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
      actionText: 'Inspect Alerts',
      onAction: () => {
        closeWalkthrough();
        setActiveTab('notifications');
      },
    },
    {
      act: 3,
      title: 'Act 3: Discovery & Security Handover',
      desc: 'Student Rahul K. (Mech Dept) spots the laptop, logs a Found report, and hands it over to Campus Security for safekeeping.',
      role: 'Rahul K. (Finder)',
      roleStyle: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      actionText: 'View Campus Feed',
      onAction: () => {
        closeWalkthrough();
        setActiveTab('home');
      },
    },
    {
      act: 4,
      title: 'Act 4: AI Telemetry 87% Match Detected',
      desc: 'Matching engine identifies 87% multi-factor correlation (Model, Color, Spatial 15m delta, Time 7m delta). Flags "MATCH ≠ OWNERSHIP".',
      role: 'Matching Engine',
      roleStyle: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      actionText: 'Review Match Matrix',
      onAction: () => {
        closeWalkthrough();
        setActiveTab('matches');
      },
    },
    {
      act: 5,
      title: 'Act 5: Private Ownership Evidence Vault Submission',
      desc: 'Sarah J. submits serial #PF-284920-X1 and PESCE purchase invoice to the encrypted vault. Direct chat remains locked for safety.',
      role: 'Sarah J. (Claimant)',
      roleStyle: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
      actionText: 'View Evidence Vault',
      onAction: () => {
        closeWalkthrough();
        setActiveTab('matches');
      },
    },
    {
      act: 6,
      title: 'Act 6: Campus Security Audit & Authorization',
      desc: 'Officer R. Nair audits purchase records, validates serial number, approves claim, and unlocks safe exchange messaging.',
      role: 'Officer R. Nair (Security)',
      roleStyle: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      actionText: 'Approve as Officer',
      onAction: () => {
        updateVerificationStatus('match_001', 'VERIFIED');
        closeWalkthrough();
        setActiveTab('matches');
      },
    },
    {
      act: 7,
      title: 'Act 7: Gate 1 Handover & Dual Confirmation Protocol',
      desc: 'Parties meet at Gate 1 Safe Exchange Kiosk. Owner confirms "I received item", Finder confirms "I returned item", Officer seals custody.',
      role: 'Dual Parties + Officer Nair',
      roleStyle: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      actionText: 'Open Handover & Sign',
      onAction: () => {
        closeWalkthrough();
        openChatModal('match_001');
      },
    },
    {
      act: 8,
      title: 'Act 8: Return Sealed & Leaderboard Updated',
      desc: 'Status sealed to RETURNED. Finder Rahul K. climbs leaderboard (+50 pts). Ranks and verified return counts update live in the Campus Heroes Leaderboard.',
      role: 'Dean Student Welfare & Campus Ledger',
      roleStyle: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
      actionText: 'View Leaderboard',
      onAction: () => {
        confirmReturnParty('match_001', 'owner');
        confirmReturnParty('match_001', 'finder');
        closeWalkthrough();
        setActiveTab('heroes');
      },
    },
  ];

  const currentAct = acts[walkthroughStep - 1];

  // Close on Escape key
  React.useEffect(() => {
    if (!isWalkthroughOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeWalkthrough();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWalkthroughOpen, closeWalkthrough]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="walkthrough-modal-title"
      onClick={closeWalkthrough}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0A101D] rounded-3xl max-w-lg md:max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-white/[0.12] text-white animate-in zoom-in-95"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <span className="material-symbols-outlined text-[18px]">route</span>
            </div>
            <div>
              <h3 id="walkthrough-modal-title" className="font-heading font-black text-base text-white">
                Campus Pick End-to-End Walkthrough
              </h3>
              <p className="text-[11px] text-slate-400">
                Step-by-step evaluator tour of PESCE item recovery lifecycle
              </p>
            </div>
          </div>
          <button
            onClick={closeWalkthrough}
            aria-label="Close walkthrough dialog"
            className="w-8 h-8 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-400 font-mono">Act {walkthroughStep} of 8</span>
          <span className="text-indigo-400 font-bold font-mono">PESCE Mandya Trust Protocol</span>
        </div>

        {/* Stepper Dots */}
        <div className="flex gap-1.5">
          {acts.map((a) => (
            <div
              key={a.act}
              onClick={() => setWalkthroughStep(a.act)}
              className={`h-1.5 flex-1 rounded-full cursor-pointer transition-all ${
                walkthroughStep === a.act
                  ? 'bg-indigo-500 shadow-md shadow-indigo-500/50'
                  : walkthroughStep > a.act
                  ? 'bg-emerald-500'
                  : 'bg-white/[0.1]'
              }`}
            />
          ))}
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0E1726] border border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-heading font-black text-sm sm:text-base text-white">
              {currentAct.title}
            </h4>
            <span className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full border shrink-0 ${currentAct.roleStyle}`}>
              {currentAct.role}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            {currentAct.desc}
          </p>

          <div className="pt-1.5">
            <button
              onClick={currentAct.onAction}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-lg shadow-indigo-600/30 active:scale-[0.99]"
            >
              <span>{currentAct.actionText}</span>
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </button>
          </div>
        </div>

        {/* Bottom Stepper Navigation */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={prevWalkthroughStep}
            disabled={walkthroughStep === 1}
            className="px-3.5 py-2 border border-white/[0.1] text-slate-300 hover:bg-white/[0.05] rounded-xl text-xs font-semibold disabled:opacity-30 cursor-pointer transition-colors"
          >
            ← Previous Act
          </button>

          <button
            onClick={nextWalkthroughStep}
            disabled={walkthroughStep === 8}
            className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-500 rounded-xl text-xs font-bold disabled:opacity-30 cursor-pointer shadow-md transition-all active:scale-[0.99]"
          >
            Next Act →
          </button>
        </div>
      </div>
    </div>
  );
};
