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

// type PhotoResultsPropType = {
//   photos: RoverPhotos;
//   updatePhotosPerPage: (photoPerPage: number, totalPhotos: number) => void;
//   updatePhotoPage: (page: number, maxPage: number) => void;
//   className?: string;
//   [key: string]: any;
// };

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
  });

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
      setPhotos((prev) => ({ ...prev, isFetching: false }));
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
    const handleKeyDown = (e: KeyboardEvent) => {
      isDev && console.log('User pressed: ', e.key);
      if (display.fullscreen !== true) {
        if (e.key === 'ArrowRight' && photos.currentPage < maxPage) {
          updatePhotoPage(photos.currentPage + 1, maxPage);
        } else if (e.key === 'ArrowLeft' && photos.currentPage > 1) {
          updatePhotoPage(photos.currentPage - 1, maxPage);
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
  }, [display.fullscreen, updatePhotoPage, photos.currentPage, maxPage]);

  if (!photos.isFetching && totalPhotos === 0) {
    return <>No photos yet</>;
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
      text: `Click on an image to view it in fullscreen, click on the fullscreen image or press the 'Esc' key to exit fullscreen. (Tip: You can use the left/right arrow keys to navigate between pages.)`,
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
    // PUT request to /api/favorites
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

      <div className='m-2 flex flex-col justify-center gap-2'>
        {photos.favorites
          .slice(photoStartIndex, photoStartIndex + photos.photoPerPage)
          .map((p) => {
            return (
              <div className='flex h-60 w-full gap-4' key={p.photoid}>
                <div className='relative aspect-square min-w-60'>
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
                    onClick={(e) => removeFromFavorites(e, p.photoid)}
                    className='absolute right-1 top-1 cursor-pointer rounded-xl border border-slate-600 bg-slate-300 p-0.5 hover:scale-125 focus-visible:ring'
                  >
                    <CloseIcon />
                  </button>
                </div>
                <form
                  className='flex w-full flex-col gap-2'
                  onSubmit={(e) => updateNote(e, p.photoid)}
                  method='POST'
                >
                  <label className=''>
                    Notes:
                    <textarea
                      rows={3}
                      name='note'
                      className='h-full w-full px-2 py-1'
                      defaultValue={p.note ? p.note : ''}
                    />
                  </label>
                  <button type='submit'>Update Note</button>
                </form>
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
