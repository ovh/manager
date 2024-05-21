import {
  QueryClient,
  QueryClientProvider,
  UseQueryResult,
} from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import * as useCloudModule from '@/api/hooks/useCloud';
import * as useNetworkModule from '@/api/hooks/useNetwork';
import * as useRegionsModule from '@/api/hooks/useRegions';

import { useProductMaintenance } from './useMaintenance';
import { Stein } from '@/api/data/cloud';
import { TRegion } from '@/api/data/project';

const renderUseMaintenanceHook = () => {
  const queryClient = new QueryClient();

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const { result } = renderHook(() => useProductMaintenance('projectId'), {
    wrapper,
  });

  return result;
};

describe(' hook tests ', () => {
  it('should return hasMaintenance with false value when useMigrationSteins return empty array', async () => {
    vi.spyOn(useCloudModule, 'useMigrationSteins').mockReturnValue({
      data: [],
    } as UseQueryResult<Stein[]>);

    const result = renderUseMaintenanceHook();

    expect(result.current.hasMaintenance).toEqual(false);
  });

  it('should return hasMaintenance with false value when useAggregatedPrivateNetworksRegions return empty array', async () => {
    const mockSteins: Stein[] = [
      {
        date: 'date-1',
        zone: 'REGION-1',
        travaux: 'travaux-1',
      },
      {
        date: 'date-2',
        zone: 'REGION-2',
        travaux: 'travaux-2',
      },
    ];

    vi.spyOn(useCloudModule, 'useMigrationSteins').mockReturnValue({
      data: mockSteins,
    } as UseQueryResult<Stein[]>);

    vi.spyOn(
      useNetworkModule,
      'useAggregatedNonLocalNetworksRegions',
    ).mockReturnValue({
      data: [],
    } as UseQueryResult<string[]>);

    const result = renderUseMaintenanceHook();

    expect(result.current.hasMaintenance).toEqual(false);
  });

  it('should return hasMaintenance true.', async () => {
    const mockedCustomRegions: TRegion[] = [
      {
        name: 'RN',
        type: 'RT',
        status: 'RS',
        continentCode: 'CC',
        datacenterLocation: 'DCL',
      },
    ];

    vi.spyOn(useRegionsModule, 'useProjectRegions').mockReturnValue({
      data: mockedCustomRegions,
    } as UseQueryResult<TRegion[]>);

    const mockSteins: Stein[] = [
      {
        date: 'date-1',
        zone: 'REGION-1',
        travaux: 'travaux-1',
      },
      {
        date: 'date-2',
        zone: 'REGION-2',
        travaux: 'travaux-2',
      },
    ];

    vi.spyOn(useCloudModule, 'useMigrationSteins').mockReturnValue({
      data: mockSteins,
    } as UseQueryResult<Stein[]>);

    const mockedProjectRegions = ['REGION-1', 'REGION-2'];

    vi.spyOn(
      useNetworkModule,
      'useAggregatedNonLocalNetworksRegions',
    ).mockReturnValue({
      data: mockedProjectRegions,
    } as UseQueryResult<string[]>);

    const result = renderUseMaintenanceHook();

    expect(result.current.hasMaintenance).toEqual(true);
  });
});
