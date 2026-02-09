import React from 'react';

import { QueryClient } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { queryKeys } from '@/data/queries/queryKeys';
import { VAULT_PLAN_CODE } from '@/module.constants';
import { DataGridTextCellMock } from '@/test-utils/mocks/manager-react-components';
import { OdsSkeletonMock } from '@/test-utils/mocks/ods-components';
import { testWrapperBuilder } from '@/test-utils/testWrapperBuilder';
import { createQueryClientTest } from '@/test-utils/testWrapperProviders';

import { BillingPriceCell } from '../BillingPriceCell.components';

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: DataGridTextCellMock,
}));

vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsSkeleton: OdsSkeletonMock,
}));

describe('BillingPriceCell', () => {
  let queryClient: QueryClient;

  const buildWrapper = () => testWrapperBuilder().withQueryClient(queryClient).build();

  beforeEach(() => {
    queryClient = createQueryClientTest();
  });

  it('should display price when data is present', async () => {
    queryClient.setQueryData(queryKeys.consumption.byResource('vault-id'), [
      {
        planCode: VAULT_PLAN_CODE,
        price: { text: '30.00 €' },
      },
    ]);

    const wrapper = await buildWrapper();

    render(<BillingPriceCell vaultId="vault-id" />, { wrapper });

    expect(screen.getByText('30.00 €')).toBeVisible();
  });

  it('should display skeleton during loading', async () => {
    // Don't seed the cache so the query stays in pending state

    const wrapper = await buildWrapper();

    render(<BillingPriceCell vaultId="vault-id" />, { wrapper });

    expect(screen.getByTestId('ods-skeleton')).toBeVisible();
  });
});
