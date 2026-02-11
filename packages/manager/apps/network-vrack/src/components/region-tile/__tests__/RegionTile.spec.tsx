import { MemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { vi } from 'vitest';

import { checkTextInScreen } from '@/__tests__/Test.utils';

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

// Mock vrack tasks context used by IpTableBlock (child of RegionTile)
vi.mock('@/contexts/vrack-tasks/useVrackTasks', () => ({
  useVrackTasksContext: () => ({ trackedTasks: [], trackTask: vi.fn() }),
}));

describe('RegionTile', () => {
  // eslint-disable-next-line  vitest/expect-expect
  it('should display some information about a region in a tile', async () => {
    // Given
    const ipv4List = ['192.166.0.0/32', '192.169.0.0/28'];
    const ipv6List = [
      {
        ipv6: '2001:41d0:b00:1b00::/56',
        region: 'eu-west-rbx',
        bridgedSubranges: [],
        routedSubranges: [],
      },
    ];

    // When
    const qc = new QueryClient();
    render(
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
    await checkTextInScreen('eu-south-mil');
    await checkTextInScreen('10 unit_size_GB');
    await checkTextInScreen('192.166.0.0/32');
    await checkTextInScreen('192.169.0.0/28');
    await checkTextInScreen('2001:41d0:b00:1b00::/56');
  });
});
