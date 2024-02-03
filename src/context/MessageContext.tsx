'use client';
import React from 'react';
import { MessageType } from '@/lib/types';
import useEscapeKey from '@/hooks/useEscapeKey';

type MessageContextType = {
  messageList: MessageType[];
  addMessage: ({
    text,
    type,
  }: {
    text: string;
    type: 'Error' | 'Info' | 'Warning';
  }) => void;
  handleDismiss: (id: string) => void;
};

export const MessageContext = React.createContext<MessageContextType | null>(
  null
);

export default function MessageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [messageList, setMessageList] = React.useState<MessageType[]>([]);

  const handleEsc = React.useCallback(() => {
    // need conditional check, else keydown on PhotoResults won't work
    // suspect once state updates, it stops processing further keydown events
    if (messageList.length > 0) {
      setMessageList([]);
    }
  }, [messageList]);
  useEscapeKey(handleEsc);

  const addMessage = ({
    text,
    type,
  }: {
    text: string;
    type: MessageType['type'];
  }) => {
    setMessageList((prev) => [
      ...prev,
      { text, type, id: crypto.randomUUID() },
    ]);
  };

  const handleDismiss = (id: string) => {
    setMessageList((prev) => prev.filter((c) => c.id !== id));
  };

  const value = {
    messageList,
    addMessage,
    handleDismiss,
  };

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
}
