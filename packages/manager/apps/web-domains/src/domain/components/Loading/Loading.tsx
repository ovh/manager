import React from 'react';
import { Spinner } from '@ovhcloud/ods-react';

export default function Loading() {
  return (
    <div className="flex justify-center" data-testid="listing-page-spinner">
      <Spinner />
    </div>
  );
}
