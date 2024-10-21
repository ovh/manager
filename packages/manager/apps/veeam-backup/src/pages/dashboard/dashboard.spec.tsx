import { screen, waitFor } from '@testing-library/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  renderTest,
  labels,
  waitForOptions,
  goToDashboard,
  getButtonByIcon,
  getButtonByLabel,
} from '@/test-helpers';
import { backupList } from '@/../mocks/veeam-backup.mock';
import '@testing-library/jest-dom';
import { urls } from '@/routes/routes.constant';

describe('dashboard', () => {
  it('displays the dashboard page when clicking on the link', async () => {
    await renderTest();
    await goToDashboard(backupList[0].iam.displayName);

    await waitFor(
      () =>
        expect(
          screen.getByText(
            new RegExp(
              labels.dashboard.administrator_contact.replace('{{code}}', '.*'),
            ),
          ),
        ),
      waitForOptions,
    );
  });

  it('actions are disabled if backup is not ready', async () => {
    const { container } = await renderTest({
      initialRoute: urls.dashboard.replace(':id', backupList[2].id),
    });

    await waitFor(
      () =>
        expect(
          screen.getByText(
            new RegExp(
              labels.dashboard.administrator_contact.replace('{{code}}', '.*'),
            ),
          ),
        ),
      waitForOptions,
    );

    await getButtonByIcon({
      container,
      iconName: ODS_ICON_NAME.PEN,
      disabled: true,
    });

    await getButtonByLabel({
      container,
      label: labels.dashboard.delete_service,
      disabled: true,
    });

    expect(screen.getByText(labels.dashboard.terminated_service)).toBeVisible();
  });
});
