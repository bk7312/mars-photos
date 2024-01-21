'use client';
import React from 'react';
import { RoverManifest } from '@/lib/types';

type RoverInfoPropType = { roverData: RoverManifest };

export default function RoverInfo({ roverData }: RoverInfoPropType) {
  return (
    <section className='flex flex-col items-center border-2 border-slate-500 rounded p-2 m-2'>
      <div id='manifests'>
        {roverData && (
          <div>
            {Object.entries(roverData).map(([k, v]) => (
              <p key={k}>
                {k}: {Array.isArray(v) ? `Array with ${v.length} items` : v}
              </p>
            ))}
            <p>Current Time: {Date.now()}</p>
          </div>
        )}
      </div>
    </section>
  );
}
