import { MemoryRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { vi } from 'vitest';

import { checkTextInScreen } from '@/__tests__/Test.utils';

import { RegionTile } from '../RegionTile';

// Mock vrack tasks context used by IpTableBlock (child of RegionTile)
vi.mock('@/contexts/vrack-tasks/useVrackTasks', () => ({
  useVrackTasksContext: () => ({ trackedTasks: [], trackTask: vi.fn() }),
}));

// Mock the BandwidthOrderDrawer to keep the RegionTile test isolated
vi.mock('../../bandwidth-order-drawer/BandwidthOrderDrawer', () => ({
  BandwidthOrderDrawer: () => <div data-testid="mock-bandwidth-drawer">drawer</div>,
}));

// Mock react-i18next to avoid async init in tests
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
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
