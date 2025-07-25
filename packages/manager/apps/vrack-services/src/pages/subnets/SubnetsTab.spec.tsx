import { describe, it } from 'vitest';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { vrackServicesListMocks } from '@ovh-ux/manager-network-common';
import {
  assertModalVisibility,
  assertModalText,
  assertOsdFormInputInError,
  changeInputValueByLabelText,
  getButtonByIcon,
  getButtonByLabel,
  labels,
  renderTest,
  assertDisabled,
  assertEnabled,
  doActionOnElementUntil,
} from '@/test-utils';
import { urls } from '@/routes/routes.constants';

describe('Vrack Services subnets page test suite', () => {
  it('should display the subnets onboarding if no subnet exist', async () => {
    await renderTest({
      nbVs: 1,
      initialRoute: urls.subnets.replace(':id', vrackServicesListMocks[0].id),
    });

    const subnetTab = await waitFor(() =>
      screen.getByText(labels.dashboard.subnetsTabLabel),
    );
    await waitFor(() => userEvent.click(subnetTab));

    await assertTextVisibility(labels.subnets.subnetsOnboardingTitle);
  });

  it('should display the subnets listing if subnet exist', async () => {
    await renderTest({
      nbVs: 2,
      initialRoute: urls.subnets.replace(':id', vrackServicesListMocks[1].id),
    });

    const subnetTab = await waitFor(() =>
      screen.getByText(labels.dashboard.subnetsTabLabel),
    );
    await waitFor(() => userEvent.click(subnetTab));

    await assertTextVisibility(labels.subnets.subnetDatagridDisplayNameLabel);
    await assertTextVisibility(
      vrackServicesListMocks[1].currentState.subnets[0].displayName,
    );
    await assertTextVisibility(
      vrackServicesListMocks[1].currentState.subnets[0].serviceRange.cidr,
    );
  });

  it('should limit the subnets to 1', async () => {
    const { container } = await renderTest({
      nbVs: 2,
      initialRoute: urls.subnetsListing.replace(
        ':id',
        vrackServicesListMocks[1].id,
      ),
    });

    await assertTextVisibility(labels.subnets.betaSubnetLimitMessage);
    const submitButton = await getButtonByLabel({
      container,
      value: labels.subnets.createSubnetButtonLabel,
    });
    await assertDisabled(submitButton);
  });

  it('should edit a subnet', async () => {
    const { container } = await renderTest({
      nbVs: 2,
      initialRoute: urls.subnetsListing.replace(
        ':id',
        vrackServicesListMocks[1].id,
      ),
    });

    const actionMenuButton = await getButtonByIcon({
      container,
      value: ODS_ICON_NAME.ellipsisVertical,
    });
    await assertEnabled(actionMenuButton);
    await waitFor(() => userEvent.click(actionMenuButton));

    const editLink = await getButtonByLabel({
      container,
      value: labels.subnets['action-editSubnet'],
    });
    await assertEnabled(editLink);
    await waitFor(() => userEvent.click(editLink));

    await assertModalText({
      container,
      text: labels.subnets.modalSubnetUpdateHeadline,
    });

    // not /24
    await changeInputValueByLabelText({
      inputLabel: labels.subnets.cidrLabel,
      value: '10.0.0.0/23',
    });
    await assertOsdFormInputInError({
      inputLabel: labels.subnets.cidrLabel,
      inError: true,
    });

    // didn't change
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
      value: labels.actions.modify,
    });
    await assertDisabled(submitButton);

    // new value is correct
    await changeInputValueByLabelText({
      inputLabel: labels.subnets.cidrLabel,
      value: '11.0.0.0/24',
    });
    await assertOsdFormInputInError({
      inputLabel: labels.subnets.cidrLabel,
      inError: false,
    });
    await assertEnabled(submitButton);
    const modal = container.querySelector('ods-modal');
    await doActionOnElementUntil(
      () => userEvent.click(submitButton),
      () => expect(modal).not.toBeInTheDocument(),
    );
  });

  it('should display an error if api fail to edit a subnet', async () => {
    const { container } = await renderTest({
      nbVs: 2,
      initialRoute: urls.subnetsListing.replace(
        ':id',
        vrackServicesListMocks[1].id,
      ),
      updateKo: true,
    });

    const actionMenuButton = await getButtonByIcon({
      container,
      value: ODS_ICON_NAME.ellipsisVertical,
    });
    await waitFor(() => userEvent.click(actionMenuButton));

    const editLink = await getButtonByLabel({
      container,
      value: labels.subnets['action-editSubnet'],
    });
    await waitFor(() => userEvent.click(editLink));

    // new value is correct
    await changeInputValueByLabelText({
      inputLabel: labels.subnets.cidrLabel,
      value: '11.0.0.0/24',
    });
    await assertOsdFormInputInError({
      inputLabel: labels.subnets.cidrLabel,
      inError: false,
    });
    const submitButton = await getButtonByLabel({
      container,
      value: labels.actions.modify,
    });
    await assertEnabled(submitButton);
    await waitFor(() => userEvent.click(submitButton));

    await assertModalVisibility({ container, isVisible: true });
    await assertTextVisibility(
      labels.subnets.subnetUpdateError.replace('{{error}}', 'Update vs error'),
    );
  });

  it('should delete a subnet', async () => {
    const { container } = await renderTest({
      nbVs: 2,
      initialRoute: urls.subnetsListing.replace(
        ':id',
        vrackServicesListMocks[1].id,
      ),
    });

    const actionMenuButton = await getButtonByIcon({
      container,
      value: ODS_ICON_NAME.ellipsisVertical,
    });
    await waitFor(() => userEvent.click(actionMenuButton));

    const deleteLink = await getButtonByLabel({
      container,
      value: labels.subnets['action-deleteSubnet'],
    });
    await assertEnabled(deleteLink);
    await waitFor(() => userEvent.click(deleteLink));

    await assertModalText({
      container,
      text: labels.subnets.modalDeleteSubnetHeadline,
    });

    const deleteButton = await getButtonByLabel({
      container,
      value: labels.actions.delete,
    });
    await assertEnabled(deleteButton);
    const modal = container.querySelector('ods-modal');
    await doActionOnElementUntil(
      () => userEvent.click(deleteButton),
      () => expect(modal).not.toBeInTheDocument(),
    );
  });
});
