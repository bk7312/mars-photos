export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { rover } = await request.json();

  if (rover === '') {
    return Response.json({ error: 'Invalid input' }, { status: 400 });
  }

  const url = `${process.env.NASA_ENDPOINT}/manifests/${rover}?api_key=${process.env.NASA_API_KEY}`;

  const controller = new AbortController();
  const signal = controller.signal;
  const timeout = setTimeout(() => {
    controller.abort();
  }, 15000);

  try {
    const res = await fetch(url, { signal });
    clearTimeout(timeout);

    const { photo_manifest, error } = await res.json();

    console.log({ photo_manifest, error });
    if (error) {
      console.warn(error);
      throw new Error(`${error.code} - ${error.message}`);
    }

    return Response.json({ data: photo_manifest });
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
