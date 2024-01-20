'use client';
import React from 'react';
import {
  Rover,
  RoverSearch,
  RoverPhotos,
  RoverManifest,
  ManifestPhotos,
} from '@/lib/types';
import { rovers, ONE_HOUR_IN_MS, cameraNames } from '@/lib/constants';
import { range } from '@/lib/utils';
import Image from 'next/image';

export default function Home() {
  const [search, setSearch] = React.useState<RoverSearch>({
    rover: 'Perseverance',
    sol: 0,
    camera: undefined,
    currentPage: 1,
    photoPerPage: 8,
  });
  const [roverData, setRoverData] = React.useState<RoverManifest>(null);
  const [photos, setPhotos] = React.useState<RoverPhotos>([]);

  React.useEffect(() => {
    const json = localStorage.getItem(search.rover);
    if (!json) {
      fetchManifest(search.rover);
      return;
    }

    const data = JSON.parse(json);
    const toUpdate =
      data.status === 'complete'
        ? false
        : data.lastUpdated + ONE_HOUR_IN_MS < Date.now();

    if (!data || toUpdate) {
      fetchManifest(search.rover);
      return;
    }

    setRoverData(data);
  }, [search.rover]);

  React.useEffect(() => {
    if (!roverData) {
      return;
    }

    const photoIndex = roverData.photos.findIndex(
      (p: ManifestPhotos) => p.sol === search.sol
    );

    if (photoIndex === -1) {
      setSearch((prev) => ({ ...prev, camera: undefined }));
      return;
    }

    setSearch((prev) => ({
      ...prev,
      camera:
        roverData.photos[photoIndex].cameras.length > 1
          ? 'ALL'
          : roverData.photos[photoIndex].cameras[0],
    }));
  }, [roverData, search.sol]);

  const updateSearch = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setSearch((prev) => ({
      ...prev,
      [name]:
        name === 'sol'
          ? Math.max(0, parseInt(value))
          : name === 'photoPerPage'
          ? Math.max(1, parseInt(value))
          : value,
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
    data.lastUpdated = Date.now();
    setRoverData(data);
    localStorage.setItem(rover, JSON.stringify(data));
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

  const fetchLatestPhotos = async (search: RoverSearch) => {
    const res = await fetch('/api/latest/', {
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
  const photoIndex =
    roverData?.photos.findIndex((p) => p.sol === search.sol) ?? -1;

  // const pageArr = new Array(
  //   Math.ceil(photos.length / search.photoPerPage)
  // ).fill(0);
  const photoStartIndex = (search.currentPage - 1) * search.photoPerPage;

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
      <label>
        Photos per page:{' '}
        <input
          type='number'
          name='photoPerPage'
          id='photoPerPage'
          onChange={updateSearch}
          value={search.photoPerPage}
          min={1}
        />
      </label>

      <br />

      <button onClick={() => fetchPhotos(search)}>Get Photos</button>
      <button onClick={() => fetchLatestPhotos(search)}>
        Get Latest Photos
      </button>

      <br />

      <div id='manifests'>
        {roverData && (
          <div>
            {Object.entries(roverData).map(([k, v]) => (
              <p key={k}>
                {k}: {Array.isArray(v) ? `Array with ${v.length} items` : v}
              </p>
            ))}
            <p>Current Time: {Date.now()}</p>
          </div>
        )}
      </div>

      <br />

      <div id='photos'>
        {photos.length > 0 ? (
          <div className='flex flex-col'>
            <div className='flex flex-wrap gap-2 justify-center items-center'>
              {photos
                .slice(photoStartIndex, photoStartIndex + search.photoPerPage)
                .map((p, i) => (
                  <Image
                    key={i}
                    src={p.img_src}
                    alt={i.toString()}
                    height={300}
                    width={300}
                  />
                ))}
            </div>
            <div className='flex gap-2 justify-center my-4'>
              Page:{' '}
              {range(Math.ceil(photos.length / search.photoPerPage)).map(
                (_, i) => (
                  <button
                    className={
                      search.currentPage === i + 1
                        ? 'bg-slate-700 text-slate-100'
                        : 'bg-slate-100'
                    }
                    key={i}
                    onClick={() =>
                      setSearch((prev) => ({ ...prev, currentPage: i + 1 }))
                    }
                  >
                    {i + 1}
                  </button>
                )
              )}
            </div>
          </div>
        ) : (
          <p>No photos</p>
        )}
      </div>
    </main>
  );
}
