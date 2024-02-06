export const dynamic = 'force-dynamic';

import { pool } from '@/db/db';
import { auth } from '@/auth/auth';

export async function GET(request: Request) {
  // get list of favorites for user
  try {
    const session = await auth();
    // console.log({ session });
    if (!session) {
      return Response.json({ error: 'Not logged in' }, { status: 403 });
    }

    const data = await pool.query(
      'SELECT photoId, src, rover, sol, camera FROM favorites WHERE userId = (SELECT id FROM users WHERE email = $1)',
      [session.user?.email]
    );

    console.log({ data });
    console.log(data.rows);
    return Response.json({ data: data.rows });
  } catch (error) {
    console.log('error caught:', error);
    const err = error as Error;
    console.log(err.name, err.message);

    let errMsg = err.message;

    return Response.json({ error: errMsg }, { status: 400 });
  }
}

export async function POST(request: Request) {
  // add to favorite
  const session = await auth();
  //   console.log({ session });
  if (!session) {
    return Response.json({ error: 'Not logged in' }, { status: 403 });
  }

  const { photoId, src, rover, sol, camera } = await request.json();
  console.log('input', { photoId, src, rover, sol, camera });

  const data = await pool.query(
    'INSERT INTO favorites (userId, photoId, src, rover, sol, camera) VALUES ((SELECT id FROM users WHERE email = $1), $2, $3, $4, $5, $6)',
    [session.user?.email, photoId, src, rover, sol, camera]
  );

  console.log('return', { data });
  console.log(data.rows[0]);

  return Response.json({ data: 'hello from post' });
}

export async function DELETE(request: Request) {
  // remove from favorite
  const session = await auth();
  //   console.log({ session });
  if (!session) {
    return Response.json({ error: 'Not logged in' }, { status: 403 });
  }

  const { photoId } = await request.json();

  const data = await pool.query(
    'DELETE FROM favorites WHERE userId = (SELECT id FROM users WHERE email = $1) AND photoID = $2',
    [session.user?.email, photoId]
  );

  console.log({ data });
  console.log(data.rows[0]);
  return Response.json({ data: 'hello from delete' });
}
