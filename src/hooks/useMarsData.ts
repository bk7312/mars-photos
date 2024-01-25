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

function useMarsData() {
  const [search, setSearch] = React.useState<RoverSearch>({
    rover: undefined,
    sol: undefined,
    camera: undefined,
    photoIndex: -1,
  });
  const [roverData, setRoverData] = React.useState<RoverManifest>(null);
  const [photos, setPhotos] = React.useState<RoverPhotos>({
    src: [],
    currentPage: 1,
    photoPerPage: 4,
    cameraMap: {},
    rover: undefined,
    sol: undefined,
    currentCamera: undefined,
  });

  // updates rover manifest on search form rover input change
  React.useEffect(() => {
    if (typeof search.rover === 'undefined') {
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
  }, [search.rover]);

  // updates search form camera options based on sol
  React.useEffect(() => {
    if (!roverData) {
      return;
    }

    const photoIndex = roverData.photos.findIndex(
      (p: ManifestPhotos) => p.sol === search.sol
    );

    if (photoIndex === -1) {
      setSearch((prev) => ({
        ...prev,
        sol: undefined,
        camera: undefined,
        photoIndex,
      }));
      return;
    }

    setSearch((prev) => ({
      ...prev,
      photoIndex,
      camera:
        roverData.photos[photoIndex].cameras.length > 1
          ? 'ALL'
          : roverData.photos[photoIndex].cameras[0],
    }));
  }, [roverData, search.sol]);

  const updateSearch = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setSearch((prev) => ({
      ...prev,
      [name]: name === 'sol' ? setWithinRange(parseInt(value), 0) : value,
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

  const updatePhotoPage = (page: number, maxPage: number) => {
    setPhotos((prev) => {
      return {
        ...prev,
        currentPage: setWithinRange(page, 1, maxPage),
      };
    });
  };

  const fetchManifest = async (rover: Rover) => {
    const res = await fetch('/api/manifests/', {
      method: 'POST',
      body: JSON.stringify({ rover }),
    });

    if (!res.ok) {
      console.error(res.statusText);
      return;
    }

    const { data } = await res.json();
    isDev && console.log(data);
    data.lastUpdated = Date.now();
    setRoverData(data);
    localStorage.setItem(rover, JSON.stringify(data));
  };

  const fetchPhotos = async (search: RoverSearch) => {
    const matchingRoverSol =
      photos.rover &&
      photos.rover === search.rover &&
      photos.sol &&
      photos.sol === search.sol;

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
      setPhotos((prev) => {
        return {
          ...prev,
          currentCamera: search.camera,
          currentPage: 1,
        };
      });
      return;
    }

    const res = await fetch('/api/photos/', {
      method: 'POST',
      body: JSON.stringify(search),
    });

    if (!res.ok) {
      console.error(res.statusText);
      return;
    }

    const { data, cameraMap } = await res.json();
    isDev && console.log(data, cameraMap);

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
  };

  return {
    search,
    photos,
    roverData,
    updateSearch,
    fetchPhotos,
    updatePhotosPerPage,
    updatePhotoPage,
  };
}

export default useMarsData;
