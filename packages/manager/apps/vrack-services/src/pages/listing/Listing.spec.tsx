import { describe, it } from 'vitest';
import '@testing-library/jest-dom';
import {
  assertTextVisibility,
  getButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { fireEvent, waitFor } from '@testing-library/react';
import {
  assertModalTitle,
  getButtonByIcon,
  getButtonByVariant,
  labels,
  renderTest,
} from '../../test-utils';

describe('Vrack Services listing test suite', () => {
  it('should redirect to the onboarding page when the VRS list is empty', async () => {
    await renderTest({ nbVs: 0 });

    await assertTextVisibility(labels.onboarding.onboardingPageTitle);
  });

  it('should show list of vrack services', async () => {
    const { container } = await renderTest({ nbVs: 7 });

    await assertTextVisibility(labels.listing.createVrackServicesButtonLabel);

    const actionMenuDisabled = await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.ELLIPSIS,
      nth: 6,
    });

    await waitFor(() => fireEvent.click(actionMenuDisabled));

    await getButtonByLabel({
      container,
      label: labels.common['action-editDisplayName'],
      nth: 6,
      disabled: true,
    });
    await getButtonByLabel({
      container,
      label: labels.common['action-deleteVrackServices'],
      nth: 6,
      disabled: true,
    });
    await getButtonByLabel({
      container,
      label: labels.common['action-goDetails'],
      nth: 6,
      disabled: false,
    });

    const actionMenuActive = await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.ELLIPSIS,
      nth: 1,
    });

    await waitFor(() => fireEvent.click(actionMenuActive));

    const editDisplayNameModalButton = await getButtonByLabel({
      container,
      label: labels.common['action-editDisplayName'],
      nth: 1,
      disabled: false,
    });
    await getButtonByLabel({
      container,
      label: labels.common['action-deleteVrackServices'],
      nth: 1,
      disabled: false,
    });
    const goToDEtailButton = await getButtonByLabel({
      container,
      label: labels.common['action-goDetails'],
      nth: 1,
      disabled: false,
    });

    await waitFor(() => fireEvent.click(editDisplayNameModalButton));

    await assertModalTitle({
      container,
      title: labels.common.modalUpdateVrackServicesHeadline.replace(
        '{{id}}',
        'vrs-ahz-9t0-7lb-b5r',
      ),
    });

    const closeDisplayNameModal = await getButtonByVariant({
      container,
      variant: ODS_BUTTON_VARIANT.ghost,
    });
    await waitFor(() => fireEvent.click(closeDisplayNameModal));

    await waitFor(() => fireEvent.click(goToDEtailButton));

    await assertTextVisibility(labels.dashboard.dashboardPageDescription);
  });
});
