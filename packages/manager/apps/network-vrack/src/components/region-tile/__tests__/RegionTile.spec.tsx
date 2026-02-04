import { MemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { vi } from 'vitest';

import { RegionTile } from '../RegionTile';

// Mock upgrade/downgrade hooks used inside BandwidthOrderDrawer (child component)
vi.mock('@/hooks/order/useUpgradeBandwidth', () => ({
  useUpgradeBandwidth: (args: { onSuccess: ({ order }: { order: { url: string } }) => void }) => ({
    mutate: () => args.onSuccess?.({ order: { url: 'https://order.example' } }),
    isPending: false,
  }),
}));

vi.mock('@/hooks/order/useDowngradeBandwidth', () => ({
  useDowngradeBandwidth: (args: {
    onSuccess: ({ data }: { data: { order: { url: string } } }) => void;
  }) => ({
    mutate: () => args.onSuccess?.({ data: { order: { url: 'https://order.example' } } }),
    isPending: false,
  }),
}));

// Mock vrack tasks context used by IpTable (child of RegionTile)
vi.mock('@/contexts/vrack-tasks/useVrackTasks', () => ({
  useVrackTasksContext: () => ({ vrackTasks: [] }),
}));

describe('RegionTile', () => {
  it('should display some information about a region in a tile', () => {
    // Given
    const ipv4List = ['192.166.0.0/32', '192.169.0.0/28'];
    const ipv6List = ['2001:41d0:b00:1b00::/56'];

    // When
    const qc = new QueryClient();
    const component = render(
      <MemoryRouter>
        <QueryClientProvider client={qc}>
          <RegionTile
            serviceName="pn-12345"
            region="eu-south-mil"
            bandwidthLimit={10000}
            ipv4List={ipv4List}
            ipv6List={ipv6List}
          />
        </QueryClientProvider>
      </MemoryRouter>,
    );

    // Then
    expect(component.getByText('eu-south-mil')).toBeVisible();
    expect(component.getByText('10 unit_size_GB')).toBeVisible();
    expect(component.getByText('192.166.0.0/32')).toBeVisible();
    expect(component.getByText('192.169.0.0/28')).toBeVisible();
    expect(component.getByText('2001:41d0:b00:1b00::/56')).toBeVisible();
  });
});
