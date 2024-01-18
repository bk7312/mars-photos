import { RoverPhotos } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { rover, camera, page = 1 } = await request.json();
  let url = `${process.env.NASA_ENDPOINT}/rovers/${rover}/latest_photos?api_key=${process.env.NASA_API_KEY}&page=${page}`;

  if (camera && camera !== 'ALL') {
    url += `&camera=${camera}`;
  }

  try {
    console.log(url);
    const res = await fetch(url);
    const { latest_photos, errors } = await res.json();

    if (errors) {
      throw new Error(errors);
    }

    const photoData: RoverPhotos = latest_photos;
    if (!photoData) {
      return Response.json({ data: [] });
    }
    const data = photoData.map((p) => ({ img_src: p.img_src }));
    return Response.json({ data });
  } catch (error) {
    return Response.json(
      { error },
      { status: 400, statusText: error as string }
    );
  }
}
