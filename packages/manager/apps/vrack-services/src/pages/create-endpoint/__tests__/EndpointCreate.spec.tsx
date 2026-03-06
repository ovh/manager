import { describe, expect, it } from 'vitest';

import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { vrackServicesListMocks } from '@ovh-ux/manager-network-common';

import { labels } from '@/__tests__/test-i18n';
import {
  assertEnabled,
  changeSelectValueByTestId,
  doActionOnElementUntil,
  getElementByText,
  renderTestComponent,
} from '@/__tests__/uiTestHelpers';

import EndpointCreatePage from '../EndpointCreate.page';

describe('Vrack Services endpoint creation page test suite', () => {
  it('should display an endpoint creation page', async () => {
    const { container } = await renderTestComponent({
      component: <EndpointCreatePage />,
    });

    await assertTextVisibility(labels.endpoints.createEndpointPageDescription);

    const submitButton = await getElementByText({
      value: labels.endpoints.createEndpointButtonLabel,
    });
    if (submitButton) {
      await doActionOnElementUntil(
        () =>
          void changeSelectValueByTestId({
            testId: 'select-subnet',
            container,
            value: vrackServicesListMocks[20]?.currentState.subnets[0]?.cidr ?? '',
          }),
        () => void assertEnabled(submitButton),
      );
    } else {
      expect.fail();
    }

    expect(submitButton).toBeEnabled();
  });
});
