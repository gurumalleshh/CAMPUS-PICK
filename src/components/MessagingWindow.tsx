import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';

export interface ThreadInfo {
  id: string;
  name: string;
  role: string;
  dept: string;
  avatar: string;
  itemTitle: string;
  itemPhoto?: string;
  ticket: string;
  location: string;
  statusBadge: string;
  isOnline: boolean;
  unreadCount?: number;
  category: 'match' | 'owner' | 'security';
  userId?: string;
  credentialIdentifier: string;
  email: string;
  demoRoleKey?: 'student_sarah' | 'student_rahul' | 'security_nair' | 'admin_shivakumar' | 'faculty_divya';
}

export const DEMO_CREDENTIALS_LIST = [
  {
    roleKey: 'student_sarah' as const,
    userId: 'usr_sarah',
    name: 'Sarah J.',
    role: 'Student (Owner)',
    credential: 'USN: 4PS23CS084',
    email: 'sarah.jenkins@pesce.ac.in',
    dept: 'Computer Science (Year 3)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    threadId: 'chat_sarah',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    roleKey: 'student_rahul' as const,
    userId: 'usr_rahul',
    name: 'Rahul K.',
    role: 'Student (Finder)',
    credential: 'USN: 4PS22ME049',
    email: 'rahul.k@pesce.ac.in',
    dept: 'Mechanical Eng (Year 4)',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    threadId: 'match_001',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    roleKey: 'security_nair' as const,
    userId: 'usr_nair',
    name: 'Officer R. Nair',
    role: 'Campus Security',
    credential: 'BADGE #CS-409',
    email: 'security.dispatch@pesce.ac.in',
    dept: 'Gate 1 Custody Post',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    threadId: 'chat_security',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    roleKey: 'admin_shivakumar' as const,
    userId: 'usr_admin',
    name: 'Dr. N. Shivakumar',
    role: 'Dean of Student Welfare (Admin)',
    credential: 'EMP: EMP-ADM-012',
    email: 'dean.welfare@pesce.ac.in',
    dept: 'Dean Office (Admin Block F1)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    threadId: 'chat_admin',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    roleKey: 'faculty_divya' as const,
    userId: 'usr_divya',
    name: 'Prof. Divya R.',
    role: 'Faculty / Dept Staff',
    credential: 'EMP: FAC-BS-104',
    email: 'divya.r@pesce.ac.in',
    dept: 'Basic Sciences & Maths',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    threadId: 'chat_faculty',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
  },
];

export const THREADS: ThreadInfo[] = [
  {
    id: 'match_001',
    name: 'Rahul K.',
    role: 'Finder / Student',
    dept: 'Mechanical Eng (4PS22ME049)',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    itemTitle: 'Lenovo ThinkPad X1 Carbon',
    itemPhoto: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&auto=format&fit=crop&q=80',
    ticket: '#CP-2026-00142',
    location: 'Gate 1 Campus Security Post',
    statusBadge: 'Match Correlated',
    isOnline: true,
    unreadCount: 1,
    category: 'match',
    userId: 'usr_rahul',
    credentialIdentifier: 'USN: 4PS22ME049',
    email: 'rahul.k@pesce.ac.in',
    demoRoleKey: 'student_rahul',
  },
  {
    id: 'chat_sarah',
    name: 'Sarah J.',
    role: 'Owner / Student',
    dept: 'Computer Science (4PS23CS084)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    itemTitle: 'Lenovo ThinkPad X1 & CS Lab ID',
    itemPhoto: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&auto=format&fit=crop&q=80',
    ticket: '#CP-2026-00142',
    location: 'CS-204 (AI Lab Desk)',
    statusBadge: 'Verified Student',
    isOnline: true,
    unreadCount: 0,
    category: 'owner',
    userId: 'usr_sarah',
    credentialIdentifier: 'USN: 4PS23CS084',
    email: 'sarah.jenkins@pesce.ac.in',
    demoRoleKey: 'student_sarah',
  },
  {
    id: 'chat_security',
    name: 'Officer R. Nair',
    role: 'Campus Security',
    dept: 'Gate 1 Custody Desk (Badge #CS-409)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    itemTitle: 'Central Security Custody Vault',
    ticket: '#SEC-DISPATCH-99',
    location: 'Gate 1 Physical Security Post',
    statusBadge: 'Official Custody',
    isOnline: true,
    unreadCount: 0,
    category: 'security',
    userId: 'usr_nair',
    credentialIdentifier: 'BADGE #CS-409',
    email: 'security.dispatch@pesce.ac.in',
    demoRoleKey: 'security_nair',
  },
  {
    id: 'chat_admin',
    name: 'Dr. N. Shivakumar',
    role: 'Dean of Student Welfare (Admin)',
    dept: 'Admin Block (EMP-ADM-012)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    itemTitle: 'Institutional Administration & Clearance',
    ticket: '#ADM-DEAN-012',
    location: 'Dean Office (Admin Block F1)',
    statusBadge: 'Institutional Admin',
    isOnline: true,
    unreadCount: 0,
    category: 'security',
    userId: 'usr_admin',
    credentialIdentifier: 'EMP: EMP-ADM-012',
    email: 'dean.welfare@pesce.ac.in',
    demoRoleKey: 'admin_shivakumar',
  },
  {
    id: 'chat_faculty',
    name: 'Prof. Divya R.',
    role: 'Faculty / Dept Staff',
    dept: 'Basic Sciences & Maths (FAC-BS-104)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    itemTitle: 'Tutorial Hall Lost Property Desk',
    ticket: '#FAC-MATH-104',
    location: 'Basic Science Block Room 104',
    statusBadge: 'Faculty Desk',
    isOnline: true,
    unreadCount: 0,
    category: 'match',
    userId: 'usr_divya',
    credentialIdentifier: 'EMP: FAC-BS-104',
    email: 'divya.r@pesce.ac.in',
    demoRoleKey: 'faculty_divya',
  },
  {
    id: 'chat_priya',
    name: 'Priya S.',
    role: 'Finder / Student',
    dept: 'ECE Dept (4PS23EC071)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    itemTitle: 'Casio Scientific Calculator FX-991CW',
    itemPhoto: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=400&auto=format&fit=crop&q=80',
    ticket: '#CP-2026-00139',
    location: 'Central Library Circulation Desk',
    statusBadge: 'Direct Inquiry',
    isOnline: true,
    unreadCount: 2,
    category: 'match',
    userId: 'usr_priya',
    credentialIdentifier: 'USN: 4PS23EC071',
    email: 'priya.s@pesce.ac.in',
  },
  {
    id: 'chat_tanvi',
    name: 'Tanvi M.',
    role: 'Owner / Student',
    dept: 'Computer Science (4PS23CS019)',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    itemTitle: 'PESCE Student Smart Card ID',
    itemPhoto: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
    ticket: '#CP-2026-00135',
    location: 'Campus Canteen Register',
    statusBadge: 'Owner Claim',
    isOnline: false,
    unreadCount: 0,
    category: 'owner',
    userId: 'usr_tanvi',
    credentialIdentifier: 'USN: 4PS23CS019',
    email: 'tanvi.m@pesce.ac.in',
  },
];

interface MessagingWindowProps {
  isFullScreen?: boolean;
  isModal?: boolean;
  initialThreadId?: string;
  onClose?: () => void;
}

export const MessagingWindow: React.FC<MessagingWindowProps> = ({
  isFullScreen = false,
  isModal = false,
  initialThreadId,
  onClose,
}) => {
  const {
    currentUser,
    chatMessages,
    sendChatMessage,
    handovers,
    confirmReturnParty,
    triggerToast,
    closeChatModal,
    verifications,
    requestChatApproval,
    updateVerificationStatus,
    goBack,
    switchUserRole,
    openCertModal,
    setActiveTab,
  } = useApp();

  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(
    initialThreadId || (isModal ? 'match_001' : null)
  );

  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatFilter, setChatFilter] = useState<'all' | 'unread' | 'matches' | 'security'>('all');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showCredsModal, setShowCredsModal] = useState(false);
  const [showItemDetailsDrawer, setShowItemDetailsDrawer] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeThread = THREADS.find((t) => t.id === selectedThreadId);
  const messages = selectedThreadId ? chatMessages[selectedThreadId] || [] : [];
  const currentHandover = selectedThreadId ? handovers[selectedThreadId] : undefined;

  // Verification & Authority Approval Gate
  const isOfficerDirectThread = selectedThreadId === 'chat_security' || selectedThreadId === 'chat_admin';
  const currentVerification = selectedThreadId ? verifications[selectedThreadId] : undefined;
  const isThreadVerified = isOfficerDirectThread || currentVerification?.status === 'VERIFIED';
  const isThreadRejected = !isOfficerDirectThread && currentVerification?.status === 'REJECTED';
  const isThreadUnderReview = !isOfficerDirectThread && (currentVerification?.status === 'UNDER_REVIEW' || currentVerification?.status === 'SUBMITTED');

  const isApprovedByAdmin =
    isThreadVerified &&
    !isOfficerDirectThread &&
    (currentVerification?.approverRole === 'ADMIN' ||
      currentVerification?.reviewedBy?.toLowerCase().includes('admin') ||
      currentVerification?.reviewedBy?.toLowerCase().includes('dean') ||
      currentVerification?.reviewedBy?.toLowerCase().includes('shivakumar'));

  const isAdminOrSecurity =
    currentUser?.role === 'admin' || currentUser?.role === 'security';

  // Ensure current selected thread is not the logged in user themselves
  useEffect(() => {
    if (selectedThreadId) {
      const active = THREADS.find((t) => t.id === selectedThreadId);
      if (active && currentUser && active.userId === currentUser.id) {
        const available = THREADS.find((t) => !currentUser || t.userId !== currentUser.id);
        setSelectedThreadId(available ? available.id : null);
      }
    }
  }, [currentUser, selectedThreadId]);

  // Auto scroll to bottom on new message
  useEffect(() => {
    if (selectedThreadId) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, selectedThreadId]);

  // Filtered threads list
  const filteredThreads = useMemo(() => {
    return THREADS.filter((thread) => {
      if (currentUser && thread.userId === currentUser.id) return false;

      const matchesSearch =
        thread.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.itemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.ticket.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (chatFilter === 'unread') return (thread.unreadCount || 0) > 0;
      if (chatFilter === 'matches') return thread.category === 'match';
      if (chatFilter === 'security') return thread.category === 'security';
      return true;
    });
  }, [searchQuery, chatFilter, currentUser]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedThreadId) return;

    if (!isThreadVerified && !isAdminOrSecurity) {
      triggerToast('Admin or Officer approval is required before sending messages!', 'lock', 'warning');
      return;
    }

    sendChatMessage(selectedThreadId, inputText.trim());
    setInputText('');
  };

  const handleQuickChip = (text: string) => {
    if (!selectedThreadId) return;
    if (!isThreadVerified && !isAdminOrSecurity) {
      triggerToast('Take Admin or Officer approval first to enable chat responses.', 'lock', 'warning');
      return;
    }
    sendChatMessage(selectedThreadId, text);
  };

  const handleTakeOfficerApproval = () => {
    if (!selectedThreadId) return;
    updateVerificationStatus(
      selectedThreadId,
      'VERIFIED',
      `Match verification certified at Gate 1 post by Officer R. Nair. Messaging access authorized for ${activeThread?.name}.`,
      'Verification Officer R. Nair (Badge #CS-409)',
      'OFFICER'
    );
  };

  const handleTakeAdminApproval = () => {
    if (!selectedThreadId) return;
    updateVerificationStatus(
      selectedThreadId,
      'VERIFIED',
      `Administrative ownership verification approved under Dean of Student Welfare records. Messaging access authorized for ${activeThread?.name}.`,
      'Admin Dr. N. Shivakumar (Dean of Student Welfare)',
      'ADMIN'
    );
  };

  const handleRejectChat = () => {
    if (!selectedThreadId) return;
    const isAdm = currentUser?.role === 'admin';
    const reviewer = isAdm
      ? 'Admin Dr. N. Shivakumar (Dean of Student Welfare)'
      : 'Verification Officer R. Nair (Badge #CS-409)';
    const role = isAdm ? 'ADMIN' : 'OFFICER';
    updateVerificationStatus(
      selectedThreadId,
      'REJECTED',
      `Evidence submitted for ${activeThread?.itemTitle || 'item'} did not match custody records. Chat request rejected by ${reviewer}.`,
      reviewer,
      role
    );
  };

  const handleRequestChatApproval = () => {
    if (!selectedThreadId) return;
    requestChatApproval(selectedThreadId);
  };

  const isBothConfirmed =
    Boolean(currentHandover?.ownerConfirmed && currentHandover?.finderConfirmed);

  // Sidebar Chats List Component
  const renderChatList = () => (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 select-none">
      {/* Top Header */}
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          {!isModal && (
            <button
              onClick={goBack}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-slate-300 hover:text-white shrink-0"
              title="Back"
              aria-label="Back"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
          )}
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center font-bold text-indigo-300 shrink-0">
            <span className="material-symbols-outlined text-[18px]">forum</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="font-heading font-bold text-sm tracking-tight leading-tight text-white">
                Handover Dispatches
              </h2>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/20">
                Encrypted
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {isAdminOrSecurity ? 'Security & Custody Oversight' : 'Verified Handover Channels'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-300">
          <button
            onClick={() => setShowCredsModal(true)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-slate-300 hover:text-white"
            title="Campus Demo Credentials Hub"
          >
            <span className="material-symbols-outlined text-[18px]">badge</span>
          </button>
          <button
            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-slate-300 hover:text-white"
            title="Options"
          >
            <span className="material-symbols-outlined text-[18px]">more_vert</span>
          </button>

          {isModal && (
            <button
              onClick={() => (onClose ? onClose() : closeChatModal())}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-slate-300 hover:text-white ml-1"
              title="Close"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Observer Banner */}
      {isAdminOrSecurity && (
        <div className="bg-slate-800 text-indigo-200 px-3.5 py-2 text-[11px] flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-indigo-400">
              admin_panel_settings
            </span>
            <span className="font-semibold text-white">Oversight Mode:</span>
            <span>Monitoring campus custody channels</span>
          </div>
          <span className="text-xs bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-bold px-1.5 py-0.5 rounded">
            Live Gate Post
          </span>
        </div>
      )}

      {/* Demo Credentials Switcher Hub */}
      <div className="bg-slate-50 px-3 py-2 border-b border-slate-200">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
            <span className="material-symbols-outlined text-[14px] text-indigo-600">switch_account</span>
            <span>Perspective Switcher</span>
          </div>
          <button
            onClick={() => setShowCredsModal(true)}
            className="text-[10.5px] text-indigo-600 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>All 5 Roles</span>
            <span className="material-symbols-outlined text-[12px]">open_in_new</span>
          </button>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {DEMO_CREDENTIALS_LIST.map((cred) => {
            const isCurrent = currentUser?.id === cred.userId;
            return (
              <button
                key={cred.roleKey}
                onClick={() => {
                  switchUserRole(cred.roleKey);
                  triggerToast(`Logged in as ${cred.name} (${cred.credential})`, 'verified_user', 'success');
                }}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all shrink-0 cursor-pointer border ${
                  isCurrent
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                title={`Switch to ${cred.name} (${cred.credential})`}
              >
                <img
                  src={cred.avatar}
                  alt={cred.name}
                  className="w-4 h-4 rounded-full object-cover shrink-0"
                />
                <span className="truncate max-w-[70px]">{cred.name.split(' ')[0]}</span>
                <span className={`text-[10px] font-mono px-1 py-0.5 rounded ${
                  isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {cred.credential.replace('USN: ', '').replace('EMP: ', '').replace('BADGE #', '#')}
                </span>
                {isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3 bg-slate-50/50 border-b border-slate-200">
        <div className="relative flex items-center bg-white rounded-xl px-3 py-1.5 border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/15 transition-all shadow-2xs">
          <span className="material-symbols-outlined text-[17px] text-slate-400 mr-2 shrink-0">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student or item..."
            className="w-full text-xs text-slate-800 placeholder-slate-400 outline-none bg-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">close</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mt-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread' },
            { id: 'matches', label: 'Matches' },
            { id: 'security', label: 'Security Desk' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setChatFilter(pill.id as any)}
              className={`px-2.5 py-1 rounded-lg text-[10.5px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                chatFilter === pill.id
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {filteredThreads.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-1">
            <span className="material-symbols-outlined text-[32px] text-slate-300">chat_bubble_outline</span>
            <p className="text-xs font-semibold text-slate-600">No channels found</p>
            <p className="text-[11px]">Adjust your search query or filters</p>
          </div>
        ) : (
          filteredThreads.map((thread) => {
            const isSelected = thread.id === selectedThreadId;
            const threadMsgs = chatMessages[thread.id] || [];
            const lastMsg = threadMsgs[threadMsgs.length - 1];
            const isOfficer = thread.id === 'chat_security' || thread.id === 'chat_admin';
            const threadVer = verifications[thread.id];
            const isVer = isOfficer || threadVer?.status === 'VERIFIED';
            const isRej = !isOfficer && threadVer?.status === 'REJECTED';
            const isPending = !isOfficer && (threadVer?.status === 'UNDER_REVIEW' || threadVer?.status === 'SUBMITTED');

            return (
              <button
                key={thread.id}
                onClick={() => setSelectedThreadId(thread.id)}
                className={`w-full p-3 flex items-center gap-3 text-left transition-all cursor-pointer border-l-3 ${
                  isSelected
                    ? 'bg-indigo-50/70 border-l-indigo-600'
                    : 'hover:bg-slate-50 bg-white border-l-transparent'
                }`}
              >
                {/* Contact Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={thread.avatar}
                    alt={thread.name}
                    className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-200 shadow-2xs"
                  />
                  {thread.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                  )}
                </div>

                {/* Conversation Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-semibold text-xs text-slate-900 truncate">
                        {thread.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200 shrink-0">
                        {thread.credentialIdentifier}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium shrink-0">
                      {lastMsg ? lastMsg.timestamp : 'Today'}
                    </span>
                  </div>

                  {/* Subtitle / Case item */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate mt-0.5">
                    <span className="font-medium text-slate-700 shrink-0">
                      [{thread.ticket}]
                    </span>
                    <span className="truncate">{thread.itemTitle}</span>
                  </div>

                  {/* Last message snippet & status badge */}
                  <div className="flex items-center justify-between gap-1 mt-1">
                    <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-indigo-500">
                        done_all
                      </span>
                      <span className="truncate">
                        {lastMsg ? lastMsg.content : 'Handover channel active'}
                      </span>
                    </p>

                    <div className="flex items-center gap-1 shrink-0">
                      {isVer ? (
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Verified
                        </span>
                      ) : isRej ? (
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                          Declined
                        </span>
                      ) : isPending ? (
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          Pending
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          Locked
                        </span>
                      )}

                      {(thread.unreadCount || 0) > 0 && (
                        <span className="min-w-4 h-4 px-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                          {thread.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
        <span className="material-symbols-outlined text-[12px] text-slate-400">verified_user</span>
        <span>PESCE Physical Custody Verification Protocol</span>
      </div>
    </div>
  );

  // Conversation Canvas Component
  const renderConversation = () => {
    if (!activeThread) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 p-8 text-center select-none">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center mb-3 shadow-xs">
            <span className="material-symbols-outlined text-[32px]">handshake</span>
          </div>
          <h3 className="font-heading text-lg font-bold text-slate-900">
            Handover & Custody Dispatch Bridge
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
            Select a verified match to coordinate safe physical exchanges, inspect evidence, and log dual sign-offs at Gate 1.
          </p>
          <div className="mt-5 flex items-center gap-1.5 text-[11px] text-slate-400 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
            <span className="material-symbols-outlined text-[14px] text-emerald-600">lock</span>
            <span>Protected under PES College Student Trust Protocol</span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col bg-slate-100/60 relative min-h-0 overflow-hidden">
        {/* Top Chat Header */}
        <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0 shadow-2xs z-10">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSelectedThreadId(null)}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-slate-500 md:hidden"
              title="Back to channels"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>

            <div className="relative shrink-0">
              <img
                src={activeThread.avatar}
                alt={activeThread.name}
                className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
              />
              {activeThread.isOnline && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-heading font-bold text-sm text-slate-900 truncate leading-tight">
                  {activeThread.name}
                </h3>
                <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                  {activeThread.credentialIdentifier}
                </span>
                <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded shrink-0">
                  {activeThread.role}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {activeThread.isOnline ? 'Active now' : 'Seen recently'} • {activeThread.dept}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-500 shrink-0">
            <button
              onClick={() => setShowItemDetailsDrawer(!showItemDetailsDrawer)}
              className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold ${
                showItemDetailsDrawer
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="View Item Evidence & Custody Specs"
            >
              <span className="material-symbols-outlined text-[17px]">inventory_2</span>
              <span className="hidden sm:inline">Case Details</span>
            </button>
            <button
              onClick={() =>
                triggerToast(
                  `Designated Handover Post: ${activeThread.location}`,
                  'pin_drop',
                  'info'
                )
              }
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-slate-600 hover:text-slate-900"
              title="Meetup Location"
            >
              <span className="material-symbols-outlined text-[19px]">pin_drop</span>
            </button>
            {isModal && (
              <button
                onClick={() => (onClose ? onClose() : closeChatModal())}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-slate-600 hover:text-slate-900 ml-1"
                title="Close"
              >
                <span className="material-symbols-outlined text-[19px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* PINNED CASE HERO RAIL (Edge-to-Edge Visual Anchor) */}
        <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between gap-3 text-xs shrink-0 shadow-xs border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            {activeThread.itemPhoto ? (
              <img
                src={activeThread.itemPhoto}
                alt={activeThread.itemTitle}
                className="w-10 h-10 rounded-lg object-cover ring-1 ring-white/20 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                <span className="material-symbols-outlined text-[20px]">devices</span>
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-indigo-300 font-bold bg-indigo-500/20 px-1.5 py-0.2 rounded border border-indigo-400/20">
                  {activeThread.ticket}
                </span>
                <p className="font-semibold text-white text-xs truncate">
                  {activeThread.itemTitle}
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10.5px] text-slate-300 truncate mt-0.5">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px] text-slate-400">location_on</span>
                  <span>{activeThread.location}</span>
                </span>
                <span className="text-slate-500">•</span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <span className="material-symbols-outlined text-[11px]">verified</span>
                  <span>Custody Tracked</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {currentHandover && (
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isBothConfirmed
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {isBothConfirmed ? 'RETURNED & CERTIFIED' : 'HANDOVER IN PROGRESS'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* EXPANDABLE CASE EVIDENCE DRAWER */}
        {showItemDetailsDrawer && (
          <div className="bg-slate-800 text-slate-200 border-b border-slate-700 px-4 py-3 text-xs animate-in slide-in-from-top-2 duration-150 shrink-0">
            <div className="flex items-start justify-between gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                    Physical Custody
                  </span>
                  <p className="text-white font-medium text-xs mt-0.5">{activeThread.location}</p>
                  <span className="text-[10px] text-slate-400">Security Log: Vault #CS-04</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                    Encrypted Evidence
                  </span>
                  <p className="text-amber-300 font-mono font-medium text-xs mt-0.5">S/N: PF-284920-X1</p>
                  <span className="text-[10px] text-slate-400">Decal: Silver PESCE AI Lab</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                    Protocol Officer
                  </span>
                  <p className="text-white font-medium text-xs mt-0.5">Officer R. Nair</p>
                  <span className="text-[10px] text-indigo-300 font-mono">BADGE #CS-409</span>
                </div>
              </div>
              <button
                onClick={() => setShowItemDetailsDrawer(false)}
                className="text-slate-400 hover:text-white p-1"
                title="Collapse drawer"
              >
                <span className="material-symbols-outlined text-[16px]">expand_less</span>
              </button>
            </div>
          </div>
        )}

        {/* REAL-WORLD HANDOVER TIMELINE STEPPER */}
        <div className="bg-white border-b border-slate-200 px-4 py-2 shrink-0">
          <div className="flex items-center justify-between max-w-2xl mx-auto text-[10.5px]">
            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[11px] font-bold">✓</span>
              <span>Match Correlated</span>
            </div>
            <div className="h-0.5 flex-1 mx-2 bg-emerald-200" />
            <div className={`flex items-center gap-1.5 ${isThreadVerified ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                isThreadVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
              }`}>
                {isThreadVerified ? '✓' : '2'}
              </span>
              <span>Officer Clearance</span>
            </div>
            <div className={`h-0.5 flex-1 mx-2 ${isThreadVerified ? 'bg-emerald-200' : 'bg-slate-200'}`} />
            <div className={`flex items-center gap-1.5 ${isThreadVerified ? 'text-indigo-600 font-semibold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                isThreadVerified ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
              }`}>
                3
              </span>
              <span>Gate 1 Kiosk Meetup</span>
            </div>
            <div className={`h-0.5 flex-1 mx-2 ${isBothConfirmed ? 'bg-emerald-200' : 'bg-slate-200'}`} />
            <div className={`flex items-center gap-1.5 ${isBothConfirmed ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                isBothConfirmed ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {isBothConfirmed ? '★' : '4'}
              </span>
              <span>Dual Attestation</span>
            </div>
          </div>
        </div>

        {/* CELEBRATION RETURN MOMENT BANNER (When Both Parties Confirm) */}
        {isBothConfirmed && (
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white px-4 py-3 shrink-0 shadow-md animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-amber-300 text-[22px] shrink-0 shadow-inner">
                  🎉
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-sm tracking-tight text-white flex items-center gap-2 justify-center sm:justify-start">
                    <span>BELONGING SAFELY RESTORED TO OWNER!</span>
                    <span className="text-[10px] bg-amber-400 text-slate-900 font-bold px-2 py-0.2 rounded-full">
                      +50 KARMA
                    </span>
                  </h4>
                  <p className="text-[11.5px] text-emerald-100 mt-0.5">
                    Dual signature attested. Chain of custody officially closed under PESCE Trust Protocol.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openCertModal()}
                  className="px-3 py-1.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[15px] text-amber-600">workspace_premium</span>
                  <span>Dean's Certificate</span>
                </button>
                <button
                  onClick={() => setActiveTab('heroes')}
                  className="px-3 py-1.5 bg-emerald-800/60 hover:bg-emerald-800/80 text-white rounded-xl font-semibold text-xs transition-all border border-emerald-400/30 cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">military_tech</span>
                  <span>Leaderboard</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DUAL CONFIRMATION KIOSK PROTOCOL DECK */}
        {currentHandover && (
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 shrink-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[18px] text-indigo-600 shrink-0">
                  how_to_reg
                </span>
                <div>
                  <span className="font-bold text-xs text-slate-800">
                    Dual Confirmation Kiosk Protocol:
                  </span>
                  <span className="text-[11px] text-slate-500 ml-1.5">
                    Physical handover requires both owner and finder confirmation.
                  </span>
                </div>
              </div>

              {/* Protocol Sign-off Buttons */}
              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                {/* Owner confirmation toggle */}
                <button
                  onClick={() => confirmReturnParty(activeThread.id, 'owner')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                    currentHandover.ownerConfirmed
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                  }`}
                  title="Owner: Sarah J. confirms receipt of laptop"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {currentHandover.ownerConfirmed ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span>Owner (Sarah): {currentHandover.ownerConfirmed ? 'Received ✓' : 'Confirm Receipt'}</span>
                </button>

                {/* Finder confirmation toggle */}
                <button
                  onClick={() => confirmReturnParty(activeThread.id, 'finder')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                    currentHandover.finderConfirmed
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                  }`}
                  title="Finder: Rahul K. confirms handover of laptop"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {currentHandover.finderConfirmed ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  <span>Finder (Rahul): {currentHandover.finderConfirmed ? 'Handed Over ✓' : 'Confirm Handover'}</span>
                </button>

                {/* Officer Attestation */}
                {isAdminOrSecurity && (
                  <button
                    onClick={() => confirmReturnParty(activeThread.id, 'security')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                      currentHandover.officerWitnessed
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                    }`}
                    title="Campus Security certifies physical handover witnessed at Gate 1"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {currentHandover.officerWitnessed ? 'verified' : 'security'}
                    </span>
                    <span>Officer: {currentHandover.officerWitnessed ? 'Witnessed ✓' : 'Witness Handover'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Verification Authority Gate (Rejection / Pending / Approval Banners) */}
        {isThreadRejected ? (
          <div className="bg-rose-50 border-b border-rose-200 px-4 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shrink-0 text-xs text-rose-900">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-rose-600 shrink-0">
                cancel
              </span>
              <div>
                <span className="font-bold text-rose-800">Status: REJECTED</span>
                <span className="text-rose-700 ml-1.5">
                  Verification declined by {currentVerification?.reviewedBy || 'Officer R. Nair'}. Direct student messaging is locked.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto">
              {currentUser?.role === 'admin' ? (
                <button
                  onClick={handleTakeAdminApproval}
                  className="flex-1 sm:flex-none px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px] rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">verified_user</span>
                  Approve as Admin
                </button>
              ) : currentUser?.role === 'security' ? (
                <button
                  onClick={handleTakeOfficerApproval}
                  className="flex-1 sm:flex-none px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Approve as Officer
                </button>
              ) : (
                <button
                  onClick={handleRequestChatApproval}
                  className="flex-1 sm:flex-none px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">send</span>
                  Re-Submit Request
                </button>
              )}
            </div>
          </div>
        ) : isThreadUnderReview ? (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shrink-0 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-amber-600 shrink-0">
                hourglass_top
              </span>
              <div>
                <span className="font-bold text-amber-900">Status: PENDING REVIEW</span>
                <span className="text-amber-800 ml-1.5">
                  Evidence logged for Gate 1 Security Desk & Dean Office review. Direct chat unlocks upon officer approval.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto">
              {currentUser?.role === 'admin' ? (
                <>
                  <button
                    onClick={handleTakeAdminApproval}
                    className="flex-1 sm:flex-none px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px] rounded-lg shadow-2xs cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">verified_user</span>
                    Approve as Admin
                  </button>
                  <button
                    onClick={handleRejectChat}
                    className="flex-1 sm:flex-none px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] rounded-lg shadow-2xs cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">cancel</span>
                    Reject
                  </button>
                </>
              ) : currentUser?.role === 'security' ? (
                <>
                  <button
                    onClick={handleTakeOfficerApproval}
                    className="flex-1 sm:flex-none px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] rounded-lg shadow-2xs cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    Approve as Officer
                  </button>
                  <button
                    onClick={handleRejectChat}
                    className="flex-1 sm:flex-none px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[11px] rounded-lg shadow-2xs cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">cancel</span>
                    Reject
                  </button>
                </>
              ) : (
                <span className="text-[11px] font-semibold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-md">
                  Awaiting Officer Decision
                </span>
              )}
            </div>
          </div>
        ) : !isThreadVerified ? (
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shrink-0 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-slate-400 shrink-0">
                lock
              </span>
              <span className="text-[11.5px] text-slate-600">
                {currentUser?.role === 'admin'
                  ? 'Administrator authority active: Review claim credentials to authorize chat.'
                  : currentUser?.role === 'security'
                  ? 'Gate 1 Security Officer authority: Verify physical custody to authorize chat.'
                  : 'Direct student messaging is locked. Submit verification request to Gate 1 security desk.'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto">
              {currentUser?.role === 'admin' ? (
                <button
                  onClick={handleTakeAdminApproval}
                  className="flex-1 sm:flex-none px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px] rounded-lg shadow-2xs cursor-pointer flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">verified_user</span>
                  Approve as Admin
                </button>
              ) : currentUser?.role === 'security' ? (
                <button
                  onClick={handleTakeOfficerApproval}
                  className="flex-1 sm:flex-none px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] rounded-lg shadow-2xs cursor-pointer flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  Approve as Officer
                </button>
              ) : (
                <button
                  onClick={handleRequestChatApproval}
                  className="flex-1 sm:flex-none px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px] rounded-lg shadow-2xs cursor-pointer flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">send</span>
                  Request Officer Approval
                </button>
              )}
            </div>
          </div>
        ) : (
          <div
            className={`px-4 py-2 border-b flex items-center justify-between text-[11px] shrink-0 ${
              isApprovedByAdmin
                ? 'bg-purple-50/80 border-purple-200 text-purple-900'
                : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
            }`}
          >
            <div className="flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
              <span>
                {isOfficerDirectThread
                  ? 'Official Campus Security Direct Line (Officer R. Nair, Badge #CS-409)'
                  : isApprovedByAdmin
                  ? `Authorized by Admin (${currentVerification?.reviewedBy || 'Dean Dr. N. Shivakumar'}) • Direct Channel Active`
                  : `Authorized by Verification Officer (${currentVerification?.reviewedBy || 'Officer R. Nair, Badge #CS-409'}) • Direct Channel Active`}
              </span>
            </div>

            {!isOfficerDirectThread && (
              <div className="flex items-center gap-2 text-[10.5px]">
                <button
                  onClick={handleRejectChat}
                  className="text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
                >
                  Reject Claim
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={() => {
                    updateVerificationStatus(activeThread?.id || selectedThreadId, 'UNDER_REVIEW', 'Reset to Under Review for verification testing.');
                    triggerToast('Thread reset to Pending Review.', 'hourglass_top', 'info');
                  }}
                  className="text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Reset Status
                </button>
              </div>
            )}
          </div>
        )}

        {/* Message Canvas Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Security Notice */}
          <div className="flex justify-center my-1">
            <div className="bg-white/90 border border-slate-200/80 rounded-xl px-3.5 py-2 max-w-md text-center text-[11px] text-slate-500 shadow-2xs flex items-center gap-2 leading-relaxed">
              <span className="material-symbols-outlined text-[15px] text-indigo-600 shrink-0">
                lock
              </span>
              <span>
                All communications are recorded for campus security verification at Gate 1 post.
              </span>
            </div>
          </div>

          {/* Date Separator */}
          <div className="flex justify-center my-2">
            <span className="bg-slate-200/80 text-[10px] font-semibold text-slate-600 uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              Today
            </span>
          </div>

          {/* Messages */}
          {messages.map((msg) => {
            const isMe =
              msg.senderId === currentUser?.id ||
              msg.senderName.includes(currentUser?.displayName.split(' ')[0] || '');

            if (msg.isSystemNotice) {
              return (
                <div key={msg.id} className="flex justify-center my-1.5">
                  <div className="bg-indigo-50/80 border border-indigo-100 text-indigo-800 px-3.5 py-1.5 rounded-xl text-[11px] font-medium shadow-2xs flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-indigo-600">verified_user</span>
                    <span>{msg.content} • {msg.timestamp}</span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <img
                    src={activeThread.avatar}
                    alt={msg.senderName}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 shrink-0 mb-1"
                  />
                )}

                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-xs shadow-2xs relative ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                  }`}
                >
                  {!isMe && (
                    <p className="font-semibold text-[10.5px] text-indigo-600 mb-0.5">
                      {msg.senderName}
                    </p>
                  )}

                  <p className="whitespace-pre-wrap leading-relaxed pr-12">{msg.content}</p>

                  <div className={`flex items-center justify-end gap-1 mt-1 text-[11px] ${
                    isMe ? 'text-indigo-200' : 'text-slate-400'
                  }`}>
                    <span>{msg.timestamp}</span>
                    {isMe && (
                      <span className="material-symbols-outlined text-[13px] text-white">
                        done_all
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Response Chips */}
        {isThreadVerified && (
          <div className="px-4 py-2 bg-white/80 border-t border-slate-200 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {[
              '👋 Hi, is this item still at Gate 1?',
              '📍 Can we meet at Gate 1 Kiosk now?',
              '🔍 Verified my USN 4PS23CS084 matches!',
              '⏰ I am outside CS Block now',
              '🎉 Thanks a lot for safely returning it!',
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickChip(chip)}
                className="px-3 py-1 rounded-full bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 text-slate-600 text-[11px] whitespace-nowrap transition-colors cursor-pointer shadow-2xs"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Bottom Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          {isThreadVerified ? (
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => triggerToast('Emoji picker ready', 'mood', 'info')}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                title="Emojis"
              >
                <span className="material-symbols-outlined text-[20px]">mood</span>
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                  title="Attach verification document"
                >
                  <span className="material-symbols-outlined text-[20px]">attach_file</span>
                </button>

                {showAttachMenu && (
                  <div className="absolute bottom-12 left-0 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 space-y-1 w-52 z-30 text-xs animate-in fade-in">
                    <button
                      type="button"
                      onClick={() => {
                        triggerToast('Attached purchase invoice PDF to chat', 'description', 'info');
                        setShowAttachMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-800 font-medium text-left cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[17px] text-indigo-600">
                        description
                      </span>
                      <span>Invoice / Receipt PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerToast('Attached Smart ID card photo to chat', 'badge', 'info');
                        setShowAttachMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-800 font-medium text-left cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[17px] text-emerald-600">
                        badge
                      </span>
                      <span>PESCE Smart ID</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerToast('Shared Gate 1 Custody meetup coordinates', 'pin_drop', 'info');
                        setShowAttachMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-800 font-medium text-left cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[17px] text-rose-600">
                        pin_drop
                      </span>
                      <span>Gate 1 Kiosk Meetup</span>
                    </button>
                  </div>
                )}
              </div>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a verified message..."
                className="flex-1 px-4 py-2.5 bg-slate-50 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-all shadow-2xs"
              />

              {inputText.trim() ? (
                <button
                  type="submit"
                  className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-all active:scale-95 shadow-xs cursor-pointer shrink-0"
                  title="Send Message"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => triggerToast('Voice note recorded (2s sample)', 'mic', 'info')}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all active:scale-95 cursor-pointer shrink-0"
                  title="Record voice note"
                >
                  <span className="material-symbols-outlined text-[18px]">mic</span>
                </button>
              )}
            </form>
          ) : isThreadRejected ? (
            <div className="flex flex-col sm:flex-row items-center justify-between p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-rose-600">cancel</span>
                <span>
                  Status: <strong>Declined</strong>. Chat request rejected by {currentVerification?.reviewedBy || 'Officer R. Nair'}. Messaging is locked.
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {currentUser?.role === 'admin' ? (
                  <button
                    onClick={handleTakeAdminApproval}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Approve as Admin
                  </button>
                ) : currentUser?.role === 'security' ? (
                  <button
                    onClick={handleTakeOfficerApproval}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Approve as Officer
                  </button>
                ) : (
                  <button
                    onClick={handleRequestChatApproval}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Re-Send Request to Officers
                  </button>
                )}
              </div>
            </div>
          ) : isThreadUnderReview ? (
            <div className="flex flex-col sm:flex-row items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-amber-600">hourglass_top</span>
                <span>
                  Status: <strong>Under Review</strong>. Request logged with Gate 1 Security Desk. Awaiting officer confirmation...
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {currentUser?.role === 'admin' ? (
                  <>
                    <button
                      onClick={handleTakeAdminApproval}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Approve as Admin
                    </button>
                    <button
                      onClick={handleRejectChat}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Reject
                    </button>
                  </>
                ) : currentUser?.role === 'security' ? (
                  <>
                    <button
                      onClick={handleTakeOfficerApproval}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Approve as Officer
                    </button>
                    <button
                      onClick={handleRejectChat}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span className="text-[11px] font-semibold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-md">
                    Under Review by Officers
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-slate-400">lock</span>
                <span>
                  {currentUser?.role === 'admin'
                    ? 'Administrator clearance active. Verify claim to unlock direct communication.'
                    : currentUser?.role === 'security'
                    ? 'Security Officer clearance active. Verify physical claim to unlock direct communication.'
                    : 'Direct communication requires Gate 1 security clearance before connecting.'}
                </span>
              </div>
              {currentUser?.role === 'admin' ? (
                <button
                  onClick={handleTakeAdminApproval}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer shrink-0"
                >
                  Approve as Admin
                </button>
              ) : currentUser?.role === 'security' ? (
                <button
                  onClick={handleTakeOfficerApproval}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer shrink-0"
                >
                  Approve as Officer
                </button>
              ) : (
                <button
                  onClick={handleRequestChatApproval}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer shrink-0"
                >
                  Request Chat Clearance
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`bg-slate-900/5 flex flex-col relative ${
        isFullScreen
          ? 'pt-16 pb-20 min-h-[calc(100vh-4rem)] max-w-6xl mx-auto w-full px-2 sm:px-4'
          : 'h-full max-h-[88vh] w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200'
      }`}
    >
      <div className="w-full flex-1 flex rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white min-h-[580px]">
        {/* Mobile View: Switch between list and active conversation */}
        <div className="w-full h-full flex md:hidden">
          {selectedThreadId === null ? (
            <div className="w-full h-full">{renderChatList()}</div>
          ) : (
            <div className="w-full h-full">{renderConversation()}</div>
          )}
        </div>

        {/* Desktop Split View: Master List on Left, Active Canvas on Right */}
        <div className="hidden md:flex w-full h-full">
          <div className="w-[360px] h-full shrink-0">{renderChatList()}</div>
          <div className="flex-1 h-full flex flex-col">{renderConversation()}</div>
        </div>
      </div>

      {/* Demo Credentials Modal */}
      {showCredsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 text-white px-4 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm leading-tight">Campus Demo Credentials Hub</h3>
                  <p className="text-[11px] text-slate-400">PES College of Engineering, Mandya</p>
                </div>
              </div>
              <button
                onClick={() => setShowCredsModal(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-slate-300 hover:text-white"
                title="Close"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto flex-1">
              <div className="bg-indigo-50/80 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-950 flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-indigo-600 shrink-0">info</span>
                <span>
                  Switch active session to simulate student owner, student finder, security officer, or dean perspectives.
                </span>
              </div>

              <div className="space-y-2">
                {DEMO_CREDENTIALS_LIST.map((cred) => {
                  const isCurrent = currentUser?.id === cred.userId;
                  return (
                    <div
                      key={cred.roleKey}
                      className={`p-3 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-indigo-50/50 border-indigo-300 ring-1 ring-indigo-200'
                          : 'bg-slate-50/60 border-slate-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-start gap-3 min-w-0">
                          <img
                            src={cred.avatar}
                            alt={cred.name}
                            className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 shrink-0 mt-0.5"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="font-bold text-slate-900 text-xs truncate">{cred.name}</h4>
                              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded border ${cred.badgeColor}`}>
                                {cred.role}
                              </span>
                              {isCurrent && (
                                <span className="text-[10px] font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded-full">
                                  Current Session
                                </span>
                              )}
                            </div>
                            <div className="mt-1 space-y-0.5 text-[11px] text-slate-600">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-medium text-slate-400">Credential:</span>
                                <span className="font-mono font-semibold text-slate-800 bg-white px-1.5 py-0.2 rounded border border-slate-200 text-[10.5px]">
                                  {cred.credential}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-medium text-slate-400">Email:</span>
                                <span className="text-slate-700 font-mono text-[10px]">{cred.email}</span>
                              </div>
                              <p className="text-[10px] text-slate-500">{cred.dept}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              switchUserRole(cred.roleKey);
                              triggerToast(`Switched login session to ${cred.name} (${cred.credential})`, 'verified_user', 'success');
                              setShowCredsModal(false);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                              isCurrent
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-2xs'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              {isCurrent ? 'check' : 'login'}
                            </span>
                            <span>{isCurrent ? 'Active' : 'Switch'}</span>
                          </button>

                          <button
                            onClick={() => {
                              setSelectedThreadId(cred.threadId);
                              setShowCredsModal(false);
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[10.5px] font-medium flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[13px] text-indigo-600">chat</span>
                            <span>Open</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-500 font-medium">5 verified demo roles ready</span>
              <button
                onClick={() => setShowCredsModal(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
