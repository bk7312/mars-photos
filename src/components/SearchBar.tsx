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
};

export default function SearchBar({
  search,
  roverData,
  updateSearch,
}: SearchBarPropType) {
  const photoIndex =
    roverData?.photos.findIndex((p) => p.sol === search.sol) ?? -1;

  return (
    <section className='flex flex-col items-center'>
      <label>
        Rover:{' '}
        <select
          name='rover'
          id='rover'
          value={search.rover}
          onChange={updateSearch}
        >
          <option disabled>-Select a rover-</option>
          {rovers.map((rover) => (
            <option key={rover} value={rover}>
              {rover}
            </option>
          ))}
        </select>
      </label>
      <label>
        Camera:{' '}
        <select
          name='camera'
          id='camera'
          value={search.camera}
          onChange={updateSearch}
        >
          {photoIndex === -1 ? (
            <option disabled value=''>
              No photos on this day
            </option>
          ) : (
            roverData &&
            roverData.photos[photoIndex].cameras.length > 1 && (
              <option value='ALL'>ALL: Show photos from all cameras</option>
            )
          )}

          {roverData?.photos[photoIndex]?.cameras.map((v) => (
            <option key={v} value={v}>
              {v}: {cameraNames[v]}
            </option>
          ))}
        </select>
      </label>
      <label>
        Sol:{' '}
        <input
          type='number'
          name='sol'
          id='sol'
          onChange={updateSearch}
          value={search.sol}
          min={0}
        />
      </label>
    </section>
  );
}
