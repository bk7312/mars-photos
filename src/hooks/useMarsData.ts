'use client';
import React from 'react';
import {
  Rover,
  RoverSearch,
  RoverPhotos,
  RoverManifest,
  ManifestPhotos,
} from '@/lib/types';
import { ONE_HOUR_IN_MS, isDev } from '@/lib/constants';
import { isArrayStringInObjectKey, setWithinRange } from '@/lib/utils';
import { MessageContext } from '@/context/MessageContext';

function useMarsData() {
  const [search, setSearch] = React.useState<RoverSearch>({
    rover: '',
    sol: '',
    camera: '',
    photoIndex: -1,
    isFetchingManifest: false,
  });
  const [roverData, setRoverData] = React.useState<RoverManifest>(null);
  const [photos, setPhotos] = React.useState<RoverPhotos>({
    src: [],
    currentPage: 1,
    photoPerPage: 12,
    cameraMap: {},
    rover: '',
    sol: '',
    currentCamera: '',
    isFetching: false,
  });

  const messageContext = React.useContext(MessageContext);

  const fetchManifest = React.useCallback(
    async (rover: Rover) => {
      setSearch((prev) => ({ ...prev, isFetchingManifest: true }));

      try {
        const res = await fetch('/api/manifests/', {
          method: 'POST',
          body: JSON.stringify({ rover }),
        });

        isDev && console.log(res);
        if (!res.ok) {
          const { error } = await res.json();
          isDev && console.error('error received:', error);
          throw new Error(error);
        }

        const { data } = await res.json();
        isDev && console.log({ data });

        data.lastUpdated = Date.now();
        setRoverData(data);
        localStorage.setItem(rover, JSON.stringify(data));
        setSearch((prev) => ({
          ...prev,
          sol: data.photos[0].sol,
        }));
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

        setSearch((prev) => ({
          ...prev,
          rover: roverData?.name ?? '',
          sol: '',
          camera: '',
          photoIndex: -1,
        }));
      } finally {
        setSearch((prev) => ({ ...prev, isFetchingManifest: false }));
      }
    },
    [roverData?.name, messageContext]
  );

  const fetchPhotos = async (
    search: RoverSearch,
    matchingRoverSol: boolean
  ) => {
    setPhotos((prev) => ({ ...prev, isFetching: true }));

    try {
      const res = await fetch('/api/photos/', {
        method: 'POST',
        body: JSON.stringify(search),
      });

      isDev && console.log(res);

      if (!res.ok) {
        const { error } = await res.json();
        isDev && console.error('error received:', error);
        throw new Error(error);
      }

      const { data, cameraMap } = await res.json();
      isDev && console.log({ data, cameraMap });

      if (data.length === 0) {
        messageContext.addMessage({
          text: 'No photos found',
          type: 'Info',
        });
        return;
      }

      setPhotos((prev) => {
        if (matchingRoverSol && search.camera !== 'ALL') {
          return {
            ...prev,
            src: [...prev.src, ...data],
            currentPage: 1,
            cameraMap: {
              ...prev.cameraMap,
              ...cameraMap,
            },
            rover: search.rover,
            sol: search.sol,
            currentCamera: search.camera,
          };
        }

        return {
          ...prev,
          src: data,
          currentPage: 1,
          cameraMap,
          rover: search.rover,
          sol: search.sol,
          currentCamera: search.camera,
        };
      });
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
      setPhotos((prev) => ({ ...prev, isFetching: false }));
    }
  };

  // updates rover manifest on search form rover input change
  React.useEffect(() => {
    isDev && console.log('rover effect ran');
    if (search.rover === '') {
      return;
    }

    // checks localStorage first before fetching manifest
    const json = localStorage.getItem(search.rover);
    if (!json) {
      fetchManifest(search.rover);
      return;
    }

    const data = JSON.parse(json);
    const toUpdate =
      data.status === 'complete'
        ? false
        : data.lastUpdated + ONE_HOUR_IN_MS < Date.now();

    // fetches manifest if data is outdated
    if (!data || toUpdate) {
      fetchManifest(search.rover);
      return;
    }

    setRoverData(data);
    setSearch((prev) => ({
      ...prev,
      sol: data.photos[0].sol,
    }));
  }, [search.rover, fetchManifest]);

  // updates search form camera options based on sol
  React.useEffect(() => {
    isDev && console.log('sol effect ran');
    if (search.sol === '') {
      return;
    }

    if (!roverData || roverData.name !== search.rover) {
      setSearch((prev) => ({
        ...prev,
        camera: '',
        photoIndex: -1,
      }));
      return;
    }

    const photoIndex = roverData.photos.findIndex(
      (p: ManifestPhotos) => p.sol === search.sol
    );
    const camera =
      photoIndex === -1
        ? ''
        : roverData.photos[photoIndex].cameras.length > 1
        ? 'ALL'
        : roverData.photos[photoIndex].cameras[0];

    setSearch((prev) => ({
      ...prev,
      camera,
      photoIndex,
    }));
  }, [search.sol, search.rover, roverData]);

  const updateSearch = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'sol') {
      if (value === '') {
        setSearch((prev) => ({
          ...prev,
          sol: value,
          camera: '',
          photoIndex: -1,
        }));
        return;
      }

      const min = roverData?.photos[0].sol ?? 0;
      const max = roverData?.max_sol;
      setSearch((prev) => ({
        ...prev,
        sol: setWithinRange(parseInt(value), min, max),
      }));
      return;
    }

    setSearch((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const getPhotos = (search: RoverSearch) => {
    const matchingRoverSol =
      photos.rover === search.rover && photos.sol === search.sol;

    const cameraAvailable =
      (search.camera && search.camera in photos.cameraMap) ||
      (search.camera === 'ALL' &&
        roverData &&
        isArrayStringInObjectKey(
          roverData.photos[search.photoIndex].cameras,
          photos.cameraMap
        ));

    if (matchingRoverSol && cameraAvailable) {
      isDev && console.log('data already available, no need to refetch');
      setPhotos((prev) => ({
        ...prev,
        currentCamera: search.camera,
        currentPage: 1,
      }));
      return;
    }

    fetchPhotos(search, matchingRoverSol);
  };

  const toggleIsFetching = () =>
    setSearch((prev) => ({
      ...prev,
      isFetchingManifest: !prev.isFetchingManifest,
    }));

  return {
    search,
    photos,
    roverData,
    updateSearch,
    getPhotos,
    updatePhotosPerPage,
    updatePhotoPage,
    toggleIsFetching,
  };
}

export default useMarsData;
