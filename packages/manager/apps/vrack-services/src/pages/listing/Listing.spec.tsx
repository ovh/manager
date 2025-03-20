import { describe, it } from 'vitest';
import {
  WAIT_FOR_DEFAULT_OPTIONS,
  assertTextVisibility,
} from '@ovh-ux/manager-core-test-utils';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import {
  getButtonByLabel,
  assertModalText,
  getButtonByIcon,
  labels,
  renderTest,
} from '@/test-utils';

describe('Vrack Services listing test suite', () => {
  it('should redirect to the onboarding page when the VRS list is empty', async () => {
    await renderTest({ nbVs: 0 });

    await assertTextVisibility(labels.onboarding.onboardingPageTitle);
  });

  it.only('should show list of vrack services', async () => {
    const { container } = await renderTest({ nbVs: 7 });

    await getButtonByLabel({
      container,
      value: labels.listing.createVrackServicesButtonLabel,
    });

    const actionMenuDisabled = await getButtonByIcon({
      container,
      value: ODS_ICON_NAME.ellipsisVertical,
      nth: 6,
    });
    await waitFor(() => userEvent.click(actionMenuDisabled));

    const editButton = await getButtonByLabel({
      container,
      value: labels.common['action-editDisplayName'],
      nth: 6,
    });
    expect(editButton).toBeDisabled();

    let deleteButton = await getButtonByLabel({
      container,
      value: labels.common['action-deleteVrackServices'],
      nth: 6,
    });
    expect(deleteButton).toBeDisabled();

    let goDetailsButton = await getButtonByLabel({
      container,
      value: labels.common['action-goDetails'],
      nth: 6,
    });
    expect(goDetailsButton).toBeEnabled();

    const actionMenuActive = await getButtonByIcon({
      container,
      value: ODS_ICON_NAME.ellipsisVertical,
      nth: 1,
    });
    await waitFor(() => userEvent.click(actionMenuActive));

    const editDisplayNameModalButton = await getButtonByLabel({
      container,
      value: labels.common['action-editDisplayName'],
      nth: 1,
    });
    await waitFor(
      () => expect(editDisplayNameModalButton).not.toBeDisabled(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    deleteButton = await getButtonByLabel({
      container,
      value: labels.common['action-deleteVrackServices'],
      nth: 1,
    });
    await waitFor(
      () => expect(deleteButton).not.toBeDisabled(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );

    goDetailsButton = await getButtonByLabel({
      container,
      value: labels.common['action-goDetails'],
      nth: 1,
    });
    expect(goDetailsButton).toBeEnabled();

    await waitFor(() => userEvent.click(editDisplayNameModalButton));

    await assertModalText({
      container,
      text: labels.common.modalUpdateVrackServicesHeadline.replace(
        '{{id}}',
        'vrs-ahz-9t0-7lb-b5r',
      ),
    });

    const closeDisplayNameModal = await getButtonByLabel({
      container,
      value: labels.actions.cancel,
    });
    await waitFor(() => userEvent.click(closeDisplayNameModal));

    await waitFor(() => userEvent.click(goDetailsButton));

    await assertTextVisibility(labels.dashboard.dashboardPageDescription);
  });
});
