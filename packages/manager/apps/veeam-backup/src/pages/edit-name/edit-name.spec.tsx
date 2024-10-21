import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import userEvents from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import {
  renderTest,
  labels,
  checkModal,
  waitForOptions,
  changeInputValue,
  getButtonByIcon,
} from '@/test-helpers';
import { backupList } from '@/../mocks/veeam-backup.mock';
import { urls } from '@/routes/routes.constant';
import '@testing-library/jest-dom';

describe('Edit name', () => {
  it('modify the name of the backup', async () => {
    const { container } = await renderTest({
      initialRoute: urls.dashboard.replace(':id', backupList[1].id),
    });

    await waitFor(
      () =>
        expect(screen.getByText(labels.dashboard.delete_service)).toBeVisible(),
      waitForOptions,
    );

    const editButton = await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.PEN,
    });
    await waitFor(() => userEvents.click(editButton));

    await checkModal({ container, isVisible: true });

    await changeInputValue({ inputLabel: 'update-input', value: 'new name' });

    const modifyButton = screen.getByText(
      labels.common.update_display_name_confirm_button,
      { exact: true },
    );

    await waitFor(() => userEvents.click(modifyButton));

    await checkModal({ container, isVisible: false });

    expect(
      screen.getByText(labels.common.update_veeam_backup_display_name_success),
    ).toBeVisible();
  });
});
