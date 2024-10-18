import React from 'react';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';

/* v8 ignore start */
export default function Loading() {
  return (
    <div className="flex justify-center">
      <OsdsSpinner />
    </div>
  );
}
