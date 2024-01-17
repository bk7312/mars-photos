'use client';
import React from 'react';
import {
  Rover,
  RoverSearch,
  RoverPhotos,
  RoverManifest,
  ManifestPhotos,
} from '@/lib/types';
import { rovers, ONE_HOUR_IN_MS } from '@/lib/constants';
import Image from 'next/image';

export default function Home() {
  const [search, setSearch] = React.useState<RoverSearch>({
    rover: 'Curiosity',
    sol: 0,
    camera: 'ALL',
  });
  const [roverData, setRoverData] = React.useState<RoverManifest>(null);
  const [photos, setPhotos] = React.useState<RoverPhotos>(null);
  const [cameraData, setCameraData] = React.useState<string[]>([]);

  React.useEffect(() => {
    const json = localStorage.getItem(search.rover);
    if (!json) {
      fetchManifest(search.rover);
      return;
    }

    const data = JSON.parse(json);
    if (!data || data.lastUpdated > Date.now() + ONE_HOUR_IN_MS) {
      fetchManifest(search.rover);
      return;
    }
    setRoverData(data);
  }, [search.rover]);

  React.useEffect(() => {
    const photoIndex = roverData?.photos.findIndex(
      (p: ManifestPhotos) => p.sol === search.sol
    );
    if (!photoIndex || !roverData) {
      return;
    }
    console.log(photoIndex);
    if (photoIndex === -1) {
      setCameraData([]);
      return;
    }
    setCameraData(roverData.photos[photoIndex].cameras);
  }, [roverData, search.sol]);

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
    data.lastUpdated = Date.now();
    localStorage.setItem(rover, JSON.stringify(data));
  };

  const fetchPhotos = async (search: RoverSearch, page: number = 1) => {
    const res = await fetch('/api/photos/', {
      method: 'POST',
      body: JSON.stringify({ ...search, page }),
    });

    if (!res.ok) {
      console.error(res.statusText);
      return;
    }

    const { data } = await res.json();
    console.log(data);
    setPhotos(data);
  };

  const fetchLatestPhotos = async (search: RoverSearch, page: number = 1) => {
    const res = await fetch('/api/latest/', {
      method: 'POST',
      body: JSON.stringify({ ...search, page }),
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
          {cameraData.length === 0 ? (
            <option disabled value=''>
              No photos on this day
            </option>
          ) : (
            cameraData.length > 1 && <option value='ALL'>ALL</option>
          )}
          {roverData?.photos[
            roverData?.photos.findIndex((p) => p.sol === search.sol)
          ]?.cameras.map((v) => (
            <option key={v}>{v}</option>
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
          max={roverData?.max_sol}
        />
      </label>

      <button onClick={() => fetchManifest(search.rover)}>Get Manifests</button>
      <button onClick={() => fetchPhotos(search)}>Get Photos</button>
      <button onClick={() => fetchLatestPhotos(search)}>
        Get Latest Photos
      </button>
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
              height={200}
              width={200}
            />
          ))}
      </div>
    </main>
  );
}
