import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import React from 'react';
import updateTranslation from '@translation/updateSoftware/Messages_fr_FR.json';
import dashboardTranslation from '@translation/dashboard/Messages_fr_FR.json';
import { versionsMocked } from '@/__mocks__/version';
import { render, waitFor } from '@/utils/test/test.provider';
import UpdateSoftwareModal from './UpdateSoftwareConfirmModal.component';

const onConfirmUpdated = vi.fn();
const onClose = vi.fn();

afterEach(() => {
  vi.clearAllMocks();
});

const setupSpecTest = async () =>
  waitFor(() =>
    render(
      <UpdateSoftwareModal
        onClose={onClose}
        selectedVersion={versionsMocked[1].name}
        onConfirmUpdated={onConfirmUpdated}
        isUpdatePending={false}
      />,
    ),
  );

describe('Update Software Confirm Modal', () => {
  it('I should see the title, confirm button', async () => {
    const screen = await setupSpecTest();

    const title = screen.getByText(updateTranslation.updateSoftwareModalTitle);
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
