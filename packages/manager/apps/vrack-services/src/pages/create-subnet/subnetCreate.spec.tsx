import { describe, it } from 'vitest';
import '@testing-library/jest-dom';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { waitFor, fireEvent } from '@testing-library/react';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { vrackServicesListMocks } from '@ovh-ux/manager-network-common';
import {
  assertOsdFormInputInError,
  changeInputValueByLabelText,
  clickOnRadioByName,
  getButtonByVariant,
  labels,
  renderTest,
} from '../../test-utils';
import { urls } from '@/routes/routes.constants';

describe('Vrack Services subnets page test suite', () => {
  it('should create a subnet', async () => {
    const { container } = await renderTest({
      nbVs: 2,
      initialRoute: urls.createSubnet.replace(
        ':id',
        vrackServicesListMocks[1].id,
      ),
    });

    await assertTextVisibility(labels.subnets.subnetNameLabel);

    await changeInputValueByLabelText({
      inputLabel: labels.subnets.cidrLabel,
      value: '10.0.0.0/23',
    });
    await assertOsdFormInputInError({
      inputLabel: labels.subnets.cidrLabel,
      inError: true,
    });

    await changeInputValueByLabelText({
      inputLabel: labels.subnets.cidrLabel,
      value: '10.0.0.0/24',
    });
    await assertOsdFormInputInError({
      inputLabel: labels.subnets.cidrLabel,
      inError: false,
    });
    await getButtonByVariant({
      container,
      variant: ODS_BUTTON_VARIANT.flat,
      disabled: false,
    });

    clickOnRadioByName({ container, name: 'hasVlan', value: 'vlanNumber' });
    await getButtonByVariant({
      container,
      variant: ODS_BUTTON_VARIANT.flat,
      disabled: true,
    });
    await changeInputValueByLabelText({
      inputLabel: labels.subnets.vlanNumberLabel,
      value: '20',
    });
    const submitButton = await getButtonByVariant({
      container,
      variant: ODS_BUTTON_VARIANT.flat,
      disabled: false,
    });

    await waitFor(() => fireEvent.click(submitButton));

    await assertTextVisibility(labels.subnets.subnetDatagridDisplayNameLabel);
  });
});
