'use client';
import React from 'react';
import SearchBar from '@/components/SearchBar';
import PhotoResults from '@/components/PhotoResults';
import useMarsData from '@/hooks/useMarsData';
import { isDev } from '@/lib/constants';

export default function Home() {
  const { search, photos, roverData, updateSearch, getPhotos } = useMarsData();

  isDev && console.log('main rendered');

  return (
    <main className='flex w-full flex-col items-center justify-between gap-6 p-4 xs:gap-8'>
      <SearchBar
        search={search}
        roverData={roverData}
        updateSearch={updateSearch}
        getPhotos={getPhotos}
      />

      <PhotoResults initPhotos={photos} />
    </main>
  );
}
