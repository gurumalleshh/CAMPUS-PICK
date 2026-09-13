import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { NotificationType, NotificationItem, NotificationCategory } from '../types';

export const getNotificationCategory = (type: NotificationType): Exclude<NotificationCategory, 'all'> => {
  switch (type) {
    case 'POTENTIAL_MATCH':
      return 'match';
    case 'VERIFICATION_REQUIRED':
    case 'MORE_EVIDENCE_NEEDED':
    case 'VERIFICATION_APPROVED':
    case 'SECURITY_DISPATCH':
      return 'action';
    case 'HANDOVER_SCHEDULED':
    case 'RETURN_CONFIRMED':
      return 'handover';
    case 'PRIORITY_ALERT':
      return 'priority';
    case 'GENERAL_LOST':
    case 'GENERAL_FOUND':
    case 'HERO_RECOGNITION':
    default:
      return 'bulletin';
  }
};

interface CategoryConfig {
  id: Exclude<NotificationCategory, 'all'>;
  title: string;
  shortLabel: string;
  icon: string;
  badgeEmoji: string;
  description: string;
  badgeColor: string;
  headerBorder: string;
  accentBg: string;
  accentText: string;
}

const CATEGORIES: CategoryConfig[] = [
  {
    id: 'match',
    title: 'Potential Matches',
    shortLabel: 'Matches',
    icon: 'join_inner',
    badgeEmoji: '🎯',
    description: 'AI telemetry correlations, confidence scores & claim comparisons',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    headerBorder: 'border-emerald-300',
    accentBg: 'bg-emerald-50/70',
    accentText: 'text-emerald-800',
  },
  {
    id: 'action',
    title: 'Action & Verification',
    shortLabel: 'Action Required',
    icon: 'verified_user',
    badgeEmoji: '🛡️',
    description: 'Officer / Admin approvals, evidence requests & custody reviews',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    headerBorder: 'border-indigo-300',
    accentBg: 'bg-indigo-50/70',
    accentText: 'text-indigo-800',
  },
  {
    id: 'handover',
    title: 'Handover & Returns',
    shortLabel: 'Handover & Return',
    icon: 'handshake',
    badgeEmoji: '🤝',
    description: 'Safe Gate 1 physical exchanges, Locker B-12 pickup & dual sign-offs',
    badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
    headerBorder: 'border-teal-300',
    accentBg: 'bg-teal-50/70',
    accentText: 'text-teal-800',
  },
  {
    id: 'priority',
    title: 'Priority Alerts',
    shortLabel: 'Priority Alerts',
    icon: 'bolt',
    badgeEmoji: '⚡',
    description: 'Time-critical classroom proximity broadcasts & urgent alerts',
    badgeColor: 'bg-amber-100 text-amber-950 border-amber-300',
    headerBorder: 'border-amber-300',
    accentBg: 'bg-amber-50/70',
    accentText: 'text-amber-900',
  },
  {
    id: 'bulletin',
    title: 'Campus Bulletins & Rewards',
    shortLabel: 'Campus Bulletins',
    icon: 'campaign',
    badgeEmoji: '📢',
    description: 'General lost & found notices and civic hero leaderboard points',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    headerBorder: 'border-purple-300',
    accentBg: 'bg-purple-50/70',
    accentText: 'text-purple-800',
  },
];

export const NotificationsScreen: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    dismissNotification,
    setActiveTab,
    setSelectedMatch,
    matches,
    openChatModal,
    goBack,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all');
  const [viewMode, setViewMode] = useState<'grouped' | 'timeline'>('grouped');

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: notifications.length,
      match: 0,
      action: 0,
      handover: 0,
      priority: 0,
      bulletin: 0,
    };

    notifications.forEach((n) => {
      const cat = getNotificationCategory(n.type);
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return counts;
  }, [notifications]);

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    if (activeCategory === 'all') return notifications;
    return notifications.filter((n) => getNotificationCategory(n.type) === activeCategory);
  }, [notifications, activeCategory]);

  const handleNotificationClick = (notif: NotificationItem) => {
    markNotificationAsRead(notif.id);

    if (notif.deepLinkTarget === 'matches') {
      if (notif.relatedMatchId) {
        const m = matches.find((item) => item.id === notif.relatedMatchId);
        if (m) setSelectedMatch(m);
      }
      setActiveTab('matches');
    } else if (notif.deepLinkTarget === 'verification') {
      if (notif.relatedMatchId) {
        const m = matches.find((item) => item.id === notif.relatedMatchId);
        if (m) setSelectedMatch(m);
      }
      setActiveTab('matches');
    } else if (notif.deepLinkTarget === 'handover') {
      openChatModal(notif.relatedMatchId || 'match_001');
    } else if (notif.deepLinkTarget === 'heroes') {
      setActiveTab('heroes');
    } else if (notif.deepLinkTarget === 'report') {
      setActiveTab('home');
    }
  };

  const getNotificationDetails = (notif: NotificationItem) => {
    switch (notif.type) {
      case 'POTENTIAL_MATCH':
        return {
          categoryLabel: 'POTENTIAL MATCH',
          icon: 'join_inner',
          badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          iconClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          actionText: 'View Match Telemetry',
        };
      case 'VERIFICATION_APPROVED':
        return {
          categoryLabel: 'VERIFIED & APPROVED',
          icon: 'verified',
          badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300',
          iconClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          actionText: 'Open Approved Messaging',
        };
      case 'MORE_EVIDENCE_NEEDED':
        return {
          categoryLabel: 'ACTION: EVIDENCE REQUIRED',
          icon: 'fact_check',
          badgeClass: 'bg-rose-100 text-rose-900 border-rose-300',
          iconClass: 'bg-rose-50 text-rose-700 border-rose-200',
          actionText: 'Submit Proof to Vault',
        };
      case 'VERIFICATION_REQUIRED':
        return {
          categoryLabel: 'ACTION: VERIFICATION REQUIRED',
          icon: 'shield_person',
          badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300',
          iconClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          actionText: 'Review Officer Sign-off',
        };
      case 'SECURITY_DISPATCH':
        return {
          categoryLabel: 'SECURITY DISPATCH',
          icon: 'local_police',
          badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
          iconClass: 'bg-blue-50 text-blue-700 border-blue-200',
          actionText: 'Check Security Post',
        };
      case 'HANDOVER_SCHEDULED':
        return {
          categoryLabel: 'HANDOVER SCHEDULED',
          icon: 'handshake',
          badgeClass: 'bg-teal-100 text-teal-900 border-teal-300',
          iconClass: 'bg-teal-50 text-teal-700 border-teal-200',
          actionText: 'Coordinate Handover Chat',
        };
      case 'RETURN_CONFIRMED':
        return {
          categoryLabel: 'RETURN CONFIRMED',
          icon: 'celebration',
          badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
          iconClass: 'bg-purple-50 text-purple-700 border-purple-200',
          actionText: 'View Civic Recognition',
        };
      case 'PRIORITY_ALERT':
        return {
          categoryLabel: 'PRIORITY PROXIMITY ALERT',
          icon: 'bolt',
          badgeClass: 'bg-amber-100 text-amber-950 border-amber-300',
          iconClass: 'bg-amber-50 text-amber-800 border-amber-300',
          actionText: 'Inspect Proximity Report',
        };
      case 'GENERAL_LOST':
        return {
          categoryLabel: 'CAMPUS BULLETIN (LOST)',
          icon: 'travel_explore',
          badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
          iconClass: 'bg-slate-50 text-slate-700 border-slate-200',
          actionText: 'View Report Details',
        };
      case 'GENERAL_FOUND':
        return {
          categoryLabel: 'CAMPUS BULLETIN (FOUND)',
          icon: 'inventory_2',
          badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
          iconClass: 'bg-slate-50 text-slate-700 border-slate-200',
          actionText: 'View Report Details',
        };
      case 'HERO_RECOGNITION':
        return {
          categoryLabel: 'CIVIC RECOGNITION (+50 PTS)',
          icon: 'military_tech',
          badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
          iconClass: 'bg-purple-50 text-purple-700 border-purple-200',
          actionText: 'View Heroes Leaderboard',
        };
      default:
        return {
          categoryLabel: 'CAMPUS NOTICE',
          icon: 'campaign',
          badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
          iconClass: 'bg-slate-50 text-slate-600 border-slate-200',
          actionText: 'View Notice',
        };
    }
  };

  const renderNotificationCard = (notif: NotificationItem, itemKey?: string) => {
    const details = getNotificationDetails(notif);

    return (
      <div
        key={itemKey || notif.id}
        onClick={() => handleNotificationClick(notif)}
        className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
          notif.read
            ? 'bg-white/95 border-slate-200 hover:border-slate-300 hover:shadow-xs'
            : 'bg-white border-emerald-300 shadow-xs ring-1 ring-emerald-500/20'
        }`}
      >
        {/* Unread indicator dot */}
        {!notif.read && (
          <span
            className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-emerald-100"
            title="Unread alert"
          />
        )}

        <div className="flex items-start gap-3.5">
          {/* Distinct Category Icon */}
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-xs ${details.iconClass}`}
          >
            <span className="material-symbols-outlined text-[22px]">{details.icon}</span>
          </div>

          <div className="flex-1 min-w-0 pr-4">
            {/* Badges row: Category Badge ALWAYS distinct, Priority Badge only if high priority */}
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Primary Specified Category Badge */}
              <span
                className={`text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${details.badgeClass}`}
              >
                {details.categoryLabel}
              </span>

              {/* Dedicated High Priority Badge (shows alongside category, NEVER overwrites it) */}
              {notif.priority && (
                <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500 text-white flex items-center gap-0.5 shadow-xs">
                  <span className="material-symbols-outlined text-[12px]">bolt</span>
                  <span>HIGH PRIORITY</span>
                </span>
              )}

              <span className="text-[10px] text-slate-400 font-medium ml-auto">
                {notif.timestamp}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-heading font-bold text-sm text-[#0b1c30] mt-1.5 group-hover:text-emerald-700 transition-colors">
              {notif.title}
            </h3>

            {/* Message Body */}
            <p className="text-xs text-[#3d4a42] mt-0.5 leading-relaxed">
              {notif.message}
            </p>

            {/* Targeted Relevance Reason if available */}
            {notif.targetingReason && (
              <div className="mt-2 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 leading-snug flex items-start gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-amber-700 shrink-0 mt-0.5">
                  near_me
                </span>
                <span>{notif.targetingReason}</span>
              </div>
            )}

            {/* Action Bar */}
            <div className="mt-2.5 flex items-center justify-between pt-1 border-t border-slate-100">
              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <span>{details.actionText}</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dismissNotification(notif.id);
                }}
                className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                title="Dismiss notification"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-24 pt-20 px-4 max-w-2xl mx-auto space-y-4">
      {/* Title Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 hover:text-emerald-700 active:scale-95 transition-all shadow-xs cursor-pointer shrink-0"
            aria-label="Back"
            title="Back to Previous Screen"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <h1 className="font-heading text-2xl font-bold text-[#0b1c30] tracking-tight">
              Notifications & Alerts
            </h1>
            <p className="text-xs text-[#3d4a42]">
              Organized strictly under verified campus categories
            </p>
          </div>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">done_all</span>
          <span className="hidden sm:inline">Mark All Read</span>
        </button>
      </div>

      {/* Category Divide Filter Tabs */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {/* All tab */}
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'all'
                ? 'bg-[#0b1c30] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>All Alerts</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                activeCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {categoryCounts.all}
            </span>
          </button>

          {/* Individual Category Tabs */}
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.id] || 0;
            const isSelected = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#0b1c30] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>
                  {cat.shortLabel} {cat.badgeEmoji}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Switcher when Viewing All Alerts */}
        {activeCategory === 'all' && (
          <div className="flex items-center justify-between text-xs pt-1 px-0.5">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <span className="material-symbols-outlined text-[16px] text-slate-400">category</span>
              <span>Category Divide Mode</span>
            </div>
            <div className="bg-slate-200/70 p-0.5 rounded-lg flex items-center gap-0.5">
              <button
                onClick={() => setViewMode('grouped')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === 'grouped'
                    ? 'bg-white text-[#0b1c30] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">view_agenda</span>
                <span>Divided by Category</span>
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === 'timeline'
                    ? 'bg-white text-[#0b1c30] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                <span>Timeline</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
          <span className="material-symbols-outlined text-[36px] text-slate-300">
            notifications_off
          </span>
          <p className="font-bold text-sm text-[#0b1c30]">No notifications available</p>
          <p className="text-xs text-slate-400">You are all caught up with campus alerts.</p>
        </div>
      ) : activeCategory === 'all' && viewMode === 'grouped' ? (
        /* CATEGORY DIVIDE GROUPED VIEW: Strictly segments all notifications into their specified categories */
        <div className="space-y-5">
          {CATEGORIES.map((category) => {
            const items = notifications.filter(
              (n) => getNotificationCategory(n.type) === category.id
            );

            if (items.length === 0) return null;

            return (
              <div
                key={category.id}
                className="space-y-2.5 bg-slate-50/50 p-3 rounded-2xl border border-slate-200"
              >
                {/* Category Divide Section Header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{category.badgeEmoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-heading font-bold text-sm text-[#0b1c30]">
                          {category.title}
                        </h2>
                        <span
                          className={`text-[9.5px] font-black px-2 py-0.5 rounded-full border ${category.badgeColor}`}
                        >
                          {items.length} {items.length === 1 ? 'alert' : 'alerts'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{category.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveCategory(category.id)}
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-0.5 cursor-pointer shrink-0"
                  >
                    <span>View only</span>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  </button>
                </div>

                {/* Items in this category */}
                <div className="space-y-2.5">
                  {items.map((notif, idx) =>
                    renderNotificationCard(notif, `${category.id}_${notif.id}_${idx}`)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* FLAT / SPECIFIC CATEGORY VIEW */
        <div className="space-y-3">
          {/* Header if specific category is selected */}
          {activeCategory !== 'all' && (
            <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {CATEGORIES.find((c) => c.id === activeCategory)?.badgeEmoji}
                </span>
                <div>
                  <h2 className="font-heading font-bold text-sm text-[#0b1c30]">
                    {CATEGORIES.find((c) => c.id === activeCategory)?.title}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {CATEGORIES.find((c) => c.id === activeCategory)?.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveCategory('all')}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                Show All
              </button>
            </div>
          )}

          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
              <span className="material-symbols-outlined text-[36px] text-slate-300">
                filter_list_off
              </span>
              <p className="font-bold text-sm text-[#0b1c30]">
                No notifications in this category
              </p>
              <p className="text-xs text-slate-400">
                Try switching to "All Alerts" or choose another category filter.
              </p>
              <button
                onClick={() => setActiveCategory('all')}
                className="mt-2 px-3 py-1.5 bg-[#0b1c30] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                View All Alerts
              </button>
            </div>
          ) : (
            filteredNotifications.map((notif, idx) =>
              renderNotificationCard(notif, `flat_${notif.id}_${idx}`)
            )
          )}
        </div>
      )}
    </div>
  );
};
