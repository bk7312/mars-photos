'use client';
import React from 'react';
import { setWithinRange } from '@/lib/utils';
import { isDev } from '@/lib/constants';
import { MessageContext } from '@/context/MessageContext';
import { useSession } from 'next-auth/react';
import { RoverPhotos } from '@/lib/types';

type DisplayType =
  | {
      fullscreen: false;
    }
  | {
      fullscreen: true;
      src: string;
      alt: string;
    };

function useFavorites() {
  const [display, setDisplay] = React.useState<DisplayType>({
    fullscreen: false,
  });

  const [favorites, setFavorites] = React.useState<RoverPhotos>({
    src: [],
    currentPage: 1,
    photoPerPage: 12,
    isFetching: false,
    init: true,
  });

  const [askConfirm, setAskConfirm] = React.useState<number | ''>('');

  const { addMessage } = React.useContext(MessageContext);
  const { data: session } = useSession();

  const fetchFavorites = React.useCallback(async () => {
    setFavorites((prev) => ({ ...prev, isFetching: true }));
    isDev && console.log('fetch favorites favpage');
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
        setFavorites((prev) => ({
          ...prev,
          src: data,
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
      setFavorites((prev) => ({ ...prev, isFetching: false, init: false }));
    }
  }, [addMessage]);

  React.useEffect(() => {
    if (!session) {
      return;
    }
    fetchFavorites();
  }, [fetchFavorites, session]);

  isDev && console.log('logging favorites', favorites.src);

  const totalPhotos = favorites.src.length;
  const photoStartIndex = (favorites.currentPage - 1) * favorites.photoPerPage;
  const maxPage = Math.ceil(totalPhotos / favorites.photoPerPage);

  const updatePhotosPerPage = (photoPerPage: number, totalPhotos: number) => {
    setFavorites((prev) => {
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
    setFavorites((prev) => {
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
        if (e.key === 'ArrowRight' && favorites.currentPage < maxPage) {
          updatePhotoPage(favorites.currentPage + 1, maxPage);
        } else if (e.key === 'ArrowLeft' && favorites.currentPage > 1) {
          updatePhotoPage(favorites.currentPage - 1, maxPage);
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
    favorites.currentPage,
    maxPage,
    askConfirm,
  ]);

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
  return {
    favorites,
    fetchFavorites,
    removeFromFavorites,
    updateNote,
    totalPhotos,
    maxPage,
    photoStartIndex,
    updatePhotoPage,
    updatePhotosPerPage,
    display,
    toggleFullscreen,
    askConfirm,
    setAskConfirm,
  };
}

export default useFavorites;
