import React from 'react';
import { Spinner } from '@ovhcloud/ods-react';

/* v8 ignore start */
export default function Loading() {
  return (
    <div className="flex justify-center">
      <Spinner />
    </div>
  );
}
