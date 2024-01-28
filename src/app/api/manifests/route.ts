export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { rover } = await request.json();
  const url = `${process.env.NASA_ENDPOINT}/manifests/${rover}?apti_key=${process.env.NASA_API_KEY}`;
  try {
    console.log(url);
    const res = await fetch(url);
    const { photo_manifest, error } = await res.json();

    console.log({ photo_manifest, error });
    if (error) {
      console.warn(error);
      throw new Error(`${error.code} - ${error.message}`);
    }

    return Response.json({ data: photo_manifest });
  } catch (error) {
    console.log('error caught:', error);
    return Response.json(
      { error },
      { status: 400, statusText: error as string }
    );
  }
}
