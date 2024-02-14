'use client';
import React from 'react';
import Image from 'next/image';
import { combineClassNames } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';

export default function Profile() {
  const { data: session } = useSession();

  const handleSignOut = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    signOut();
  };

  return (
    <section
      className={combineClassNames(
        'relative h-full w-full max-w-screen-xl grow bg-center bg-no-repeat p-4',
        'flex items-center justify-center gap-4'
      )}
    >
      <div className='relative h-28 w-28 overflow-clip rounded-full border'>
        <Image
          src={session?.user?.image ?? '/stock-user.jpg'}
          alt={session?.user?.name ?? ''}
          title={session?.user?.name ?? ''}
          fill={true}
          sizes='300px'
          className='object-cover'
        />
      </div>
      <div className='flex flex-col items-start gap-2 text-lg'>
        <p className='px-1'>{session?.user?.name}</p>
        <p className='px-1'>{session?.user?.email}</p>
        <button
          className='rounded bg-slate-200 px-2 py-1 hover:underline focus-visible:ring dark:bg-slate-800'
          onClick={handleSignOut}
        >
          Sign out
        </button>
      </div>
    </section>
  );
}
