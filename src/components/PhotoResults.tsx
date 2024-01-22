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

type DisplayType =
  | {
      fullscreen: false;
    }
  | {
      fullscreen: true;
      src: string;
      alt: string;
    };

export default function PhotoResults({
  photos,
  updatePhotos,
  updatePhotoPage,
}: PhotoResultsPropType) {
  const [display, setDisplay] = React.useState<DisplayType>({
    fullscreen: false,
  });
  const photoStartIndex = (photos.currentPage - 1) * photos.photoPerPage;
  const maxPage = Math.ceil(photos.src.length / photos.photoPerPage) + 1;

  const toggleFullscreen = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (display.fullscreen === true) {
      setDisplay({ fullscreen: false });
      return;
    }

    const child = e.currentTarget.children[0] as HTMLImageElement;
    setDisplay({
      fullscreen: true,
      src: e.currentTarget.dataset.imgSrc ?? '',
      alt: child.alt,
    });
  };

  return (
    <section className='flex flex-col items-center border-2 border-slate-500 rounded p-2 m-2'>
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
              found, showing photos {photoStartIndex + 1} to{' '}
              {Math.min(
                photoStartIndex + photos.photoPerPage,
                photos.src.length
              )}
            </p>
            <br />
            <div className='flex flex-wrap gap-2 justify-center items-center'>
              {photos.src
                .slice(photoStartIndex, photoStartIndex + photos.photoPerPage)
                .map((p) => (
                  <div
                    key={p.img_alt}
                    className='relative w-80 cursor-pointer aspect-square'
                    data-img-src={p.img_src}
                    onClick={toggleFullscreen}
                  >
                    <Image
                      src={p.img_src}
                      alt={p.img_alt}
                      fill={true}
                      sizes='300px'
                    />
                  </div>
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
      {display.fullscreen && (
        <div className='flex justify-center items-center backdrop-blur fixed h-screen w-screen inset-0'>
          <div
            className='relative w-[1000px] m-4 sm:m-8 cursor-pointer aspect-square'
            onClick={toggleFullscreen}
          >
            <Image
              src={display.src}
              alt={display.alt}
              fill={true}
              sizes='300px'
            />
          </div>
        </div>
      )}
    </section>
  );
}
