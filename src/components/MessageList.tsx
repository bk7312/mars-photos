'use client';
import React from 'react';
import Message from './Message';
import { MessageContext } from '@/context/MessageContext';
import { MessageType } from '@/lib/types';

export default function MessageList() {
  const messageContext = React.useContext(MessageContext);
  if (!messageContext || messageContext.messageList.length === 0) return <></>;

  const { messageList, handleDismiss } = messageContext;
  return (
    <ol className='flex flex-col min-w-fit max-w-sm w-full gap-2 p-2 fixed bottom-0 right-0'>
      {messageList.map(({ text, type, id }: MessageType) => (
        <li className='animate-slide-in min-w-fit max-w-sm w-full' key={id}>
          <Message type={type} handleDismiss={() => handleDismiss(id)}>
            {text}
          </Message>
        </li>
      ))}
    </ol>
  );
}
