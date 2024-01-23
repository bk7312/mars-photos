import React from 'react';
import {
  Rover,
  RoverSearch,
  RoverPhotos,
  RoverManifest,
  ManifestPhotos,
} from '@/lib/types';
import { ONE_HOUR_IN_MS, isDev } from '@/lib/constants';

function useMarsData() {
  const [search, setSearch] = React.useState<RoverSearch>({
    rover: undefined,
    sol: undefined,
    camera: undefined,
  });
  const [roverData, setRoverData] = React.useState<RoverManifest>(null);
  const [photos, setPhotos] = React.useState<RoverPhotos>({
    src: [],
    currentPage: 1,
    photoPerPage: 4,
  });

  React.useEffect(() => {
    if (typeof search.rover === 'undefined') {
      return;
    }

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

    if (!data || toUpdate) {
      fetchManifest(search.rover);
      return;
    }

    setRoverData(data);
  }, [search.rover]);

  React.useEffect(() => {
    if (!roverData) {
      return;
    }

    const photoIndex = roverData.photos.findIndex(
      (p: ManifestPhotos) => p.sol === search.sol
    );

    if (photoIndex === -1) {
      setSearch((prev) => ({ ...prev, sol: undefined, camera: undefined }));
      return;
    }

    setSearch((prev) => ({
      ...prev,
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
      [name]: name === 'sol' ? Math.max(0, parseInt(value) || 0) : value,
    }));
  };

  const updatePhotos = (photoPerPage: number) => {
    setPhotos((prev) => {
      photoPerPage = Math.max(1, photoPerPage || 1);
      const maxPage = Math.ceil(prev.src.length / photoPerPage);
      return {
        ...prev,
        currentPage: prev.currentPage > maxPage ? maxPage : prev.currentPage,
        photoPerPage,
      };
    });
  };

  const updatePhotoPage = (page: number) => {
    setPhotos((prev) => {
      const maxPage = Math.ceil(prev.src.length / prev.photoPerPage);
      return {
        ...prev,
        currentPage: page > maxPage ? maxPage : page,
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
    const res = await fetch('/api/photos/', {
      method: 'POST',
      body: JSON.stringify(search),
    });

    if (!res.ok) {
      console.error(res.statusText);
      return;
    }

    const { data } = await res.json();
    isDev && console.log(data);
    setPhotos((prev) => ({ ...prev, src: data, currentPage: 1 }));
  };

  return {
    search,
    photos,
    roverData,
    updateSearch,
    fetchPhotos,
    updatePhotos,
    updatePhotoPage,
  };
}

export default useMarsData;
