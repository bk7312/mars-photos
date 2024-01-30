import React from 'react';

export default function Footer() {
  return (
    <footer className='mt-2 p-6 bg-slate-300 w-full text-center'>
      Made by{' '}
      <a
        className='underline text-blue-600'
        href='https://github.com/bk7312/'
        target='_blank'
      >
        Boon Kai
      </a>
      . See the{' '}
      <a
        className='underline text-blue-600'
        href='https://github.com/bk7312/mars-photos'
        target='_blank'
      >
        Github repo
      </a>{' '}
      for the source code.
    </footer>
  );
}
