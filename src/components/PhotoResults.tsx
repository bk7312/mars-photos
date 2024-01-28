'use client';
import React from 'react';
import { RoverPhotos } from '@/lib/types';
import Image from 'next/image';
import { combineClassNames } from '@/lib/utils';
import { isDev } from '@/lib/constants';

type PhotoResultsPropType = {
  photos: RoverPhotos;
  updatePhotosPerPage: (photoPerPage: number, totalPhotos: number) => void;
  updatePhotoPage: (page: number, maxPage: number) => void;
  className?: string;
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
  className = '',
  ...delegated
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

  if (totalPhotos === 0 && !photos.isFetching) {
    isDev && console.log('Skipped rendering, no photos and not fetching');
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

  isDev && console.log({ display, photos, photoArr });

  return (
    <section
      className={combineClassNames(
        'grow p-4 w-full max-w-screen-xl',
        className
      )}
      {...delegated}
    >
      <div
        id='photos'
        className='flex flex-col border border-slate-500 rounded p-4 h-full bg-no-repeat bg-center'
        style={
          photos.isFetching
            ? { backgroundImage: "url('/loading-bar.gif')" }
            : {}
        }
      >
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
              className='w-16 px-2 py-1 focus-visible:ring'
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
              className='w-16 px-2 py-1 focus-visible:ring'
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

        <div className='flex flex-wrap gap-2 justify-center m-2 h-full'>
          {!photos.isFetching &&
            photoArr
              .slice(photoStartIndex, photoStartIndex + photos.photoPerPage)
              .map((p) => (
                <button
                  key={p.img_alt}
                  className={combineClassNames(
                    'relative max-w-lg w-64 cursor-zoom-in aspect-square flex-grow focus-visible:ring',
                    'bg-no-repeat bg-center'
                  )}
                  style={{ backgroundImage: "url('/loading-bar.gif')" }}
                  onClick={toggleFullscreen}
                  data-img-src={p.img_src}
                >
                  <Image
                    src={p.img_src}
                    alt={p.img_alt}
                    title={p.img_alt}
                    fill={true}
                    sizes='300px'
                    className='object-contain'
                  />
                </button>
              ))}
        </div>

        <label className='flex gap-2 justify-center items-center my-2'>
          <p>Go to page</p>
          <input
            type='number'
            name='currentPage'
            id='currentPage-2'
            onChange={(e) => updatePhotoPage(e.target.valueAsNumber, maxPage)}
            value={photos.currentPage}
            min={1}
            className='w-16 px-2 py-1 focus-visible:ring'
          />{' '}
          of {maxPage}
        </label>
      </div>

      {display.fullscreen && (
        <div className='flex justify-center items-center backdrop-blur fixed h-screen w-screen inset-0'>
          <button
            className={combineClassNames(
              'relative w-[1000px] m-4 sm:m-8 cursor-zoom-out aspect-square',
              'bg-no-repeat bg-center'
            )}
            style={{ backgroundImage: "url('/loading-bar.gif')" }}
            onClick={toggleFullscreen}
          >
            <Image
              src={display.src}
              alt={display.alt}
              title={display.alt}
              fill={true}
              sizes='1000px'
              className='object-contain'
            />
          </button>
        </div>
      )}
    </section>
  );
}
