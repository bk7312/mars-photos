'use client';
import React from 'react';
import { RoverSearch, RoverManifest } from '@/lib/types';
import { ROVERS, cameraNames } from '@/lib/constants';
import { combineClassNames, getBackgroundImageStyle } from '@/lib/utils';
import { MessageContext } from '@/context/MessageContext';

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
  const messageContext = React.useContext(MessageContext);
  const isDisabled = search.isFetchingManifest;

  const showHelp = () => {
    messageContext?.addMessage({
      text: `First, select a rover. Next, choose a sol (a Mars solar day, the equivalent Earth date will also be shown in the dropdown). Finally, choose a camera from the dropdown and click 'Get Photos'. (Tip: Press 'Esc' to clear all popups.)`,
      type: 'Info',
    });
  };

  return (
    <section
      className={combineClassNames(
        'relative w-full h-full max-w-screen-sm p-4 xs:pb-6 xs:pt-8 xs:pr-8',
        'flex flex-col items-start gap-4 border-2 border-slate-400 rounded',
        className
      )}
      {...delegated}
    >
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
          {ROVERS.map((rover) => (
            <option key={rover} value={rover}>
              {rover}
            </option>
          ))}
        </select>
      </label>

      <label
        className='flex flex-col xs:flex-row gap-1 xs:gap-2 xs:items-center w-full h-full bg-no-repeat bg-center'
        style={search.isFetchingManifest ? getBackgroundImageStyle() : {}}
      >
        <p className='w-20 xs:text-right'>Sol:</p>
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
        style={search.isFetchingManifest ? getBackgroundImageStyle() : {}}
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
        className='bg-slate-200 border-solid rounded px-2 py-1 xs:mt-2 mx-auto select-none disabled:cursor-not-allowed focus-visible:ring'
        onClick={() => getPhotos(search)}
        disabled={isDisabled || search.camera === ''}
      >
        Get Photos
      </button>

      <button
        onClick={showHelp}
        className='cursor-pointer absolute top-1 right-1 focus-visible:ring'
      >
        <svg
          width='24px'
          height='24px'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M12 17H12.01M12 14C12.8906 12.0938 15 12.2344 15 10C15 8.5 14 7 12 7C10.4521 7 9.50325 7.89844 9.15332 9M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z'
            stroke='#777'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>
    </section>
  );
}
