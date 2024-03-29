export const dynamic = 'force-dynamic';

import { pool } from '@/db/db';
import { auth } from '@/app/api/auth/auth';

export async function GET(request: Request) {
  // get list of favorites for user
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ error: 'Not logged in' }, { status: 403 });
    }

    const data = await pool.query(
      'SELECT "photoId", src, alt, rover, sol, camera, note FROM favorites WHERE "userId" = (SELECT id FROM users WHERE email = $1)',
      [session.user?.email]
    );

    console.log('return', { data });

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
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ error: 'Not logged in' }, { status: 403 });
    }

    const { photoId, src, alt, rover, sol, camera } = await request.json();
    console.log('input', { photoId, src, alt, rover, sol, camera });

    const data = await pool.query(
      'INSERT INTO favorites ("userId", "photoId", src, alt, rover, sol, camera) VALUES ((SELECT id FROM users WHERE email = $1), $2, $3, $4, $5, $6, $7)',
      [session.user?.email, photoId, src, alt, rover, sol, camera]
    );

    console.log('return', { data });

    return Response.json({ data: 'Added to favorites' });
  } catch (error) {
    console.log('error caught:', error);
    const err = error as Error;
    console.log(err.name, err.message);

    let errMsg = err.message;

    return Response.json({ error: errMsg }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  // edit note
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ error: 'Not logged in' }, { status: 403 });
    }

    const { photoId, note } = await request.json();
    console.log('input', { photoId, note });

    const data = await pool.query(
      'UPDATE favorites SET note = $1 WHERE "userId" = (SELECT id FROM users WHERE email = $2) AND "photoId" = $3',
      [note, session.user?.email, photoId]
    );

    console.log('return', { data });

    return Response.json({ data: 'Note updated' });
  } catch (error) {
    console.log('error caught:', error);
    const err = error as Error;
    console.log(err.name, err.message);

    let errMsg = err.message;

    return Response.json({ error: errMsg }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  // remove from favorite
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ error: 'Not logged in' }, { status: 403 });
    }

    const { photoId } = await request.json();

    const data = await pool.query(
      'DELETE FROM favorites WHERE "userId" = (SELECT id FROM users WHERE email = $1) AND "photoId" = $2',
      [session.user?.email, photoId]
    );

    console.log('return', { data });

    return Response.json({ data: 'Favorite deleted' });
  } catch (error) {
    console.log('error caught:', error);
    const err = error as Error;
    console.log(err.name, err.message);

    let errMsg = err.message;

    return Response.json({ error: errMsg }, { status: 400 });
  }
}
