import React from 'react';
import { useApp } from '../context/AppContext';
import { MessagingWindow } from './MessagingWindow';

export const HandoverChatModal: React.FC = () => {
  const { isChatModalOpen, closeChatModal, activeChatMatchId } = useApp();

  if (!isChatModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-2xl h-[92vh] sm:h-[660px] flex flex-col shadow-2xl rounded-3xl overflow-hidden">
        <MessagingWindow
          isModal={true}
          initialThreadId={activeChatMatchId || 'match_001'}
          onClose={closeChatModal}
        />
      </div>
    </div>
  );
};
