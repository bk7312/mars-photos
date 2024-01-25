'use client';
import React from 'react';
import { RoverSearch, RoverManifest } from '@/lib/types';
import { rovers, cameraNames } from '@/lib/constants';

type SearchBarPropType = {
  search: RoverSearch;
  roverData: RoverManifest;
  updateSearch: (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => void;
  fetchPhotos: (rover: RoverSearch) => void;
};

export default function SearchBar({
  search,
  roverData,
  updateSearch,
  fetchPhotos,
}: SearchBarPropType) {
  return (
    <section className='flex flex-col items-start gap-4 border-2 border-slate-500 rounded p-4 m-4 w-full max-w-xl'>
      <label className='flex gap-2 items-center w-full'>
        <p className='w-20 text-right'>Rover:</p>
        <select
          name='rover'
          id='rover'
          value={search.rover}
          onChange={updateSearch}
          className='w-full px-1 py-1'
        >
          {!search.rover && <option value=''>Select a rover</option>}
          {rovers.map((rover) => (
            <option key={rover} value={rover}>
              {rover}
            </option>
          ))}
        </select>
      </label>

      {search.rover && (
        <>
          <label className='flex gap-2 items-center w-full'>
            <p className='w-20 text-right'>Sol:</p>
            <input
              type='number'
              list='sol-datalist'
              name='sol'
              onChange={updateSearch}
              min={0}
              className='w-full px-2 py-1'
            />
            <datalist id='sol-datalist'>
              {roverData?.photos.map(({ sol, earth_date }) => (
                <option key={sol} value={sol}>
                  Sol: {sol} (Earth Date: {earth_date})
                </option>
              ))}
            </datalist>
          </label>

          {search.sol !== undefined && (
            <>
              {' '}
              <label className='flex gap-2 items-center w-full'>
                <p className='w-20 text-right'>Camera:</p>
                <select
                  name='camera'
                  id='camera'
                  value={search.camera}
                  onChange={updateSearch}
                  className='w-full px-1 py-1'
                >
                  {search.photoIndex === -1 ? (
                    <option disabled value=''>
                      No photos on this day
                    </option>
                  ) : (
                    roverData &&
                    roverData.photos[search.photoIndex].cameras.length > 1 && (
                      <option value='ALL'>All Cameras</option>
                    )
                  )}
                  {roverData?.photos[search.photoIndex]?.cameras.map((v) => (
                    <option key={v} value={v}>
                      {cameraNames[v]}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className='bg-slate-200 border-solid rounded px-2 py-1 mx-auto'
                onClick={() => fetchPhotos(search)}
              >
                Get Photos
              </button>
            </>
          )}
        </>
      )}
    </section>
  );
}
