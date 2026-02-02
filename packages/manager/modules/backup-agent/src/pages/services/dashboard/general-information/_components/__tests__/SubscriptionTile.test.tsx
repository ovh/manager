import { screen, waitFor } from '@testing-library/react';

import { VSPC_TENANTS_MOCKS } from '@/mocks/tenant/vspcTenants.mock';
import { urlParams, urls } from '@/routes/routes.constants';
import { renderTest } from '@/test-utils/Test.utils';
import { labels } from '@/test-utils/i18ntest.utils';

describe('SubscriptionTile', () => {
  it('Should render SubscriptionTile component', async () => {
    await renderTest({
      initialRoute: urls.dashboardTenants.replace(urlParams.tenantId, VSPC_TENANTS_MOCKS[0]!.id),
    });

    await waitFor(
      () => expect(screen.getAllByText(labels.billing.subscription)?.[0]).toBeVisible(),
      {
        timeout: 15_000,
      },
    );
  });
});
