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
      actionText: 'Inspect Alerts',
      onAction: () => {
        closeWalkthrough();
        setActiveTab('notifications');
      },
    },
    {
      act: 3,
      title: 'Act 3: Discovery & Safe Locker Deposit',
      desc: 'Student Rahul K. (Mech Dept) spots the laptop, logs a Found report, and deposits it into Smart Locker B-12 supervised by Campus Security.',
      role: 'Rahul K. (Finder)',
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

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg md:max-w-xl w-full p-4 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[22px]">
              route
            </span>
            <h3 className="font-heading font-bold text-base text-[#0b241c]">
              Campus Pick End-to-End Walkthrough
            </h3>
          </div>
          <button
            onClick={closeWalkthrough}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span>Act {walkthroughStep} of 8</span>
          <span className="text-emerald-700 font-bold">PESCE Mandya Trust Protocol</span>
        </div>

        {/* Stepper Dots */}
        <div className="flex gap-1">
          {acts.map((a) => (
            <div
              key={a.act}
              onClick={() => setWalkthroughStep(a.act)}
              className={`h-1.5 flex-1 rounded-full cursor-pointer transition-all ${
                walkthroughStep === a.act
                  ? 'bg-emerald-600'
                  : walkthroughStep > a.act
                  ? 'bg-emerald-300'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Card Body */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-heading font-bold text-sm text-[#0b241c]">
              {currentAct.title}
            </h4>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              {currentAct.role}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {currentAct.desc}
          </p>

          <div className="pt-2">
            <button
              onClick={currentAct.onAction}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-xs"
            >
              <span>{currentAct.actionText}</span>
              <span className="material-symbols-outlined text-[15px]">open_in_new</span>
            </button>
          </div>
        </div>

        {/* Bottom Stepper Navigation */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={prevWalkthroughStep}
            disabled={walkthroughStep === 1}
            className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold disabled:opacity-40 cursor-pointer"
          >
            ← Previous Act
          </button>

          <button
            onClick={nextWalkthroughStep}
            disabled={walkthroughStep === 8}
            className="px-4 py-1.5 bg-[#0b241c] text-white hover:bg-emerald-950 rounded-xl text-xs font-bold disabled:opacity-40 cursor-pointer shadow-xs"
          >
            Next Act →
          </button>
        </div>
      </div>
    </div>
  );
};
