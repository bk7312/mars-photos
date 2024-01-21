'use client';
import React from 'react';
import { RoverPhotos } from '@/lib/types';
import Image from 'next/image';
import { range } from '@/lib/utils';

type PhotoResultsPropType = {
  photos: RoverPhotos;
  updatePhotos: (photoPerPage: number) => void;
  updatePhotoPage: (page: number) => void;
};

export default function PhotoResults({
  photos,
  updatePhotos,
  updatePhotoPage,
}: PhotoResultsPropType) {
  const photoStartIndex = (photos.currentPage - 1) * photos.photoPerPage;
  const maxPage = Math.ceil(photos.src.length / photos.photoPerPage) + 1;

  return (
    <section className='flex flex-col items-center'>
      <label>
        Photos per page:{' '}
        <input
          type='number'
          name='photoPerPage'
          id='photoPerPage'
          onChange={(e) => updatePhotos(e.target.valueAsNumber)}
          value={photos.photoPerPage}
          min={1}
        />
      </label>

      <br />

      <div id='photos'>
        {photos.src.length > 0 ? (
          <div className='flex flex-col'>
            <p className='text-center'>
              {photos.src.length} {photos.src.length === 1 ? 'photo' : 'photos'}{' '}
              found
            </p>
            <br />
            <div className='flex flex-wrap gap-2 justify-center items-center'>
              {photos.src
                .slice(photoStartIndex, photoStartIndex + photos.photoPerPage)
                .map((p) => (
                  <Image
                    key={p.img_alt}
                    src={p.img_src}
                    alt={p.img_alt}
                    height={300}
                    width={300}
                  />
                ))}
            </div>
            <div className='flex flex-wrap gap-2 justify-center my-4'>
              Page:{' '}
              {range(1, maxPage).map((i) => (
                <button
                  className={
                    photos.currentPage === i
                      ? 'bg-slate-700 text-slate-100'
                      : 'bg-slate-100'
                  }
                  key={i}
                  onClick={() => updatePhotoPage(i)}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p>No photos</p>
        )}
      </div>
    </section>
  );
}
