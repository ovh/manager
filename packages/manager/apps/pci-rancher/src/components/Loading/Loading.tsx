import React from 'react';
import { OsdsSpinner } from '@ovhcloud/ods-components/spinner/react';

export default function Loading() {
  return (
    <div className="flex justify-center">
      <div>
        <OsdsSpinner />
      </div>
    </div>
  );
}
