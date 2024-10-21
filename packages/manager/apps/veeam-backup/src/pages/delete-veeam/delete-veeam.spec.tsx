import userEvents from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import {
  renderTest,
  labels,
  checkModal,
  changeInputValue,
  getEnabledButtonByLabel,
} from '@/test-helpers';
import { backupList } from '@/../mocks/veeam-backup.mock';
import { urls } from '@/routes/routes.constant';
import '@testing-library/jest-dom';

describe('Delete veeam-backup', () => {
  it('Delete a backup', async () => {
    const { container } = await renderTest({
      initialRoute: urls.dashboard.replace(':id', backupList[1].id),
    });

    const deleteButton = await getEnabledButtonByLabel(
      labels.dashboard.delete_service,
    );
    await waitFor(() => userEvents.click(deleteButton));

    await checkModal({ container, isVisible: true });

    await changeInputValue({
      inputLabel: 'delete-input',
      value: 'TERMINATE',
    });

    const confirmButton = screen.getByText('deleteModalDeleteButton', {
      exact: true,
    });

    await waitFor(() => userEvents.click(confirmButton));

    await checkModal({ container, isVisible: false });

    expect(
      screen.getByText(labels.deleteVeeam.terminate_veeam_backup_success),
    ).toBeVisible();
  });
});
