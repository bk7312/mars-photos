'use client';
import React from 'react';
import { MessageType } from '@/lib/types';
import { combineClassNames } from '@/lib/utils';
import CloseIcon from './icons/CloseIcon';

type MessagePropType = {
  type: MessageType['type'];
  children: string;
  handleDismiss: () => void;
  className?: string;
  [key: string]: any;
};

// don't put COLORS in constants.ts and import
// tailwind will not know these classes are in use
// and thus remove during bundling
const COLORS = {
  Error: 'bg-red-400',
  Info: 'bg-green-400',
  Warning: 'bg-orange-400',
};

export default function Message({
  type,
  handleDismiss,
  className = '',
  children,
  ...delegated
}: MessagePropType) {
  return (
    <div
      className={combineClassNames(
        'relative rounded-lg p-6 font-semibold',
        COLORS[type],
        className
      )}
      {...delegated}
    >
      <button
        onClick={handleDismiss}
        className='absolute right-2 top-2 cursor-pointer focus-visible:ring'
      >
        <CloseIcon />
      </button>
      <p className='w-full'>{children}</p>
    </div>
  );
}
