import React from 'react';

import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OdsSpinner } from '@ovhcloud/ods-components/react';

export default function Loading({
  className = 'flex justify-center my-5',
  size = ODS_SPINNER_SIZE.md,
}: {
  className?: string;
  size?: ODS_SPINNER_SIZE;
}) {
  return (
    <div data-testid="spinner" className={className}>
      <OdsSpinner size={size} inline-block />
    </div>
  );
}
