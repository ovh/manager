import React from 'react';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_MODE, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';

export default function Loading({
  className = 'flex justify-center my-5',
  mode = ODS_SPINNER_MODE.indeterminate,
  size = ODS_SPINNER_SIZE.md,
}) {
  return (
    <div data-testid="spinner" className={className}>
      <OsdsSpinner mode={mode} size={size} inline></OsdsSpinner>
    </div>
  );
}
