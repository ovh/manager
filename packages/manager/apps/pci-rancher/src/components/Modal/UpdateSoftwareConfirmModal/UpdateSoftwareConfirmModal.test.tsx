import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, it, vi } from 'vitest';
import { act, waitFor } from '@testing-library/react';
import updateTranslation from '../../../../public/translations/updateSoftware/Messages_fr_FR.json';
import dashboardTranslation from '../../../../public/translations/dashboard/Messages_fr_FR.json';
import { versionsMocked } from '../../../_mock_/version';
import { render } from '../../../utils/test/test.provider';
import UpdateSoftwareModal from './UpdateSoftwareConfirmModal.component';

const onConfirmUpdated = vi.fn();
const onClose = vi.fn();

afterEach(() => {
  vi.clearAllMocks();
});

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useTracking: vi.fn(() => ({
    trackPage: vi.fn(),
    trackClick: vi.fn(),
  })),
}));

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

    act(async () => {
      await userEvent.click(button);
    });

    waitFor(() => {
      expect(onConfirmUpdated).toHaveBeenCalled();
    });
  });

  it('The cancel button should call onClose method', async () => {
    const screen = await setupSpecTest();

    waitFor(() => {
      const cancelButton = screen.getByText(dashboardTranslation.cancel);

      act(async () => {
        await userEvent.click(cancelButton);
      });

      waitFor(() => {
        expect(onClose).toHaveBeenCalled();
      });
    });
  });
});
