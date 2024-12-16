import { describe, it } from 'vitest';
import '@testing-library/jest-dom';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { waitFor, fireEvent } from '@testing-library/react';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { eligibleManagedServiceResponse } from 'mocks/vrack-services/vrack-services';
import {
  assertOsdFormInputInError,
  changeInputValueByLabelText,
  changeSelectValueByLabelText,
  clickOnRadioByName,
  getButtonByVariant,
  labels,
  renderTest,
} from '../../test-utils';
import vrackServicesList from '../../../mocks/vrack-services/get-vrack-services.json';
import { urls } from '@/routes/routes.constants';
import { iamResources } from '../../../mocks/iam/iam';

describe('Vrack Services endpoint creation page test suite', () => {
  it('should create an endpoint', async () => {
    const { container } = await renderTest({
      nbVs: 21,
      initialRoute: urls.createEndpoint.replace(
        ':id',
        vrackServicesList[20].id,
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
      value: iamResources[0].displayName,
    });

    await getButtonByVariant({
      container,
      variant: ODS_BUTTON_VARIANT.flat,
      disabled: true,
    });

    await changeSelectValueByLabelText({
      selectLabel: labels.endpoints.subnetLabel,
      value: vrackServicesList[20].currentState.subnets[0].cidr,
    });

    await getButtonByVariant({
      container,
      variant: ODS_BUTTON_VARIANT.flat,
      disabled: false,
    });
  });
});
