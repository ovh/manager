import userEvents from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import {
  assertModalVisibility,
  changeInputValue,
  getButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';
import { backupList } from '@ovh-ux/manager-module-vcd-api';
import { renderTest, labels } from '@/test-helpers';
import { urls } from '@/routes/routes.constant';
import '@testing-library/jest-dom';

describe('Delete veeam-backup', () => {
  it('Delete a backup', async () => {
    const { container } = await renderTest({
      initialRoute: urls.dashboard.replace(':id', backupList[1].id),
    });

    const deleteButton = await getButtonByLabel({
      container,
      label: labels.dashboard.delete_service,
    });
    await waitFor(() => userEvents.click(deleteButton));

    await assertModalVisibility({ container, isVisible: true });

    await changeInputValue({
      inputLabel: 'delete-input',
      value: 'TERMINATE',
    });

    const confirmButton = await getButtonByLabel({
      container,
      label: 'deleteModalDeleteButton',
      altLabel: 'Résilier',
    });

    await waitFor(() => userEvents.click(confirmButton));

    await assertModalVisibility({ container, isVisible: false });

    expect(
      screen.getByText(labels.deleteVeeam.terminate_veeam_backup_success),
    ).toBeVisible();
  });
});
