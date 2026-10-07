import React from 'react';
import { useApp } from '../context/AppContext';

interface BottomNavProps {
  onOpenCommandPalette?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = () => {
  const {
    activeTab,
    setActiveTab,
    matches,
    unreadCount,
    currentUser,
  } = useApp();

  const pendingMatchesCount = matches.filter(
    (m) => (m.status === 'PENDING' || m.confidenceScore >= 75) && m.status !== 'RESOLVED'
  ).length;

  if (!currentUser) return null;

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: 'radar',
      ariaLabel: 'Campus Radar Home Feed',
      badge: null,
    },
    {
      id: 'matches',
      label: 'Matches',
      icon: 'hub',
      ariaLabel: pendingMatchesCount > 0 ? `Correlations (${pendingMatchesCount} active matches)` : 'Correlations',
      badge: pendingMatchesCount > 0 ? pendingMatchesCount : null,
      badgeColor: 'bg-indigo-600',
    },
    {
      id: 'map',
      label: 'Map',
      icon: 'map',
      ariaLabel: 'Campus Blueprint & Map',
      badge: null,
    },
    {
      id: 'notifications',
      label: 'Alerts',
      icon: 'notifications',
      ariaLabel: unreadCount > 0 ? `Notifications (${unreadCount} unread)` : 'Notifications',
      hasUnread: unreadCount > 0,
      unreadCount: unreadCount,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'person',
      ariaLabel: `Profile (${currentUser.displayName})`,
      badge: null,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 w-full z-40 bg-[#0E1626]/95 backdrop-blur-2xl border-t border-white/[0.1] pb-safe shadow-2xl shadow-black/80"
    >
      <div className="h-16 max-w-lg mx-auto flex items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 min-w-0 min-h-[48px] flex flex-col items-center justify-center py-1 transition-all cursor-pointer focus-ring rounded-2xl relative select-none ${
                isActive
                  ? 'text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
              aria-label={item.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Icon Container with Badges */}
              <div className="relative flex items-center justify-center">
                <span
                  className={`material-symbols-outlined text-[22px] transition-transform ${
                    isActive ? 'scale-110 text-[#C3D809]' : 'text-slate-400'
                  }`}
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {item.icon}
                </span>

                {/* Notifications Visually Obvious Small Unread Indicator */}
                {item.hasUnread && (
                  <span
                    className="absolute -top-0.5 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-[#0E1626] animate-pulse"
                    aria-hidden="true"
                  />
                )}

                {/* Matches Count Badge */}
                {item.badge && (
                  <span
                    className="absolute -top-1 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-indigo-500 text-white text-[10px] font-mono font-bold flex items-center justify-center ring-2 ring-[#0E1626]"
                    aria-hidden="true"
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[11px] tracking-tight truncate max-w-full text-center mt-0.5 leading-tight ${
                  isActive ? 'text-white font-bold' : 'text-slate-400 font-medium'
                }`}
              >
                {item.label}
              </span>

              {/* Subtle Active Pill Dot */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#C3D809] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
