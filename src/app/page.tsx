'use client';
import React from 'react';
import SearchBar from '@/components/SearchBar';
import PhotoResults from '@/components/PhotoResults';
import Footer from '@/components/Footer';
import useMarsData from '@/hooks/useMarsData';
import Spinner from '@/components/Spinner';

export default function Home() {
  const {
    search,
    photos,
    roverData,
    updateSearch,
    fetchPhotos,
    updatePhotos,
    updatePhotoPage,
  } = useMarsData();

  const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

  return (
    <main className='h-screen flex flex-col items-center gap-2'>
      <SearchBar
        search={search}
        roverData={roverData}
        updateSearch={updateSearch}
        fetchPhotos={fetchPhotos}
      />

      {isDev && (
        <div className='absolute top-0 right-0 opacity-30 border-2 border-slate-500 rounded p-2'>
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
        updatePhotos={updatePhotos}
        updatePhotoPage={updatePhotoPage}
      />

      <Footer />
    </main>
  );
}
