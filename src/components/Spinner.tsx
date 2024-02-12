'use client';
import { combineClassNames } from '@/lib/utils';
import React from 'react';

type SpinnerPropType = {
  className?: string;
  [key: string]: any;
};

export default function Spinner({
  className = '',
  ...delegated
}: SpinnerPropType) {
  return (
    <div
      className={combineClassNames(
        'mx-auto flex h-full w-full max-w-sm items-center justify-center p-4',
        className
      )}
      {...delegated}
    >
      <div className='mx-auto h-5 w-5 bg-slate-500 motion-safe:animate-spin motion-reduce:hidden'></div>
      <div className='ml-2 motion-safe:hidden'>Loading...</div>
    </div>
  );
}
