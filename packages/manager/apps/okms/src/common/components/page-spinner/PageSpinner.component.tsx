import { Spinner } from '@ovhcloud/ods-react';

import { PAGE_SPINNER_TEST_ID } from './PageSpinner.constants';

export const PageSpinner = () => {
  return (
    <div data-testid={PAGE_SPINNER_TEST_ID} className="flex h-screen items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
};
