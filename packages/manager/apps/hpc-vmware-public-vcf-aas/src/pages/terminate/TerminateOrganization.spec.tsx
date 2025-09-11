import { organizationList } from '@ovh-ux/manager-module-vcd-api';
import { screen } from '@testing-library/dom';
import { act } from '@testing-library/react';
import { renderTest, labels } from '../../test-utils';

const openTerminateModal = async () => {
  const vcdActionMenu = await screen.findByTestId(
    'navigation-action-trigger-action',
  );
  expect(vcdActionMenu).toBeVisible();
  act(() => vcdActionMenu.click());

  const terminateCta = await screen.findByTestId(
    `terminate-cta-${organizationList[0].id}`,
  );
  expect(terminateCta).toBeVisible();

  act(() => {
    terminateCta.click();
  });
};

describe('Organization Terminate Page', () => {
  it('Should display the VCD terminate modal when user clicks on terminate button', async () => {
    await renderTest({ nbOrganization: 1 });

    openTerminateModal();

    const modalDescription = await screen.findByTestId(
      'manager-delete-modal-description',
    );
    expect(modalDescription).toBeVisible();
  });

  it('Should display listing page without cancel service when termination is canceled', async () => {
    await renderTest({ nbOrganization: 1 });

    openTerminateModal();

    const cancelButton = await screen.findByTestId(
      'manager-delete-modal-cancel',
    );
    expect(cancelButton).toBeVisible();
    act(() => {
      cancelButton.click();
    });

    const nameLabel = await screen.findByText(
      labels.listing.managed_vcd_listing_name,
    );
    expect(nameLabel).toBeVisible();
  });

  it('Should display listing page and cancel service when termination is confirmed', async () => {
    await renderTest({ nbOrganization: 1 });

    openTerminateModal();

    const confirmButton = await screen.findByTestId(
      'manager-delete-modal-confirm',
    );
    expect(confirmButton).toBeVisible();
    await act(() => {
      confirmButton.click();
    });

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
  });
});
