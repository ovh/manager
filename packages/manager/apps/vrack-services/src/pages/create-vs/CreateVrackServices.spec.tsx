import { describe, it } from 'vitest';
import '@testing-library/jest-dom';
import {
  assertModalText,
  assertModalVisibility,
  assertTextVisibility,
  getButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';
import { screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { labels, renderTest } from '../../test-utils';

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

    await act(() => {
      user.click(regionRadio);
    });

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

    assertModalVisibility({ container, isVisible: true });
    assertModalText({ container, text: labels.create.modalHeadline });
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
});
