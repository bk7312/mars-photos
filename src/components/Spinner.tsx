'use client';
import React from 'react';

export default function Spinner() {
  return (
    <div className='flex items-center border-2 border-slate-300 h-12 w-full max-w-sm p-4 mx-auto'>
      <div className='animate-spin h-5 w-5 mx-auto bg-slate-500'></div>
    </div>
  );
}
