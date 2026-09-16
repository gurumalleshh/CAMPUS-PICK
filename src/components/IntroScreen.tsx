import React, { useState, useEffect, useRef } from 'react';
import { CampusPickLogo } from './CampusPickLogo';
import { INSTITUTION_INFO } from '../mockData';

interface IntroScreenProps {
  onEnter: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onEnter }) => {
  const [stage, setStage] = useState<'animating' | 'ready'>('animating');
  const [progress, setProgress] = useState<number>(0);
  const hasEnteredRef = useRef(false);

  const handleEnter = () => {
    if (hasEnteredRef.current) return;
    hasEnteredRef.current = true;
    onEnter();
  };

  useEffect(() => {
    // Stage 1 animation trigger
    const stageTimer = setTimeout(() => {
      setStage('ready');
    }, 250);

    // Auto-advance timer: cleanly triggers completion without touching state updaters
    const durationMs = 2800;
    const exitTimer = setTimeout(() => {
      handleEnter();
    }, durationMs);

    // Visual progress counter interval - purely numerical state update
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / durationMs) * 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(progressInterval);
      }
    }, 40);

    return () => {
      clearTimeout(stageTimer);
      clearTimeout(exitTimer);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div
      onClick={handleEnter}
      className="fixed inset-0 z-50 bg-gradient-to-b from-[#eef6f1] via-[#f5f9f6] to-[#e7f1ea] text-[#0b241c] flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden font-body selection:bg-emerald-100 selection:text-emerald-900 cursor-pointer"
    >
      {/* Top Auto-Advance Loading Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-900/10 overflow-hidden z-20">
        <div
          className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Background Animated Gradient & Matching Institutional Radar Circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft radial emerald glow behind the logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-teal-500/8 rounded-full blur-2xl" />

        {/* Subtle Decorative Concentric Radar Rings Matching the Brand Mark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border border-emerald-600/15 animate-[spin_60s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full border border-emerald-600/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[780px] h-[780px] rounded-full border border-emerald-600/5" />

        {/* Ambient Grid Dot Pattern */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle, #059669 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Top Header Bar - Skip Intro Button REMOVED per user request */}
      <div className="relative z-10 flex items-center justify-between max-w-lg w-full mx-auto">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-emerald-900/10 px-3.5 py-1.5 rounded-full shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
          <span className="text-[11px] font-black uppercase tracking-widest text-emerald-800">
            {INSTITUTION_INFO.shortName} MANDYA • EST. 1962
          </span>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-800/80 font-semibold bg-emerald-100/70 px-2.5 py-1 rounded-full border border-emerald-300/40">
          <span className="material-symbols-outlined text-[14px] text-emerald-600 animate-spin">
            progress_activity
          </span>
          <span>Entering App...</span>
        </div>
      </div>

      {/* Center Hero: Designed Logo & Brand Identity */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6 my-auto">
        {/* Animated Custom Logo */}
        <div
          className={`relative transition-all duration-1000 transform ${
            stage === 'ready' ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
          }`}
        >
          {/* Subtle outer glow ring */}
          <div className="absolute -inset-3 bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 rounded-3xl blur-md" />
          <CampusPickLogo size="hero" animate={true} />
        </div>

        {/* App Title & Dynamic Typography */}
        <div
          className={`space-y-2 transition-all duration-700 delay-150 transform ${
            stage === 'ready' ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-100/90 border border-emerald-300/70 text-emerald-800 text-[11px] font-bold uppercase tracking-widest shadow-xs">
            Campus Lost & Found Platform
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl font-black text-[#0b241c] tracking-tight leading-tight">
            CAMPUS <span className="text-emerald-600">PICK</span>
          </h1>

          <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
            PESCE Mandya's smart item recovery and custody network. Connect, verify, and recover lost belongings across campus.
          </p>
        </div>

        {/* Feature Highlights Bento Chips Matching Main App Cards */}
        <div
          className={`grid grid-cols-3 gap-2 w-full pt-2 transition-all duration-700 delay-300 transform ${
            stage === 'ready' ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <div className="bg-white/80 border border-emerald-900/10 rounded-2xl p-2.5 flex flex-col items-center text-center space-y-1 shadow-xs backdrop-blur-xs">
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">
              hub
            </span>
            <span className="text-[10px] font-bold text-slate-800">Smart Match</span>
            <span className="text-[9px] text-slate-500">Auto correlation</span>
          </div>

          <div className="bg-white/80 border border-emerald-900/10 rounded-2xl p-2.5 flex flex-col items-center text-center space-y-1 shadow-xs backdrop-blur-xs">
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">
              local_police
            </span>
            <span className="text-[10px] font-bold text-slate-800">Safe Hubs</span>
            <span className="text-[9px] text-slate-500">Gate 1 & Library</span>
          </div>

          <div className="bg-white/80 border border-emerald-900/10 rounded-2xl p-2.5 flex flex-col items-center text-center space-y-1 shadow-xs backdrop-blur-xs">
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">
              military_tech
            </span>
            <span className="text-[10px] font-bold text-slate-800">Civic Points</span>
            <span className="text-[9px] text-slate-500">Karma rewards</span>
          </div>
        </div>
      </div>

      {/* Bottom Action Area: Enter App Button & Auto-advance Notice */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          handleEnter();
        }}
        className="relative z-10 max-w-md w-full mx-auto space-y-3 pt-4 cursor-pointer"
      >
        <button
          type="button"
          onClick={handleEnter}
          className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-heading font-extrabold text-base rounded-2xl shadow-[0_8px_25px_rgba(5,150,105,0.28)] hover:shadow-[0_10px_30px_rgba(5,150,105,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer group"
        >
          <span>Enter Campus Pick</span>
          <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
            arrow_forward
          </span>
        </button>

        <div className="flex items-center justify-between text-slate-500 text-[11px] px-1">
          <span>PES College of Engineering, Mandya</span>
          <span className="text-emerald-700 font-medium">Tap anywhere to enter</span>
        </div>
      </div>
    </div>
  );
};
