import React from 'react';

import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OdsSpinner } from '@ovhcloud/ods-components/react';

export default function Loading() {
  return (
    <div data-testid="spinner" className="flex justify-center my-5">
      <OdsSpinner size={ODS_SPINNER_SIZE.md} inline-block></OdsSpinner>
    </div>
  );
}
