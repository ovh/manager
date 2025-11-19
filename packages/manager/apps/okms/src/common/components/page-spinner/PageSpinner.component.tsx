import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OdsSpinner } from '@ovhcloud/ods-components/react';

import { PAGE_SPINNER_TEST_ID } from './PageSpinner.constants';

export const PageSpinner = () => {
  return (
    <div data-testid={PAGE_SPINNER_TEST_ID} className="flex h-screen items-center justify-center">
      <OdsSpinner size={ODS_SPINNER_SIZE.lg} />
    </div>
  );
};
