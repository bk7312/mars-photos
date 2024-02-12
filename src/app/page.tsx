'use client';
import React from 'react';
import SearchBar from '@/components/SearchBar';
import PhotoResults from '@/components/PhotoResults';
import useMarsData from '@/hooks/useMarsData';
import { isDev } from '@/lib/constants';
import { MessageContext } from '@/context/MessageContext';

export default function Home() {
  const {
    search,
    photos,
    roverData,
    updateSearch,
    getPhotos,
    updatePhotosPerPage,
    updatePhotoPage,
    toggleIsFetching,
  } = useMarsData();

  isDev && console.log('main rendered');
  const messageContext = React.useContext(MessageContext);

  return (
    <main className='flex w-full flex-col items-center justify-between gap-6 p-4 xs:gap-8'>
      <SearchBar
        search={search}
        roverData={roverData}
        updateSearch={updateSearch}
        getPhotos={getPhotos}
      />

      <PhotoResults
        photos={photos}
        updatePhotosPerPage={updatePhotosPerPage}
        updatePhotoPage={updatePhotoPage}
      />

      {isDev && (
        <div
          className='fixed right-0 top-0 flex translate-x-[95%] cursor-context-menu flex-col gap-1 border-2 border-slate-500 pl-6 opacity-30 transition'
          onClick={(e) => {
            e.currentTarget.classList.toggle('translate-x-[95%]');
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              localStorage.clear();
            }}
            className='cursor-pointer rounded bg-red-400 px-2'
          >
            clear localStorage
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation;
              console.log({
                search,
                roverData,
                photos,
                localStorageKeys: Object.keys(localStorage),
                node_env: process.env.NODE_ENV,
              });
            }}
            className='cursor-pointer rounded bg-red-400 px-2'
          >
            log state
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleIsFetching();
            }}
            className='cursor-pointer rounded bg-red-400 px-2'
          >
            toggle isFetching
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              messageContext.addMessage({
                text: 'testing message with lots of characters and rather verbose, perhaps excessively so to the point of pointlessly filling multiple lines',
                type: 'Error',
              });
            }}
            className='cursor-pointer rounded bg-red-400 px-2'
          >
            add long error
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              messageContext.addMessage({
                text: 'testing info',
                type: 'Info',
              });
            }}
            className='cursor-pointer rounded bg-red-400 px-2'
          >
            add short info
          </button>
        </div>
      )}
    </main>
  );
}
