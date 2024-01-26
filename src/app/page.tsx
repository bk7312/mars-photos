'use client';
import React from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import PhotoResults from '@/components/PhotoResults';
import Footer from '@/components/Footer';
import useMarsData from '@/hooks/useMarsData';
import Spinner from '@/components/Spinner';
import { isDev } from '@/lib/constants';

export default function Home() {
  const {
    search,
    photos,
    roverData,
    updateSearch,
    fetchPhotos,
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
        fetchPhotos={fetchPhotos}
      />

      {isDev && (
        <div
          className='fixed cursor-pointer transition top-0 right-0 opacity-30 border-2 border-slate-500 rounded p-2'
          onClick={(e) => e.currentTarget.classList.toggle('translate-x-[85%]')}
        >
          {roverData ? (
            <>
              {Object.entries(roverData).map(([k, v]) => (
                <p key={k}>
                  {k}: {Array.isArray(v) ? `Array(${v.length})` : v}
                </p>
              ))}
              <p>currentTime: {Date.now()}</p>
            </>
          ) : (
            <Spinner />
          )}
        </div>
      )}

      <PhotoResults
        photos={photos}
        updatePhotosPerPage={updatePhotosPerPage}
        updatePhotoPage={updatePhotoPage}
      />

      <Footer />
    </main>
  );
}
