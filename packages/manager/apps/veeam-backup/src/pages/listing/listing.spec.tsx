import { screen, waitFor } from '@testing-library/react';
import {
  renderTest,
  labels,
  waitForOptions,
  getButtonByLabel,
} from '@/test-helpers';
import '@testing-library/jest-dom';

describe('listing', () => {
  it('display the listing page', async () => {
    await renderTest();
    await waitFor(
      () => expect(screen.getByText(labels.listing.description)).toBeVisible(),
      waitForOptions,
    );
  });

  it('display an error if the backup list is KO', async () => {
    const { container } = await renderTest({
      isBackupKo: true,
      initialRoute: '/',
    });

    await getButtonByLabel({
      container,
      label: labels.error.manager_error_page_action_reload_label,
      altLabel: 'manager_error_page_action_reload_label',
    });
  });
});
