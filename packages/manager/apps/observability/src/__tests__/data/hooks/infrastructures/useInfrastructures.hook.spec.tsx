import React from 'react';

import { QueryClient, QueryClientProvider, UseQueryResult } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { Location } from '@ovh-ux/shell';

import { getInfrastructures } from '@/data/api/infrastructures.api';
import { InfrastructuresParams } from '@/data/api/infrastructures.props';
import {
  getInfrastructuresQueryKey,
  useInfrastructures,
} from '@/data/hooks/infrastructures/useInfrastructures.hook';
import { useLocations } from '@/data/hooks/infrastructures/useLocations.hook';
import { Infrastructure } from '@/types/infrastructures.type';

// Mock the dependencies
vi.mock('@/data/api/infrastructures.api', () => ({
  getInfrastructures: vi.fn(),
}));

vi.mock('@/data/hooks/infrastructures/useLocations.hook', () => ({
  useLocations: vi.fn(),
}));

const mockGetInfrastructures = vi.mocked(getInfrastructures);
const mockUseLocations = vi.mocked(useLocations);

// Test wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  TestWrapper.location = 'TestWrapper';
  return { TestWrapper, queryClient };
};

// Mock data
const mockInfrastructures: Infrastructure[] = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    currentState: {
      location: 'eu-west-sbg',
      type: 'SHARED',
      usage: 'METRICS',
      entryPoint: 'eee.metrics.ovh.com',
    },
  },
  {
    id: '6ee8fb35-2621-4530-a288-84fc0e85dac1',
    currentState: {
      location: 'eu-west-gra',
      type: 'DEDICATED',
      usage: 'LOGS',
      entryPoint: 'aaa.metrics.ovh.com',
    },
  },
];

const mockLocations: Location[] = [
  {
    name: 'eu-west-sbg',
    location: 'Strasbourg',
    geographyCode: 'EU',
    code: 'SBG',
    availabilityZones: [],
    cardinalPoint: 'WEST',
    cityCode: 'SBG',
    cityLatitude: 48.5734,
    cityLongitude: 7.7521,
    cityName: 'Strasbourg',
    countryCode: 'FR',
    countryName: 'France',
    geographyName: 'Europe',
    openingYear: 2011,
    specificType: 'STANDARD',
    type: 'REGION-1-AZ',
  },
  {
    name: 'eu-west-gra',
    location: 'Gravelines',
    geographyCode: 'EU',
    code: 'GRA',
    availabilityZones: [],
    cardinalPoint: 'WEST',
    cityCode: 'GRA',
    cityLatitude: 50.9875,
    cityLongitude: 2.1258,
    cityName: 'Gravelines',
    countryCode: 'FR',
    countryName: 'France',
    geographyName: 'Europe',
    openingYear: 2010,
    specificType: 'STANDARD',
    type: 'REGION-1-AZ',
  },
];

describe('useInfrastructures', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getInfrastructuresQueryKey', () => {
    it('should generate correct query key', () => {
      const params: Omit<InfrastructuresParams, 'signal'> = {
        resourceName: 'test-resource',
        usages: 'METRICS',
        types: 'SHARED',
      };

      const queryKey = getInfrastructuresQueryKey(params);

      expect(queryKey).toEqual(['infrastructures', 'test-resource', 'METRICS', 'SHARED']);
    });

    it('should generate query key with undefined optional params', () => {
      const params: Omit<InfrastructuresParams, 'signal'> = {
        resourceName: 'test-resource',
      };

      const queryKey = getInfrastructuresQueryKey(params);

      expect(queryKey).toEqual(['infrastructures', 'test-resource', undefined, undefined]);
    });
  });

  describe('useInfrastructures hook', () => {
    it('should return loading state initially', () => {
      const { TestWrapper } = createWrapper();

      // Mock useLocations to return loading state
      mockUseLocations.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        isSuccess: false,
      } as unknown as UseQueryResult<Location[], Error>);

      // Mock getInfrastructures to return a promise
      mockGetInfrastructures.mockResolvedValue(mockInfrastructures);

      const { result } = renderHook(() => useInfrastructures({ resourceName: 'test-resource' }), {
        wrapper: TestWrapper,
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(false);
    });

    it('should fetch infrastructures successfully and enrich with location data', async () => {
      const { TestWrapper } = createWrapper();

      // Mock useLocations to return successful data
      mockUseLocations.mockReturnValue({
        data: mockLocations,
        isLoading: false,
        error: null,
        isSuccess: true,
      } as unknown as UseQueryResult<Location[], Error>);

      // Mock getInfrastructures to return successful data
      mockGetInfrastructures.mockResolvedValue(mockInfrastructures);

      const { result } = renderHook(() => useInfrastructures({ resourceName: 'test-resource' }), {
        wrapper: TestWrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(2);
      expect(result.current.data?.[0]).toEqual({
        ...mockInfrastructures[0],
        locationDetails: mockLocations[0],
      });
      expect(result.current.data?.[1]).toEqual({
        ...mockInfrastructures[1],
        locationDetails: mockLocations[1],
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.isError).toBe(false);
    });

    it('should return infrastructures without location details when locations are not available', async () => {
      const { TestWrapper } = createWrapper();

      // Mock useLocations to return successful but empty data
      mockUseLocations.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        isSuccess: true,
      } as unknown as UseQueryResult<Location[], Error>);

      // Mock getInfrastructures to return successful data
      mockGetInfrastructures.mockResolvedValue(mockInfrastructures);

      const { result } = renderHook(() => useInfrastructures({ resourceName: 'test-resource' }), {
        wrapper: TestWrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockInfrastructures);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.isError).toBe(false);
    });

    it('should handle infrastructures API error', async () => {
      const { TestWrapper } = createWrapper();
      const mockError = new Error('Failed to fetch infrastructures');

      // Mock useLocations to return successful data
      mockUseLocations.mockReturnValue({
        data: mockLocations,
        isLoading: false,
        error: null,
        isSuccess: true,
      } as unknown as UseQueryResult<Location[], Error>);

      // Mock getInfrastructures to reject
      mockGetInfrastructures.mockRejectedValue(mockError);

      const { result } = renderHook(() => useInfrastructures({ resourceName: 'test-resource' }), {
        wrapper: TestWrapper,
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBe(mockError);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(false);
    });

    it('should handle locations API error', async () => {
      const { TestWrapper } = createWrapper();
      const mockError = new Error('Failed to fetch locations');

      // Mock useLocations to return error
      mockUseLocations.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: mockError,
        isSuccess: false,
      } as unknown as UseQueryResult<Location[], Error>);

      // Mock getInfrastructures to return successful data
      mockGetInfrastructures.mockResolvedValue(mockInfrastructures);

      const { result } = renderHook(() => useInfrastructures({ resourceName: 'test-resource' }), {
        wrapper: TestWrapper,
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(mockError);
      expect(result.current.isLoading).toBe(true); // Still loading because infrastructures query is enabled
      expect(result.current.isSuccess).toBe(false);
    });

    it('should not fetch when resourceName is empty', () => {
      const { TestWrapper } = createWrapper();

      // Mock useLocations to return successful data
      mockUseLocations.mockReturnValue({
        data: mockLocations,
        isLoading: false,
        error: null,
        isSuccess: true,
      } as unknown as UseQueryResult<Location[], Error>);

      const { result } = renderHook(() => useInfrastructures({ resourceName: '' }), {
        wrapper: TestWrapper,
      });

      expect(mockGetInfrastructures).not.toHaveBeenCalled();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
    });

    it('should pass query options correctly', async () => {
      const { TestWrapper } = createWrapper();

      // Mock useLocations to return successful data
      mockUseLocations.mockReturnValue({
        data: mockLocations,
        isLoading: false,
        error: null,
        isSuccess: true,
      } as unknown as UseQueryResult<Location[], Error>);

      // Mock getInfrastructures to return successful data
      mockGetInfrastructures.mockResolvedValue(mockInfrastructures);

      const queryOptions = {
        staleTime: 5000,
        gcTime: 10000,
      };

      renderHook(() => useInfrastructures({ resourceName: 'test-resource' }, queryOptions), {
        wrapper: TestWrapper,
      });

      await waitFor(() => {
        expect(mockGetInfrastructures).toHaveBeenCalledWith({
          resourceName: 'test-resource',
          signal: expect.any(AbortSignal) as AbortSignal,
          usages: undefined,
          types: undefined,
        });
      });
    });

    it('should pass usages and types parameters', async () => {
      const { TestWrapper } = createWrapper();

      // Mock useLocations to return successful data
      mockUseLocations.mockReturnValue({
        data: mockLocations,
        isLoading: false,
        error: null,
        isSuccess: true,
      } as unknown as UseQueryResult<Location[], Error>);

      // Mock getInfrastructures to return successful data
      mockGetInfrastructures.mockResolvedValue(mockInfrastructures);

      renderHook(
        () =>
          useInfrastructures({
            resourceName: 'test-resource',
            usages: 'METRICS',
            types: 'SHARED',
          }),
        { wrapper: TestWrapper },
      );

      await waitFor(() => {
        expect(mockGetInfrastructures).toHaveBeenCalledWith({
          resourceName: 'test-resource',
          signal: expect.any(AbortSignal) as AbortSignal,
          usages: 'METRICS',
          types: 'SHARED',
        });
      });
    });

    it('should provide refetch function', async () => {
      const { TestWrapper } = createWrapper();

      // Mock useLocations to return successful data
      mockUseLocations.mockReturnValue({
        data: mockLocations,
        isLoading: false,
        error: null,
        isSuccess: true,
      } as unknown as UseQueryResult<Location[], Error>);

      // Mock getInfrastructures to return successful data
      mockGetInfrastructures.mockResolvedValue(mockInfrastructures);

      const { result } = renderHook(() => useInfrastructures({ resourceName: 'test-resource' }), {
        wrapper: TestWrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(typeof result.current.refetch).toBe('function');

      // Test refetch functionality
      mockGetInfrastructures.mockClear();
      await result.current.refetch();

      expect(mockGetInfrastructures).toHaveBeenCalledTimes(1);
    });

    it('should handle partial location matches', async () => {
      const { TestWrapper } = createWrapper();

      // Mock locations with only one matching location
      const partialLocations: Location[] = [mockLocations[0]!];

      // Mock useLocations to return partial data
      mockUseLocations.mockReturnValue({
        data: partialLocations,
        isLoading: false,
        error: null,
        isSuccess: true,
      } as unknown as UseQueryResult<Location[], Error>);

      // Mock getInfrastructures to return successful data
      mockGetInfrastructures.mockResolvedValue(mockInfrastructures);

      const { result } = renderHook(() => useInfrastructures({ resourceName: 'test-resource' }), {
        wrapper: TestWrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(2);
      // First infrastructure should have location details
      expect(result.current.data?.[0]).toEqual({
        ...mockInfrastructures[0],
        locationDetails: mockLocations[0],
      });
      // Second infrastructure should not have location details (no matching location)
      expect(result.current.data?.[1]).toEqual({
        ...mockInfrastructures[1],
        locationDetails: undefined,
      });
    });
  });
});
