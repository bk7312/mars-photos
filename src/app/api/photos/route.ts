import { GenericStringNumberObj, RoverPhotosResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { rover, sol, camera } = await request.json();
  let url = `${process.env.NASA_ENDPOINT}/rovers/${rover}/photos?api_key=${process.env.NASA_API_KEY}&sol=${sol}`;

  if (camera && camera !== 'ALL') {
    url += `&camera=${camera}`;
  }

  try {
    console.log(url);
    const res = await fetch(url);
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
        img_src: p.img_src,
        img_alt: `PhotoID: ${p.id}, taken from ${p.rover.name} rover's ${p.camera.full_name} (${p.camera.name}) on sol ${p.sol} (Earth date: ${p.earth_date})`,
        camera: {
          name: p.camera.name,
          full_name: p.camera.full_name,
        },
      };
    });

    return Response.json({ data, cameraMap });
  } catch (error) {
    console.log('error caught:', error);
    return Response.json(
      { error },
      { status: 400, statusText: error as string }
    );
  }
}
