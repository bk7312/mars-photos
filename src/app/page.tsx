'use client';
import React from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import PhotoResults from '@/components/PhotoResults';
import Footer from '@/components/Footer';
import useMarsData from '@/hooks/useMarsData';
import { isDev } from '@/lib/constants';
import Message from '@/components/Message';

export default function Home() {
  const {
    search,
    photos,
    roverData,
    message,
    closeMessage,
    updateSearch,
    getPhotos,
    updatePhotosPerPage,
    updatePhotoPage,
  } = useMarsData();

  isDev && console.log('main rendered', roverData);

  return (
    <main className='h-screen flex flex-col justify-between items-center gap-2'>
      <Header />
      <SearchBar
        search={search}
        roverData={roverData}
        updateSearch={updateSearch}
        getPhotos={getPhotos}
      />

      <Message message={message} closeMessage={closeMessage} />

      <PhotoResults
        photos={photos}
        updatePhotosPerPage={updatePhotosPerPage}
        updatePhotoPage={updatePhotoPage}
      />

      <Footer />

      {isDev && (
        <div
          className='fixed flex flex-col gap-1 transition top-0 right-0 opacity-30 border-2 border-slate-500 pl-6'
          onClick={(e) => e.currentTarget.classList.toggle('translate-x-3/4')}
        >
          <button
            onClick={() => localStorage.clear()}
            className='rounded bg-red-300 px-2 cursor-pointer'
          >
            clear localStorage
          </button>
          <button
            onClick={() =>
              console.log({
                search,
                roverData,
                photos,
                message,
                localStorageKeys: Object.keys(localStorage),
              })
            }
            className='rounded bg-red-300 px-2 cursor-pointer'
          >
            log state
          </button>
        </div>
      )}
    </main>
  );
}
