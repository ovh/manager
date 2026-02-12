import React from 'react';

import { QueryClient } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { queryKeys } from '@/data/queries/queryKeys';
import { mockLocations } from '@/mocks/location/locations';
import { mockVaults } from '@/mocks/vaults/vaults.mock';
import { DataGridTextCellMock } from '@/test-utils/mocks/manager-react-components';
import { testWrapperBuilder } from '@/test-utils/testWrapperBuilder';
import { createQueryClientTest } from '@/test-utils/testWrapperProviders';

import { ResourceLocationCell } from '../ResourceLocationCell.component';

vi.mock('@ovh-ux/manager-react-components', () => ({
  DataGridTextCell: DataGridTextCellMock,
}));

describe('ResourceLocationCell', () => {
  let queryClient: QueryClient;
  const vault = mockVaults[0]!;
  const region = vault.currentState.region;

  const buildWrapper = () => testWrapperBuilder().withQueryClient(queryClient).build();

  beforeEach(() => {
    queryClient = createQueryClientTest();
  });

  it('renders resourceName from currentState', async () => {
    queryClient.setQueryData(queryKeys.locations.detail(region), mockLocations[0]);

    const wrapper = await buildWrapper();

    render(<ResourceLocationCell region={region} />, { wrapper });

    await waitFor(() =>
      expect(screen.getByTestId('cell')).toHaveTextContent(mockLocations[0]!.location),
    );
  });

  it('renders during loading', async () => {
    // Don't seed the cache so the query stays in loading state

    const wrapper = await buildWrapper();

    const { container } = render(<ResourceLocationCell region={region} />, { wrapper });

    await waitFor(() => expect(container.querySelector('ods-skeleton')).toBeVisible());
  });

  it('renders during error', async () => {
    // Seed the cache with an error state
    queryClient.setQueryDefaults(queryKeys.locations.detail(region), { retry: false });
    await queryClient.prefetchQuery({
      queryKey: queryKeys.locations.detail(region),
      queryFn: () => Promise.reject(new Error('fail')),
    });

    const wrapper = await buildWrapper();

    render(<ResourceLocationCell region={region} />, { wrapper });

    await waitFor(() =>
      expect(screen.getByTestId('cell')).toHaveTextContent(vault.currentState.region),
    );
  });
});
