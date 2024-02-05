'use client';
import React from 'react';
import { RoverPhotos } from '@/lib/types';
import Image from 'next/image';
import { combineClassNames, getBackgroundImageStyle } from '@/lib/utils';
import { isDev } from '@/lib/constants';
import { MessageContext } from '@/context/MessageContext';
import { useSession } from 'next-auth/react';

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

  const messageContext = React.useContext(MessageContext);

  // const { data: session } = useSession();

  if (totalPhotos === 0 && !photos.isFetching) {
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
    messageContext?.addMessage({
      text: `Click on an image to view it in fullscreen, click on the fullscreen image or press the 'Esc' key to exit fullscreen. (Tip: You can use the left/right arrow keys to navigate between pages.)`,
      type: 'Info',
    });
  };

  const toggleFavorites = async (id: number) => {
    // check db if favorite or not
    // post to add to fav
    // delete to remove from fav
    console.log(id);
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
            .map((p) => (
              <button
                key={p.img_id}
                className={combineClassNames(
                  'relative max-w-lg w-full cursor-zoom-in aspect-square focus-visible:ring',
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
            ))}
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
          <svg
            width='24px'
            height='24px'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M12 17H12.01M12 14C12.8906 12.0938 15 12.2344 15 10C15 8.5 14 7 12 7C10.4521 7 9.50325 7.89844 9.15332 9M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z'
              stroke='#777'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
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
