'use client';
import React from 'react';
import Image from 'next/image';
import {
  combineClassNames,
  getBackgroundImageStyle,
  setWithinRange,
} from '@/lib/utils';
import { isDev } from '@/lib/constants';
import { MessageContext } from '@/context/MessageContext';
import { useSession } from 'next-auth/react';
import HelpIcon from '@/components/icons/HelpIcon';
import CloseIcon from '@/components/icons/CloseIcon';
import useFavorites from '@/hooks/useFavorites';
import { imageError, imageLoaded } from '@/lib/imageHelper';

export default function Favorites() {
  const {
    photos,
    totalPhotos,
    updatePhotoPage,
    updatePhotosPerPage,
    maxPage,
    display,
    toggleFullscreen,
    photoStartIndex,
    askConfirm,
    setAskConfirm,
    removeFromFavorites,
    updateNote,
  } = useFavorites();

  const { addMessage } = React.useContext(MessageContext);

  if (!photos.isFetching && totalPhotos === 0) {
    return <>{photos.init ? 'Loading...' : 'No photos yet'}</>;
  }

  const showHelp = () => {
    addMessage({
      text: `You can add notes to your favorited photos, just remember to click save once you're done. Note that removing a photo from favorites will delete your note.`,
      type: 'Info',
    });
  };

  return (
    <section
      className={combineClassNames(
        'h-full w-full max-w-screen-xl grow bg-center bg-no-repeat p-4',
        'relative flex flex-col rounded border-2 border-slate-400'
      )}
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

      <div className='m-2 flex flex-col justify-center gap-6'>
        {photos.src
          .slice(photoStartIndex, photoStartIndex + photos.photoPerPage)
          .map((p) => {
            return (
              <div
                className='flex min-h-60 w-full flex-col gap-2 sm:flex-row sm:gap-4 md:gap-6'
                key={p.photoId}
              >
                <div className='relative aspect-square min-w-60 md:min-w-80 lg:min-w-96'>
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
                    onClick={(e) =>
                      setAskConfirm((prev) =>
                        prev === p.photoId ? '' : p.photoId
                      )
                    }
                    className='absolute right-1 top-1 cursor-pointer rounded-xl border border-slate-600 bg-slate-300 p-0.5 hover:scale-125 focus-visible:ring dark:bg-slate-500'
                  >
                    <CloseIcon />
                  </button>
                  {askConfirm === p.photoId && (
                    <div className='confirm-delete absolute right-0 top-8'>
                      <div className='absolute -top-1 right-3 h-2 w-2 translate-x-0.5 rotate-45 bg-red-600'></div>
                      <button
                        className='relative flex items-center gap-3 rounded-lg bg-red-600 p-2 text-white hover:scale-110 focus-visible:ring'
                        onClick={(e) => removeFromFavorites(e, p.photoId)}
                      >
                        Confirm delete?
                      </button>
                    </div>
                  )}
                </div>
                <div className='min-h-full w-full'>
                  <p className='text-sm italic md:text-base'>{p.alt}</p>

                  <form
                    className='relative flex min-h-full w-full flex-col gap-2'
                    onSubmit={(e) => updateNote(e, p.photoId)}
                    method='POST'
                  >
                    <label className=''>
                      <p className='my-1 text-lg'>Notes:</p>
                      <textarea
                        rows={3}
                        name='note'
                        className='w-full px-2 py-1 sm:h-28 md:h-48 lg:h-60 dark:bg-slate-800'
                        defaultValue={p.note ? p.note : ''}
                      />
                    </label>
                    <button
                      type='submit'
                      className='absolute right-0 top-0 rounded bg-slate-200 px-2 py-1 dark:bg-slate-800'
                    >
                      Save
                    </button>
                  </form>
                </div>
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
