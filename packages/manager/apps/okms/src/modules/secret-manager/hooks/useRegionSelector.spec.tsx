import React from 'react';
import { useParams } from 'react-router-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { locationsMock } from '@secret-manager/mocks/locations/locations.mock';
import {
  kmsStrasbourg1Mock,
  kmsRoubaix1Mock,
  kmsRoubaix2Mock,
} from '@/mocks/kms/okms.mock';
import {
  REGION_EU_WEST_RBX,
  REGION_EU_WEST_SBG,
} from '@/mocks/catalog/catalog.mock';
import { RegionOption, useRegionSelector } from './useRegionSelector';
import { OKMS } from '@/types/okms.type';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}));

// Mock the useLocations fetch function
vi.mock('@/modules/secret-manager/data/api/location', async () => {
  const actual = await vi.importActual(
    '@/modules/secret-manager/data/api/location',
  );
  return {
    ...actual,
    getLocations: vi.fn().mockResolvedValue(locationsMock),
  };
});

// Mock the useOkmsList fetch function
vi.mock('@/data/api/okms', async () => {
  const actual = await vi.importActual('@/data/api/okms');
  return {
    ...actual,
    getOkmsList: vi.fn(),
  };
});

const mockUseParams = vi.mocked(useParams);

// 2 domains in Roubaix, 1 in Strasbourg
const okmsMock = [kmsRoubaix1Mock, kmsRoubaix2Mock, kmsStrasbourg1Mock];

// eslint-disable-next-line import/first, import/newline-after-import
import { getOkmsList } from '@/data/api/okms';
const mockGetOkmsList = vi.mocked(getOkmsList);

// eslint-disable-next-line import/first, import/newline-after-import
import { getLocations } from '@/modules/secret-manager/data/api/location';
const mockGetLocations = vi.mocked(getLocations);

// Mock the useCurrentRegion hook
const mockUseCurrentRegion = vi.fn();
vi.mock('@secret-manager/hooks/useCurrentRegion', () => ({
  useCurrentRegion: (domains: OKMS) => mockUseCurrentRegion(domains),
}));

// Mock the useNotifications hook
const mockAddError = vi.fn();
vi.mock('@ovh-ux/manager-react-components', () => ({
  useNotifications: () => ({ addError: mockAddError }),
}));

// Helper function to create a wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries for tests
        gcTime: 0, // Disable caching for tests
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const renderCustomHook = async (state: 'success' | 'error') => {
  const { result, rerender } = renderHook(() => useRegionSelector(), {
    wrapper: createWrapper(),
  });

  if (state === 'success') {
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  } else {
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  }

  return { result, rerender };
};

const rbxRegionOptionMock: RegionOption = {
  label: 'Europe (France - Roubaix)',
  region: REGION_EU_WEST_RBX,
  geographyLabel: 'Europe',
  href: SECRET_MANAGER_ROUTES_URLS.secretDomains(REGION_EU_WEST_RBX),
};

const sbgRegionOptionMock: RegionOption = {
  label: 'Europe (France - Strasbourg)',
  region: REGION_EU_WEST_SBG,
  geographyLabel: 'Europe',
  href: SECRET_MANAGER_ROUTES_URLS.secretListing(kmsStrasbourg1Mock.id),
};

describe('useRegionSelector tests suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetOkmsList.mockResolvedValue(okmsMock);
    mockGetLocations.mockResolvedValue(locationsMock);
    mockUseParams.mockReturnValue({});
    mockAddError.mockClear();
  });

  describe('when data is loading', () => {
    it('should return loading state when API call are pending', async () => {
      mockUseCurrentRegion.mockReturnValue(REGION_EU_WEST_RBX);

      const { result } = renderHook(() => useRegionSelector(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.geographyGroups).toEqual([]);
      expect(result.current.currentRegion).toBeUndefined();
      expect(result.current.isError).toBe(false);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('when data is loaded successfully', () => {
    it('should return geography groups with regions', async () => {
      mockUseCurrentRegion.mockReturnValue(REGION_EU_WEST_RBX);

      const { result } = await renderCustomHook('success');

      expect(result.current.geographyGroups).toHaveLength(1);

      const europeGroup = result.current.geographyGroups[0];
      expect(europeGroup.geographyLabel).toBe('Europe');
      expect(europeGroup.regions).toHaveLength(2);

      // Check if regions are properly formatted
      const rbxRegion = europeGroup.regions.find(
        (r) => r.region === REGION_EU_WEST_RBX,
      );
      expect(rbxRegion).toEqual(rbxRegionOptionMock);

      const sbgRegion = europeGroup.regions.find(
        (r) => r.region === REGION_EU_WEST_SBG,
      );
      expect(sbgRegion).toEqual(sbgRegionOptionMock);
    });

    it('should set current region based on useCurrentRegion result', async () => {
      mockUseCurrentRegion.mockReturnValue(REGION_EU_WEST_SBG);

      const { result } = await renderCustomHook('success');

      expect(result.current.currentRegion).toEqual(sbgRegionOptionMock);
    });

    it('should set current region based on useCurrentRegion result', async () => {
      mockUseCurrentRegion.mockReturnValue(REGION_EU_WEST_SBG);

      const { result } = await renderCustomHook('success');

      expect(result.current.currentRegion).toEqual(sbgRegionOptionMock);
    });

    it('should return first region as current when no current region is provided', async () => {
      mockUseCurrentRegion.mockReturnValue(undefined);

      const { result } = await renderCustomHook('success');

      // Should return the first available region option
      expect(result.current.currentRegion).toEqual(rbxRegionOptionMock);
    });

    it('should show regions only once', async () => {
      mockUseCurrentRegion.mockReturnValue(REGION_EU_WEST_RBX);

      const { result } = await renderCustomHook('success');

      const europeGroup = result.current.geographyGroups.find(
        (group) => group.geographyLabel === 'Europe',
      );
      expect(europeGroup.regions).toHaveLength(2); // Should still be 2, not 3
    });
  });

  describe('when there are errors', () => {
    it('should handle domains error', async () => {
      const error = {
        response: { data: { message: 'Domains error' } },
      };
      mockGetOkmsList.mockRejectedValue(error);
      mockUseCurrentRegion.mockReturnValue(undefined);

      const { result } = await renderCustomHook('error');

      expect(result.current.isLoading).toBe(false);
      expect(mockAddError).toHaveBeenCalledWith(error.response.data.message);
    });

    it('should handle locations error', async () => {
      const error = {
        response: { data: { message: 'Locations error' } },
      };
      mockGetLocations.mockRejectedValue(error);
      mockUseCurrentRegion.mockReturnValue(undefined);

      const { result } = await renderCustomHook('error');

      expect(result.current.isLoading).toBe(false);
      expect(mockAddError).toHaveBeenCalledWith(error.response.data.message);
    });
  });

  describe('hook reactivity', () => {
    it('should update current region when useCurrentRegion hook result changes', async () => {
      mockUseCurrentRegion.mockReturnValue(REGION_EU_WEST_RBX);

      const { result, rerender } = await renderCustomHook('success');
      expect(result.current.currentRegion.region).toEqual(REGION_EU_WEST_RBX);

      mockUseCurrentRegion.mockReturnValue(REGION_EU_WEST_SBG);
      rerender();
      await waitFor(() => {
        expect(result.current.currentRegion.region).toEqual(REGION_EU_WEST_SBG);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty domains array', async () => {
      mockGetOkmsList.mockResolvedValue([]); // No OKMS domains
      mockUseCurrentRegion.mockReturnValue(REGION_EU_WEST_RBX);

      const { result } = await renderCustomHook('success');

      expect(result.current.geographyGroups).toEqual([]);
      expect(result.current.currentRegion).toBeUndefined();
    });
  });
});
