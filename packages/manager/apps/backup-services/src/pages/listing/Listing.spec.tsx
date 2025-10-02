import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TENANTS_MOCKS } from '@/mocks/tenant/tenants.mock';
import { renderTest } from '@/test-utils/Test.utils';
import { Tenant } from '@/types/Tenant.type';

describe('[INTEGRATION] - Listing page', () => {
  it('display datagrid', async () => {
    const { container, debug } = await renderTest();

    const tenant = TENANTS_MOCKS[0] as Tenant;

    await waitFor(
      () => {
        expect(screen.getByText(tenant.currentState.name)).toBeVisible();
      },
      { timeout: 10_000 },
    );
    debug(container, Infinity);
  });
});
