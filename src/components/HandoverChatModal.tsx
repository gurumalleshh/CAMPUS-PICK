import React from 'react';
import { useApp } from '../context/AppContext';
import { MessagingWindow } from './MessagingWindow';

export const HandoverChatModal: React.FC = () => {
  const { isChatModalOpen, closeChatModal, activeChatMatchId } = useApp();

  // Close on Escape key
  React.useEffect(() => {
    if (!isChatModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeChatModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isChatModalOpen, closeChatModal]);

  if (!isChatModalOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Campus Handover Chat Escrow"
      onClick={closeChatModal}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl lg:max-w-4xl h-[92vh] sm:h-[680px] flex flex-col shadow-2xl rounded-3xl overflow-hidden"
      >
        <MessagingWindow
          isModal={true}
          initialThreadId={activeChatMatchId || 'match_001'}
          onClose={closeChatModal}
        />
      </div>
    </div>
  );
};
