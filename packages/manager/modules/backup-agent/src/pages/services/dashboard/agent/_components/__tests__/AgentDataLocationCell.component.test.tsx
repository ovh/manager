import React from 'react';

import { QueryClient } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { queryKeys } from '@/data/queries/queryKeys';
import { testWrapperBuilder } from '@/test-utils/testWrapperBuilder';
import { createQueryClientTest } from '@/test-utils/testWrapperProviders';

import { AgentDataLocationCell } from '../AgentDataLocationCell.component';

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="DataGridTextCell">{children}</div>
  ),
}));

vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsSkeleton: () => <div data-testid="OdsSkeleton" />,
}));

vi.mock('@/components/CommonCells/ResourceLocationCell/ResourceLocationCell.component', () => ({
  ResourceLocationCell: ({ region }: { region: string }) => (
    <div data-testid="ResourceLocationCell">{region}</div>
  ),
}));

describe('AgentDataLocationCell', () => {
  let queryClient: QueryClient;

  const buildWrapper = () => testWrapperBuilder().withQueryClient(queryClient).build();

  beforeEach(() => {
    queryClient = createQueryClientTest();
  });

  it('renders "-" when vaultId is not provided', async () => {
    const wrapper = await buildWrapper();

    render(<AgentDataLocationCell vaultId={undefined} />, { wrapper });

    expect(screen.getByTestId('DataGridTextCell')).toHaveTextContent('-');
  });

  it('renders OdsSkeleton when isPending is true', async () => {
    // Don't seed the cache so the query stays in pending state

    const wrapper = await buildWrapper();

    render(<AgentDataLocationCell vaultId="vault-id" />, { wrapper });

    expect(screen.getByTestId('OdsSkeleton')).toBeInTheDocument();
  });

  it('renders "-" when data is not available (error)', async () => {
    // Seed the cache with an error state
    queryClient.setQueryDefaults(queryKeys.vaults.detail('vault-id'), { retry: false });
    await queryClient.prefetchQuery({
      queryKey: queryKeys.vaults.detail('vault-id'),
      queryFn: () => Promise.reject(new Error('fail')),
    });

    const wrapper = await buildWrapper();

    render(<AgentDataLocationCell vaultId="vault-id" />, { wrapper });

    await waitFor(() => expect(screen.getByText('-')).toBeInTheDocument());
  });

  it('renders ResourceLocationCell when data is available', async () => {
    const mockData = {
      currentState: {
        region: 'GRA',
      },
    };
    queryClient.setQueryData(queryKeys.vaults.detail('vault-id'), mockData);

    const wrapper = await buildWrapper();

    render(<AgentDataLocationCell vaultId="vault-id" />, { wrapper });

    expect(screen.getByTestId('ResourceLocationCell')).toHaveTextContent('GRA');
  });
});
