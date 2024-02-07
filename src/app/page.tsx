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
    <main className='flex flex-col justify-between items-center p-4 gap-6 xs:gap-8 w-full'>
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
          className='fixed flex flex-col gap-1 transition top-0 right-0 opacity-30 border-2 border-slate-500 pl-6 cursor-context-menu translate-x-[95%]'
          onClick={(e) => {
            e.currentTarget.classList.toggle('translate-x-[95%]');
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              localStorage.clear();
            }}
            className='rounded bg-red-400 px-2 cursor-pointer'
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
            className='rounded bg-red-400 px-2 cursor-pointer'
          >
            log state
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleIsFetching();
            }}
            className='rounded bg-red-400 px-2 cursor-pointer'
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
            className='rounded bg-red-400 px-2 cursor-pointer'
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
            className='rounded bg-red-400 px-2 cursor-pointer'
          >
            add short info
          </button>
        </div>
      )}
    </main>
  );
}
