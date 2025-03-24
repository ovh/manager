import React from 'react';
import 'element-internals-polyfill';
import {
  defaultServiceResponse,
  ServiceDetails,
} from '@ovh-ux/manager-module-common-api';
import { render, waitFor } from '@testing-library/react';
import { Wrapper } from '../../test-utils';
import { BillingInformationsCreationDate } from './CreationDate';
import BillingInformationsTile from '../../BillingInformationsTile';

const renderWithMock = (mock: Partial<ServiceDetails>) => {
  return render(
    <Wrapper mock={mock}>
      <BillingInformationsTile resourceName="my-resource-name">
        <BillingInformationsCreationDate />
      </BillingInformationsTile>
    </Wrapper>,
  );
};

describe('BillingInformationsTile.CreationDate', () => {
  it('should display next billing date in full display', async () => {
    const { getByText } = renderWithMock(defaultServiceResponse);

    await waitFor(
      () => {
        expect(getByText('21 octobre 2024')).not.toBeNull();
      },
      { timeout: 500 },
    );
  });
});
