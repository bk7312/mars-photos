import { RoverPhotosResponse } from '@/lib/types';

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
    const { photos, errors } = await res.json();

    if (errors) {
      throw new Error(errors);
    }

    const photoData: RoverPhotosResponse = photos;
    if (!photoData) {
      return Response.json({ data: [] });
    }
    const data = photoData.map((p) => ({
      img_src: p.img_src,
      img_alt: `Photo id ${p.id} taken on sol ${p.sol} (Earth date: ${p.earth_date}) from ${p.rover.name} - ${p.camera.full_name} (${p.camera.name})`,
    }));
    return Response.json({ data });
  } catch (error) {
    return Response.json(
      { error },
      { status: 400, statusText: error as string }
    );
  }
}
