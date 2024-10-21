import { screen, waitFor } from '@testing-library/react';
import { renderTest, labels, waitForOptions } from '@/test-helpers';
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
    await renderTest({ isBackupKo: true, initialRoute: '/' });
    await waitFor(
      () =>
        expect(screen.getByText('manager_error_page_default')).toBeVisible(),
      waitForOptions,
    );
  });
});
