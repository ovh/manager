import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TENANTS_MOCKS } from '@/mocks/tenant/tenants.mock';
import { urls } from '@/routes/routes.constants';
import { renderTest } from '@/test-utils/Test.utils';
import { labels } from '@/test-utils/i18ntest.utils';

describe('[INTEGRATION] - Agent listing page', () => {
  it('display datagrid', async () => {
    // when
    await renderTest({ initialRoute: urls.listingTenants });

    // then
    const tenantId = TENANTS_MOCKS[0]?.id as string;
    await waitFor(() => expect(screen.getByText(tenantId)).toBeVisible(), {
      timeout: 10_000,
    });

    // and
    const COLUMNS_NAME = [
      labels.commonDashboard.name,
      labels.region.localisation,
      labels.region.region,
      labels.commonDashboard.reference,
      labels.status.status,
    ];

    COLUMNS_NAME.forEach((columnName) =>
      expect(screen.getByRole('columnheader', { name: columnName })).toBeVisible(),
    );
  });
});
