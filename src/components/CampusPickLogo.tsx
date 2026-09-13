import React from 'react';

interface CampusPickLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showWordmark?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
  animate?: boolean;
}

export const CampusPickLogo: React.FC<CampusPickLogoProps> = ({
  size = 'md',
  showWordmark = false,
  theme = 'light',
  className = '',
  animate = false,
}) => {
  const sizeMap = {
    xs: { icon: 24, text: 'text-sm', sub: 'text-[8px]', box: 'w-6 h-6' },
    sm: { icon: 32, text: 'text-base', sub: 'text-[9px]', box: 'w-8 h-8' },
    md: { icon: 44, text: 'text-xl', sub: 'text-[10px]', box: 'w-11 h-11' },
    lg: { icon: 64, text: 'text-2xl', sub: 'text-xs', box: 'w-16 h-16' },
    xl: { icon: 96, text: 'text-3xl', sub: 'text-sm', box: 'w-24 h-24' },
    hero: { icon: 128, text: 'text-4xl', sub: 'text-base', box: 'w-32 h-32 sm:w-36 sm:h-36' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Designed SVG Emblem: C & P Interlocked Monogram */}
      <div
        className={`relative ${currentSize.box} rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform ${
          animate ? 'hover:scale-105 active:scale-95 transition-transform duration-300' : ''
        }`}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm overflow-visible"
        >
          <defs>
            {/* Background Shield Gradient: Deep Forest Emerald */}
            <linearGradient id="cpBgGrad" x1="10" y1="5" x2="90" y2="95" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="50%" stopColor="#047857" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>

            {/* Inner Ring Glow */}
            <linearGradient id="cpRingGrad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
            </linearGradient>

            {/* 'C' Letter Gradient: Luminous Mint to Vibrant Emerald */}
            <linearGradient id="cpCGrad" x1="16" y1="26" x2="44" y2="74" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#a7f3d0" />
              <stop offset="50%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            {/* 'P' Letter Gradient: Pure Crystal White to Ice Emerald */}
            <linearGradient id="cpPGrad" x1="48" y1="24" x2="82" y2="78" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#f0fdf4" />
              <stop offset="100%" stopColor="#d1fae5" />
            </linearGradient>

            {/* Drop Shadow for Monogram Elements */}
            <filter id="cpShadow" x="-15%" y="-15%" width="130%" height="130%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#022c22" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* Outer Squircle Container with Precision Chamfered Border */}
          <rect
            x="6"
            y="6"
            width="88"
            height="88"
            rx="24"
            fill="url(#cpBgGrad)"
            stroke="#10b981"
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />

          {/* Radar / Telemetry Pulse Concentric Rings */}
          <circle cx="50" cy="50" r="35" stroke="url(#cpRingGrad)" strokeWidth="1" strokeDasharray="3 3" opacity="0.45" />
          <circle cx="50" cy="50" r="25" stroke="#ffffff" strokeWidth="0.75" opacity="0.18" />

          {/* Micro Corner Crosshairs */}
          <g stroke="#34d399" strokeWidth="0.8" opacity="0.25">
            <line x1="12" y1="14" x2="16" y2="14" />
            <line x1="14" y1="12" x2="14" y2="16" />
            <line x1="84" y1="14" x2="88" y2="14" />
            <line x1="86" y1="12" x2="86" y2="16" />
            <line x1="12" y1="86" x2="16" y2="86" />
            <line x1="14" y1="84" x2="14" y2="88" />
            <line x1="84" y1="86" x2="88" y2="86" />
            <line x1="86" y1="84" x2="86" y2="88" />
          </g>

          {/* Monogram Group (C + P) */}
          <g filter="url(#cpShadow)">
            {/*
              LETTER 'C' (for "Campus"):
              Distinct open crescent curve on the left facing right.
              - Uniform 8px stroke weight
              - Perfectly balanced radius
              - Clear open gap ensuring it never looks closed like a 'D'
            */}
            <path
              d="
                M 43 26
                C 27.5 26, 16 36.8, 16 50
                C 16 63.2, 27.5 74, 43 74
                L 44.5 74
                L 44.5 66
                L 43 66
                C 32 66, 24 58.8, 24 50
                C 24 41.2, 32 34, 43 34
                L 44.5 34
                L 44.5 26
                Z
              "
              fill="url(#cpCGrad)"
              stroke="#a7f3d0"
              strokeWidth="0.6"
              strokeOpacity="0.8"
            />

            {/*
              LETTER 'P' (for "Pick" & Map Pin):
              - Straight vertical stem with 8px width
              - Rounded upper loop (from y=24 to 56)
              - Sharp pick needle / location pin point extending downward to (52, 78)
            */}
            <g>
              {/* Outer Boundary of 'P' with integrated Pin Point */}
              <path
                d="
                  M 48 24
                  H 65
                  C 74.5 24, 82 31.2, 82 40
                  C 82 48.8, 74.5 56, 65 56
                  H 56
                  L 56 68
                  L 52 78
                  L 48 68
                  Z
                "
                fill="url(#cpPGrad)"
                stroke="#ffffff"
                strokeWidth="0.7"
                strokeLinejoin="round"
              />

              {/* Inner Cutout defining the Eye of 'P' */}
              <path
                d="
                  M 56 32
                  H 64
                  C 68.5 32, 74 35.5, 74 40
                  C 74 44.5, 68.5 48, 64 48
                  H 56
                  Z
                "
                fill="url(#cpBgGrad)"
              />

              {/* Central Target / Precision Node inside 'P' counter */}
              <circle cx="63" cy="40" r="3.2" fill="#10b981" />
              <circle cx="63" cy="40" r="1.2" fill="#ffffff" />
            </g>
          </g>

          {/* Modern Accent Diagonal Telemetry Hash */}
          <line x1="20" y1="81" x2="28" y2="73" stroke="#6ee7b7" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
        </svg>
      </div>

      {/* Optional Wordmark */}
      {showWordmark && (
        <div className="flex flex-col select-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-heading font-extrabold tracking-tight ${currentSize.text} ${
                theme === 'dark' ? 'text-white' : 'text-[#0b1c30]'
              }`}
            >
              Campus <span className="text-emerald-700">Pick</span>
            </span>
          </div>
          <span
            className={`font-bold tracking-widest uppercase text-emerald-800/80 ${currentSize.sub}`}
          >
            PESCE MANDYA
          </span>
        </div>
      )}
    </div>
  );
};
