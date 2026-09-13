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
}

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
    location: 'Gate 1 Safe Exchange Kiosk (Locker B-12)',
    statusBadge: 'Match Correlated',
    isOnline: true,
    unreadCount: 1,
    category: 'match',
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
    updateVerificationStatus,
    goBack,
  } = useApp();

  // Selected thread. When on mobile, if null, shows WhatsApp Chats List.
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(
    initialThreadId || (isModal ? 'match_001' : null)
  );

  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatFilter, setChatFilter] = useState<'all' | 'unread' | 'matches' | 'security'>('all');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeThread = THREADS.find((t) => t.id === selectedThreadId);
  const messages = selectedThreadId ? chatMessages[selectedThreadId] || [] : [];
  const currentHandover = selectedThreadId ? handovers[selectedThreadId] : undefined;

  // Verification & Authority Approval Gate
  const isOfficerDirectThread = selectedThreadId === 'chat_security';
  const currentVerification = selectedThreadId ? verifications[selectedThreadId] : undefined;
  const isThreadVerified = isOfficerDirectThread || currentVerification?.status === 'VERIFIED';

  const isApprovedByAdmin =
    isThreadVerified &&
    !isOfficerDirectThread &&
    (currentVerification?.approverRole === 'ADMIN' ||
      currentVerification?.reviewedBy?.toLowerCase().includes('admin') ||
      currentVerification?.reviewedBy?.toLowerCase().includes('dean') ||
      currentVerification?.reviewedBy?.toLowerCase().includes('shivakumar'));

  const isApprovedByOfficer =
    isThreadVerified && !isOfficerDirectThread && !isApprovedByAdmin;

  const isAdminOrSecurity =
    currentUser?.role === 'admin' || currentUser?.role === 'security';

  // Auto scroll to bottom on new message
  useEffect(() => {
    if (selectedThreadId) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, selectedThreadId]);

  // Filtered threads list for WhatsApp chats menu
  const filteredThreads = useMemo(() => {
    return THREADS.filter((thread) => {
      // Search filter
      const matchesSearch =
        thread.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.itemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.ticket.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Category filter
      if (chatFilter === 'unread') return (thread.unreadCount || 0) > 0;
      if (chatFilter === 'matches') return thread.category === 'match';
      if (chatFilter === 'security') return thread.category === 'security';
      return true;
    });
  }, [searchQuery, chatFilter]);

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

  const isBothConfirmed =
    currentHandover?.ownerConfirmed && currentHandover?.finderConfirmed;

  // WhatsApp Chat List Component
  const renderChatList = () => (
    <div className="flex flex-col h-full bg-white border-r border-[#e9edef] select-none">
      {/* WhatsApp Green App Bar */}
      <div className="bg-[#008069] text-white px-3 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          {!isModal && (
            <button
              onClick={goBack}
              className="p-1.5 hover:bg-white/15 rounded-full transition-colors cursor-pointer text-white shrink-0"
              title="Back to Previous Screen"
              aria-label="Back"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
          )}
          <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center font-black text-white shrink-0">
            <span className="material-symbols-outlined text-[20px]">chat</span>
          </div>
          <div>
            <h2 className="font-heading font-bold text-base tracking-tight leading-tight flex items-center gap-1.5">
              <span>WhatsApp</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-white/20 text-white">
                Campus
              </span>
            </h2>
            <p className="text-[10.5px] text-white/80">
              {isAdminOrSecurity ? 'Admin Observation & Moderation' : 'Encrypted Student Messaging'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-white/90">
          <button
            onClick={() => triggerToast('Opening campus verification camera', 'photo_camera')}
            className="p-1.5 hover:bg-white/15 rounded-full transition-colors cursor-pointer"
            title="Camera"
          >
            <span className="material-symbols-outlined text-[20px]">photo_camera</span>
          </button>
          <button
            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
            className="p-1.5 hover:bg-white/15 rounded-full transition-colors cursor-pointer relative"
            title="Menu"
          >
            <span className="material-symbols-outlined text-[20px]">more_vert</span>
          </button>

          {isModal && (
            <button
              onClick={() => (onClose ? onClose() : closeChatModal())}
              className="p-1.5 hover:bg-white/15 rounded-full transition-colors cursor-pointer ml-1"
              title="Close"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Observer Banner */}
      {isAdminOrSecurity && (
        <div className="bg-[#0b1c30] text-emerald-300 px-3.5 py-2 text-[11px] flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-emerald-400">
              admin_panel_settings
            </span>
            <span className="font-semibold text-white">Admin POV:</span>
            <span>Observing all student chats</span>
          </div>
          <span className="text-[9.5px] bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold px-1.5 py-0.5 rounded">
            Live Stream
          </span>
        </div>
      )}

      {/* WhatsApp Search Bar */}
      <div className="p-2.5 bg-[#f0f2f5] border-b border-[#e9edef]">
        <div className="relative flex items-center bg-white rounded-lg px-3 py-1.5 shadow-xs border border-transparent focus-within:border-[#00a884]">
          <span className="material-symbols-outlined text-[18px] text-[#54656f] mr-2 shrink-0">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search or start new chat"
            className="w-full text-xs text-[#111b21] placeholder-[#667781] outline-none bg-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#667781] hover:text-[#111b21] text-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* WhatsApp Filter Pills */}
        <div className="flex items-center gap-1.5 mt-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread' },
            { id: 'matches', label: 'Matches' },
            { id: 'security', label: 'Security' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setChatFilter(pill.id as any)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                chatFilter === pill.id
                  ? 'bg-[#008069] text-white shadow-xs'
                  : 'bg-white text-[#54656f] hover:bg-[#e9edef] border border-slate-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* WhatsApp Vertical Chats List (No horizontal sliding bar!) */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#f2f2f2]">
        {filteredThreads.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-1">
            <span className="material-symbols-outlined text-[32px] text-slate-300">chat_bubble_outline</span>
            <p className="text-xs font-semibold text-slate-600">No chats found</p>
            <p className="text-[11px]">Try adjusting your search or filter</p>
          </div>
        ) : (
          filteredThreads.map((thread) => {
            const isSelected = thread.id === selectedThreadId;
            const threadMsgs = chatMessages[thread.id] || [];
            const lastMsg = threadMsgs[threadMsgs.length - 1];
            const isOfficer = thread.id === 'chat_security';
            const threadVer = verifications[thread.id];
            const isVer = isOfficer || threadVer?.status === 'VERIFIED';
            const threadApprovedByAdmin =
              isVer &&
              !isOfficer &&
              (threadVer?.approverRole === 'ADMIN' ||
                threadVer?.reviewedBy?.toLowerCase().includes('admin') ||
                threadVer?.reviewedBy?.toLowerCase().includes('dean') ||
                threadVer?.reviewedBy?.toLowerCase().includes('shivakumar'));
            const threadApprovedByOfficer = isVer && !isOfficer && !threadApprovedByAdmin;

            return (
              <button
                key={thread.id}
                onClick={() => setSelectedThreadId(thread.id)}
                className={`w-full p-3 flex items-center gap-3 text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#f0f2f5] border-l-4 border-[#00a884]'
                    : 'hover:bg-[#f5f6f6] bg-white'
                }`}
              >
                {/* Circular Contact Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={thread.avatar}
                    alt={thread.name}
                    className="w-12 h-12 rounded-full object-cover ring-1 ring-slate-200 shadow-xs"
                  />
                  {thread.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25d366] rounded-full border-2 border-white" />
                  )}
                </div>

                {/* Conversation Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs text-[#111b21] truncate">
                      {thread.name}
                    </span>
                    <span className="text-[10px] text-[#667781] font-medium shrink-0">
                      {lastMsg ? lastMsg.timestamp : 'Today'}
                    </span>
                  </div>

                  {/* Subtitle / Department & Item */}
                  <div className="flex items-center gap-1.5 text-[11px] text-[#54656f] truncate mt-0.5">
                    <span className="font-semibold text-emerald-800 shrink-0">
                      [{thread.itemTitle.split(' ')[0]}]
                    </span>
                    <span className="truncate">{thread.itemTitle}</span>
                  </div>

                  {/* Last Message Snippet with WhatsApp Double Tick */}
                  <div className="flex items-center justify-between gap-1 mt-0.5">
                    <p className="text-[11px] text-[#667781] truncate flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-[#53bdeb]">
                        done_all
                      </span>
                      <span>
                        {lastMsg ? lastMsg.content : 'Chat session started'}
                      </span>
                    </p>

                    {/* Verified Status Tag or Unread Badge */}
                    <div className="flex items-center gap-1 shrink-0">
                      {isVer ? (
                        <span
                          className={`text-[8.5px] font-black uppercase px-1.5 py-0.2 rounded ${
                            isOfficer
                              ? 'bg-blue-100 text-blue-800'
                              : threadApprovedByAdmin
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isOfficer ? 'OFFICER' : threadApprovedByAdmin ? 'ADMIN' : 'OFFICER'}
                        </span>
                      ) : (
                        <span className="text-[8.5px] font-bold uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">
                          🔒 LOCKED
                        </span>
                      )}

                      {(thread.unreadCount || 0) > 0 && (
                        <span className="w-4 h-4 rounded-full bg-[#25d366] text-white text-[9.5px] font-bold flex items-center justify-center">
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

      {/* WhatsApp Footer Status */}
      <div className="p-2.5 bg-[#f0f2f5] border-t border-[#e9edef] text-center text-[10px] text-[#54656f] flex items-center justify-center gap-1">
        <span className="material-symbols-outlined text-[12px] text-[#008069]">lock</span>
        <span>End-to-end encrypted • PESCE Security Protocol</span>
      </div>
    </div>
  );

  // WhatsApp Conversation Canvas Component
  const renderConversation = () => {
    if (!activeThread) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#f0f2f5] p-8 text-center select-none border-b-8 border-[#008069]">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#008069] flex items-center justify-center mb-4 shadow-sm">
            <span className="material-symbols-outlined text-[42px]">chat</span>
          </div>
          <h3 className="font-heading text-xl font-bold text-[#111b21]">
            WhatsApp for PESCE Campus
          </h3>
          <p className="text-xs text-[#667781] max-w-sm mt-1.5 leading-relaxed">
            Select a student conversation from the list to view custody discussions, verify lost items, and safely coordinate returns.
          </p>
          <div className="mt-6 flex items-center gap-1 text-[11px] text-[#8696a0]">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            <span>Messages are protected under the PES College Trust Protocol</span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col bg-[#efeae2] relative min-h-0 overflow-hidden">
        {/* WhatsApp Top Chat Header */}
        <div className="bg-[#008069] text-white px-3 py-2.5 flex items-center justify-between shrink-0 shadow-xs z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Back Button (Returns to WhatsApp Chats List) */}
            <button
              onClick={() => setSelectedThreadId(null)}
              className="p-1 hover:bg-white/15 rounded-full transition-colors cursor-pointer"
              title="Back to chats"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>

            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={activeThread.avatar}
                alt={activeThread.name}
                className="w-10 h-10 rounded-full object-cover border border-white/30"
              />
              {activeThread.isOnline && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#25d366] rounded-full border-2 border-[#008069]" />
              )}
            </div>

            {/* Contact Name & Subtitle */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-heading font-bold text-sm text-white truncate leading-tight">
                  {activeThread.name}
                </h3>
                <span className="text-[9px] font-bold bg-white/20 text-white px-1.5 py-0.2 rounded-full shrink-0">
                  {activeThread.role}
                </span>
              </div>
              <p className="text-[10.5px] text-white/80 truncate">
                {activeThread.isOnline ? 'online' : 'last seen today at 4:32 PM'} • {activeThread.dept}
              </p>
            </div>
          </div>

          {/* Action Icons (Call, Video, Location, More) */}
          <div className="flex items-center gap-1 text-white/90 shrink-0">
            <button
              onClick={() =>
                triggerToast(
                  `Initiating encrypted voice call with ${activeThread.name} via PESCE Campus Gateway`,
                  'call'
                )
              }
              className="p-1.5 hover:bg-white/15 rounded-full transition-colors cursor-pointer"
              title="Voice Call"
            >
              <span className="material-symbols-outlined text-[20px]">call</span>
            </button>
            <button
              onClick={() =>
                triggerToast(
                  `Starting verified video stream with ${activeThread.name}`,
                  'videocam'
                )
              }
              className="p-1.5 hover:bg-white/15 rounded-full transition-colors cursor-pointer"
              title="Video Call"
            >
              <span className="material-symbols-outlined text-[20px]">videocam</span>
            </button>
            <button
              onClick={() =>
                triggerToast(
                  `Safe Handover Meetup Point: ${activeThread.location}`,
                  'location_on'
                )
              }
              className="p-1.5 hover:bg-white/15 rounded-full transition-colors cursor-pointer"
              title="Meetup Location"
            >
              <span className="material-symbols-outlined text-[20px]">pin_drop</span>
            </button>
            {isModal && (
              <button
                onClick={() => (onClose ? onClose() : closeChatModal())}
                className="p-1.5 hover:bg-white/15 rounded-full transition-colors cursor-pointer ml-1"
                title="Close"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Associated Case Context Banner */}
        <div className="bg-[#111b21] text-white px-3 py-2 flex items-center justify-between gap-3 text-xs shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            {activeThread.itemPhoto && (
              <img
                src={activeThread.itemPhoto}
                alt={activeThread.itemTitle}
                className="w-8 h-8 rounded-lg object-cover border border-white/20 shrink-0"
              />
            )}
            <div className="min-w-0">
              <p className="font-bold text-white text-xs truncate">
                Case {activeThread.ticket}: {activeThread.itemTitle}
              </p>
              <p className="text-[10px] text-slate-300 truncate">
                Meetup: {activeThread.location}
              </p>
            </div>
          </div>

          {/* Handover confirmation status button */}
          {currentHandover && (
            <button
              onClick={() => confirmReturnParty(activeThread.id, 'owner')}
              className={`px-3 py-1 rounded-lg font-bold text-[11px] shrink-0 transition-all cursor-pointer ${
                isBothConfirmed
                  ? 'bg-[#25d366] text-[#111b21] shadow-xs'
                  : currentHandover.ownerConfirmed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/20 hover:bg-white/30 text-white border border-white/20'
              }`}
            >
              {isBothConfirmed
                ? '✓ Return Completed'
                : currentHandover.ownerConfirmed
                ? '✓ You Confirmed'
                : 'Confirm Received'}
            </button>
          )}
        </div>

        {/* Authority Verification Bar */}
        {!isThreadVerified ? (
          <div className="bg-[#fff3c4] border-b border-[#ffe69c] px-3 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shrink-0 text-xs text-[#664d03]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-amber-700 shrink-0">
                lock
              </span>
              <span className="font-medium text-[11.5px]">
                Direct student chat locked until an Admin or Verification Officer approves the match claim.
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto">
              <button
                onClick={handleTakeOfficerApproval}
                className="flex-1 sm:flex-none px-2.5 py-1 bg-[#008069] hover:bg-[#006e59] text-white font-bold text-[11px] rounded-md shadow-xs transition-colors cursor-pointer"
              >
                Approve as Officer
              </button>
              <button
                onClick={handleTakeAdminApproval}
                className="flex-1 sm:flex-none px-2.5 py-1 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-[11px] rounded-md shadow-xs transition-colors cursor-pointer"
              >
                Approve as Admin
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`px-3 py-1.5 border-b flex items-center justify-between text-[11px] shrink-0 ${
              isApprovedByAdmin
                ? 'bg-indigo-50 border-indigo-200 text-indigo-950'
                : 'bg-emerald-50 border-emerald-200 text-emerald-950'
            }`}
          >
            <div className="flex items-center gap-1.5 font-semibold">
              <span className="material-symbols-outlined text-[15px] text-[#008069]">verified</span>
              <span>
                {isOfficerDirectThread
                  ? 'Official Campus Security Direct Line (Officer R. Nair, Badge #CS-409)'
                  : isApprovedByAdmin
                  ? `Approved by Admin (${currentVerification?.reviewedBy || 'Dr. N. Shivakumar, Dean of Student Welfare'}) • Chat Active`
                  : `Approved by Officer (${currentVerification?.reviewedBy || 'Officer R. Nair, Badge #CS-409'}) • Chat Active`}
              </span>
            </div>

            {!isOfficerDirectThread && (
              <div className="flex items-center gap-2 text-[10.5px]">
                <button
                  onClick={() => {
                    if (isApprovedByAdmin) handleTakeOfficerApproval();
                    else handleTakeAdminApproval();
                  }}
                  className="text-slate-600 hover:text-slate-900 underline font-medium cursor-pointer"
                >
                  Switch to {isApprovedByAdmin ? 'Officer' : 'Admin'}
                </button>
                <button
                  onClick={() => {
                    updateVerificationStatus(activeThread.id, 'UNDER_REVIEW', 'Re-locked to test approval flow.');
                    triggerToast('Thread re-locked to test gate.', 'lock', 'info');
                  }}
                  className="text-slate-400 hover:text-slate-700 underline cursor-pointer"
                >
                  Re-test
                </button>
              </div>
            )}
          </div>
        )}

        {/* WhatsApp Chat Canvas Wallpaper */}
        <div
          className="flex-1 overflow-y-auto p-3.5 space-y-2.5"
          style={{
            backgroundColor: '#efeae2',
            backgroundImage:
              'radial-gradient(#d1d7db 0.8px, transparent 0.8px), radial-gradient(#d1d7db 0.8px, #efeae2 0.8px)',
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px',
          }}
        >
          {/* WhatsApp Encrypted Center Notice */}
          <div className="flex justify-center my-1">
            <div className="bg-[#fff3c4]/90 border border-[#ffe69c] rounded-lg px-3 py-1.5 max-w-md text-center text-[10.5px] text-[#54656f] shadow-xs flex items-center gap-1.5 leading-snug">
              <span className="material-symbols-outlined text-[14px] text-[#008069] shrink-0">
                lock
              </span>
              <span>
                Messages and calls are end-to-end encrypted under PESCE Student Trust Protocol. No one outside of this chat can read them.
              </span>
            </div>
          </div>

          {/* Date Separator */}
          <div className="flex justify-center my-2">
            <span className="bg-white/90 shadow-xs text-[10px] font-bold text-[#54656f] uppercase px-2.5 py-0.5 rounded-md">
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
                  <div className="bg-[#e1f3fb] border border-[#b6e1f7] text-[#055160] px-3 py-1 rounded-lg text-[10.5px] font-medium shadow-xs">
                    🛡️ {msg.content} • {msg.timestamp}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <img
                    src={activeThread.avatar}
                    alt={msg.senderName}
                    className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0 mb-0.5"
                  />
                )}

                <div
                  className={`max-w-[80%] rounded-xl px-3 py-1.5 text-xs shadow-xs relative ${
                    isMe
                      ? 'bg-[#d9fdd3] text-[#111b21] rounded-tr-xs'
                      : 'bg-white text-[#111b21] rounded-tl-xs'
                  }`}
                >
                  {/* Sender Name in group */}
                  {!isMe && (
                    <p className="font-bold text-[10px] text-[#008069] mb-0.5">
                      {msg.senderName}
                    </p>
                  )}

                  <p className="whitespace-pre-wrap leading-relaxed pr-14">{msg.content}</p>

                  {/* Timestamp and Double Checkmark (WhatsApp style) */}
                  <div className="absolute bottom-1 right-2 flex items-center gap-0.5 text-[9.5px] text-[#667781]">
                    <span>{msg.timestamp}</span>
                    {isMe && (
                      <span className="material-symbols-outlined text-[13px] text-[#53bdeb]">
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

        {/* Quick Response Chips (WhatsApp format above text box) */}
        {isThreadVerified && (
          <div className="px-3 py-1.5 bg-[#f0f2f5] border-t border-[#e9edef] flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {[
              '👋 Hi, is this item still with you?',
              '📍 Meet at Gate 1 Kiosk?',
              '🔍 It has stickers on the palmrest',
              '⏰ I am outside CS Block now',
              '🎉 Thanks for returning it!',
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickChip(chip)}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 hover:text-[#008069] border border-slate-200 text-[#54656f] text-[11px] whitespace-nowrap transition-colors cursor-pointer shadow-xs"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* WhatsApp Bottom Input Bar */}
        <div className="p-2 bg-[#f0f2f5] border-t border-[#e9edef] shrink-0">
          {isThreadVerified ? (
            <form onSubmit={handleSend} className="flex items-center gap-1.5">
              {/* Emoji Icon */}
              <button
                type="button"
                onClick={() => triggerToast('Emoji keyboard available', 'mood')}
                className="p-2 text-[#54656f] hover:text-[#111b21] rounded-full hover:bg-white/60 transition-colors cursor-pointer"
                title="Emojis"
              >
                <span className="material-symbols-outlined text-[22px]">mood</span>
              </button>

              {/* Attachment Paperclip Icon */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  className="p-2 text-[#54656f] hover:text-[#111b21] rounded-full hover:bg-white/60 transition-colors cursor-pointer"
                  title="Attach verification document"
                >
                  <span className="material-symbols-outlined text-[22px]">attach_file</span>
                </button>

                {showAttachMenu && (
                  <div className="absolute bottom-12 left-0 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 space-y-1 w-48 z-30 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        triggerToast('Attached purchase invoice PDF to chat', 'description');
                        setShowAttachMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 text-[#111b21] font-medium text-left cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-indigo-600">
                        description
                      </span>
                      <span>Invoice / Receipt</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerToast('Attached ID card photo to chat', 'badge');
                        setShowAttachMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 text-[#111b21] font-medium text-left cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-emerald-600">
                        badge
                      </span>
                      <span>College Smart ID</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerToast('Shared Gate 1 Kiosk meetup pin', 'pin_drop');
                        setShowAttachMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 text-[#111b21] font-medium text-left cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px] text-rose-600">
                        pin_drop
                      </span>
                      <span>Gate 1 Kiosk Pin</span>
                    </button>
                  </div>
                )}
              </div>

              {/* WhatsApp Message Input Pill */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message"
                className="flex-1 px-4 py-2 bg-white rounded-full text-xs text-[#111b21] placeholder-[#667781] outline-none shadow-xs border border-transparent focus:border-[#00a884]"
              />

              {/* WhatsApp Circular Green Send Button */}
              {inputText.trim() ? (
                <button
                  type="submit"
                  className="w-10 h-10 rounded-full bg-[#008069] hover:bg-[#006e59] text-white flex items-center justify-center transition-transform active:scale-95 shadow-md cursor-pointer shrink-0"
                  title="Send"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => triggerToast('Voice note recorded (2s sample)', 'mic')}
                  className="w-10 h-10 rounded-full bg-[#008069] hover:bg-[#006e59] text-white flex items-center justify-center transition-transform active:scale-95 shadow-md cursor-pointer shrink-0"
                  title="Record voice note"
                >
                  <span className="material-symbols-outlined text-[20px]">mic</span>
                </button>
              )}
            </form>
          ) : (
            <div className="flex items-center justify-between p-2 bg-[#fff3c4] border border-[#ffe69c] rounded-xl text-xs text-[#664d03]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-amber-700">lock</span>
                <span>Messaging input is disabled until Admin or Officer approves verification.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleTakeOfficerApproval}
                  className="px-3 py-1 bg-[#008069] text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Approve as Officer
                </button>
                <button
                  onClick={handleTakeAdminApproval}
                  className="px-3 py-1 bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Approve as Admin
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`bg-[#111b21] flex flex-col ${
        isFullScreen
          ? 'pt-16 pb-20 min-h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full px-2 sm:px-4'
          : 'h-full max-h-[88vh] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200'
      }`}
    >
      {/* WhatsApp Frame Wrapper: Responsive Split View on Desktop, Single View on Mobile (Zero sliding bar!) */}
      <div className="w-full flex-1 flex rounded-2xl overflow-hidden shadow-xl border border-[#e9edef] bg-white min-h-[560px]">
        {/* Mobile: Switch between List and Conversation */}
        <div className="w-full h-full flex md:hidden">
          {selectedThreadId === null ? (
            <div className="w-full h-full">{renderChatList()}</div>
          ) : (
            <div className="w-full h-full">{renderConversation()}</div>
          )}
        </div>

        {/* Desktop / Tablet (WhatsApp Web Two-Column Format): Master List on Left, Active Chat on Right */}
        <div className="hidden md:flex w-full h-full">
          {/* Left Master Chats List (360px wide) */}
          <div className="w-[360px] h-full shrink-0">{renderChatList()}</div>

          {/* Right Active Conversation Canvas */}
          <div className="flex-1 h-full flex flex-col">{renderConversation()}</div>
        </div>
      </div>
    </div>
  );
};
