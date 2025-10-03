import React from 'react';

import { OsdsSkeleton } from '@ovhcloud/ods-components/react/';

export default function Loading() {
  return (
    <>
      {Array.from({ length: 9 }, (_, i) => (
        <div
          key={`skeleton${i}`}
          className="break-words p-4 border-2 border-solid border-cyan-200 rounded-xl"
        >
          <OsdsSkeleton />
        </div>
      ))}
    </>
  );
}
