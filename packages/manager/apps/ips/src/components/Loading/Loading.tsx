import React from 'react';

import { Spinner } from '@ovhcloud/ods-react';

export default function Loading() {
  return (
    <div className="flex justify-center">
      <div>
        <Spinner />
      </div>
    </div>
  );
}
