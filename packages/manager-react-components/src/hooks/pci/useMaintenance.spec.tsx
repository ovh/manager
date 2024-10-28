import {
  QueryClient,
  QueryClientProvider,
  UseQueryResult,
} from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { useProductMaintenance } from './useMaintenance';
import * as useMigrationSteins from './useMigrationSteins';
import * as useAggregatedPrivateNetworks from './useAggregatedPrivateNetworks';
import * as useProjectRegions from './useProjectRegions';
import { Stein } from './useMigrationSteins';
import { Region } from './useProjectRegions';

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

describe('useMaintenance', () => {
  it('should return hasMaintenance with false value when useMigrationSteins return empty array', async () => {
    jest.spyOn(useMigrationSteins, 'useMigrationSteins').mockReturnValue({
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

    jest.spyOn(useMigrationSteins, 'useMigrationSteins').mockReturnValue({
      data: mockSteins,
    } as UseQueryResult<Stein[]>);

    jest
      .spyOn(
        useAggregatedPrivateNetworks,
        'useAggregatedPrivateNetworksRegions',
      )
      .mockReturnValue({
        data: [],
      } as UseQueryResult<string[]>);

    const result = renderUseMaintenanceHook();

    expect(result.current.hasMaintenance).toEqual(false);
  });

  it('should return hasMaintenance true.', async () => {
    const mockedCustomRegions: Partial<Region>[] = [
      {
        name: 'RN',
        type: 'RT',
        status: 'RS',
        continentCode: 'CC',
        datacenterLocation: 'DCL',
      },
    ];

    jest.spyOn(useProjectRegions, 'useProjectRegions').mockReturnValue({
      data: mockedCustomRegions,
    } as UseQueryResult<Region[]>);

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

    jest.spyOn(useMigrationSteins, 'useMigrationSteins').mockReturnValue({
      data: mockSteins,
    } as UseQueryResult<Stein[]>);

    const mockedProjectRegions = ['REGION-1', 'REGION-2'];

    jest
      .spyOn(
        useAggregatedPrivateNetworks,
        'useAggregatedPrivateNetworksRegions',
      )
      .mockReturnValue({
        data: mockedProjectRegions,
      } as UseQueryResult<string[]>);

    const result = renderUseMaintenanceHook();

    expect(result.current.hasMaintenance).toEqual(true);
  });
});
