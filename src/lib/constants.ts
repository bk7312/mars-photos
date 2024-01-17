import { Rover } from './types';

export const rovers: Rover[] = [
  'Perseverance',
  'Curiosity',
  'Opportunity',
  'Spirit',
] as const;

export const ONE_HOUR_IN_MS = 60 * 60 * 1000;

// export const CURIOSITY_INFO: RoverInfo = {
//   name: 'Curiosity',
//   landing_date: '2012-08-06',
//   launch_date: '2011-11-26',
//   status: 'active',
// };

// export const PERSEVERANCE_INFO: RoverInfo = {
//   name: 'Perseverance',
//   landing_date: '2021-02-18',
//   launch_date: '2020-07-30',
//   status: 'active',
// };

// export const OPPORTUNITY_INFO: RoverInfo = {
//   name: 'Opportunity',
//   landing_date: '2004-01-25',
//   launch_date: '2003-07-07',
//   status: 'complete',
//   max_sol: 5111,
//   max_date: '2018-06-11',
//   total_photos: 198439,
// };

// export const SPIRIT_INFO: RoverInfo = {
//   name: 'Spirit',
//   landing_date: '2004-01-04',
//   launch_date: '2003-06-10',
//   status: 'complete',
//   max_sol: 2208,
//   max_date: '2010-03-21',
//   total_photos: 124550,
// };

// const perseveranceCameras = {
//   EDL_RUCAM: 'Rover Up-Look Camera',
//   EDL_RDCAM: 'Rover Down-Look Camera',
//   EDL_DDCAM: 'Descent Stage Down-Look Camera',
//   EDL_PUCAM1: 'Parachute Up-Look Camera A',
//   EDL_PUCAM2: 'Parachute Up-Look Camera B',
//   NAVCAM_LEFT: 'Navigation Camera - Left',
//   NAVCAM_RIGHT: 'Navigation Camera - Right',
//   MCZ_RIGHT: 'Mast Camera Zoom - Right',
//   MCZ_LEFT: 'Mast Camera Zoom - Left',
//   FRONT_HAZCAM_LEFT_A: 'Front Hazard Avoidance Camera - Left',
//   FRONT_HAZCAM_RIGHT_A: 'Front Hazard Avoidance Camera - Right',
//   REAR_HAZCAM_LEFT: 'Rear Hazard Avoidance Camera - Left',
//   REAR_HAZCAM_RIGHT: 'Rear Hazard Avoidance Camera - Right',
//   SKYCAM: 'MEDA Skycam',
//   SHERLOC_WATSON: 'SHERLOC WATSON Camera',
// };

// const curiosityCameras = {
//   FHAZ: 'Front Hazard Avoidance Camera',
//   RHAZ: 'Rear Hazard Avoidance Camera',
//   MAST: 'Mast Camera',
//   CHEMCAM: 'Chemistry and Camera Complex',
//   MAHLI: 'Mars Hand Lens Imager',
//   MARDI: 'Mars Descent Imager',
//   NAVCAM: 'Navigation Camera',
// };

// const opportunityCameras = {
//   FHAZ: 'Front Hazard Avoidance Camera',
//   RHAZ: 'Rear Hazard Avoidance Camera',
//   NAVCAM: 'Navigation Camera',
//   PANCAM: 'Panoramic Camera',
//   MINITES: 'Miniature Thermal Emission Spectrometer (Mini-TES)',
// };

// const spiritCameras = opportunityCameras;

// const cameras = {
//   Perseverance: perseveranceCameras,
//   Curiosity: curiosityCameras,
//   Opportunity: opportunityCameras,
//   Spirit: spiritCameras,
// };

// export const cameraNames = {
//   EDL_RUCAM: 'Rover Up-Look Camera',
//   EDL_RDCAM: 'Rover Down-Look Camera',
//   EDL_DDCAM: 'Descent Stage Down-Look Camera',
//   EDL_PUCAM1: 'Parachute Up-Look Camera A',
//   EDL_PUCAM2: 'Parachute Up-Look Camera B',
//   NAVCAM_LEFT: 'Navigation Camera - Left',
//   NAVCAM_RIGHT: 'Navigation Camera - Right',
//   MCZ_RIGHT: 'Mast Camera Zoom - Right',
//   MCZ_LEFT: 'Mast Camera Zoom - Left',
//   FRONT_HAZCAM_LEFT_A: 'Front Hazard Avoidance Camera - Left',
//   FRONT_HAZCAM_RIGHT_A: 'Front Hazard Avoidance Camera - Right',
//   REAR_HAZCAM_LEFT: 'Rear Hazard Avoidance Camera - Left',
//   REAR_HAZCAM_RIGHT: 'Rear Hazard Avoidance Camera - Right',
//   SKYCAM: 'MEDA Skycam',
//   SHERLOC_WATSON: 'SHERLOC WATSON Camera',
//   FHAZ: 'Front Hazard Avoidance Camera',
//   RHAZ: 'Rear Hazard Avoidance Camera',
//   MAST: 'Mast Camera',
//   CHEMCAM: 'Chemistry and Camera Complex',
//   MAHLI: 'Mars Hand Lens Imager',
//   MARDI: 'Mars Descent Imager',
//   NAVCAM: 'Navigation Camera',
//   PANCAM: 'Panoramic Camera',
//   MINITES: 'Miniature Thermal Emission Spectrometer (Mini-TES)',
// };
