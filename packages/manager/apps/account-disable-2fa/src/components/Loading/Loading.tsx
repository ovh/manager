import React from 'react';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';

export default function Loading() {
  return (
    <div className="flex justify-center items-center">
      <div>
        <OsdsSpinner className="h-20 w-20" />
      </div>
    </div>
  );
}
