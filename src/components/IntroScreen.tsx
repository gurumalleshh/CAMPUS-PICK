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

    // Auto-advance timer
    const durationMs = 2800;
    const exitTimer = setTimeout(() => {
      handleEnter();
    }, durationMs);

    // Visual progress counter interval
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
      className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden font-sans selection:bg-indigo-500 selection:text-white cursor-pointer"
    >
      {/* Top Auto-Advance Loading Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 overflow-hidden z-20">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Background Animated Ambient & Radial Blueprint Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft radial indigo glow behind the logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] bg-indigo-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] bg-blue-500/10 rounded-full blur-2xl" />

        {/* Subtle Decorative Concentric Radar Rings Matching the Brand Mark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-indigo-500/15 animate-[spin_60s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[820px] h-[820px] rounded-full border border-white/5" />

        {/* Ambient Grid Dot Pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(circle, #818cf8 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Top Header Bar */}
      <div className="relative z-10 flex items-center justify-between max-w-lg w-full mx-auto">
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-full shadow-xs">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-200">
            {INSTITUTION_INFO.shortName} MANDYA • EST. 1962
          </span>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-1.5 text-[11px] text-indigo-300 font-semibold bg-indigo-500/15 px-3 py-1 rounded-full border border-indigo-500/30">
          <span className="material-symbols-outlined text-[14px] text-indigo-300 animate-spin">
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
          <div className="absolute -inset-4 bg-indigo-500/20 rounded-3xl blur-xl" />
          <CampusPickLogo size="hero" animate={true} />
        </div>

        {/* App Title & Dynamic Typography */}
        <div
          className={`space-y-2.5 transition-all duration-700 delay-150 transform ${
            stage === 'ready' ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-semibold tracking-wider uppercase border border-indigo-500/30">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            <span>Campus Lost & Found Platform</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            CAMPUS <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-200">PICK</span>
          </h1>

          <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed font-normal">
            PESCE Mandya's smart item recovery and custody network. Connect, verify, and recover lost belongings across campus.
          </p>
        </div>

        {/* Feature Highlights Bento Chips */}
        <div
          className={`grid grid-cols-3 gap-2.5 w-full pt-2 transition-all duration-700 delay-300 transform ${
            stage === 'ready' ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center text-center space-y-1 shadow-2xs backdrop-blur-xs">
            <span className="material-symbols-outlined text-indigo-400 text-[20px]">
              hub
            </span>
            <span className="text-[11px] font-bold text-white">Smart Match</span>
            <span className="text-[10px] text-slate-400">Auto correlation</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center text-center space-y-1 shadow-2xs backdrop-blur-xs">
            <span className="material-symbols-outlined text-blue-400 text-[20px]">
              map
            </span>
            <span className="text-[11px] font-bold text-white">Campus Map</span>
            <span className="text-[10px] text-slate-400">Lost & Found pins</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center text-center space-y-1 shadow-2xs backdrop-blur-xs">
            <span className="material-symbols-outlined text-emerald-400 text-[20px]">
              military_tech
            </span>
            <span className="text-[11px] font-bold text-white">Civic Points</span>
            <span className="text-[10px] text-slate-400">Karma rewards</span>
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
          className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-heading font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-indigo-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
        >
          <span>Enter Campus Pick</span>
          <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
            arrow_forward
          </span>
        </button>

        <div className="flex items-center justify-between text-slate-400 text-[11px] px-1">
          <span>PES College of Engineering, Mandya</span>
          <span className="text-indigo-400 font-semibold">Tap anywhere to enter</span>
        </div>
      </div>
    </div>
  );
};
