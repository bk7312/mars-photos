'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import { combineClassNames } from '@/lib/utils';
import GoogleIcon from './icons/GoogleIcon';
import GithubIcon from './icons/GithubIcon';
import useEscapeKey from '@/hooks/useEscapeKey';
import icon from '@/app/icon.png';
import HeartIcon from './icons/HeartIcon';

export default function Header() {
  console.log('header rendered');
  const [showSignin, setShowSignin] = React.useState<boolean>(false);
  const { data: session } = useSession();
  console.log(session);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Element;
      const isPopup =
        target.id === 'signIn' || target.parentElement?.id === 'signIn';

      if (showSignin && !isPopup) {
        setShowSignin(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [showSignin]);

  const handleEsc = React.useCallback(() => {
    if (showSignin) {
      setShowSignin(false);
    }
  }, [showSignin]);
  useEscapeKey(handleEsc);

  const handleSignin = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    provider: string
  ) => {
    e.stopPropagation();
    signIn(provider);
    setShowSignin(false);
  };

  return (
    <header className='mb-2 py-4 bg-slate-400 w-full'>
      <div className='flex flex-col xs:flex-row justify-between items-center gap-4 max-w-screen-lg mx-auto px-4 xs:px-8'>
        <Link href='/' className='flex items-center gap-2'>
          <Image src={icon} alt='logo' height={42} width={42} className='' />
          <h2 className='text-3xl font-semibold text-orange-800'>Mars Photo</h2>
        </Link>
        <div className='flex items-center gap-4'>
          {session ? (
            <>
              <Link
                href='/favorites'
                className='flex items-center gap-2 bg-slate-300 rounded px-2 py-1 focus-visible:ring'
              >
                <HeartIcon isFavorite={true} />
                Favorites
              </Link>
              <button
                className='bg-slate-300 rounded px-2 py-1 focus-visible:ring'
                onClick={() => signOut()}
              >
                Sign out
              </button>
              {/* <div className='hidden sm:block relative h-8 w-8 rounded-full overflow-clip border'>
                <Image
                  src={session?.user?.image ?? '/stock-user.jpg'}
                  alt={session?.user?.name ?? 'User'}
                  title={session?.user?.name ?? 'User'}
                  fill={true}
                  sizes='300px'
                  className='object-cover'
                />
              </div> */}
            </>
          ) : (
            <div className='relative'>
              <button
                className='bg-slate-300 rounded px-2 py-1 focus-visible:ring'
                onClick={() => setShowSignin((prev) => !prev)}
              >
                Sign in
              </button>
              {showSignin && (
                <div
                  className={combineClassNames(
                    'absolute -right-2 top-10 translate-x-1/3 xs:translate-x-0 z-10',
                    'flex flex-col gap-2 justify-center',
                    'bg-slate-200 w-56 rounded-lg p-2'
                  )}
                  id='signIn'
                >
                  <div className='absolute h-3 w-3 bg-slate-200 -top-1 right-28 xs:right-8 rotate-45 xs:-translate-x-1/2'></div>
                  <button
                    className='relative flex justify-between items-center p-2 gap-2 border rounded-lg bg-slate-100 focus-visible:ring'
                    onClick={(e) => handleSignin(e, 'google')}
                  >
                    <GoogleIcon />
                    Sign in with Google
                  </button>
                  <button
                    className='relative flex justify-between items-center p-2 gap-2 border rounded-lg bg-slate-100 focus-visible:ring'
                    onClick={(e) => handleSignin(e, 'github')}
                  >
                    <GithubIcon />
                    Sign in with Github
                  </button>
                </div>
              )}
            </div>
          )}
          <></>
        </div>
      </div>
    </header>
  );
}
