'use client';
import React from 'react';
import { RoverSearch, RoverManifest } from '@/lib/types';
import { rovers, cameraNames, isDev } from '@/lib/constants';
import { combineClassNames } from '@/lib/utils';

type SearchBarPropType = {
  search: RoverSearch;
  roverData: RoverManifest;
  updateSearch: (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => void;
  getPhotos: (rover: RoverSearch) => void;
  className?: string;
};

export default function SearchBar({
  search,
  roverData,
  updateSearch,
  getPhotos,
  className = '',
  ...delegated
}: SearchBarPropType) {
  const showSearchForm =
    search.rover === '' || search.rover === roverData?.name;
  isDev && console.log(search);

  return (
    <section
      className={combineClassNames(
        'p-4 w-full min-h-60 max-w-screen-sm',
        className
      )}
      {...delegated}
    >
      <div
        className='flex flex-col items-start gap-4 border border-slate-500 rounded p-4 h-full bg-no-repeat bg-center'
        style={
          showSearchForm ? {} : { backgroundImage: "url('/loading-bar.gif')" }
        }
      >
        {showSearchForm && (
          <>
            <label className='flex gap-2 items-center w-full'>
              <p className='w-20 text-right'>Rover:</p>
              <select
                name='rover'
                id='rover'
                value={search.rover}
                onChange={updateSearch}
                className='w-full px-1 py-1 focus-visible:ring'
              >
                {!search.rover && <option value=''>Select a rover</option>}
                {rovers.map((rover) => (
                  <option key={rover} value={rover}>
                    {rover}
                  </option>
                ))}
              </select>
            </label>

            <label className='flex gap-2 items-center w-full'>
              <p className='w-20 text-right'>Sol:</p>
              <input
                type='number'
                list='sol-datalist'
                name='sol'
                value={search.sol}
                onChange={updateSearch}
                min={roverData?.photos[0].sol ?? 0}
                max={roverData?.max_sol}
                className='w-full px-2 py-1 focus-visible:ring'
              />
              <datalist id='sol-datalist'>
                {roverData?.photos.map(({ sol, earth_date }) => (
                  <option key={sol} value={sol}>
                    Sol: {sol} (Earth Date: {earth_date})
                  </option>
                ))}
              </datalist>
            </label>

            <label className='flex gap-2 items-center w-full'>
              <p className='w-20 text-right'>Camera:</p>
              <select
                name='camera'
                id='camera'
                value={search.camera}
                onChange={updateSearch}
                className='w-full px-1 py-1 focus-visible:ring'
              >
                {search.photoIndex === -1 ? (
                  <option value=''>
                    {search.sol ? 'No photos on this sol' : 'Select a sol'}
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
              className='bg-slate-200 border-solid rounded px-2 py-1 mx-auto disabled:cursor-not-allowed focus-visible:ring'
              onClick={() => getPhotos(search)}
              disabled={search.camera === ''}
            >
              Get Photos
            </button>
          </>
        )}
      </div>
    </section>
  );
}
