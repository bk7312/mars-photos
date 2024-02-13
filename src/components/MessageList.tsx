'use client';
import React from 'react';
import Message from './Message';
import { MessageContext } from '@/context/MessageContext';
import { MessageType } from '@/lib/types';
import { combineClassNames } from '@/lib/utils';

export default function MessageList() {
  const { messageList, handleDismiss } = React.useContext(MessageContext);
  const [lastMessageId, setLastMessageId] = React.useState<string>('');
  const listRef = React.useRef<null | HTMLOListElement>(null);

  // scroll to last message if last message is new
  React.useEffect(() => {
    if (messageList.at(-1)?.id === lastMessageId) {
      return;
    }
    setLastMessageId(messageList.at(-1)?.id ?? '');
    if (listRef.current) {
      listRef.current.scrollTop =
        listRef.current.scrollHeight - listRef.current.clientHeight;
    }
  }, [messageList, lastMessageId]);

  if (messageList.length === 0) {
    return <></>;
  }

  return (
    <ol
      className={combineClassNames(
        'fixed bottom-0 right-0 flex w-full min-w-fit max-w-sm flex-col gap-2 p-2',
        'hide-scrollbar max-h-full min-h-fit overflow-y-scroll overscroll-contain scroll-smooth'
      )}
      ref={listRef}
    >
      {messageList.map(({ text, type, id }: MessageType) => (
        <li className='w-full min-w-fit max-w-sm animate-slide-in' key={id}>
          <Message type={type} handleDismiss={() => handleDismiss(id)}>
            {text}
          </Message>
        </li>
      ))}
    </ol>
  );
}
