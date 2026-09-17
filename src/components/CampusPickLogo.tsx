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
            {/* Background Shield Gradient: Deep Obsidian #222022 */}
            <linearGradient id="cpBgGrad" x1="10" y1="5" x2="90" y2="95" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#353235" />
              <stop offset="50%" stopColor="#222022" />
              <stop offset="100%" stopColor="#181718" />
            </linearGradient>

            {/* Inner Ring Glow */}
            <linearGradient id="cpRingGrad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C3D809" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#C3D809" stopOpacity="0.1" />
            </linearGradient>

            {/* 'C' Letter Gradient: Luminous Lime to Electric Chartreuse #C3D809 */}
            <linearGradient id="cpCGrad" x1="16" y1="26" x2="44" y2="74" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f4fac4" />
              <stop offset="50%" stopColor="#d5ea1b" />
              <stop offset="100%" stopColor="#C3D809" />
            </linearGradient>

            {/* 'P' Letter Gradient: Pure Crystal White to Electric Lime Tint */}
            <linearGradient id="cpPGrad" x1="48" y1="24" x2="82" y2="78" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#fbfde8" />
              <stop offset="100%" stopColor="#e2f068" />
            </linearGradient>

            {/* Drop Shadow for Monogram Elements */}
            <filter id="cpShadow" x="-15%" y="-15%" width="130%" height="130%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.6" />
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
            stroke="#C3D809"
            strokeWidth="1.75"
            strokeOpacity="0.8"
          />

          {/* Radar / Telemetry Pulse Concentric Rings */}
          <circle cx="50" cy="50" r="35" stroke="url(#cpRingGrad)" strokeWidth="1" strokeDasharray="3 3" opacity="0.45" />
          <circle cx="50" cy="50" r="25" stroke="#ffffff" strokeWidth="0.75" opacity="0.18" />

          {/* Micro Corner Crosshairs */}
          <g stroke="#C3D809" strokeWidth="0.8" opacity="0.4">
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
              stroke="#e4f454"
              strokeWidth="0.6"
              strokeOpacity="0.8"
            />

            <g>
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
              <circle cx="63" cy="40" r="3.2" fill="#C3D809" />
              <circle cx="63" cy="40" r="1.2" fill="#222022" />
            </g>
          </g>

          {/* Modern Accent Diagonal Telemetry Hash */}
          <line x1="20" y1="81" x2="28" y2="73" stroke="#C3D809" strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
        </svg>
      </div>

      {/* Optional Wordmark */}
      {showWordmark && (
        <div className="flex flex-col select-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-heading font-extrabold tracking-tight ${currentSize.text} ${
                theme === 'dark' ? 'text-white' : 'text-[#222022]'
              }`}
            >
              Campus <span className="text-[#C3D809] bg-[#222022] px-1.5 py-0.2 rounded-md">Pick</span>
            </span>
          </div>
          <span
            className={`font-bold tracking-widest uppercase ${theme === 'dark' ? 'text-[#C3D809]' : 'text-[#222022]/70'} ${currentSize.sub}`}
          >
            PESCE MANDYA
          </span>
        </div>
      )}
    </div>
  );
};
