import React from 'react';
import {
  defaultServiceResponse,
  ServiceDetails,
} from '@ovh-ux/manager-module-common-api';
import { render, waitFor } from '@testing-library/react';

import { BillingInformationsTileStandard } from './BillingInformationsTileStandard';
import {
  serviceEngagedAndContinueResponse,
  serviceEngagedAndEndResponse,
  serviceSuspendedResponse,
} from './test-utils/mockUtils';
import { Wrapper } from './test-utils';

type TestParams = {
  mock: Partial<ServiceDetails>;
  label: string;
  isResiliateLinkView: boolean;
};

const testCases: TestParams[] = [
  {
    mock: defaultServiceResponse,
    label: 'on active status',
    isResiliateLinkView: true,
  },
  {
    mock: serviceSuspendedResponse,
    label: 'on suspended status',
    isResiliateLinkView: false,
  },
  {
    mock: serviceEngagedAndContinueResponse,
    label: 'on engaged and continue status',
    isResiliateLinkView: true,
  },
  {
    mock: serviceEngagedAndEndResponse,
    label: 'on engaged but end state',
    isResiliateLinkView: false,
  },
];

const renderComponent = (mock: Partial<ServiceDetails>) => {
  return render(
    <Wrapper mock={mock}>
      <BillingInformationsTileStandard resourceName="my-resource-name" />
    </Wrapper>,
  );
};

describe('BillingInformationsTile.State', () => {
  it.each(testCases)(
    'should display resiliate link ($isResiliateLinkView) or not for status $label',
    async ({ mock, isResiliateLinkView }) => {
      const { container } = renderComponent(mock);

      await waitFor(
        () => {
          const resiliateLink = container.querySelector(
            `ods-link[label="billing_informations_tile_field_label_resiliate"]`,
          );

          if (isResiliateLinkView) {
            expect(resiliateLink).not.toBeNull();
          } else {
            expect(resiliateLink).toBeNull();
          }
        },
        { timeout: 500 },
      );
    },
  );
});
