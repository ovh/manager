import React from 'react';
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { PAGE_SPINNER_TEST_ID } from './PageSpinner.constants';

export const PageSpinner = () => {
  return (
    <div
      data-testid={PAGE_SPINNER_TEST_ID}
      className="flex justify-center h-screen items-center"
    >
      <OdsSpinner size={ODS_SPINNER_SIZE.lg} />
    </div>
  );
};
