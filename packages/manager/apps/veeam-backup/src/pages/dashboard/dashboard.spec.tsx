import { screen, waitFor } from '@testing-library/react';
import {
  renderTest,
  labels,
  waitForOptions,
  goToDashboard,
} from '@/test-helpers';
import { backupList } from '@/../mocks/veeam-backup.mock';
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
      waitForOptions,
    );
  });
});
