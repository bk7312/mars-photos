'use client';
import React from 'react';
import { RoverPhotos } from '@/lib/types';
import Image from 'next/image';
import { range } from '@/lib/utils';
import { isDev } from '@/lib/constants';

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

  React.useEffect(() => {
    const escHandler = (e: KeyboardEvent) => {
      isDev && console.log('User pressed: ', e.key);
      if (display.fullscreen !== true) {
        return;
      }
      e.preventDefault();

      if (e.key === 'Escape') {
        setDisplay({ fullscreen: false });
      }
    };
    document.addEventListener('keydown', escHandler);

    return () => {
      document.removeEventListener('keydown', escHandler);
    };
  }, [display.fullscreen]);

  const photoStartIndex = (photos.currentPage - 1) * photos.photoPerPage;
  const maxPage = Math.ceil(photos.src.length / photos.photoPerPage) + 1;

  const toggleFullscreen = (e: React.MouseEvent<HTMLButtonElement>) => {
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
    <section className='flex flex-col border-2 border-slate-500 rounded p-2 m-2'>
      <div id='photos' className=''>
        {photos.src.length > 0 ? (
          <div className='flex flex-col '>
            <p className='text-center m-2'>
              Showing photos {photoStartIndex + 1} to{' '}
              {Math.min(
                photoStartIndex + photos.photoPerPage,
                photos.src.length
              )}{' '}
              (Total: {photos.src.length}{' '}
              {photos.src.length === 1 ? 'photo' : 'photos'})
            </p>

            <label className='text-center'>
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

            <div className='flex flex-wrap gap-2 justify-center border-2'>
              {photos.src
                .slice(photoStartIndex, photoStartIndex + photos.photoPerPage)
                .map((p) => (
                  <button
                    key={p.img_alt}
                    className='relative max-w-lg w-64 cursor-pointer aspect-square flex-grow'
                    data-img-src={p.img_src}
                    onClick={toggleFullscreen}
                  >
                    <Image
                      src={p.img_src}
                      alt={p.img_alt}
                      fill={true}
                      sizes='300px'
                      className='object-contain'
                    />
                  </button>
                ))}
            </div>
          </div>
        ) : (
          <p>No photos</p>
        )}
      </div>

      {display.fullscreen && (
        <button
          className='flex justify-center items-center backdrop-blur fixed h-screen w-screen inset-0'
          onClick={toggleFullscreen}
        >
          <div className='relative w-[1000px] m-4 sm:m-8 cursor-pointer aspect-square'>
            <Image
              src={display.src}
              alt={display.alt}
              fill={true}
              sizes='1000px'
              className='object-contain'
            />
          </div>
        </button>
      )}
    </section>
  );
}
