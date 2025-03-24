import React from 'react';
import 'element-internals-polyfill';
import {
  defaultServiceResponse,
  ServiceDetails,
} from '@ovh-ux/manager-module-common-api';
import { render, waitFor } from '@testing-library/react';

import { BillingInformationsNextBilling } from './NextBillingDate';
import { Wrapper } from '../../test-utils';
import BillingInformationsTile from '../../BillingInformationsTile';

const renderWithMock = (mock: Partial<ServiceDetails>) => {
  return render(
    <Wrapper mock={mock}>
      <BillingInformationsTile resourceName="my-resource-name">
        <BillingInformationsNextBilling />
      </BillingInformationsTile>
    </Wrapper>,
  );
};

describe('BillingInformationsTile.NextBilling', () => {
  it('should display next billing date in full display', async () => {
    const { getByText } = renderWithMock(defaultServiceResponse);

    await waitFor(
      () => {
        expect(getByText('21 novembre 2024')).not.toBeNull();
      },
      { timeout: 500 },
    );
  });
});
