export type Rover = 'Perseverance' | 'Curiosity' | 'Opportunity' | 'Spirit';

export type RoverSearch = {
  rover: Rover | '';
  prevRover: Rover | '';
  sol: number | '';
  prevSol: number | '';
  camera: CameraTypes | 'ALL' | '';
  cameraMap: GenericStringNumberObj;
  photoIndex: number;
  isFetchingManifest: boolean;
};

type PerseveranceCameras =
  | 'EDL_RUCAM'
  | 'EDL_RDCAM'
  | 'EDL_DDCAM'
  | 'EDL_PUCAM1'
  | 'EDL_PUCAM2'
  | 'NAVCAM_LEFT'
  | 'NAVCAM_RIGHT'
  | 'MCZ_RIGHT'
  | 'MCZ_LEFT'
  | 'FRONT_HAZCAM_LEFT_A'
  | 'FRONT_HAZCAM_RIGHT_A'
  | 'REAR_HAZCAM_LEFT'
  | 'REAR_HAZCAM_RIGHT'
  | 'SKYCAM'
  | 'SHERLOC_WATSON'
  | 'SUPERCAM_RMI'
  | 'LCAM';

type CuriosityCameras =
  | 'FHAZ'
  | 'RHAZ'
  | 'MAST'
  | 'CHEMCAM'
  | 'MAHLI'
  | 'MARDI'
  | 'NAVCAM';

type SpiritAndOpportunityCameras =
  | 'FHAZ'
  | 'RHAZ'
  | 'NAVCAM'
  | 'PANCAM'
  | 'MINITES'
  | 'ENTRY';

export type CameraTypes =
  | PerseveranceCameras
  | CuriosityCameras
  | SpiritAndOpportunityCameras;

export type ManifestPhotos = {
  sol: number;
  earth_date: string;
  total_photos: number;
  cameras: CameraTypes[];
};

export type RoverManifest = {
  name: Rover;
  landing_date: string;
  launch_date: string;
  status: 'complete' | 'active';
  max_sol: number;
  max_date: string;
  total_photos: number;
  photos: ManifestPhotos[];
  lastUdated: number;
} | null;

type CameraNameAndFullName = {
  name: CameraTypes;
  full_name: string;
};

export type GenericStringNumberObj = {
  [key: string]: number;
};

export type RoverPhotosResponse = {
  id: number;
  sol: number;
  earth_date: string;
  camera: CameraNameAndFullName;
  rover: {
    name: string;
  };
  img_src: string;
}[];

export type RoverPhotoSrc = {
  photoId: number;
  src: string;
  alt: string;
  rover: Rover;
  sol: number;
  camera: CameraTypes;
  note?: string;
};

export type RoverPhotos = {
  src: RoverPhotoSrc[];
  currentPage: number;
  photoPerPage: number;
  currentCamera?: CameraTypes | 'ALL' | '';
  isFetching: boolean;
  init?: boolean;
};

export type MessageType = {
  id: string;
  text: string;
  type: 'Error' | 'Info' | 'Warning';
};

// export type Cameras = {
//   Perseverance: PerseveranceCameras;
//   Curiosity: CuriosityCameras;
//   Opportunity: OpportunityCameras;
//   Spirit: SpiritCameras;
// };

export type IconPropType = {
  height?: number;
  width?: number;
};
