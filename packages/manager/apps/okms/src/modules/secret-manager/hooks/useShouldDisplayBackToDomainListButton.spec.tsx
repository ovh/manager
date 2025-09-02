import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, vi, beforeEach } from 'vitest';
import { getOkmsList } from '@/data/api/okms';
import { useShouldDisplayBackToDomainListButton } from './useShouldDisplayBackToDomainListButton';
import { promiseWithDelayMock } from '@/utils/tests/testUtils';
import { OKMS } from '@/types/okms.type';
import { REGION_EU_WEST_RBX } from '@/mocks/catalog/catalog.mock';
import {
  kmsRoubaix1Mock,
  kmsRoubaix2Mock,
  kmsStrasbourg1Mock,
} from '@/mocks/kms/okms.mock';
import { ErrorResponse } from '@/types/api.type';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(() => ({
    domainId: 'mocked-domain-id',
  })),
}));

// Mock the useOkmsList fetch function
vi.mock('@/data/api/okms', async () => {
  const actual = await vi.importActual('@/data/api/okms');
  return {
    ...actual,
    getOkmsList: vi.fn(),
  };
});
const mockGetOkmsList = vi.mocked(getOkmsList);

// Mock the useCurrentRegion hook
vi.mock('@secret-manager/hooks/useCurrentRegion', () => ({
  useCurrentRegion: () => REGION_EU_WEST_RBX,
}));

const createWrapper = () => {
  const queryClient = new QueryClient();

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useRegionSelector tests suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when data is loading', () => {
    it('should return false when API call are pending', async () => {
      // GIVEN
      mockGetOkmsList.mockImplementation(() =>
        promiseWithDelayMock<OKMS[]>({} as OKMS[], 2000),
      );

      // WHEN
      const { result } = renderHook(
        () => useShouldDisplayBackToDomainListButton(),
        {
          wrapper: createWrapper(),
        },
      );

      // THEN
      expect(result.current).toBeFalsy();
    });

    it('should return false when error on API call', async () => {
      // GIVEN
      const mockError: ErrorResponse = {
        response: { data: { message: 'errorOkmsList' }, status: 500 },
      };
      mockGetOkmsList.mockRejectedValue(mockError);

      // WHEN
      const { result } = renderHook(
        () => useShouldDisplayBackToDomainListButton(),
        {
          wrapper: createWrapper(),
        },
      );

      // THEN
      expect(result.current).toBeFalsy();
    });

    it('should return false when there is one kms on a region', async () => {
      // GIVEN
      mockGetOkmsList.mockResolvedValue([kmsStrasbourg1Mock]);

      // WHEN
      const { result } = renderHook(
        () => useShouldDisplayBackToDomainListButton(),
        {
          wrapper: createWrapper(),
        },
      );
      await waitFor(() => result.current);

      // THEN
      expect(result.current).toBeFalsy();
    });

    it('should return true when there is more than one kms on a region ', async () => {
      // GIVEN
      mockGetOkmsList.mockResolvedValue([kmsRoubaix1Mock, kmsRoubaix2Mock]);

      // WHEN
      const { result } = renderHook(
        () => useShouldDisplayBackToDomainListButton(),
        {
          wrapper: createWrapper(),
        },
      );
      await waitFor(() => result.current);

      // THEN
      expect(result.current).toBeTruthy();
    });
  });
});
