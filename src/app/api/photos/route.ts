export const dynamic = 'force-dynamic';

import { GenericStringNumberObj, RoverPhotosResponse } from '@/lib/types';
import { sleep } from '@/lib/utils';

export async function POST(request: Request) {
  const { rover, sol, camera } = await request.json();

  if (rover === '' || sol === '' || camera === '') {
    return Response.json({ error: 'Invalid input' }, { status: 400 });
  }

  let url = `${process.env.NASA_ENDPOINT}/rovers/${rover}/photos?api_key=${process.env.NASA_API_KEY}&sol=${sol}`;

  if (camera && camera !== 'ALL') {
    url += `&camera=${camera}`;
  }

  const controller = new AbortController();
  const signal = controller.signal;
  const timeout = setTimeout(() => {
    controller.abort();
  }, 15000);

  try {
    const res = await fetch(url, { signal });
    clearTimeout(timeout);

    const { photos, error } = await res.json();

    console.log({ photos, error });
    if (error) {
      console.warn(error);
      throw new Error(`${error.code} - ${error.message}`);
    }

    const photoData: RoverPhotosResponse = photos;
    if (!photoData) {
      return Response.json({ data: [] });
    }

    // cameraMap stores the number of images per camera
    // keep as is for now, can simplify to set/array?
    const cameraMap: GenericStringNumberObj = {};
    const data = photoData.map((p) => {
      if (!(p.camera.name in cameraMap)) {
        cameraMap[p.camera.name] = 0;
      }
      ++cameraMap[p.camera.name];

      return {
        photoId: p.id,
        src: p.img_src,
        alt: `Photo ${p.id} from ${p.rover.name}'s ${p.camera.full_name} (${p.camera.name}) on Sol ${p.sol} (Earth date: ${p.earth_date})`,
        camera: p.camera.name,
      };
    });

    return Response.json({ data, cameraMap });
  } catch (error) {
    console.log('error caught:', error);
    const err = error as Error;
    console.log(err.name, err.message);

    let errMsg =
      'Looks like something went wrong, please try again later. Please contact the developer if issue presists.';

    if (err.name === 'AbortError') {
      errMsg = 'Request took too long to respond, please try again later.';
    }

    return Response.json({ error: errMsg }, { status: 400 });
  }
}
