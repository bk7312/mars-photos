'use client';
import React from 'react';
import { Rover, CameraTypes, RoverPhotos, RoverPhotoSrc } from '@/lib/types';
import { isDev } from '@/lib/constants';
import { MessageContext } from '@/context/MessageContext';
import { useSession } from 'next-auth/react';
import { setWithinRange } from '@/lib/utils';

type DisplayType =
  | {
      fullscreen: false;
    }
  | {
      fullscreen: true;
      src: string;
      alt: string;
    };

function usePhotos(init: RoverPhotos) {
  const [display, setDisplay] = React.useState<DisplayType>({
    fullscreen: false,
  });

  const [photos, setPhotos] = React.useState<RoverPhotos>(init);

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
        setFavorites(data.map((d: { photoId: number }) => d.photoId));
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

  React.useEffect(() => {
    setPhotos(init);
  }, [init]);

  isDev && console.log('uesphoto', { init, photos });

  const photoArr =
    photos.currentCamera === 'ALL' || photos.currentCamera === undefined
      ? photos.src
      : photos.src.filter((p) => p.camera === photos.currentCamera);

  const totalPhotos = photoArr.length;
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

  const toggleFavorites = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    photo: RoverPhotoSrc,
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

  return {
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
  };
}

export default usePhotos;
