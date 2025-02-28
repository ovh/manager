import { describe, it } from 'vitest';
import '@testing-library/jest-dom';
import {
  assertModalVisibility,
  assertTextVisibility,
  getButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';
import { waitFor, fireEvent, screen } from '@testing-library/react';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { vrackServicesListMocks } from '@ovh-ux/manager-network-common';
import {
  assertModalTitle,
  assertOsdFormInputInError,
  changeInputValueByLabelText,
  getButtonByIcon,
  getButtonByVariant,
  labels,
  renderTest,
} from '../../test-utils';
import { urls } from '@/routes/routes.constants';

describe('Vrack Services subnets page test suite', () => {
  it('should display the subnets onboarding if no subnet exist', async () => {
    await renderTest({
      nbVs: 1,
      initialRoute: urls.overview.replace(':id', vrackServicesListMocks[0].id),
    });

    const subnetTab = await waitFor(() =>
      screen.getByText(labels.dashboard.subnetsTabLabel),
    );

    await waitFor(() => fireEvent.click(subnetTab));

    await assertTextVisibility(labels.subnets.subnetsOnboardingTitle);
  });

  it('should display the subnets listing if subnet exist', async () => {
    await renderTest({
      nbVs: 2,
      initialRoute: urls.overview.replace(':id', vrackServicesListMocks[1].id),
    });

    const subnetTab = await waitFor(() =>
      screen.getByText(labels.dashboard.subnetsTabLabel),
    );

    await waitFor(() => fireEvent.click(subnetTab));

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
    await getButtonByLabel({
      container,
      label: labels.subnets.createSubnetButtonLabel,
      disabled: true,
    });
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
      iconName: ODS_ICON_NAME.ELLIPSIS,
    });

    await waitFor(() => fireEvent.click(actionMenuButton));

    const editLink = await getButtonByLabel({
      container,
      label: labels.subnets['action-editSubnet'],
    });

    await waitFor(() => fireEvent.click(editLink));

    await assertModalTitle({
      container,
      title: labels.subnets.modalSubnetUpdateHeadline,
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
    await getButtonByVariant({
      container,
      variant: ODS_BUTTON_VARIANT.flat,
      disabled: true,
    });

    // new value is correct
    await changeInputValueByLabelText({
      inputLabel: labels.subnets.cidrLabel,
      value: '11.0.0.0/24',
    });
    await assertOsdFormInputInError({
      inputLabel: labels.subnets.cidrLabel,
      inError: false,
    });
    const submitButton = await getButtonByVariant({
      container,
      variant: ODS_BUTTON_VARIANT.flat,
      disabled: false,
    });

    await waitFor(() => fireEvent.click(submitButton));

    await assertModalVisibility({ container, isVisible: false });
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
      iconName: ODS_ICON_NAME.ELLIPSIS,
    });

    await waitFor(() => fireEvent.click(actionMenuButton));

    const editLink = await getButtonByLabel({
      container,
      label: labels.subnets['action-editSubnet'],
    });

    await waitFor(() => fireEvent.click(editLink));

    // new value is correct
    await changeInputValueByLabelText({
      inputLabel: labels.subnets.cidrLabel,
      value: '11.0.0.0/24',
    });
    await assertOsdFormInputInError({
      inputLabel: labels.subnets.cidrLabel,
      inError: false,
    });
    const submitButton = await getButtonByVariant({
      container,
      variant: ODS_BUTTON_VARIANT.flat,
      disabled: false,
    });

    await waitFor(() => fireEvent.click(submitButton));

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
      iconName: ODS_ICON_NAME.ELLIPSIS,
    });

    await waitFor(() => fireEvent.click(actionMenuButton));

    const editLink = await getButtonByLabel({
      container,
      label: labels.subnets['action-deleteSubnet'],
    });

    await waitFor(() => fireEvent.click(editLink));

    await assertModalTitle({
      container,
      title: labels.subnets.modalDeleteSubnetHeadline,
    });
    await getButtonByVariant({
      container,
      variant: ODS_BUTTON_VARIANT.flat,
      disabled: true,
    });
    await changeInputValueByLabelText({
      inputLabel: labels.subnets.modalDeleteSubnetInputLabel,
      value: 'TERMINATE',
    });

    const submitButton = await getButtonByVariant({
      container,
      variant: ODS_BUTTON_VARIANT.flat,
      disabled: false,
    });

    await waitFor(() => fireEvent.click(submitButton));

    await assertModalVisibility({ container, isVisible: false });
  });
});
