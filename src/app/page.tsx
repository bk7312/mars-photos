'use client';
import React from 'react';
import { Rover, RoverSearch, RoverPhotos, RoverManifest } from '@/lib/types';
import { rovers, cameras } from '@/lib/constants';
import Image from 'next/image';

export default function Home() {
  const [search, setSearch] = React.useState<RoverSearch>({
    rover: 'Curiosity',
    sol: 0,
    camera: 'ALL',
  });
  const [roverData, setRoverData] = React.useState<RoverManifest>(null);
  const [photos, setPhotos] = React.useState<RoverPhotos>(null);

  const updateSearch = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setSearch((prev) => ({
      ...prev,
      [name]: name === 'sol' ? Math.max(0, parseInt(value)) : value,
    }));
  };

  const fetchManifest = async (rover: Rover) => {
    const res = await fetch('/api/manifests/', {
      method: 'POST',
      body: JSON.stringify({ rover }),
    });

    if (!res.ok) {
      console.error(res.statusText);
      return;
    }

    const { data } = await res.json();
    console.log(data);
    setRoverData(data);
  };

  const fetchPhotos = async (search: RoverSearch) => {
    const res = await fetch('/api/photos/', {
      method: 'POST',
      body: JSON.stringify(search),
    });

    if (!res.ok) {
      console.error(res.statusText);
      return;
    }

    const { data } = await res.json();
    console.log(data);
    setPhotos(data);
  };

  return (
    <main className='h-screen flex flex-col items-center'>
      <label>
        Rover:{' '}
        <select
          name='rover'
          id='rover'
          value={search.rover}
          onChange={updateSearch}
        >
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
          <option value='ALL'>ALL</option>
          {Object.entries(cameras[search.rover]).map(([k, v]) => (
            <option key={k} value={k}>
              {k}: {v}
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
      <button onClick={() => fetchManifest(search.rover)}>Get Manifests</button>
      <button onClick={() => fetchPhotos(search)}>Get Photos</button>
      <button onClick={() => console.log(search)}>Search</button>
      <div id='manifests'>
        {roverData &&
          Object.entries(roverData).map(([k, v]) => (
            <p key={k}>
              {k}: {Array.isArray(v) ? '' : v}
            </p>
          ))}
      </div>
      <div id='photos' className='flex flex-wrap'>
        {photos &&
          photos.map((p, i) => (
            <Image
              key={i}
              src={p.img_src}
              alt={i.toString()}
              height={100}
              width={100}
            />
          ))}
      </div>
    </main>
  );
}
