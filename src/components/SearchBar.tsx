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
  isDev && console.log(search);

  const isDisabled = search.isFetchingManifest;

  return (
    <section
      className={combineClassNames(
        'p-4 w-full max-h-64 max-w-screen-sm',
        className
      )}
      {...delegated}
    >
      <div className='relative flex flex-col items-start gap-4 border border-slate-500 rounded px-6 py-8 h-full'>
        <label className='flex gap-2 items-center w-full'>
          <p className='w-20 text-right'>Rover:</p>

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
          className='flex gap-2 items-center w-full h-full bg-no-repeat bg-center group'
          style={
            search.isFetchingManifest
              ? { backgroundImage: "url('/loading-bar.gif')" }
              : {}
          }
        >
          {!search.isFetchingManifest && (
            <>
              <p className='w-20 text-right relative'>
                Sol:
                <span className='absolute z-10 hidden group-hover:block top-full right-0 w-20 px-2 py-1 rounded bg-white'>
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
                className='w-full px-2 py-1 focus-visible:ring peer'
                disabled={isDisabled}
              />
              <datalist id='sol-datalist'>
                {roverData?.photos.map(({ sol, earth_date }) => (
                  <option key={sol} value={sol}>
                    Sol: {sol} (Earth Date: {earth_date})
                  </option>
                ))}
              </datalist>
            </>
          )}
        </label>

        <label
          className='flex gap-2 items-center w-full h-full bg-no-repeat bg-center'
          style={
            search.isFetchingManifest
              ? { backgroundImage: "url('/loading-bar.gif')" }
              : {}
          }
        >
          {!search.isFetchingManifest && (
            <>
              <p className='w-20 text-right'>Camera:</p>
              <select
                name='camera'
                id='camera'
                value={search.camera}
                onChange={updateSearch}
                className='w-full px-1 py-1 focus-visible:ring'
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
            </>
          )}
        </label>
        <button
          className='bg-slate-200 border-solid rounded px-2 py-1 mx-auto disabled:cursor-not-allowed focus-visible:ring'
          onClick={() => getPhotos(search)}
          disabled={isDisabled || search.camera === ''}
        >
          Get Photos
        </button>
      </div>

      {false && (
        <ol className='list-decimal list-inside '>
          <li className='mb-2'>
            Select a rover, there are {rovers.length} to choose from:{' '}
            {rovers.join(', ')}.
          </li>
          <li className='mb-2'>
            Select a sol, a sol is a Mars solar day. Selecting sol 10 would be
            the equivalent of day 10 of the rover&apos;s mission. The
            corresponding Earth date will also be shown in the dropdown.
          </li>
          <li className='mb-2'>
            Select a camera, your selected rover is equipped with several
            cameras. Which would you like to see? Note that not all cameras will
            be available on all sols, some sols may not have any photos.
          </li>
        </ol>
      )}
    </section>
  );
}
