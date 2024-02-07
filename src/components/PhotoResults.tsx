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
  const messageContext = React.useContext(MessageContext);
  const { data: session } = useSession();

  const fetchFavorites = React.useCallback(async () => {
    console.log('fetch favorites photoresults');
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

      messageContext.addMessage({
        text: errMsg,
        type: 'Error',
      });
    }
  }, [messageContext.addMessage]);

  React.useEffect(() => {
    console.log('photores effect', session);
    if (!session) {
      return;
    }
    fetchFavorites();
  }, [fetchFavorites]);

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
    messageContext.addMessage({
      text: `Click on an image to view it in fullscreen, click on the fullscreen image or press the 'Esc' key to exit fullscreen. (Tip: You can use the left/right arrow keys to navigate between pages.)`,
      type: 'Info',
    });
  };

  const toggleFavorites = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    photo: {
      photoId: number;
      src: string;
      rover: Rover | '';
      sol: number | '';
      camera: CameraTypes;
    },
    isFavorite: boolean
  ) => {
    e.stopPropagation();

    if (!session) {
      messageContext.addMessage({
        text: 'Please login first.',
        type: 'Warning',
      });
      return;
    }

    console.log(photo);
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

      messageContext.addMessage({
        text: errMsg,
        type: 'Error',
      });
    } finally {
      console.log('photores finally');
      fetchFavorites();
    }
  };

  return (
    <section
      className={combineClassNames(
        'grow p-4 w-full h-full max-w-screen-xl bg-no-repeat bg-center',
        'relative flex flex-col border-2 border-slate-400 rounded',
        className
      )}
      {...delegated}
      style={photos.isFetching ? getBackgroundImageStyle() : {}}
    >
      <div className='flex flex-row justify-between gap-8 mx-auto px-2 max-w-lg w-full'>
        <label className='flex flex-col xs:flex-row gap-2 justify-center items-center my-2'>
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

        <label className='flex flex-col xs:flex-row gap-2 justify-center items-center my-2'>
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

      <p className='text-center m-2'>
        Showing photo number {photoStartIndex + 1}{' '}
        {photos.photoPerPage > 1 &&
          totalPhotos > 1 &&
          `to ${Math.min(
            photoStartIndex + photos.photoPerPage,
            totalPhotos
          )}`}{' '}
        out of {totalPhotos}
      </p>

      <div className='grid auto-cols-fr grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 justify-center m-2 h-full min-h-40'>
        {!photos.isFetching &&
          photoArr
            .slice(photoStartIndex, photoStartIndex + photos.photoPerPage)
            .map((p) => {
              const isFavorite = favorites.includes(p.img_id);
              const photo = {
                photoId: p.img_id,
                src: p.img_src,
                rover: photos.rover,
                sol: photos.sol,
                camera: p.camera.name,
              };
              return (
                <div className='relative' key={p.img_id}>
                  <button
                    className={combineClassNames(
                      'relative max-w-lg w-full cursor-zoom-in aspect-square',
                      'ring-offset-2 focus-visible:ring-4',
                      'bg-no-repeat bg-center'
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
                    className='bg-slate-300 border border-slate-600 rounded-xl p-0.5 cursor-pointer absolute top-1 right-1 focus-visible:ring'
                  >
                    <HeartIcon isFavorite={isFavorite} />
                  </button>
                </div>
              );
            })}
      </div>

      <div className='flex justify-center items-center gap-4'>
        <label>
          <button
            onClick={() => updatePhotoPage(photos.currentPage - 1, maxPage)}
            value={photos.currentPage}
            className='focus-visible:ring cursor-pointer disabled:cursor-not-allowed'
            disabled={
              photos.isFetching || display.fullscreen || photos.currentPage <= 1
            }
          >
            ←
          </button>
        </label>

        <label className='flex gap-2 justify-center items-center my-2'>
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
            className='focus-visible:ring cursor-pointer disabled:cursor-not-allowed'
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
          className='cursor-pointer absolute top-1 right-1 focus-visible:ring'
        >
          <HelpIcon />
        </button>
      </div>

      {display.fullscreen && (
        <div className='flex justify-center items-center backdrop-blur fixed h-screen w-screen inset-0'>
          <button
            className={combineClassNames(
              'relative w-screen h-screen cursor-zoom-out',
              'bg-no-repeat bg-center'
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
