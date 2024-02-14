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

type PhotoResultsPropType = {
  photos: RoverPhotos;
  updatePhotosPerPage: (photoPerPage: number, totalPhotos: number) => void;
  updatePhotoPage: (page: number, maxPage: number) => void;
  className?: string;
  [key: string]: any;
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

  const [favorites, setFavorites] = React.useState<number[]>([]);
  const { addMessage } = React.useContext(MessageContext);
  const { data: session } = useSession();

  const fetchFavorites = React.useCallback(async () => {
    isDev && console.log('fetch favorites photoresults');
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
        setFavorites(data.map((d: { photoid: number }) => d.photoid));
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
    }
  }, [addMessage]);

  React.useEffect(() => {
    if (!session) {
      return;
    }
    fetchFavorites();
  }, [fetchFavorites, session]);

  isDev && console.log(favorites);

  const photoArr =
    photos.currentCamera === 'ALL' || photos.currentCamera === undefined
      ? photos.src
      : photos.src.filter((p) => p.camera.name === photos.currentCamera);
  const totalPhotos = photoArr.length;

  const photoStartIndex = (photos.currentPage - 1) * photos.photoPerPage;
  const maxPage = Math.ceil(totalPhotos / photos.photoPerPage);

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
    isDev && console.log('Skipped rendering, no photos and not fetching');
    return <></>;
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
    addMessage({
      text: `Click on an image to view it in fullscreen, click on the fullscreen image or press the 'Esc' key to exit fullscreen. (Tip: You can use the left/right arrow keys to navigate between pages.)`,
      type: 'Info',
    });
  };

  const toggleFavorites = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    photo: {
      photoId: number;
      src: string;
      alt: string;
      rover: Rover | '';
      sol: number | '';
      camera: CameraTypes;
    },
    isFavorite: boolean
  ) => {
    e.stopPropagation();

    if (!session) {
      addMessage({
        text: 'Please login first.',
        type: 'Warning',
      });
      return;
    }

    const { photoId } = photo;

    try {
      const options = isFavorite
        ? { method: 'DELETE', body: JSON.stringify({ photoId }) }
        : { method: 'POST', body: JSON.stringify(photo) };

      const res = await fetch('/api/favorites', options);

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
              const isFavorite = favorites.includes(p.img_id);
              const photo = {
                photoId: p.img_id,
                src: p.img_src,
                alt: p.img_alt,
                rover: photos.rover,
                sol: photos.sol,
                camera: p.camera.name,
              };
              return (
                <div className='relative' key={p.img_id}>
                  <button
                    className={combineClassNames(
                      'relative aspect-square w-full max-w-lg cursor-zoom-in',
                      'ring-offset-2 focus-visible:ring-4',
                      'bg-center bg-no-repeat'
                    )}
                    style={getBackgroundImageStyle()}
                    onClick={toggleFullscreen}
                    data-img-src={p.img_src}
                    disabled={photos.isFetching || display.fullscreen}
                  >
                    <Image
                      src={p.img_src}
                      alt={p.img_alt}
                      title={p.img_alt}
                      onLoad={imageLoaded}
                      onError={imageError}
                      fill={true}
                      sizes='300px'
                      className='object-contain'
                    />
                  </button>
                  <button
                    onClick={(e) => toggleFavorites(e, photo, isFavorite)}
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
