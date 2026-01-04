import { screen, waitFor } from '@testing-library/react';

import { urls } from '@/routes/routes.constants';
import { renderTest } from '@/test-utils/Test.utils';
import { labels } from '@/test-utils/i18ntest.utils';

describe('SubscriptionTile', () => {
  it('Should render SubscriptionTile component', async () => {
    await renderTest({ initialRoute: urls.dashboardTenants });

    await waitFor(() => expect(screen.getByText(labels.billing.subscription)).toBeVisible(), {
      timeout: 10_000,
    });
  });
});
