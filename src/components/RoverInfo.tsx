'use client';
import React from 'react';
import { RoverManifest } from '@/lib/types';

type RoverInfoPropType = { roverData: RoverManifest };

export default function RoverInfo({ roverData }: RoverInfoPropType) {
  return (
    <section className='flex flex-col items-center'>
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
