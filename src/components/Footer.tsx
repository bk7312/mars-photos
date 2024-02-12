import React from 'react';

export default function Footer() {
  return (
    <footer className='mt-2 w-full bg-slate-400 p-6 text-center'>
      Made by{' '}
      <a
        className='text-blue-600 underline underline-offset-2'
        href='https://github.com/bk7312/'
        target='_blank'
      >
        Boon Kai
      </a>
      . See the{' '}
      <a
        className='text-blue-600 underline underline-offset-2'
        href='https://github.com/bk7312/mars-photos'
        target='_blank'
      >
        Github repo
      </a>{' '}
      for the source code.
    </footer>
  );
}
