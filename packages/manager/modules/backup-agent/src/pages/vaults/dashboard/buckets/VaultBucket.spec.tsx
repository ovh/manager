import { screen, waitFor } from '@testing-library/react';

import { renderTest } from '@/test-utils/Test.utils';
import { labels } from '@/test-utils/i18ntest.utils';

const COLUMN_NAME = [labels.commonDashboard.name, labels.region.localisation, labels.region.region];

describe('[INTEGRATION] - Bucket Listing page', () => {
  it('Listing page display datagrid', async () => {
    await renderTest({
      initialRoute: '/vaults/a1b2c3d4-1234-4000-82dc-5366d6786f80/buckets',
    });

    /* eslint-disable max-nested-callbacks */
    await waitFor(
      () => {
        COLUMN_NAME.forEach((columnName) => {
          expect(screen.getByRole('columnheader', { name: columnName })).toBeVisible();
        });
      },
      { timeout: 5000 },
    );
  });
});
