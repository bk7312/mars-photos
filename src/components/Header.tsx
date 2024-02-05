'use client';
import React from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

const ACTIVE_ROUTE = 'py-1 px-2 text-gray-300 bg-gray-700';
const INACTIVE_ROUTE =
  'py-1 px-2 text-gray-500 hover:text-gray-300 hover:bg-gray-700';

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  console.log(session);
  return (
    <header className='flex justify-center items-center gap-4 mb-2 py-4 text-center bg-slate-400 w-full'>
      <Link href='/'>
        <h2 className='text-3xl font-semibold'>Mars Photo</h2>
      </Link>
      <div>
        {session ? (
          <>
            {session?.user?.name}{' '}
            <button onClick={() => signOut()}>Sign out</button>
          </>
        ) : (
          <>
            Not signed in <button onClick={() => signIn()}>Sign in</button>
          </>
        )}
        <>
          <Link
            href='/favorites'
            className={
              pathname === '/favorites' ? ACTIVE_ROUTE : INACTIVE_ROUTE
            }
          >
            Favorites
          </Link>
        </>
      </div>
    </header>
  );
}
