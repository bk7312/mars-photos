import { RoverPhotos } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { rover, sol, camera, page = 1 } = await request.json();
  let url = `${process.env.NASA_ENDPOINT}/rovers/${rover}/photos?api_key=${process.env.NASA_API_KEY}&sol=${sol}&page=${page}`;

  if (camera !== 'ALL') {
    url += `&camera=${camera}`;
  }

  try {
    console.log(url);
    const res = await fetch(url);
    const { photos, errors } = await res.json();

    if (errors) {
      throw new Error(errors);
    }

    const photoData: RoverPhotos = photos;
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
