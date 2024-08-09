import React from 'react';
import { OsdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';

export default function Loading() {
  return (
    <div className="flex justify-center h-screen items-center">
      <OsdsSpinner inline size={ODS_SPINNER_SIZE.lg} />
    </div>
  );
}
