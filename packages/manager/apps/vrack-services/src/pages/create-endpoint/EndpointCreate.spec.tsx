import { describe, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { vrackServicesListMocks } from '@ovh-ux/manager-network-common';
import { iamResourcesMocks } from '../../../__mocks__';
import {
  changeSelectValueByLabelText,
  getButtonByLabel,
  labels,
  renderTest,
  assertDisabled,
  assertEnabled,
  doActionOnElementUntil,
} from '@/test-utils';
import { urls } from '@/routes/routes.constants';

describe('Vrack Services endpoint creation page test suite', () => {
  it('should create an endpoint', async () => {
    const { container } = await renderTest({
      nbVs: 21,
      initialRoute: urls.createEndpoint.replace(
        ':id',
        vrackServicesListMocks[20].id,
      ),
      nbEligibleService: 1,
    });

    await assertTextVisibility(labels.endpoints.createEndpointPageDescription);

    const submitButton = await getButtonByLabel({
      container,
      value: labels.endpoints.createEndpointButtonLabel,
    });
    await assertDisabled(submitButton);

    await changeSelectValueByLabelText({
      selectLabel: labels.endpoints.serviceNameLabel,
      value: iamResourcesMocks[0].urn,
    });
    await assertDisabled(submitButton);

    await doActionOnElementUntil(
      () =>
        changeSelectValueByLabelText({
          selectLabel: labels.endpoints.subnetLabel,
          value: vrackServicesListMocks[20].currentState.subnets[0].cidr,
        }),
      () => assertEnabled(submitButton),
    );

    await doActionOnElementUntil(
      () => userEvent.click(submitButton),
      () =>
        expect(
          screen.getByText(labels.endpoints.endpointsOnboardingDescription),
        ).toBeVisible(),
    );
  });
});
