import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TENANTS_MOCKS } from '@/mocks/tenant/tenants.mock';
import { renderTest } from '@/test-utils/Test.utils';
import { labels } from '@/test-utils/test-i18n';

describe('[INTEGRATION] - Listing page', () => {
  it('display datagrid', async () => {
    // when
    await renderTest();

    // then
    const tenantId = TENANTS_MOCKS[0]?.id as string;
    await waitFor(() => expect(screen.getByText(tenantId)).toBeVisible(), {
      timeout: 10_000,
    });

    // and
    const headers = [
      labels.commonDashboard.name,
      labels.region.localisation,
      labels.region.region,
      labels.commonDashboard.reference,
      labels.status.status,
    ];
    headers.forEach((el) => expect(screen.getByText(el)).toBeVisible());
  });
});
