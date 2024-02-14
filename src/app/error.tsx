'use client';
import React from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='flex h-screen flex-col items-center justify-center gap-6'>
      <h2 className='text-2xl'>Looks like something went wrong!</h2>
      <button
        className='rounded border-2 bg-slate-100 px-4 py-2'
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
