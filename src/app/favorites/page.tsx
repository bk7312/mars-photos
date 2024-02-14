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

type FavoritesType = {
  photoid: number;
  src: string;
  alt: string;
  rover: string;
  sol: number;
  camera: string;
  note?: string;
};

type PhotosType = {
  favorites: FavoritesType[];
  currentPage: number;
  photoPerPage: number;
  isFetching: boolean;
  init: boolean;
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

export default function Favorites() {
  const [display, setDisplay] = React.useState<DisplayType>({
    fullscreen: false,
  });

  const [photos, setPhotos] = React.useState<PhotosType>({
    favorites: [],
    currentPage: 1,
    photoPerPage: 12,
    isFetching: false,
    init: true,
  });

  const [askConfirm, setAskConfirm] = React.useState<number | ''>('');

  const { addMessage } = React.useContext(MessageContext);
  const { data: session } = useSession();

  const fetchFavorites = React.useCallback(async () => {
    setPhotos((prev) => ({ ...prev, isFetching: true }));
    console.log('fetch favorites favpage');
    try {
      const res = await fetch('/api/favorites/');

      if (!res.ok) {
        const { error } = await res.json();
        isDev && console.error('error received:', error);
        throw new Error(error);
      }

      const { data } = await res.json();
      isDev && console.log({ data });
      if (data) {
        console.log(data);
        setPhotos((prev) => ({
          ...prev,
          favorites: data,
        }));
      }
    } catch (error) {
      isDev && console.log('caught error', error);
      const err = error as Error;
      isDev && console.log(err.name, err.message);

      let errMsg = err?.message ?? 'Something went wrong';

      if (err.message === 'Failed to fetch') {
        errMsg = 'Failed to fetch, possibly no internet connection.';
      }

      addMessage({
        text: errMsg,
        type: 'Error',
      });
    } finally {
      setPhotos((prev) => ({ ...prev, isFetching: false, init: false }));
    }
  }, [addMessage]);

  React.useEffect(() => {
    console.log('favPage effect', session);
    if (!session) {
      return;
    }
    fetchFavorites();
  }, [fetchFavorites, session]);

  isDev && console.log('logging favorites', photos.favorites);

  const totalPhotos = photos.favorites.length;

  const photoStartIndex = (photos.currentPage - 1) * photos.photoPerPage;
  const maxPage = Math.ceil(totalPhotos / photos.photoPerPage);

  const updatePhotosPerPage = (photoPerPage: number, totalPhotos: number) => {
    setPhotos((prev) => {
      photoPerPage = setWithinRange(photoPerPage, 1);
      const maxPage = Math.ceil(totalPhotos / photoPerPage);
      return {
        ...prev,
        currentPage: setWithinRange(prev.currentPage, 1, maxPage),
        photoPerPage,
      };
    });
  };

  const updatePhotoPage = React.useCallback((page: number, maxPage: number) => {
    setPhotos((prev) => {
      return {
        ...prev,
        currentPage: setWithinRange(page, 1, maxPage),
      };
    });
  }, []);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Element;
      const isPopup =
        target.classList.contains('confirmDelete') ||
        target.parentElement?.classList.contains('confirmDelete');

      if (askConfirm !== '' && !isPopup) {
        setAskConfirm('');
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [askConfirm]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      isDev && console.log('User pressed: ', e.key);
      if (display.fullscreen !== true) {
        if (e.key === 'ArrowRight' && photos.currentPage < maxPage) {
          updatePhotoPage(photos.currentPage + 1, maxPage);
        } else if (e.key === 'ArrowLeft' && photos.currentPage > 1) {
          updatePhotoPage(photos.currentPage - 1, maxPage);
        }

        if (e.key === 'Escape' && askConfirm !== '') {
          setAskConfirm('');
        }

        return;
      }

      // preventDefault to block keyboard tab navigation while fullscreen
      e.preventDefault();
      if (e.key === 'Escape') {
        setDisplay({ fullscreen: false });
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    display.fullscreen,
    updatePhotoPage,
    photos.currentPage,
    maxPage,
    askConfirm,
  ]);

  if (!photos.isFetching && totalPhotos === 0) {
    return <>{photos.init ? 'Loading...' : 'No photos yet'}</>;
  }

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

  const imageLoaded = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!e.currentTarget.parentElement) {
      return;
    }
    e.currentTarget.parentElement.style.backgroundImage = '';
  };

  const imageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    url: string = 'img-not-found.png',
    contain: boolean = false
  ) => {
    if (!e.currentTarget.parentElement) {
      return;
    }
    if (contain) {
      e.currentTarget.parentElement.classList.add('bg-contain');
    }
    e.currentTarget.parentElement.style.backgroundImage = `url(${url})`;
  };

  const showHelp = () => {
    console.log('help');
    addMessage({
      text: `You can add notes to your favorited photos, just remember to click save once you're done. Note that removing a photo from favorites will delete your note.`,
      type: 'Info',
    });
  };

  const removeFromFavorites = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    photoId: number
  ) => {
    e.stopPropagation();

    if (!session) {
      addMessage({
        text: 'Please login first.',
        type: 'Warning',
      });
      return;
    }

    try {
      const res = await fetch('/api/favorites', {
        method: 'DELETE',
        body: JSON.stringify({ photoId }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        isDev && console.error('error received:', error);
        throw new Error(error);
      }

      const { data } = await res.json();
      isDev && console.log({ data });
    } catch (error) {
      isDev && console.log('caught error', error);
      const err = error as Error;
      isDev && console.log(err.name, err.message);

      let errMsg = err?.message ?? 'Something went wrong';

      if (err.message === 'Failed to fetch') {
        errMsg = 'Failed to fetch, possibly no internet connection.';
      }

      addMessage({
        text: errMsg,
        type: 'Error',
      });
    } finally {
      fetchFavorites();
    }
  };

  const updateNote = async (
    e: React.FormEvent<HTMLFormElement>,
    photoId: number
  ) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const note = formData.get('note');
    console.log({ photoId, note });

    if (!session) {
      addMessage({
        text: 'Please login first.',
        type: 'Warning',
      });
      return;
    }

    try {
      const res = await fetch('/api/favorites', {
        method: 'PUT',
        body: JSON.stringify({ photoId, note }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        isDev && console.error('error received:', error);
        throw new Error(error);
      }

      const { data } = await res.json();
      isDev && console.log({ data });
      addMessage({
        text: 'Note saved!',
        type: 'Info',
      });
    } catch (error) {
      isDev && console.log('caught error', error);
      const err = error as Error;
      isDev && console.log(err.name, err.message);

      let errMsg = err?.message ?? 'Something went wrong';

      if (err.message === 'Failed to fetch') {
        errMsg = 'Failed to fetch, possibly no internet connection.';
      }

      addMessage({
        text: errMsg,
        type: 'Error',
      });
    }
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
            className='w-16 px-2 py-1 focus-visible:ring'
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
            className='w-16 px-2 py-1 focus-visible:ring'
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
        {photos.favorites
          .slice(photoStartIndex, photoStartIndex + photos.photoPerPage)
          .map((p) => {
            return (
              <div
                className='flex min-h-60 w-full flex-col gap-2 sm:flex-row sm:gap-4 md:gap-6'
                key={p.photoid}
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
                        prev === p.photoid ? '' : p.photoid
                      )
                    }
                    className='absolute right-1 top-1 cursor-pointer rounded-xl border border-slate-600 bg-slate-300 p-0.5 hover:scale-125 focus-visible:ring'
                  >
                    <CloseIcon />
                  </button>
                  {askConfirm === p.photoid && (
                    <div className='confirm-delete absolute right-0 top-8'>
                      <div className='absolute -top-1 right-3 h-2 w-2 translate-x-0.5 rotate-45 bg-red-600'></div>
                      <button
                        className='relative flex items-center gap-3 rounded-lg bg-red-600 p-2 text-white hover:scale-110 focus-visible:ring'
                        onClick={(e) => removeFromFavorites(e, p.photoid)}
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
                    onSubmit={(e) => updateNote(e, p.photoid)}
                    method='POST'
                  >
                    <label className=''>
                      <p className='my-1 text-lg'>Notes:</p>
                      <textarea
                        rows={3}
                        name='note'
                        className='w-full px-2 py-1 sm:h-28 md:h-48 lg:h-60'
                        defaultValue={p.note ? p.note : ''}
                      />
                    </label>
                    <button
                      type='submit'
                      className='absolute right-0 top-0 rounded bg-slate-200 px-2 py-1'
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
            className='w-16 px-2 py-1 focus-visible:ring'
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
