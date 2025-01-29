import React from 'react';
import { describe, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import {
  getCatalog,
  ResponseAPIError,
  TCatalog,
  TProductAvailability,
  TProject,
  useProductAvailability,
  useProject,
} from '@ovh-ux/manager-pci-common';
import {
  QueryClient,
  QueryClientProvider,
  UseQueryResult,
} from '@tanstack/react-query';
import { availableGateway, catalog } from '@/__mocks__/gateway';
import {
  useSmallestGatewayByRegion,
  useRegionPlans,
} from './useAvailableGateway';

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original = await importOriginal<
    typeof import('@ovh-ux/manager-react-shell-client')
  >();

  return {
    ...original,
    ShellContext: React.createContext({
      environment: {
        getUser: vi.fn(() => ({ ovhSubsidiary: 'FR' })),
      },
    }),
  };
});

vi.mock('@ovh-ux/manager-pci-common');

vi.mocked(useProject).mockReturnValue({
  data: { project_id: '' },
} as UseQueryResult<TProject, ResponseAPIError>);

vi.mocked(useProductAvailability).mockReturnValue({
  data: availableGateway as TProductAvailability,
} as UseQueryResult<TProductAvailability>);

vi.mocked(getCatalog).mockResolvedValue(catalog as TCatalog);

const queryClient = new QueryClient();

describe('useRegionPlans', () => {
  it('should return available hourly plans for GRA-STAGING-A', async () => {
    const { result } = renderHook(() => useRegionPlans('GRA-STAGING-A'));

    await waitFor(() =>
      expect(result.current).toEqual([
        'gateway.2xl.hour.consumption',
        'gateway.s.hour.consumption',
      ]),
    );
  });
});

describe('useSmallestGatewayByRegion', () => {
  it('should return size and price per hour of the smallest gateway catalog', async () => {
    const { result } = renderHook(
      () => useSmallestGatewayByRegion('GRA-STAGING-A'),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      },
    );

    await waitFor(() =>
      expect(result.current.data).toEqual({
        size: 's',
        price: 280000,
      }),
    );
  });
});
