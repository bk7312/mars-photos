'use client';
import React from 'react';
import { RoverPhotos, CameraTypes } from '@/lib/types';
import Image from 'next/image';
import { range } from '@/lib/utils';
import { isDev } from '@/lib/constants';

type PhotoResultsPropType = {
  photos: RoverPhotos;
  updatePhotosPerPage: (photoPerPage: number, totalPhotos: number) => void;
  updatePhotoPage: (page: number, maxPage: number) => void;
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
  updatePhotosPerPage,
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

  const photoArr =
    photos.currentCamera === 'ALL' || photos.currentCamera === undefined
      ? photos.src
      : photos.src.filter((p) => p.camera.name === photos.currentCamera);
  const totalPhotos = photoArr.length;

  if (totalPhotos === 0) {
    return <></>;
  }

  const photoStartIndex = (photos.currentPage - 1) * photos.photoPerPage;
  const maxPage = Math.ceil(totalPhotos / photos.photoPerPage) + 1;

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
      <div id='photos' className='flex flex-col'>
        <div className='flex justify-center gap-4 mx-3'>
          <label className='flex gap-2 justify-center items-center my-2'>
            <p>Photos per page:</p>
            <input
              type='number'
              name='photoPerPage'
              id='photoPerPage'
              onChange={(e) =>
                updatePhotosPerPage(e.target.valueAsNumber, totalPhotos)
              }
              value={photos.photoPerPage}
              min={1}
              className='w-16 px-2 py-1'
            />{' '}
          </label>

          <label className='flex gap-2 justify-center items-center my-2'>
            <p>Showing page:</p>
            <input
              type='number'
              name='currentPage'
              id='currentPage'
              onChange={(e) => updatePhotoPage(e.target.valueAsNumber, maxPage)}
              value={photos.currentPage}
              min={1}
              className='w-16 px-2 py-1'
            />{' '}
          </label>
        </div>

        <p className='text-center m-2'>
          Showing photo number {photoStartIndex + 1}{' '}
          {photos.photoPerPage > 1 &&
            totalPhotos > 1 &&
            `to ${Math.min(
              photoStartIndex + photos.photoPerPage,
              totalPhotos
            )}`}{' '}
          out of {totalPhotos}{' '}
        </p>

        <div className='flex flex-wrap gap-2 justify-center border-2 m-2'>
          {photoArr
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

        <div className='flex flex-wrap gap-2 justify-center my-2'>
          Page:{' '}
          {range(1, maxPage).map((i) => (
            <button
              className={
                photos.currentPage === i
                  ? 'bg-slate-700 text-slate-100 px-1'
                  : 'bg-slate-100 px-1'
              }
              key={i}
              onClick={() => updatePhotoPage(i, maxPage)}
            >
              {i}
            </button>
          ))}
        </div>
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
