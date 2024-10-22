import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderTest, labels } from '../../test-helpers';
import '@testing-library/jest-dom';
import backupList from '../../../mocks/veeam-backup.json';

const goToDashboard = async (name: string) => {
  await waitFor(() => {
    userEvent.click(screen.getByText(name));
  });

  await waitFor(
    () => expect(screen.getByText(labels.dashboard.general_informations)),
    { timeout: 30000 },
  );
};

describe('dashboard', () => {
  it('displays the dashboard page when clicking on the link', async () => {
    await renderTest();
    await goToDashboard(backupList[0].iam.displayName);
  });

  it('displays the modal to delete backup when clicking on the action', async () => {
    await renderTest();
    await goToDashboard(backupList[0].iam.displayName);

    await waitFor(
      () =>
        expect(screen.getByText(labels.dashboard.delete_service)).toBeEnabled(),
      {
        timeout: 30000,
      },
    );

    await waitFor(() =>
      userEvent.click(screen.getByText(labels.dashboard.delete_service)),
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.deleteVeeam.delete_input_label),
        ).toBeVisible(),
      { timeout: 30000 },
    );
  });

  it('displays the modal to edit backup name when clicking on the action', async () => {
    await renderTest();
    await goToDashboard(backupList[0].iam.displayName);

    await waitFor(
      () => expect(screen.getByTestId('edit-name-button')).toBeEnabled(),
      {
        timeout: 30000,
      },
    );

    await waitFor(() =>
      userEvent.click(screen.getByTestId('edit-name-button')),
    );

    await waitFor(
      () =>
        expect(
          screen.getByText(labels.common.update_display_name_input_label),
        ).toBeVisible(),
      { timeout: 30000 },
    );
  });
});
