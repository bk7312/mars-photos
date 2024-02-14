'use client';
import React from 'react';
import { RoverSearch, RoverManifest } from '@/lib/types';
import { ROVERS, cameraNames } from '@/lib/constants';
import { combineClassNames, getBackgroundImageStyle } from '@/lib/utils';
import { MessageContext } from '@/context/MessageContext';
import HelpIcon from './icons/HelpIcon';

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
  const { addMessage } = React.useContext(MessageContext);
  const isDisabled = search.isFetchingManifest;

  const showHelp = () => {
    addMessage({
      text: `First, select a rover. Next, choose a sol (a Mars solar day, the equivalent Earth date will also be shown in the dropdown). Finally, choose a camera from the dropdown and click 'Get Photos'. (Tip: Press 'Esc' to clear all popups.)`,
      type: 'Info',
    });
  };

  return (
    <section
      className={combineClassNames(
        'relative h-full w-full max-w-screen-sm p-4 xs:pb-6 xs:pr-8 xs:pt-8',
        'flex flex-col items-start gap-4 rounded border-2 border-slate-400',
        className
      )}
      {...delegated}
    >
      <label className='flex w-full flex-col gap-1 xs:flex-row xs:items-center xs:gap-2'>
        <p className='w-20 xs:text-right'>Rover:</p>
        <select
          name='rover'
          id='rover'
          value={search.rover}
          onChange={updateSearch}
          className='w-full px-1 py-1 focus-visible:ring dark:bg-slate-800'
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
        className='flex h-full w-full flex-col gap-1 bg-center bg-no-repeat xs:flex-row xs:items-center xs:gap-2'
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
            'peer w-full px-2 py-1 focus-visible:ring dark:bg-slate-800',
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
        className='flex h-full w-full flex-col gap-1 bg-center bg-no-repeat xs:flex-row xs:items-center xs:gap-2'
        style={search.isFetchingManifest ? getBackgroundImageStyle() : {}}
      >
        <p className='w-20 xs:text-right'>Camera:</p>
        <select
          name='camera'
          id='camera'
          value={search.camera}
          onChange={updateSearch}
          className={combineClassNames(
            'w-full px-1 py-1 focus-visible:ring dark:bg-slate-800',
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
        className='mx-auto select-none rounded bg-slate-200 px-2 py-1 hover:underline focus-visible:ring disabled:cursor-not-allowed disabled:opacity-50 xs:mt-2 dark:bg-slate-800'
        onClick={() => getPhotos(search)}
        disabled={isDisabled || search.camera === ''}
      >
        Get Photos
      </button>

      <button
        onClick={showHelp}
        className='absolute right-1 top-1 cursor-pointer hover:scale-125 focus-visible:ring'
      >
        <HelpIcon />
      </button>
    </section>
  );
}
