export type Rover = 'Perseverance' | 'Curiosity' | 'Opportunity' | 'Spirit';

export type RoverSearch = {
  rover: Rover;
  sol: number;
  camera: string | undefined;
};

export type ManifestPhotos = {
  sol: number;
  earth_date: string;
  total_photos: number;
  cameras: string[];
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
} | null;

export type RoverPhotos = {
  img_src: string;
}[];

// export type PerseveranceCameras =
//   | 'EDL_RUCAM'
//   | 'EDL_RDCAM'
//   | 'EDL_DDCAM'
//   | 'EDL_PUCAM1'
//   | 'EDL_PUCAM2'
//   | 'NAVCAM_LEFT'
//   | 'NAVCAM_RIGHT'
//   | 'MCZ_RIGHT'
//   | 'MCZ_LEFT'
//   | 'FRONT_HAZCAM_LEFT_A'
//   | 'FRONT_HAZCAM_RIGHT_A'
//   | 'REAR_HAZCAM_LEFT'
//   | 'REAR_HAZCAM_RIGHT'
//   | 'SKYCAM'
//   | 'SHERLOC_WATSON';

// type CuriosityCameras =
//   | 'FHAZ'
//   | 'RHAZ'
//   | 'MAST'
//   | 'CHEMCAM'
//   | 'MAHLI'
//   | 'MARDI'
//   | 'NAVCAM';

// type OpportunityCameras = 'FHAZ' | 'RHAZ' | 'NAVCAM' | 'PANCAM' | 'MINITES';

// type SpiritCameras = OpportunityCameras;

// export type Cameras = {
//   Perseverance: PerseveranceCameras;
//   Curiosity: CuriosityCameras;
//   Opportunity: OpportunityCameras;
//   Spirit: SpiritCameras;
// };

// export type CameraTypes =
//   | 'EDL_RUCAM'
//   | 'EDL_RDCAM'
//   | 'EDL_DDCAM'
//   | 'EDL_PUCAM1'
//   | 'EDL_PUCAM2'
//   | 'NAVCAM_LEFT'
//   | 'NAVCAM_RIGHT'
//   | 'MCZ_RIGHT'
//   | 'MCZ_LEFT'
//   | 'FRONT_HAZCAM_LEFT_A'
//   | 'FRONT_HAZCAM_RIGHT_A'
//   | 'REAR_HAZCAM_LEFT'
//   | 'REAR_HAZCAM_RIGHT'
//   | 'SKYCAM'
//   | 'SHERLOC_WATSON'
//   | 'FHAZ'
//   | 'RHAZ'
//   | 'MAST'
//   | 'CHEMCAM'
//   | 'MAHLI'
//   | 'MARDI'
//   | 'NAVCAM'
//   | 'PANCAM'
//   | 'MINITES'
//   | 'ENTRY';
