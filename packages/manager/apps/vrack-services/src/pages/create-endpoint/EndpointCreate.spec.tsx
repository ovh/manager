import { describe, it } from 'vitest';
import '@testing-library/jest-dom';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { vrackServicesListMocks } from '@ovh-ux/manager-network-common';
import { iamResourcesMocks } from '@/data/mocks/iam';
import {
  changeSelectValueByLabelText,
  getButtonByVariant,
  labels,
  renderTest,
} from '../../test-utils';

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

    await getButtonByVariant({
      container,
      variant: ODS_BUTTON_VARIANT.flat,
      disabled: true,
    });

    await changeSelectValueByLabelText({
      selectLabel: labels.endpoints.serviceNameLabel,
      value: iamResourcesMocks[0].displayName,
    });

    await getButtonByVariant({
      container,
      variant: ODS_BUTTON_VARIANT.flat,
      disabled: true,
    });

    await changeSelectValueByLabelText({
      selectLabel: labels.endpoints.subnetLabel,
      value: vrackServicesListMocks[20].currentState.subnets[0].cidr,
    });

    await getButtonByVariant({
      container,
      variant: ODS_BUTTON_VARIANT.flat,
      disabled: false,
    });
  });
});
