import { screen, waitFor } from '@testing-library/react';
import {
  WAIT_FOR_DEFAULT_OPTIONS,
  getOdsButtonByLabel,
} from '@ovh-ux/manager-core-test-utils';
import { renderTest, labels } from '@/test-helpers';
import '@testing-library/jest-dom';

describe('listing', () => {
  it('display the listing page', async () => {
    await renderTest();
    await waitFor(
      () => expect(screen.getByText(labels.listing.description)).toBeVisible(),
      WAIT_FOR_DEFAULT_OPTIONS,
    );
  });

  it('display an error if the backup list is KO', async () => {
    const { container } = await renderTest({
      isBackupKo: true,
      initialRoute: '/',
    });

    await getOdsButtonByLabel({
      container,
      label: labels.error.manager_error_page_action_reload_label,
      altLabel: 'manager_error_page_action_reload_label',
    });
  });
});
