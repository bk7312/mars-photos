export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { rover } = await request.json();
  const url = `${process.env.NASA_ENDPOINT}/manifests/${rover}?api_key=${process.env.NASA_API_KEY}`;
  try {
    const res = await fetch(url);
    const { photo_manifest, errors } = await res.json();

    if (errors) {
      throw new Error(errors);
    }

    return Response.json({ data: photo_manifest });
  } catch (error) {
    return Response.json(
      { error },
      { status: 400, statusText: error as string }
    );
  }
}
