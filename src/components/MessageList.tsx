'use client';
import React from 'react';
import Message from './Message';
import { MessageContext } from '@/context/MessageContext';
import { MessageType } from '@/lib/types';

export default function MessageList() {
  const messageContext = React.useContext(MessageContext);
  if (!messageContext) return <></>;

  const { messageList, handleDismiss } = messageContext;
  return (
    <ol className='flex flex-col gap-2 p-2 fixed bottom-0 right-0'>
      {messageList.map(({ text, type, id }: MessageType) => (
        <li className='will-change-transform animate-slide' key={id}>
          <Message type={type} handleDismiss={() => handleDismiss(id)}>
            {text}
          </Message>
        </li>
      ))}
    </ol>
  );
}
