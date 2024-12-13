import { screen, waitFor } from '@testing-library/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  WAIT_FOR_DEFAULT_OPTIONS,
  getButtonByIcon,
  getButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';
import { backupList } from '@ovh-ux/manager-module-vcd-api';
import { renderTest, labels, goToDashboard } from '@/test-helpers';
import { urls } from '@/routes/routes.constant';
import '@testing-library/jest-dom';

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
      WAIT_FOR_DEFAULT_OPTIONS,
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
      WAIT_FOR_DEFAULT_OPTIONS,
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
