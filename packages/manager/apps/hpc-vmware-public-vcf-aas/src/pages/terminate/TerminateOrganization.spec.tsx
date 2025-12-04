import { screen } from '@testing-library/dom';
import { act } from '@testing-library/react';

import { SAFE_MOCK_DATA } from '@/test-utils/safeMockData.utils';

import { labels, renderTest } from '../../test-utils';

const config = {
  org: SAFE_MOCK_DATA.orgStandard,
};

const openTerminateModal = async () => {
  const vcdActionMenu = await screen.findByTestId('navigation-action-trigger-action');
  expect(vcdActionMenu).toBeVisible();
  act(() => vcdActionMenu.click());

  const terminateCta = await screen.findByTestId(`terminate-cta-${config.org.id}`);
  expect(terminateCta).toBeVisible();

  act(() => {
    terminateCta.click();
  });
};

describe('Organization Terminate Page', () => {
  it('Should display the VCD terminate modal when user clicks on terminate button', async () => {
    await renderTest({ nbOrganization: 1 });

    await openTerminateModal();

    const modalDescription = await screen.findByTestId('manager-delete-modal-description');
    expect(modalDescription).toBeVisible();
  });

  it('Should display listing page without cancel service when termination is canceled', async () => {
    await renderTest({ nbOrganization: 1 });

    await openTerminateModal();

    const cancelButton = await screen.findByTestId('manager-delete-modal-cancel');
    expect(cancelButton).toBeVisible();
    act(() => {
      cancelButton.click();
    });

    const nameLabel = await screen.findByText(labels.listing.managed_vcd_listing_name);
    expect(nameLabel).toBeVisible();
  });

  it('Should display listing page and cancel service when termination is confirmed', async () => {
    await renderTest({ nbOrganization: 1 });

    await openTerminateModal();

    const confirmButton = await screen.findByTestId('manager-delete-modal-confirm');
    expect(confirmButton).toBeVisible();
    act(() => {
      confirmButton.click();
    });

    // Timeout to wait for the end of the mutation
    await act(() => new Promise((resolve) => setTimeout(resolve, 2000)));

    const successBanner = await screen.findByText(
      labels.terminate.terminate_managed_vcd_success.replace('{{service}}', config.org.id),
    );
    expect(successBanner).toBeVisible();

    const nameLabel = await screen.findByText(labels.listing.managed_vcd_listing_name);
    expect(nameLabel).toBeVisible();
  });
});
