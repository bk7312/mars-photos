'use client';
import React from 'react';
import SearchBar from '@/components/SearchBar';
import PhotoResults from '@/components/PhotoResults';
import RoverInfo from '@/components/RoverInfo';
import Footer from '@/components/Footer';
import useMarsData from '@/hooks/useMarsData';

export default function Home() {
  const {
    search,
    photos,
    roverData,
    updateSearch,
    fetchPhotos,
    updatePhotos,
    updatePhotoPage,
  } = useMarsData('Perseverance');

  return (
    <main className='h-screen flex flex-col items-center gap-2'>
      <SearchBar
        search={search}
        roverData={roverData}
        updateSearch={updateSearch}
      />

      <RoverInfo roverData={roverData} />

      <button
        className='bg-slate-200 border-solid rounded px-2 py-1'
        onClick={() => fetchPhotos(search)}
      >
        Get Photos
      </button>

      <PhotoResults
        photos={photos}
        updatePhotos={updatePhotos}
        updatePhotoPage={updatePhotoPage}
      />

      <Footer />
    </main>
  );
}
