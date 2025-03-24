import React from 'react';
import {
  defaultServiceResponse,
  ServiceDetails,
} from '@ovh-ux/manager-module-common-api';
import { render, waitFor } from '@testing-library/react';

import { BillingInformationsState } from './State';
import {
  serviceEngagedAndContinueResponse,
  serviceEngagedAndEndResponse,
  serviceManualRenewResponse,
  serviceSuspendedResponse,
} from '../../test-utils/mockUtils';
import { Wrapper } from '../../test-utils';
import BillingInformationsTile from '../../BillingInformationsTile';

type TestParams = {
  mock: Partial<ServiceDetails>;
  engagementLabel: string;
  renewLabel: string;
};

const testCases: TestParams[] = [
  {
    mock: defaultServiceResponse,
    engagementLabel: 'billing_informations_tile_engagement_status_none',
    renewLabel: 'billing_informations_tile_renew_state_automatic',
  },
  {
    mock: serviceSuspendedResponse,
    engagementLabel: 'billing_informations_tile_engagement_status_none',
    renewLabel: 'billing_informations_tile_renew_state_resiliated',
  },
  {
    mock: serviceEngagedAndContinueResponse,
    engagementLabel:
      'billing_informations_tile_engagement_status_engaged_renew',
    renewLabel: 'billing_informations_tile_renew_state_automatic',
  },
  {
    mock: serviceEngagedAndEndResponse,
    engagementLabel: 'billing_informations_tile_engagement_status_engaged',
    renewLabel: 'billing_informations_tile_renew_state_resiliate_planned',
  },
  {
    mock: serviceManualRenewResponse,
    engagementLabel: 'billing_informations_tile_engagement_status_none',
    renewLabel: 'billing_informations_tile_renew_state_manual',
  },
];

describe('BillingInformationsTile.State', () => {
  it.each(testCases)(
    'should display state $engagementLabel with badge $renewLabel',
    async ({ mock, engagementLabel, renewLabel }) => {
      const { container, getByText } = render(
        <Wrapper mock={mock}>
          <BillingInformationsTile resourceName="my-resource-name">
            <BillingInformationsState />
          </BillingInformationsTile>
        </Wrapper>,
      );

      await waitFor(
        () => {
          expect(getByText(engagementLabel, { exact: false })).not.toBeNull();
          expect(
            container.querySelector(`ods-badge[label="${renewLabel}"]`),
          ).not.toBeNull();
        },
        { timeout: 500 },
      );
    },
  );
});
