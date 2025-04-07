import { describe, it } from 'vitest';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vrackServicesListMocks } from '@ovh-ux/manager-network-common';
import {
  assertOsdFormInputInError,
  changeInputValueByLabelText,
  clickOnRadioByName,
  getButtonByLabel,
  labels,
  renderTest,
  assertDisabled,
  assertEnabled,
} from '@/test-utils';
import { urls } from '@/routes/routes.constants';
import { vlanInputName, vlanNumberOptionValue } from './subnetCreate.constants';

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
    const submitButton = await getButtonByLabel({
      container,
      value: labels.subnets.createSubnetButtonLabel,
    });
    await assertEnabled(submitButton);

    await clickOnRadioByName({
      container,
      name: vlanInputName,
      value: vlanNumberOptionValue,
    });

    await assertDisabled(submitButton);

    await changeInputValueByLabelText({
      inputLabel: labels.subnets.vlanNumberLabel,
      value: '20',
    });
    await assertEnabled(submitButton);
    await waitFor(() => userEvent.click(submitButton));

    await assertTextVisibility(labels.subnets.subnetDatagridDisplayNameLabel);
  });
});
