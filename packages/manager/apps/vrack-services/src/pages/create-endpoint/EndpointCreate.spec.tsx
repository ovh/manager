import { describe, it } from 'vitest';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { vrackServicesListMocks } from '@ovh-ux/manager-network-common';
import React from 'react';
import {
  labels,
  assertEnabled,
  doActionOnElementUntil,
  getElementByText,
  renderTestComponent,
  changeSelectValueByTestId,
} from '@/test-utils';
import EndpointCreatePage from './EndpointCreate.page';

describe('Vrack Services endpoint creation page test suite', () => {
  it('should display an endpoint creation page', async () => {
    const { container } = await renderTestComponent({
      component: <EndpointCreatePage />,
    });

    await assertTextVisibility(labels.endpoints.createEndpointPageDescription);

    const submitButton = await getElementByText({
      value: labels.endpoints.createEndpointButtonLabel,
    });

    await doActionOnElementUntil(
      () =>
        changeSelectValueByTestId({
          testId: 'select-subnet',
          container,
          value: vrackServicesListMocks[20].currentState.subnets[0].cidr,
        }),
      () => assertEnabled(submitButton),
    );
  });
});
