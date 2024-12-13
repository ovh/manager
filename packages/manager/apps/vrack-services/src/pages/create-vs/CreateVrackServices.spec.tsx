import { describe, it } from 'vitest';
import '@testing-library/jest-dom';
import {
  assertModalText,
  assertModalVisibility,
  assertTextVisibility,
  getButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';
import { screen, waitFor, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { assertModalTitle, labels, renderTest } from '../../test-utils';
import { urls } from '@/routes/routes.constants';

describe('Vrack Services create page test suite', () => {
  it('should display the create form with regions', async () => {
    const user = userEvent.setup();

    const { container } = await renderTest({
      initialRoute: '/create',
      nbVs: 1,
    });

    await waitFor(() => {
      expect(screen.getAllByText(labels.create.createPageTitle).length).toBe(2);
    });

    await getButtonByLabel({
      container,
      label: labels.create.createButtonLabel,
      disabled: true,
    });

    const regionRadio = await waitFor(() => {
      const regionRadioInput = screen.getByText('eu-west-rbx');
      expect(regionRadioInput).toBeDefined();
      return regionRadioInput;
    });

    await waitFor(() => user.click(regionRadio));

    await waitFor(() => {
      expect(regionRadio.closest('osds-radio')).toHaveAttribute('checked');
    });

    const submitButton = await getButtonByLabel({
      container,
      label: labels.create.createButtonLabel,
      disabled: false,
    });

    await act(() => {
      user.click(submitButton);
    });

    await assertModalVisibility({ container, isVisible: true });
    await assertModalTitle({ container, title: labels.create.modalHeadline });
  });

  it('should redirect to listing page if user has no right to order vrs', async () => {
    await renderTest({
      initialRoute: '/create',
      isVrackServicesOrderFeatureUnavailable: true,
      isFeatureAvailabilityServiceKo: false,
      nbVs: 1,
    });

    await waitFor(() => {
      expect(screen.getAllByText(labels.create.createPageTitle).length).toBe(2);
    });

    await assertTextVisibility(labels.listing.listingDescription);
  });

  it('should display create with vRack', async () => {
    const { container } = await renderTest({
      initialRoute: urls.createConfirm.replace(':region', 'eu-west-rbx'),
      nbVs: 1,
    });

    const createvrackButton = await getButtonByLabel({
      container,
      label: labels.create.modalConfirmVrackButtonLabel,
    });

    await waitFor(() => fireEvent.click(createvrackButton));

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
      label: labels.create.modalCancelButtonLabel,
    });

    await waitFor(() => fireEvent.click(cancelButton));

    await assertModalVisibility({ container, isVisible: false });
  });

  it('should display create without vRack', async () => {
    const { container } = await renderTest({
      initialRoute: urls.createConfirm.replace(':region', 'eu-west-rbx'),
      nbVs: 1,
    });

    const createWithoutVrackButton = await getButtonByLabel({
      container,
      label: labels.create.modalNoVrackButtonLabel,
    });

    await waitFor(() => fireEvent.click(createWithoutVrackButton));

    await waitFor(() => {
      expect(
        screen.queryByText(labels.create.modalDescriptionLine4),
      ).toBeNull();
    });

    await assertModalText({
      container,
      text: labels.create.modalDescriptionLine5,
    });
  });
});
