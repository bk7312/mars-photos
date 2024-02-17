'use client';
import React from 'react';
import { Rover, RoverPhotos, CameraTypes } from '@/lib/types';
import Image from 'next/image';
import { combineClassNames, getBackgroundImageStyle } from '@/lib/utils';
import { isDev } from '@/lib/constants';
import { MessageContext } from '@/context/MessageContext';
import { useSession } from 'next-auth/react';
import HeartIcon from './icons/HeartIcon';
import HelpIcon from './icons/HelpIcon';
import useFavorites from '@/hooks/useFavorites';
import usePhotos from '@/hooks/usePhotos';
import { imageError, imageLoaded } from '@/lib/imageHelper';

type PhotoResultsPropType = {
  initPhotos: RoverPhotos;
  // updatePhotosPerPage: (photoPerPage: number, totalPhotos: number) => void;
  // updatePhotoPage: (page: number, maxPage: number) => void;
  className?: string;
  [key: string]: any;
};

export default function PhotoResults({
  initPhotos,
  // updatePhotosPerPage,
  // updatePhotoPage,
  className = '',
  ...delegated
}: PhotoResultsPropType) {
  const {
    totalPhotos,
    display,
    maxPage,
    updatePhotoPage,
    updatePhotosPerPage,
    photoStartIndex,
    photos,
    photoArr,
    favorites,
    toggleFullscreen,
    toggleFavorites,
  } = usePhotos(initPhotos);

  const { addMessage } = React.useContext(MessageContext);

  isDev && console.log('photoresults', { initPhotos, photos, photoArr });

  if (!photos.isFetching && totalPhotos === 0) {
    isDev && console.log('Skipped rendering, no photos and not fetching');
    return <></>;
  }

  const showHelp = () => {
    addMessage({
      text: `Click on an image to view it in fullscreen, click on the fullscreen image or press the 'Esc' key to exit fullscreen. (Tip: You can use the left/right arrow keys to navigate between pages.)`,
      type: 'Info',
    });
  };

  return (
    <section
      className={combineClassNames(
        'h-full w-full max-w-screen-xl grow bg-center bg-no-repeat p-4',
        'relative flex flex-col rounded border-2 border-slate-400',
        className
      )}
      {...delegated}
      style={photos.isFetching ? getBackgroundImageStyle() : {}}
    >
      <div className='mx-auto flex w-full max-w-lg flex-row justify-between gap-8 px-2'>
        <label className='my-2 flex flex-col items-center justify-center gap-2 xs:flex-row'>
          <p>Showing page:</p>
          <input
            type='number'
            name='currentPage'
            id='currentPage'
            onChange={(e) => updatePhotoPage(e.target.valueAsNumber, maxPage)}
            value={photos.currentPage}
            min={1}
            className='w-16 px-2 py-1 focus-visible:ring dark:bg-slate-800'
            disabled={photos.isFetching || display.fullscreen}
          />
        </label>

        <label className='my-2 flex flex-col items-center justify-center gap-2 xs:flex-row'>
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
            className='w-16 px-2 py-1 focus-visible:ring dark:bg-slate-800'
            disabled={photos.isFetching || display.fullscreen}
          />
        </label>
      </div>

      <p className='m-2 text-center'>
        Showing photo number {photoStartIndex + 1}{' '}
        {photos.photoPerPage > 1 &&
          totalPhotos > 1 &&
          `to ${Math.min(
            photoStartIndex + photos.photoPerPage,
            totalPhotos
          )}`}{' '}
        out of {totalPhotos}
      </p>

      <div className='m-2 grid h-full min-h-40 auto-cols-fr grid-cols-1 justify-center gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {!photos.isFetching &&
          photoArr
            .slice(photoStartIndex, photoStartIndex + photos.photoPerPage)
            .map((p) => {
              const isFavorite = favorites.includes(p.photoId);

              return (
                <div className='relative' key={p.photoId}>
                  <button
                    className={combineClassNames(
                      'relative aspect-square w-full max-w-lg cursor-zoom-in',
                      'ring-offset-2 focus-visible:ring-4',
                      'bg-center bg-no-repeat'
                    )}
                    style={getBackgroundImageStyle()}
                    onClick={toggleFullscreen}
                    data-img-src={p.src}
                    disabled={photos.isFetching || display.fullscreen}
                  >
                    <Image
                      src={p.src}
                      alt={p.alt}
                      title={p.alt}
                      onLoad={imageLoaded}
                      onError={imageError}
                      fill={true}
                      sizes='300px'
                      className='object-contain'
                    />
                  </button>
                  <button
                    onClick={(e) => toggleFavorites(e, p, isFavorite)}
                    className='absolute right-1 top-1 cursor-pointer rounded-xl border border-slate-600 bg-slate-300 p-0.5 hover:scale-125 focus-visible:ring'
                  >
                    <HeartIcon isFavorite={isFavorite} />
                  </button>
                </div>
              );
            })}
      </div>

      <div className='flex items-center justify-center gap-4'>
        <label>
          <button
            onClick={() => updatePhotoPage(photos.currentPage - 1, maxPage)}
            value={photos.currentPage}
            className='cursor-pointer focus-visible:ring disabled:cursor-not-allowed'
            disabled={
              photos.isFetching || display.fullscreen || photos.currentPage <= 1
            }
          >
            ←
          </button>
        </label>

        <label className='my-2 flex items-center justify-center gap-2'>
          <p>Page</p>
          <input
            type='number'
            name='currentPage'
            id='currentPage-2'
            onChange={(e) => updatePhotoPage(e.target.valueAsNumber, maxPage)}
            value={photos.currentPage}
            min={1}
            className='w-16 px-2 py-1 focus-visible:ring dark:bg-slate-800'
            disabled={photos.isFetching || display.fullscreen}
          />{' '}
          / {maxPage}
        </label>

        <label>
          <button
            onClick={() => updatePhotoPage(photos.currentPage + 1, maxPage)}
            value={photos.currentPage}
            className='cursor-pointer focus-visible:ring disabled:cursor-not-allowed'
            disabled={
              photos.isFetching ||
              display.fullscreen ||
              photos.currentPage >= maxPage
            }
          >
            →
          </button>
        </label>

        <button
          onClick={showHelp}
          className='absolute right-1 top-1 cursor-pointer hover:scale-125 focus-visible:ring'
        >
          <HelpIcon />
        </button>
      </div>

      {display.fullscreen && (
        <div className='fixed inset-0 flex h-screen w-screen items-center justify-center backdrop-blur'>
          <button
            className={combineClassNames(
              'relative h-screen w-screen cursor-zoom-out',
              'bg-center bg-no-repeat'
            )}
            style={getBackgroundImageStyle()}
            onClick={toggleFullscreen}
          >
            <Image
              src={display.src}
              alt={display.alt}
              title={display.alt}
              onLoad={imageLoaded}
              onError={(e) => imageError(e, 'not-found-full.png', true)}
              fill={true}
              sizes='100vw'
              className='object-contain'
            />
          </button>
        </div>
      )}
    </section>
  );
}
