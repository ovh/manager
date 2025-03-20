import { describe, it } from 'vitest';
import {
  WAIT_FOR_DEFAULT_OPTIONS,
  assertTextVisibility,
} from '@ovh-ux/manager-core-test-utils';
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
    let submitButton = await getButtonByLabel({
      container,
      value: labels.subnets.createSubnetButtonLabel,
    });
    await waitFor(
      () => expect(submitButton).not.toBeDisabled(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    await clickOnRadioByName({
      container,
      name: vlanInputName,
      value: vlanNumberOptionValue,
    });

    submitButton = await getButtonByLabel({
      container,
      value: labels.subnets.createSubnetButtonLabel,
    });
    await waitFor(
      () => expect(submitButton).toBeDisabled(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    await changeInputValueByLabelText({
      inputLabel: labels.subnets.vlanNumberLabel,
      value: '20',
    });
    submitButton = await getButtonByLabel({
      container,
      value: labels.subnets.createSubnetButtonLabel,
    });
    await waitFor(
      () => expect(submitButton).not.toBeDisabled(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    await waitFor(() => userEvent.click(submitButton));

    await assertTextVisibility(labels.subnets.subnetDatagridDisplayNameLabel);
  });
});
