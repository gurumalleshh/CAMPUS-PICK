import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Report,
  PotentialMatch,
  VerificationRecord,
  HandoverSchedule,
  NotificationItem,
  FinderContribution,
  Certificate,
  Reward,
  AuditLog,
  ChatMessage,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_REPORTS,
  INITIAL_MATCHES,
  INITIAL_VERIFICATIONS,
  INITIAL_HANDOVERS,
  INITIAL_NOTIFICATIONS,
  LEADERBOARD_USERS,
  DEMO_CERTIFICATE,
  DEMO_REWARDS,
} from '../mockData';

interface ToastData {
  id: string;
  message: string;
  icon?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  switchUserRole: (roleKey: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  goBack: () => void;
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt'>) => Report;
  updateReportStatus: (reportId: string, status: Report['status']) => void;
  matches: PotentialMatch[];
  selectedMatch: PotentialMatch | null;
  setSelectedMatch: (match: PotentialMatch | null) => void;
  dismissMatch: (matchId: string) => void;
  verifications: Record<string, VerificationRecord>;
  submitVerification: (matchId: string, evidence: VerificationRecord['submittedEvidence']) => void;
  updateVerificationStatus: (
    matchId: string,
    status: VerificationRecord['status'],
    notes?: string,
    reviewedBy?: string,
    approverRole?: 'ADMIN' | 'OFFICER'
  ) => void;
  handovers: Record<string, HandoverSchedule>;
  scheduleHandover: (matchId: string, location: string, date: string, time: string) => void;
  confirmReturnParty: (matchId: string, party: 'owner' | 'finder' | 'security') => void;
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  dismissNotification: (id: string) => void;
  unreadCount: number;
  leaderboard: typeof LEADERBOARD_USERS;
  userCertificate: Certificate;
  rewards: Reward[];
  requestRewardClaim: (rewardId: string) => void;
  auditLogs: AuditLog[];
  toasts: ToastData[];
  triggerToast: (message: string, icon?: string, type?: ToastData['type']) => void;
  // Modals & flows
  isReportModalOpen: boolean;
  openReportModal: (intent?: 'LOST' | 'FOUND', preselectedCategory?: string) => void;
  closeReportModal: () => void;
  initialReportIntent: 'LOST' | 'FOUND';
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isChatModalOpen: boolean;
  openChatModal: (matchId?: string) => void;
  closeChatModal: () => void;
  activeChatMatchId: string | null;
  chatMessages: Record<string, ChatMessage[]>;
  sendChatMessage: (matchId: string, content: string) => void;
  isCertModalOpen: boolean;
  openCertModal: () => void;
  closeCertModal: () => void;
  isWalkthroughOpen: boolean;
  openWalkthrough: () => void;
  closeWalkthrough: () => void;
  walkthroughStep: number;
  setWalkthroughStep: (step: number) => void;
  nextWalkthroughStep: () => void;
  prevWalkthroughStep: () => void;
  draftReport: Partial<Report> | null;
  saveDraft: (draft: Partial<Report>) => void;
  clearDraft: () => void;
  // Intro & Splash
  showIntro: boolean;
  setShowIntro: (show: boolean) => void;
  // Edge cases & offline state
  isOffline: boolean;
  toggleOffline: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to ensure notifications array never has duplicate IDs or invalid priority flags
const deduplicateNotifications = (list: NotificationItem[]): NotificationItem[] => {
  const seenIds = new Set<string>();
  const result: NotificationItem[] = [];
  for (const item of list) {
    if (!item || !item.id) continue;
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      result.push({
        ...item,
        priority: item.type === 'PRIORITY_ALERT' || item.id === 'notif_001',
      });
    }
  }
  return result;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cp_auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [activeTab, setActiveTabState] = useState<string>('home');
  const [tabHistory, setTabHistory] = useState<string[]>(['home']);

  const setActiveTab = (tab: string) => {
    setActiveTabState((prev) => {
      if (prev !== tab) {
        setTabHistory((h) => [...h, tab]);
      }
      return tab;
    });
  };

  const goBack = () => {
    setTabHistory((h) => {
      if (h.length > 1) {
        const next = [...h];
        next.pop(); // remove current tab
        const target = next[next.length - 1] || 'home';
        setActiveTabState(target);
        return next;
      }
      setActiveTabState('home');
      return ['home'];
    });
  };
  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem('cp_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });
  const [matches, setMatches] = useState<PotentialMatch[]>(() => {
    const saved = localStorage.getItem('cp_matches');
    return saved ? JSON.parse(saved) : INITIAL_MATCHES;
  });
  const [selectedMatch, setSelectedMatch] = useState<PotentialMatch | null>(matches[0] || null);
  const [verifications, setVerifications] = useState<Record<string, VerificationRecord>>(() => {
    const saved = localStorage.getItem('cp_verifications');
    return saved ? JSON.parse(saved) : INITIAL_VERIFICATIONS;
  });
  const [handovers, setHandovers] = useState<Record<string, HandoverSchedule>>(() => {
    const saved = localStorage.getItem('cp_handovers');
    return saved ? JSON.parse(saved) : INITIAL_HANDOVERS;
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('cp_notifications');
    let rawList: NotificationItem[] = INITIAL_NOTIFICATIONS;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          rawList = parsed;
        }
      } catch {
        rawList = INITIAL_NOTIFICATIONS;
      }
    }
    const cleanList = deduplicateNotifications(rawList);
    // Overwrite any corrupted or duplicate items previously saved in local storage
    try {
      localStorage.setItem('cp_notifications', JSON.stringify(cleanList));
    } catch {
      // ignore
    }
    return cleanList;
  });
  const [leaderboard, setLeaderboard] = useState(() => {
    const saved = localStorage.getItem('cp_leaderboard');
    let list = LEADERBOARD_USERS;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = parsed.map((item: any, idx: number) => {
            const fallback =
              LEADERBOARD_USERS.find((u) => u.id === item.id || u.name === item.name) ||
              LEADERBOARD_USERS[idx % LEADERBOARD_USERS.length];
            return {
              ...fallback,
              ...item,
              avatar: item.avatar || fallback.avatar,
            };
          });
        }
      } catch {
        list = LEADERBOARD_USERS;
      }
    }
    // Strict sort by points descending, then returns descending
    list.sort((a: any, b: any) => b.points - a.points || b.returns - a.returns);
    // Strict sequential 1-based ranking without duplicate ranks
    return list.map((u: any, idx: number) => ({ ...u, rank: idx + 1 }));
  });
  const [userCertificate, setUserCertificate] = useState<Certificate>(DEMO_CERTIFICATE);
  const [rewards, setRewards] = useState<Reward[]>(DEMO_REWARDS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log_1',
      timestamp: 'Today, 3:45 PM',
      actor: 'Sarah J.',
      action: 'REPORT_CREATED',
      details: 'Lost Report #CP-2026-00142 (Lenovo ThinkPad X1) registered in CS-204.',
    },
    {
      id: 'log_2',
      timestamp: 'Today, 3:52 PM',
      actor: 'Rahul K.',
      action: 'REPORT_CREATED',
      details: 'Found Report #CP-2026-00148 secured in Smart Locker B-12.',
    },
    {
      id: 'log_3',
      timestamp: 'Today, 3:55 PM',
      actor: 'Matching Engine',
      action: 'MATCH_DETECTED',
      details: '87% AI Telemetry correlation detected between #00142 and #00148.',
    },
  ]);

  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [initialReportIntent, setInitialReportIntent] = useState<'LOST' | 'FOUND'>('LOST');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [activeChatMatchId, setActiveChatMatchId] = useState<string | null>('match_001');
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);
  const [walkthroughStep, setWalkthroughStep] = useState(1);
  const [draftReport, setDraftReport] = useState<Partial<Report> | null>(() => {
    const saved = localStorage.getItem('cp_draft_report');
    return saved ? JSON.parse(saved) : null;
  });
  const [isOffline, setIsOffline] = useState(false);

  // Chat message store per match and student thread
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({
    match_001: [
      {
        id: 'msg_sys_1',
        senderId: 'system',
        senderName: 'Campus Pick Trust Protocol',
        senderRole: 'Security Bot',
        content: 'Verification approved. Direct coordination unlocked for safe handover at Gate 1.',
        timestamp: '4:16 PM',
        isSystemNotice: true,
      },
      {
        id: 'msg_1',
        senderId: 'usr_rahul',
        senderName: 'Rahul K.',
        senderRole: 'Mechanical Dept (Finder)',
        content: 'Hi Sarah! Handed the laptop to Officer Nair at Gate 1 Security Desk so you can pick it up safely.',
        timestamp: '4:28 PM',
      },
      {
        id: 'msg_2',
        senderId: 'usr_sarah',
        senderName: 'Sarah J.',
        senderRole: 'Computer Science (Owner)',
        content: 'Thank you so much Rahul! Heading there right now with my college ID card.',
        timestamp: '4:29 PM',
      },
      {
        id: 'msg_3',
        senderId: 'usr_rahul',
        senderName: 'Rahul K.',
        senderRole: 'Mechanical Dept (Finder)',
        content: 'Awesome! It is in Locker B-12 with the Linux sticker on the palmrest.',
        timestamp: '4:30 PM',
      },
    ],
    chat_priya: [
      {
        id: 'msg_priya_sys',
        senderId: 'system',
        senderName: 'Campus Pick Trust Protocol',
        senderRole: 'System',
        content: 'Student-to-student messaging initiated regarding Casio Scientific Calculator FX-991CW.',
        timestamp: 'Yesterday',
        isSystemNotice: true,
      },
      {
        id: 'msg_priya_1',
        senderId: 'usr_priya',
        senderName: 'Priya S.',
        senderRole: 'Electronics & Comm (Finder)',
        content: 'Hi! I found your Casio FX-991CW calculator in the Mathematics Tutorial Hall on the 2nd bench.',
        timestamp: 'Yesterday, 5:10 PM',
      },
      {
        id: 'msg_priya_2',
        senderId: 'usr_sarah',
        senderName: 'Sarah J.',
        senderRole: 'Computer Science (Student)',
        content: 'Oh brilliant! Does it have a white pencil marking on the back slip cover?',
        timestamp: 'Yesterday, 5:14 PM',
      },
      {
        id: 'msg_priya_3',
        senderId: 'usr_priya',
        senderName: 'Priya S.',
        senderRole: 'Electronics & Comm (Finder)',
        content: 'Yes! It has "PESCE-MATH-SEM3" penciled inside. I can meet you at Central Library circulation counter.',
        timestamp: 'Yesterday, 5:16 PM',
      },
    ],
    chat_tanvi: [
      {
        id: 'msg_tanvi_sys',
        senderId: 'system',
        senderName: 'Campus Pick Trust Protocol',
        senderRole: 'System',
        content: 'Student-to-student messaging active for PESCE Smart Card ID #4PS23CS019.',
        timestamp: 'Today',
        isSystemNotice: true,
      },
      {
        id: 'msg_tanvi_1',
        senderId: 'usr_tanvi',
        senderName: 'Tanvi M.',
        senderRole: 'Computer Science (Student)',
        content: 'Hey! Saw your report for the lost blue college lanyard & ID card. I found one at the Canteen billing counter!',
        timestamp: 'Today, 2:15 PM',
      },
    ],
    chat_security: [
      {
        id: 'msg_sec_sys',
        senderId: 'system',
        senderName: 'Campus Pick Security Desk',
        senderRole: 'Security Dispatch',
        content: 'Official Security Desk channel • Officer R. Nair (Badge #CS-409)',
        timestamp: 'Active',
        isSystemNotice: true,
      },
      {
        id: 'msg_sec_1',
        senderId: 'usr_nair',
        senderName: 'Officer R. Nair',
        senderRole: 'Campus Security Officer',
        content: 'Gate 1 Custody Kiosk is open until 7:30 PM. All verified items are logged in the Central Register.',
        timestamp: 'Today, 3:00 PM',
      },
    ],
  });

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem('cp_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('cp_matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('cp_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('cp_verifications', JSON.stringify(verifications));
  }, [verifications]);

  useEffect(() => {
    localStorage.setItem('cp_handovers', JSON.stringify(handovers));
  }, [handovers]);

  const triggerToast = (message: string, icon = 'check_circle', type: ToastData['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, icon, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const login = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('cp_auth_user', JSON.stringify(user));
    triggerToast(`Welcome, ${user.displayName}! Verified session active.`, 'verified_user', 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cp_auth_user');
    setActiveTab('home');
    setShowIntro(true);
    triggerToast('Logged out of Campus Pick session.', 'logout', 'info');
  };

  const switchUserRole = (roleKey: string) => {
    if (DEMO_USERS[roleKey]) {
      login(DEMO_USERS[roleKey]);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    triggerToast('All notifications marked as read', 'done_all');
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    triggerToast('Notification dismissed', 'delete');
  };

  const openReportModal = (intent: 'LOST' | 'FOUND' = 'LOST') => {
    setInitialReportIntent(intent);
    setIsReportModalOpen(true);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const openChatModal = (matchId = 'match_001') => {
    setActiveChatMatchId(matchId);
    setIsChatModalOpen(true);
  };
  const closeChatModal = () => setIsChatModalOpen(false);

  const openCertModal = () => setIsCertModalOpen(true);
  const closeCertModal = () => setIsCertModalOpen(false);

  const openWalkthrough = () => setIsWalkthroughOpen(true);
  const closeWalkthrough = () => setIsWalkthroughOpen(false);

  const nextWalkthroughStep = () => {
    setWalkthroughStep((prev) => (prev < 8 ? prev + 1 : 1));
  };
  const prevWalkthroughStep = () => {
    setWalkthroughStep((prev) => (prev > 1 ? prev - 1 : 8));
  };

  const saveDraft = (draft: Partial<Report>) => {
    setDraftReport(draft);
    localStorage.setItem('cp_draft_report', JSON.stringify(draft));
    triggerToast('Report draft saved safely', 'save');
  };

  const clearDraft = () => {
    setDraftReport(null);
    localStorage.removeItem('cp_draft_report');
  };

  const toggleOffline = () => {
    setIsOffline((prev) => {
      const next = !prev;
      triggerToast(next ? "You're currently offline (Drafts cached)" : 'Back online! Synced with PESCE Mandya ledger', next ? 'wifi_off' : 'wifi', next ? 'warning' : 'success');
      return next;
    });
  };

  // Add report and run matching engine
  const addReport = (reportData: Omit<Report, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt'>): Report => {
    const id = `rep_${Date.now()}`;
    const seq = Math.floor(100 + Math.random() * 900);
    const ticketNumber = `CP-2026-00${seq}`;
    const now = 'Just now';

    const newReport: Report = {
      ...reportData,
      id,
      ticketNumber,
      createdAt: now,
      updatedAt: now,
    };

    setReports((prev) => [newReport, ...prev]);

    // Audit log
    setAuditLogs((prev) => [
      {
        id: `log_${Date.now()}`,
        timestamp: now,
        actor: currentUser ? currentUser.displayName : 'Campus User',
        action: 'REPORT_CREATED',
        details: `${newReport.type} report logged: ${newReport.itemName} (${newReport.complexity}) in ${newReport.location.building} ${newReport.location.room}`,
        caseId: newReport.ticketNumber,
      },
      ...prev,
    ]);

    // 1. Mandatory General Notification for everyone
    const generalNotifId = `notif_gen_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const generalNotif: NotificationItem = {
      id: generalNotifId,
      type: newReport.type === 'LOST' ? 'GENERAL_LOST' : 'GENERAL_FOUND',
      priority: false,
      title: `${newReport.type === 'LOST' ? 'New Lost Item Reported' : 'New Item Found & Secured'}: ${newReport.itemName}`,
      message: `${newReport.description.slice(0, 110)}... Reported near ${newReport.location.building}.`,
      relatedReportId: newReport.id,
      deepLinkTarget: 'report',
      timestamp: 'Just now',
      read: false,
    };

    // 2. Special Priority Notification if room/building targeted
    const priorityNotifId = `notif_prio_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const priorityNotif: NotificationItem = {
      id: priorityNotifId,
      type: 'PRIORITY_ALERT',
      priority: true,
      title: `⭐ PRIORITY ALERT: ${newReport.itemName}`,
      message: `A ${newReport.itemName.toLowerCase()} was reported in ${newReport.location.room} (${newReport.location.building}).`,
      targetingReason: `Why you're seeing this: You have a scheduled class or faculty association with ${newReport.location.room} during this time window.`,
      relatedReportId: newReport.id,
      deepLinkTarget: 'report',
      timestamp: 'Just now',
      read: false,
    };

    setNotifications((prev) => [
      priorityNotif,
      generalNotif,
      ...prev.filter((n) => n.id !== priorityNotifId && n.id !== generalNotifId),
    ]);

    // 3. Matching Engine Trigger
    // Look for opposite type reports with matching category or keywords
    const oppositeType = newReport.type === 'LOST' ? 'FOUND' : 'LOST';
    const candidate = reports.find(
      (r) =>
        r.type === oppositeType &&
        (r.category === newReport.category ||
          r.itemName.toLowerCase().includes(newReport.itemName.toLowerCase()) ||
          newReport.itemName.toLowerCase().includes(r.itemName.toLowerCase()))
    );

    if (candidate) {
      const matchId = `match_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const lostRep = newReport.type === 'LOST' ? newReport : candidate;
      const foundRep = newReport.type === 'FOUND' ? newReport : candidate;

      const newMatch: PotentialMatch = {
        id: matchId,
        lostReportId: lostRep.id,
        foundReportId: foundRep.id,
        lostReport: lostRep,
        foundReport: foundRep,
        confidenceScore: 89,
        confidenceLevel: 'High',
        matchingFactors: [
          { name: 'Item Classification', match: true, description: `${lostRep.itemName} vs ${foundRep.itemName}`, strength: 'STRONG' },
          { name: 'Category & Type', match: true, description: `Category: ${lostRep.category.replace('_', ' ')}`, strength: 'STRONG' },
          { name: 'Location Proximity', match: true, description: `${lostRep.location.building} → ${foundRep.location.building}`, strength: 'STRONG' },
          { name: 'Time Proximity', match: true, description: 'Reports logged within immediate campus window', strength: 'STRONG' },
          { name: 'Hardware Serial Number', match: false, description: 'Confidential • Protected until Officer authorization', strength: 'STRONG' },
        ],
        status: 'PENDING',
        createdAt: 'Just now',
      };

      setMatches((prev) => [newMatch, ...prev]);
      setSelectedMatch(newMatch);

      // Add Potential Match notification with unique ID
      const matchNotifId = `notif_match_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const matchNotif: NotificationItem = {
        id: matchNotifId,
        type: 'POTENTIAL_MATCH',
        priority: false,
        title: '🎯 Potential Match Detected (89% Similarity)',
        message: `A found report correlates with your ${lostRep.itemName}. Compare attributes and verify ownership.`,
        relatedMatchId: matchId,
        deepLinkTarget: 'matches',
        timestamp: 'Just now',
        read: false,
      };
      setNotifications((prev) => [matchNotif, ...prev.filter((n) => n.id !== matchNotifId)]);
      triggerToast('Matching Engine: High-confidence potential match detected!', 'auto_awesome', 'info');
    }

    clearDraft();
    return newReport;
  };

  const updateReportStatus = (reportId: string, status: Report['status']) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status, updatedAt: 'Just now' } : r))
    );
  };

  const dismissMatch = (matchId: string) => {
    setMatches((prev) => prev.filter((m) => m.id !== matchId));
    if (selectedMatch?.id === matchId) {
      setSelectedMatch(null);
    }
    triggerToast('Potential match dismissed from active queue', 'visibility_off');
  };

  const submitVerification = (
    matchId: string,
    evidence: VerificationRecord['submittedEvidence']
  ) => {
    const verRecord: VerificationRecord = {
      id: `ver_${Date.now()}`,
      matchId,
      claimantId: currentUser ? currentUser.id : 'usr_sarah',
      claimantName: currentUser ? currentUser.displayName : 'Sarah J.',
      status: 'UNDER_REVIEW',
      submittedEvidence: evidence,
      createdAt: 'Just now',
      updatedAt: 'Just now',
    };

    setVerifications((prev) => ({ ...prev, [matchId]: verRecord }));

    setAuditLogs((prev) => [
      {
        id: `log_${Date.now()}`,
        timestamp: 'Just now',
        actor: currentUser ? currentUser.displayName : 'Campus Claimant',
        action: 'VERIFICATION_SUBMITTED',
        details: `Ownership evidence submitted for match #${matchId}. Dispatched to Security Desk.`,
      },
      ...prev,
    ]);

    triggerToast('Verification token submitted! Dispatched to Officer R. Nair at Gate 1.', 'verified', 'success');
  };

  const updateVerificationStatus = (
    matchId: string,
    status: VerificationRecord['status'],
    notes = '',
    reviewedBy?: string,
    approverRole?: 'ADMIN' | 'OFFICER'
  ) => {
    // Determine whether approved by Admin or Officer
    let resolvedRole: 'ADMIN' | 'OFFICER' = approverRole || 'OFFICER';
    if (!approverRole) {
      if (
        currentUser?.role === 'admin' ||
        (reviewedBy &&
          (reviewedBy.toLowerCase().includes('admin') || reviewedBy.toLowerCase().includes('dean') || reviewedBy.toLowerCase().includes('shivakumar')))
      ) {
        resolvedRole = 'ADMIN';
      } else {
        resolvedRole = 'OFFICER';
      }
    }

    const defaultReviewer =
      resolvedRole === 'ADMIN'
        ? 'Admin Dr. N. Shivakumar (Dean of Student Welfare)'
        : 'Verification Officer R. Nair (Badge #CS-409)';
    const finalReviewedBy = reviewedBy || defaultReviewer;

    setVerifications((prev) => {
      const existing = prev[matchId] || {
        id: `ver_${Date.now()}`,
        matchId,
        claimantId: 'usr_sarah',
        claimantName: 'Sarah J.',
        submittedEvidence: {},
        createdAt: 'Today',
        updatedAt: 'Just now',
      };
      const updated = {
        ...prev,
        [matchId]: {
          ...existing,
          status,
          approverRole: status === 'VERIFIED' ? resolvedRole : undefined,
          reviewNotes:
            notes ||
            (status === 'VERIFIED'
              ? resolvedRole === 'ADMIN'
                ? 'Official identity & academic records approved by Campus Administration.'
                : 'Hardware markings, serial number, and physical identity verified at Gate 1 post.'
              : 'More proof required.'),
          reviewedBy: finalReviewedBy,
          reviewedAt: status === 'VERIFIED' ? 'Just now' : '',
          updatedAt: 'Just now',
        },
      };
      localStorage.setItem('cp_verifications', JSON.stringify(updated));
      return updated;
    });

    if (status === 'VERIFIED') {
      const isAdm = resolvedRole === 'ADMIN';

      // Update match status to VERIFIED
      setMatches((prevMatches) => {
        const nextMatches = prevMatches.map((m) =>
          m.id === matchId ? { ...m, status: 'VERIFIED' as const } : m
        );
        localStorage.setItem('cp_matches', JSON.stringify(nextMatches));
        return nextMatches;
      });

      // Post system announcement to chat thread
      setChatMessages((prevChats) => {
        const currentThreadMsgs = prevChats[matchId] || [];
        const systemNotice: ChatMessage = {
          id: `msg_verify_${Date.now()}`,
          senderId: 'system',
          senderName: finalReviewedBy,
          senderRole: isAdm ? 'Campus Administration' : 'Verification Officer',
          content: isAdm
            ? '✓ Match Verified & Approved by Admin (Dr. N. Shivakumar). Direct student messaging is now unlocked.'
            : '✓ Match Verified & Approved by Verification Officer (Officer R. Nair). Direct student messaging is now unlocked.',
          timestamp: 'Just now',
          isSystemNotice: true,
        };
        return {
          ...prevChats,
          [matchId]: [...currentThreadMsgs, systemNotice],
        };
      });

      // Ensure Handover schedule exists
      if (!handovers[matchId]) {
        setHandovers((prev) => ({
          ...prev,
          [matchId]: {
            id: `hnd_${Date.now()}`,
            matchId,
            lostReportId: 'rep_001',
            foundReportId: 'rep_002',
            location: 'Gate 1 Campus Security Exchange Kiosk',
            date: 'Today',
            time: '4:30 PM (Scheduled)',
            witnessOfficer: finalReviewedBy,
            status: 'SCHEDULED',
            ownerConfirmed: false,
            finderConfirmed: false,
            officerWitnessed: false,
          },
        }));
      }

      // Add verification approved notification
      const vokNotifId = `notif_vok_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      setNotifications((prev) => [
        {
          id: vokNotifId,
          type: 'VERIFICATION_APPROVED',
          priority: false,
          title: isAdm
            ? '✓ Match Approved by Admin'
            : '✓ Match Approved by Officer',
          message: isAdm
            ? 'Admin Dr. N. Shivakumar (Dean of Student Welfare) approved verification. Messaging access between students has been granted!'
            : 'Verification Officer R. Nair (Badge #CS-409) approved verification. Messaging access between students has been granted!',
          relatedMatchId: matchId,
          deepLinkTarget: 'handover',
          timestamp: 'Just now',
          read: false,
        },
        ...prev.filter((n) => n.id !== vokNotifId),
      ]);

      const logVokId = `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      setAuditLogs((prevLogs) => [
        {
          id: logVokId,
          timestamp: 'Just now',
          actor: finalReviewedBy,
          action: 'VERIFICATION_APPROVED',
          details: isAdm
            ? `Match #${matchId} verified and approved by Admin (Dr. N. Shivakumar). Direct student messaging unlocked.`
            : `Match #${matchId} verified and approved by Verification Officer (Officer R. Nair). Direct student messaging unlocked.`,
        },
        ...prevLogs,
      ]);

      triggerToast(
        isAdm
          ? 'Ownership confirmed & approved by Admin! Messaging unlocked.'
          : 'Ownership confirmed & approved by Officer! Messaging unlocked.',
        'verified',
        'success'
      );
    } else if (status === 'NEEDS_MORE_EVIDENCE') {
      setMatches((prevMatches) => {
        const nextMatches = prevMatches.map((m) =>
          m.id === matchId ? { ...m, status: 'PENDING' as const } : m
        );
        localStorage.setItem('cp_matches', JSON.stringify(nextMatches));
        return nextMatches;
      });

      const nmeNotifId = `notif_nme_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      setNotifications((prev) => [
        {
          id: nmeNotifId,
          type: 'MORE_EVIDENCE_NEEDED',
          priority: false,
          title: 'Action Required: Additional Proof Requested',
          message: 'Campus Security requested an uncropped invoice receipt or photo of the base serial number.',
          relatedMatchId: matchId,
          deepLinkTarget: 'verification',
          timestamp: 'Just now',
          read: false,
        },
        ...prev.filter((n) => n.id !== nmeNotifId),
      ]);
      triggerToast('Status updated: Claimant asked for additional evidence', 'info');
    } else {
      // Re-locking or pending
      setMatches((prevMatches) => {
        const nextMatches = prevMatches.map((m) =>
          m.id === matchId ? { ...m, status: 'PENDING' as const } : m
        );
        localStorage.setItem('cp_matches', JSON.stringify(nextMatches));
        return nextMatches;
      });
    }
  };

  const scheduleHandover = (matchId: string, location: string, date: string, time: string) => {
    setHandovers((prev) => ({
      ...prev,
      [matchId]: {
        ...(prev[matchId] || {
          id: `hnd_${Date.now()}`,
          matchId,
          lostReportId: 'rep_001',
          foundReportId: 'rep_002',
          witnessOfficer: 'Officer R. Nair (Badge #CS-409)',
          ownerConfirmed: false,
          finderConfirmed: false,
          officerWitnessed: false,
        }),
        location,
        date,
        time,
        status: 'SCHEDULED',
      },
    }));

    triggerToast(`Handover scheduled at ${location} for ${date} at ${time}`, 'event', 'success');
  };

  const confirmReturnParty = (matchId: string, party: 'owner' | 'finder' | 'security') => {
    const existing = handovers[matchId];
    if (!existing) return;

    const updated = { ...existing };
    if (party === 'owner') {
      updated.ownerConfirmed = !updated.ownerConfirmed;
      updated.ownerConfirmedAt = updated.ownerConfirmed ? 'Today 4:32 PM' : undefined;
    }
    if (party === 'finder') {
      updated.finderConfirmed = !updated.finderConfirmed;
      updated.finderConfirmedAt = updated.finderConfirmed ? 'Today 4:33 PM' : undefined;
    }
    if (party === 'security') {
      updated.officerWitnessed = !updated.officerWitnessed;
      updated.officerWitnessedAt = updated.officerWitnessed ? 'Today 4:35 PM' : undefined;
    }

    const isNewlyCompleted =
      updated.ownerConfirmed &&
      updated.finderConfirmed &&
      existing.status !== 'COMPLETED';

    if (isNewlyCompleted) {
      updated.status = 'COMPLETED';
    }

    setHandovers((prev) => ({ ...prev, [matchId]: updated }));

    // Check if newly confirmed by both parties
    if (isNewlyCompleted) {
      // Update report status everywhere to RETURNED
      updateReportStatus(updated.lostReportId, 'RETURNED');
      updateReportStatus(updated.foundReportId, 'RETURNED');

      // Update leaderboard dynamically with new points and re-rank
      setLeaderboard((curr) => {
        const updatedList = curr.map((u) => {
          if (u.id === 'usr_rahul' || u.name.includes('Rahul')) {
            return { ...u, returns: u.returns + 1, points: u.points + 50 };
          }
          if (u.id === 'usr_sarah' || u.name.includes('Sarah') || u.isUser) {
            return { ...u, returns: u.returns + 1, points: u.points + 10 };
          }
          return u;
        });
        // Strict descending sort by points, then returns
        updatedList.sort((a, b) => b.points - a.points || b.returns - a.returns);
        // Strict 1-based sequential ranking so no two people ever have the same rank
        const reRanked = updatedList.map((u, idx) => ({ ...u, rank: idx + 1 }));
        localStorage.setItem('cp_leaderboard', JSON.stringify(reRanked));
        return reRanked;
      });

      // Update currentUser stats and keep rank synchronized
      setCurrentUser((u) => {
        if (!u) return null;
        const isFinder = u.id === 'usr_rahul';
        const pointsEarned = isFinder ? 50 : 10;
        const newPoints = u.points + pointsEarned;
        const newReturns = u.successfullyReturnedItems + 1;
        const nextUser = {
          ...u,
          successfullyReturnedItems: newReturns,
          points: newPoints,
        };
        localStorage.setItem('cp_auth_user', JSON.stringify(nextUser));
        return nextUser;
      });

      // Audit Trail with unique ID
      const auditLogId = `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      setAuditLogs((a) => [
        {
          id: auditLogId,
          timestamp: 'Today, 4:35 PM',
          actor: 'Dual Confirmation Protocol',
          action: 'RETURN_CONFIRMED',
          details: `Item officially marked RETURNED. Owner & Finder confirmed. +50 Points awarded to Finder Rahul K. Case #CP-89241 sealed.`,
          caseId: 'CP-89241',
        },
        ...a,
      ]);

      // Celebratory Notification with guaranteed unique ID and deduplication
      const returnNotifId = `notif_ret_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      setNotifications((prev) => {
        // Strip out any previous return confirmed notifications to avoid clutter and duplicate keys
        const cleaned = prev.filter(
          (n) => n.id !== returnNotifId && !n.id.startsWith('notif_ret_')
        );
        return [
          {
            id: returnNotifId,
            type: 'RETURN_CONFIRMED',
            priority: false,
            title: '🎉 Item Returned Successfully! Leaderboard Updated',
            message:
              'Both parties confirmed custody return. Points & returns dynamically recorded in Campus Heroes Leaderboard.',
            deepLinkTarget: 'heroes',
            timestamp: 'Just now',
            read: false,
          },
          ...cleaned,
        ];
      });

      triggerToast(
        '✓ Return Sealed! Leaderboard updated with verified returns.',
        'military_tech',
        'success'
      );
    } else {
      triggerToast(
        `${party === 'owner' ? 'Owner' : party === 'finder' ? 'Finder' : 'Officer'} custody token signed`,
        'fingerprint'
      );
    }
  };

  const sendChatMessage = (matchId: string, content: string) => {
    if (!content.trim() || !currentUser) return;
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      senderRole: currentUser.role === 'student' ? `${currentUser.department} Student` : currentUser.role,
      content,
      timestamp: 'Just now',
    };

    setChatMessages((prev) => ({
      ...prev,
      [matchId]: [...(prev[matchId] || []), newMsg],
    }));

    triggerToast('Message sent to campus partner', 'send');

    // Simulate real interactive response from the student or officer partner
    setTimeout(() => {
      let replyContent = "Got it! I am nearby and can meet you at the campus desk.";
      let senderName = "Rahul K.";
      let senderRole = "Mechanical Dept (Finder)";
      let senderId = "usr_rahul";

      const lower = content.toLowerCase();

      if (matchId === 'chat_priya') {
        senderName = "Priya S.";
        senderRole = "Electronics & Comm (Student)";
        senderId = "usr_priya";
        if (lower.includes('where') || lower.includes('meet') || lower.includes('library')) {
          replyContent = "I'm right at the Central Library circulation counter! Can meet you now.";
        } else if (lower.includes('calculator') || lower.includes('casio')) {
          replyContent = "Yes, it is the FX-991CW with all function keys working and safe.";
        } else {
          replyContent = "Thanks for the message! Let me know when you're outside the department.";
        }
      } else if (matchId === 'chat_tanvi') {
        senderName = "Tanvi M.";
        senderRole = "Computer Science (Student)";
        senderId = "usr_tanvi";
        replyContent = "Thank you so much! I was really worried about my college ID. I am heading to Gate 1 now.";
      } else if (matchId === 'chat_security') {
        senderName = "Officer R. Nair";
        senderRole = "Campus Security (Badge #CS-409)";
        senderId = "usr_nair";
        replyContent = "Officer Nair here. The custody locker is ready. Please present your PESCE USN on arrival.";
      } else {
        // Default match_001 (Rahul K. & Lenovo ThinkPad)
        if (lower.includes('meet') || lower.includes('gate') || lower.includes('kiosk') || lower.includes('time')) {
          replyContent = "Sounds perfect! Officer Nair is right here at Gate 1 Safe Kiosk. Let's do the handover!";
        } else if (lower.includes('sticker') || lower.includes('serial') || lower.includes('tux')) {
          replyContent = "Yes, exactly! It has the Linux Tux sticker right on the palmrest, totally intact.";
        } else if (lower.includes('thank') || lower.includes('thanks')) {
          replyContent = "Always glad to help a fellow student at PESCE! Glad you got it back.";
        } else {
          replyContent = "Received! Let me know when you reach Gate 1 Security Kiosk so we can confirm the return.";
        }
      }

      const replyMsg: ChatMessage = {
        id: `msg_reply_${Date.now()}`,
        senderId,
        senderName,
        senderRole,
        content: replyContent,
        timestamp: 'Just now',
      };

      setChatMessages((prev) => ({
        ...prev,
        [matchId]: [...(prev[matchId] || []), replyMsg],
      }));
    }, 1100);
  };

  const requestRewardClaim = (rewardId: string) => {
    setRewards((prev) =>
      prev.map((r) =>
        r.id === rewardId ? { ...r, status: 'PENDING_APPROVAL' } : r
      )
    );
    triggerToast('Recognition request submitted for administrative review!', 'mark_email_read', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        switchUserRole,
        activeTab,
        setActiveTab,
        goBack,
        reports,
        addReport,
        updateReportStatus,
        matches,
        selectedMatch,
        setSelectedMatch,
        dismissMatch,
        verifications,
        submitVerification,
        updateVerificationStatus,
        handovers,
        scheduleHandover,
        confirmReturnParty,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        dismissNotification,
        unreadCount,
        leaderboard,
        userCertificate,
        rewards,
        requestRewardClaim,
        auditLogs,
        toasts,
        triggerToast,
        isReportModalOpen,
        openReportModal,
        closeReportModal,
        initialReportIntent,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        isChatModalOpen,
        openChatModal,
        closeChatModal,
        activeChatMatchId,
        chatMessages,
        sendChatMessage,
        isCertModalOpen,
        openCertModal,
        closeCertModal,
        isWalkthroughOpen,
        openWalkthrough,
        closeWalkthrough,
        walkthroughStep,
        setWalkthroughStep,
        nextWalkthroughStep,
        prevWalkthroughStep,
        draftReport,
        saveDraft,
        clearDraft,
        showIntro,
        setShowIntro,
        isOffline,
        toggleOffline,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
