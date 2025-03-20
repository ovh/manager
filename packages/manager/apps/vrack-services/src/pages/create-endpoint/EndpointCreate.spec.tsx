import { describe, it } from 'vitest';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  WAIT_FOR_DEFAULT_OPTIONS,
  assertTextVisibility,
} from '@ovh-ux/manager-core-test-utils';
import { vrackServicesListMocks } from '@ovh-ux/manager-network-common';
import { iamResourcesMocks } from '@/data/mocks/iam';
import {
  changeSelectValueByLabelText,
  getButtonByLabel,
  labels,
  renderTest,
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

    let submitButton = await getButtonByLabel({
      container,
      value: labels.endpoints.createEndpointButtonLabel,
    });
    await waitFor(
      () => expect(submitButton).toBeDisabled(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    await changeSelectValueByLabelText({
      selectLabel: labels.endpoints.serviceNameLabel,
      value: iamResourcesMocks[0].urn,
    });

    submitButton = await getButtonByLabel({
      container,
      value: labels.endpoints.createEndpointButtonLabel,
    });
    expect(submitButton).toBeDisabled();

    await changeSelectValueByLabelText({
      selectLabel: labels.endpoints.subnetLabel,
      value: vrackServicesListMocks[20].currentState.subnets[0].cidr,
    });

    submitButton = await getButtonByLabel({
      container,
      value: labels.endpoints.createEndpointButtonLabel,
    });
    await waitFor(
      () => expect(submitButton).not.toBeDisabled(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
    await waitFor(() => userEvent.click(submitButton));

    await assertTextVisibility(labels.endpoints.endpointsOnboardingDescription);
  });
});
