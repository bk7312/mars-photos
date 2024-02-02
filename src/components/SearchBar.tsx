'use client';
import React from 'react';
import { RoverSearch, RoverManifest } from '@/lib/types';
import { rovers, cameraNames, isDev } from '@/lib/constants';
import { combineClassNames, isReducedMotion } from '@/lib/utils';

type SearchBarPropType = {
  search: RoverSearch;
  roverData: RoverManifest;
  updateSearch: (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => void;
  getPhotos: (rover: RoverSearch) => void;
  className?: string;
  [key: string]: any;
};

export default function SearchBar({
  search,
  roverData,
  updateSearch,
  getPhotos,
  className = '',
  ...delegated
}: SearchBarPropType) {
  isDev && console.log(search);

  const isDisabled = search.isFetchingManifest;

  return (
    <section
      className={combineClassNames(
        'p-4 w-full xs:max-h-64 max-w-screen-sm',
        className
      )}
      {...delegated}
    >
      <div className='relative flex flex-col items-start gap-4 border border-slate-500 rounded px-6 py-8 h-full'>
        <label className='flex flex-col xs:flex-row gap-1 xs:gap-2 xs:items-center w-full'>
          <p className='w-20 xs:text-right'>Rover:</p>

          <select
            name='rover'
            id='rover'
            value={search.rover}
            onChange={updateSearch}
            className='w-full px-1 py-1 focus-visible:ring'
            disabled={isDisabled}
          >
            {!search.rover && <option value=''>Select a rover</option>}
            {rovers.map((rover) => (
              <option key={rover} value={rover}>
                {rover}
              </option>
            ))}
          </select>
        </label>

        <label
          className='flex flex-col xs:flex-row gap-1 xs:gap-2 xs:items-center w-full h-full bg-no-repeat bg-center group'
          style={
            search.isFetchingManifest
              ? {
                  backgroundImage: `url('/loading-bar${
                    isReducedMotion() ? '-static' : ''
                  }.gif')`,
                }
              : {}
          }
        >
          <p className='w-20 xs:text-right relative'>
            Sol:
            <span className='absolute z-10 hidden group-hover:block -top-2 -right-[150%] w-max xs:top-full xs:right-0 xs:w-20 px-2 py-1 rounded bg-white'>
              A solar day on Mars
            </span>
          </p>
          <input
            type='number'
            list='sol-datalist'
            name='sol'
            value={search.sol}
            onChange={updateSearch}
            min={roverData?.photos[0].sol ?? 0}
            max={roverData?.max_sol}
            className={combineClassNames(
              'w-full px-2 py-1 focus-visible:ring peer',
              search.isFetchingManifest ? 'invisible' : ''
            )}
            disabled={isDisabled}
          />
          <datalist id='sol-datalist'>
            {roverData?.photos.map(({ sol, earth_date }) => (
              <option key={sol} value={sol}>
                Sol: {sol} (Earth Date: {earth_date})
              </option>
            ))}
          </datalist>
        </label>

        <label
          className='flex flex-col xs:flex-row gap-1 xs:gap-2 xs:items-center w-full h-full bg-no-repeat bg-center'
          style={
            search.isFetchingManifest
              ? { backgroundImage: "url('/loading-bar.gif')" }
              : {}
          }
        >
          <p className='w-20 xs:text-right'>Camera:</p>
          <select
            name='camera'
            id='camera'
            value={search.camera}
            onChange={updateSearch}
            className={combineClassNames(
              'w-full px-1 py-1 focus-visible:ring',
              search.isFetchingManifest ? 'invisible' : ''
            )}
            disabled={isDisabled}
          >
            {search.photoIndex === -1 ? (
              <option value=''>
                {search.rover
                  ? search.sol
                    ? 'No photos on this sol'
                    : 'Please select a sol'
                  : 'Please select a rover first'}
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
          className='bg-slate-200 border-solid rounded px-2 py-1 mt-2 xs:mt-0 mx-auto select-none disabled:cursor-not-allowed focus-visible:ring'
          onClick={() => getPhotos(search)}
          disabled={isDisabled || search.camera === ''}
        >
          Get Photos
        </button>
      </div>
    </section>
  );
}
