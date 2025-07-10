import { vi } from 'vitest';
import { organizationList } from '@ovh-ux/manager-module-vcd-api';
import { screen } from '@testing-library/dom';
import { act } from '@testing-library/react';
import { renderTest, labels } from '../../test-utils';
import { TRACKING } from '../../tracking.constants';
import TEST_IDS from '../../utils/testIds.constants';

const trackClickMock = vi.fn();
vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({
      trackClick: trackClickMock,
      trackPage: vi.fn(),
      trackCurrentPage: vi.fn(),
    }),
  };
});

const openTerminateModal = async () => {
  const vcdActionMenu = await screen.findByTestId(
    'navigation-action-trigger-action',
  );
  expect(vcdActionMenu).toBeVisible();
  act(() => vcdActionMenu.click());

  const terminateCta = await screen.findByTestId(
    TEST_IDS.terminateIdCta(organizationList[0].id),
  );
  expect(terminateCta).toBeVisible();

  act(() => terminateCta.click());
};

describe('Organization Terminate Page', () => {
  it('Should display the VCD terminate modal when user clicks on terminate button', async () => {
    await renderTest({ nbOrganization: 1 });

    openTerminateModal();

    const modalDescription = await screen.findByTestId(
      'manager-delete-modal-description',
    );
    expect(modalDescription).toBeVisible();

    // track modal opening
    expect(trackClickMock).toHaveBeenCalledWith(TRACKING.terminate.fromListing);
  });

  it('Should display listing page without cancel service when termination is canceled', async () => {
    await renderTest({ nbOrganization: 1 });

    openTerminateModal();

    const cancelButton = await screen.findByTestId(
      'manager-delete-modal-cancel',
    );
    expect(cancelButton).toBeVisible();
    act(() => cancelButton.click());

    const nameLabel = await screen.findByText(
      labels.listing.managed_vcd_listing_name,
    );
    expect(nameLabel).toBeVisible();

    // track cancellation
    expect(trackClickMock).toHaveBeenCalledWith(TRACKING.terminate.modalCancel);
  });

  it('Should display listing page and cancel service when termination is confirmed', async () => {
    await renderTest({ nbOrganization: 1 });

    openTerminateModal();

    const confirmButton = await screen.findByTestId(
      'manager-delete-modal-confirm',
    );
    expect(confirmButton).toBeVisible();
    act(() => confirmButton.click());

    // Timeout to wait for the end of the mutation
    await act(() => new Promise((resolve) => setTimeout(resolve, 2000)));

    const successBanner = await screen.findByText(
      labels.terminate.terminate_managed_vcd_success.replace(
        '{{service}}',
        organizationList[0].id,
      ),
    );
    expect(successBanner).toBeVisible();

    const nameLabel = await screen.findByText(
      labels.listing.managed_vcd_listing_name,
    );
    expect(nameLabel).toBeVisible();

    // track confirmation
    expect(trackClickMock).toHaveBeenCalledWith(
      TRACKING.terminate.modalConfirm,
    );
  });
});
