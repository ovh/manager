import userEvent from '@testing-library/user-event';
import React from 'react';
import { versionsMocked } from '@/_mock_/version';
import dashboardTranslation from '@/public/translations/pci-rancher/dashboard/Messages_fr_FR.json';
import { render, waitFor } from '@/utils/test/test.provider';
import UpdateSoftwareModal from './UpdateSoftwareConfirmModal';

const onConfirmUpdated = jest.fn();
const onClose = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

const setupSpecTest = async () =>
  waitFor(() =>
    render(
      <UpdateSoftwareModal
        onClose={onClose}
        version={versionsMocked[1]}
        onConfirmUpdated={onConfirmUpdated}
        isUpdatePending={false}
      />,
    ),
  );

describe('Update Software Confirm Modal', () => {
  it('I should see the title, confirm button', async () => {
    const screen = await setupSpecTest();

    const title = screen.getByText(
      dashboardTranslation.updateSoftwareModalTitle,
    );
    const confirmButton = screen.getByText(dashboardTranslation.confirm);

    expect(title).not.toBeNull();
    expect(confirmButton).not.toBeNull();
  });

  it('The click button should call update method', async () => {
    const screen = await setupSpecTest();

    const button = screen.getByText(dashboardTranslation.confirm);

    await userEvent.click(button);

    expect(onConfirmUpdated).toHaveBeenCalled();
  });

  it('The cancel button should call onClose method', async () => {
    const screen = await setupSpecTest();

    const cancelButton = screen.getByText(dashboardTranslation.cancel);

    await userEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });
});
