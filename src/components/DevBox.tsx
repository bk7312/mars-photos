'use client';
import React from 'react';
import { MessageContext } from '@/context/MessageContext';

export default function DevBox() {
  const { addMessage } = React.useContext(MessageContext);

  return (
    <div
      className='fixed right-0 top-0 flex translate-x-[95%] cursor-context-menu flex-col gap-1 border-2 border-slate-500 pl-6 opacity-30 transition'
      onClick={(e) => {
        e.currentTarget.classList.toggle('translate-x-[95%]');
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          localStorage.clear();
        }}
        className='cursor-pointer rounded bg-red-400 px-2'
      >
        clear localStorage
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          addMessage({
            text: 'testing message with lots of characters and rather verbose, perhaps excessively so to the point of pointlessly filling multiple lines',
            type: 'Error',
          });
        }}
        className='cursor-pointer rounded bg-red-400 px-2'
      >
        add long error
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          addMessage({
            text: 'testing info',
            type: 'Info',
          });
        }}
        className='cursor-pointer rounded bg-red-400 px-2'
      >
        add short info
      </button>
    </div>
  );
}
