'use client';
import { combineClassNames } from '@/lib/utils';
import React from 'react';

type SpinnerPropType = {
  className?: string;
};

export default function Spinner({
  className = '',
  ...delegated
}: SpinnerPropType) {
  return (
    <div
      className={combineClassNames(
        'flex justify-center items-center h-full w-full max-w-sm p-4 mx-auto',
        className
      )}
      {...delegated}
    >
      <div className='motion-safe:animate-spin motion-reduce:hidden h-5 w-5 mx-auto bg-slate-500'></div>
      <div className='motion-safe:hidden ml-2'>Loading...</div>
    </div>
  );
}
