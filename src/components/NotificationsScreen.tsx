import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { NotificationItem } from '../types';

export const NotificationsScreen: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    dismissNotification,
    setActiveTab,
    setSelectedMatch,
    matches,
    unreadCount,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'priority' | 'match' | 'action' | 'broadcast'>('all');

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (activeFilter === 'priority') return n.priority || n.type === 'PRIORITY_ALERT';
      if (activeFilter === 'match') return n.type === 'POTENTIAL_MATCH';
      if (activeFilter === 'action')
        return ['VERIFICATION_REQUIRED', 'MORE_EVIDENCE_NEEDED', 'HANDOVER_SCHEDULED'].includes(n.type);
      if (activeFilter === 'broadcast')
        return ['GENERAL_LOST', 'GENERAL_FOUND', 'HERO_RECOGNITION'].includes(n.type);
      return true;
    });
  }, [notifications, activeFilter]);

  const handleNotificationClick = (item: NotificationItem) => {
    markNotificationAsRead(item.id);
    if (item.deepLinkTarget === 'matches' || item.relatedMatchId) {
      const match = matches.find((m) => m.id === item.relatedMatchId) || matches[0];
      if (match) setSelectedMatch(match);
      setActiveTab('matches');
    } else if (item.deepLinkTarget === 'map') {
      setActiveTab('map');
    } else if (item.deepLinkTarget === 'heroes') {
      setActiveTab('heroes');
    } else if (item.deepLinkTarget === 'messages') {
      setActiveTab('messages');
    }
  };

  return (
    <div className="min-h-screen pb-28 lg:pb-16 pt-5 sm:pt-8 px-3 sm:px-6 lg:px-10 max-w-[1700px] mx-auto space-y-6 font-sans select-none">
      {/* ─────────────────────────────────────────────────────────────────────────────
          1. DISPATCH HEADER & BATCH ACTIONS
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase text-rose-400 bg-rose-500/15 border border-rose-500/25 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              CAMPUS DISPATCH RADAR
            </span>
            <span className="text-xs sm:text-sm font-mono text-slate-400">
              {unreadCount > 0 ? `${unreadCount} unread notices` : 'All notices read'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
            Notifications & Contextual Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Real-time loss broadcasts, correlation pings, and security desk handovers.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs sm:text-sm font-bold text-white transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">done_all</span>
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          2. FILTER PILLS
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'all', label: 'All Alerts', count: notifications.length },
          {
            id: 'priority',
            label: 'Priority Classroom Alerts',
            count: notifications.filter((n) => n.priority).length,
            highlight: true,
          },
          {
            id: 'match',
            label: 'Potential Matches',
            count: notifications.filter((n) => n.type === 'POTENTIAL_MATCH').length,
          },
          {
            id: 'action',
            label: 'Action Required',
            count: notifications.filter((n) => ['VERIFICATION_REQUIRED', 'MORE_EVIDENCE_NEEDED'].includes(n.type)).length,
          },
          {
            id: 'broadcast',
            label: 'Campus Bulletins',
            count: notifications.filter((n) => ['GENERAL_LOST', 'GENERAL_FOUND', 'HERO_RECOGNITION'].includes(n.type)).length,
          },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id as any)}
            className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
              activeFilter === f.id
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                : 'bg-[#0E1626] text-slate-400 hover:text-white border border-white/[0.06]'
            }`}
          >
            <span>{f.label}</span>
            <span
              className={`text-xs font-mono font-bold px-1.5 py-0.2 rounded ${
                activeFilter === f.id
                  ? 'bg-white/20 text-white'
                  : f.highlight
                  ? 'bg-rose-500/20 text-rose-300'
                  : 'bg-white/10 text-slate-400'
              }`}
            >
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          3. NOTIFICATION STREAM
      ───────────────────────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-[#090E1A] border border-white/[0.08] space-y-2">
            <span className="material-symbols-outlined text-[44px] text-slate-600">notifications_off</span>
            <h3 className="text-base font-bold text-white">No notifications in this category</h3>
            <p className="text-xs sm:text-sm text-slate-400">All radar notices and dispatches have been cleared.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const isPriority = notif.priority || notif.type === 'PRIORITY_ALERT';
            const isMatch = notif.type === 'POTENTIAL_MATCH';
            const isHandover = notif.type === 'HANDOVER_SCHEDULED' || notif.type === 'RETURN_CONFIRMED';
            const isUnread = !notif.read;

            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`group rounded-3xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl ${
                  isUnread
                    ? isPriority
                      ? 'bg-gradient-to-r from-[#1C101B] to-[#0A0E1A] border-rose-500/50 ring-1 ring-rose-500/30 border-l-4 border-l-rose-500'
                      : isMatch
                      ? 'bg-gradient-to-r from-[#131A33] to-[#090E1A] border-indigo-500/50 ring-1 ring-indigo-500/30 border-l-4 border-l-[#C3D809]'
                      : 'bg-[#0E1626] border-white/[0.14] border-l-4 border-l-[#C3D809]'
                    : 'bg-[#090E1A]/80 border-white/[0.05] opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                      isPriority
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : isMatch
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-400/30'
                        : isHandover
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-white/[0.06] text-slate-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      {isPriority ? 'bolt' : isMatch ? 'hub' : isHandover ? 'handshake' : 'campaign'}
                    </span>
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {isPriority && (
                        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wider bg-rose-500 text-white animate-pulse">
                          SPECIAL PRIORITY RADAR
                        </span>
                      )}
                      {isMatch && (
                        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                          POTENTIAL MATCH
                        </span>
                      )}

                      {/* Visually Obvious Unread Indicator Badge (Disappears when read) */}
                      {isUnread && (
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[#C3D809] text-[#222022] flex items-center gap-1 shadow-sm"
                          aria-label="Unread Notification"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#222022] animate-ping" />
                          NEW
                        </span>
                      )}

                      <span className="text-xs font-mono text-slate-400">{notif.timestamp}</span>
                    </div>

                    <h2 className="text-base sm:text-lg font-heading font-black text-white group-hover:text-indigo-200 transition-colors">
                      {notif.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                      {notif.message}
                    </p>

                    {/* Contextual targeting note */}
                    {notif.targetingReason && (
                      <div className="pt-1">
                        <span className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-400/20">
                          ℹ️ {notif.targetingReason}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                  <span className="text-xs sm:text-sm font-bold text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center">
                    <span>Inspect</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissNotification(notif.id);
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-white/[0.05] transition-colors"
                    title="Dismiss Notification"
                    aria-label="Dismiss Notification"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
