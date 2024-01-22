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
    <div className='h-screen flex flex-col justify-center items-center gap-6'>
      <h2 className='text-2xl'>Looks like something went wrong!</h2>
      <button
        className='py-2 px-4 border-2 rounded bg-slate-100'
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
