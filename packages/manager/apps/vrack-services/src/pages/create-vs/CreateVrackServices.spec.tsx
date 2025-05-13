import { describe, it } from 'vitest';
import { assertTextVisibility } from '@ovh-ux/manager-core-test-utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  assertModalText,
  labels,
  renderTest,
  assertModalVisibility,
  getButtonByLabel,
  assertDisabled,
  assertEnabled,
} from '@/test-utils';
import { urls } from '@/routes/routes.constants';

describe('Vrack Services create page test suite', () => {
  it('should display the create form with regions', async () => {
    const { container } = await renderTest({
      initialRoute: urls.createVrackServices,
      nbVs: 1,
    });

    await assertTextVisibility(labels.create.regionDescription);
    await assertTextVisibility(
      labels.regionSelector['region-selector-city-name_eu-west-rbx'],
    );

    const submitButton = await getButtonByLabel({
      container,
      value: labels.create.createButtonLabel,
    });
    await assertDisabled(submitButton);

    await waitFor(() =>
      userEvent.click(
        screen.getByText(
          labels.regionSelector['region-selector-city-name_eu-west-rbx'],
        ),
      ),
    );

    await assertEnabled(submitButton);
    await waitFor(() => userEvent.click(submitButton));

    await assertModalVisibility({ container, isVisible: true });
    await assertModalText({
      container,
      text: labels.create.modalDescriptionLine1,
    });
  });

  it('should redirect to listing page if user has no right to order vrs', async () => {
    await renderTest({
      initialRoute: urls.createVrackServices,
      isVrackServicesOrderFeatureUnavailable: true,
      isFeatureAvailabilityServiceKo: false,
      nbVs: 1,
    });

    await assertTextVisibility(labels.listing.listingDescription);
  });

  it('should display create with vRack', async () => {
    const { container } = await renderTest({
      initialRoute: urls.createConfirm.replace(':region', 'eu-west-rbx'),
      nbVs: 1,
    });

    const createVrackButton = await getButtonByLabel({
      container,
      value: labels.create.modalConfirmVrackButtonLabel,
    });
    await waitFor(() => userEvent.click(createVrackButton));

    await assertModalText({
      container,
      text: labels.create.modalDescriptionLine4,
    });
    await assertModalText({
      container,
      text: labels.create.modalDescriptionLine5,
    });

    const cancelButton = await getButtonByLabel({
      container,
      value: labels.create.modalCancelButtonLabel,
    });

    await waitFor(() => userEvent.click(cancelButton));

    await assertModalVisibility({ container, isVisible: false });
  });

  it('should display create without vRack', async () => {
    const { container } = await renderTest({
      initialRoute: urls.createConfirm.replace(':region', 'eu-west-rbx'),
      nbVs: 1,
    });

    const createWithoutVrackButton = await getButtonByLabel({
      container,
      value: labels.create.modalNoVrackButtonLabel,
    });

    await waitFor(() => userEvent.click(createWithoutVrackButton));

    await waitFor(() => {
      expect(
        screen.queryByText(labels.create.modalDescriptionLine4),
      ).not.toBeInTheDocument();
    });

    await assertModalText({
      container,
      text: labels.create.modalDescriptionLine5,
    });
  });
});
