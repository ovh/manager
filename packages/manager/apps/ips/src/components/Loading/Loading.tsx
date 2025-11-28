import React from 'react';
import { OdsSpinner } from '@ovhcloud/ods-components/react';

export default function Loading() {
  return (
    <div className="flex justify-center">
      <div>
        <OdsSpinner />
      </div>
    </div>
  );
}
