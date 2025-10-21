import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { getRetentions } from '@/data/api/infrastructures.api';
import { RetentionParams } from '@/data/api/infrastructures.props';
import {
  getRetentionsQueryKey,
  useRetentions,
} from '@/data/hooks/infrastructures/useRetentions.hook';
import { Retention } from '@/types/infrastructures.type';

// Mock the infrastructures API
vi.mock('@/data/api/infrastructures.api', () => ({
  getRetentions: vi.fn(),
}));

const mockGetRetentions = vi.mocked(getRetentions);

// Test wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  TestWrapper.displayName = 'TestWrapper';
  return TestWrapper;
};

// Mock data
const mockRetentions: Retention[] = [
  {
    id: '1',
    duration: 'P1M',
    default: true,
    supported: true,
  },
  {
    id: '2',
    duration: 'P3M',
    default: false,
    supported: true,
  },
  {
    id: '3',
    duration: 'P6M',
    default: false,
    supported: false,
  },
];

describe('useRetentions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getRetentionsQueryKey', () => {
    it('should generate correct query key', () => {
      const params: Omit<RetentionParams, 'signal'> = {
        resourceName: 'test-resource',
        infrastructureId: 'infra-123',
      };

      const queryKey = getRetentionsQueryKey(params);

      expect(queryKey).toEqual(['retentions', 'test-resource', 'infra-123']);
    });

    it('should generate different query keys for different parameters', () => {
      const params1: Omit<RetentionParams, 'signal'> = {
        resourceName: 'resource-1',
        infrastructureId: 'infra-1',
      };
      const params2: Omit<RetentionParams, 'signal'> = {
        resourceName: 'resource-2',
        infrastructureId: 'infra-2',
      };

      const queryKey1 = getRetentionsQueryKey(params1);
      const queryKey2 = getRetentionsQueryKey(params2);

      expect(queryKey1).not.toEqual(queryKey2);
    });
  });

  describe('useRetentions hook', () => {
    it('should call getRetentions with correct parameters', async () => {
      // Arrange
      const resourceName = 'test-resource';
      const infrastructureId = 'infra-123';
      mockGetRetentions.mockResolvedValue(mockRetentions);

      // Act
      renderHook(() => useRetentions({ resourceName, infrastructureId }), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(mockGetRetentions).toHaveBeenCalledWith({
          resourceName,
          infrastructureId,
          signal: expect.any(AbortSignal) as AbortSignal,
        });
      });
    });

    it('should return loading state initially', () => {
      // Arrange
      const resourceName = 'test-resource';
      const infrastructureId = 'infra-123';
      mockGetRetentions.mockImplementation(
        () =>
          new Promise(() => {
            // Never resolves to test loading state
          }),
      );

      // Act
      const { result } = renderHook(() => useRetentions({ resourceName, infrastructureId }), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBe(null);
    });

    it('should return success state when getRetentions resolves', async () => {
      // Arrange
      const resourceName = 'test-resource';
      const infrastructureId = 'infra-123';
      mockGetRetentions.mockResolvedValue(mockRetentions);

      // Act
      const { result } = renderHook(() => useRetentions({ resourceName, infrastructureId }), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toEqual(mockRetentions);
        expect(result.current.error).toBe(null);
      });
    });

    it('should return error state when getRetentions rejects', async () => {
      // Arrange
      const resourceName = 'test-resource';
      const infrastructureId = 'infra-123';
      const mockError = new Error('Failed to fetch retentions');
      mockGetRetentions.mockRejectedValue(mockError);

      // Act
      const { result } = renderHook(() => useRetentions({ resourceName, infrastructureId }), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toBeUndefined();
        expect(result.current.error).toEqual(mockError);
      });
    });

    it('should return empty array when getRetentions resolves with empty result', async () => {
      // Arrange
      const resourceName = 'test-resource';
      const infrastructureId = 'infra-123';
      mockGetRetentions.mockResolvedValue([]);

      // Act
      const { result } = renderHook(() => useRetentions({ resourceName, infrastructureId }), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(result.current.data).toEqual([]);
      });
    });

    it('should not fetch when resourceName is empty', () => {
      // Arrange
      const resourceName = '';
      const infrastructureId = 'infra-123';

      // Act
      const { result } = renderHook(() => useRetentions({ resourceName, infrastructureId }), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(mockGetRetentions).not.toHaveBeenCalled();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
    });

    it('should not fetch when infrastructureId is empty', () => {
      // Arrange
      const resourceName = 'test-resource';
      const infrastructureId = '';

      // Act
      const { result } = renderHook(() => useRetentions({ resourceName, infrastructureId }), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(mockGetRetentions).not.toHaveBeenCalled();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
    });

    it('should not fetch when both parameters are empty', () => {
      // Arrange
      const resourceName = '';
      const infrastructureId = '';

      // Act
      const { result } = renderHook(() => useRetentions({ resourceName, infrastructureId }), {
        wrapper: createWrapper(),
      });

      // Assert
      expect(mockGetRetentions).not.toHaveBeenCalled();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
    });

    it('should pass query options correctly', async () => {
      // Arrange
      const resourceName = 'test-resource';
      const infrastructureId = 'infra-123';
      mockGetRetentions.mockResolvedValue(mockRetentions);

      const queryOptions = {
        staleTime: 5000,
        gcTime: 10000,
      };

      // Act
      renderHook(() => useRetentions({ resourceName, infrastructureId }, queryOptions), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(mockGetRetentions).toHaveBeenCalledWith({
          resourceName,
          infrastructureId,
          signal: expect.any(AbortSignal) as AbortSignal,
        });
      });
    });

    it('should handle multiple retentions with different properties', async () => {
      // Arrange
      const resourceName = 'test-resource';
      const infrastructureId = 'infra-123';
      const retentionsWithLink: Retention[] = [
        {
          id: '1',
          duration: 'P1M',
          default: true,
          supported: true,
          link: 'https://example.com/retention-1',
        },
        {
          id: '2',
          duration: 'P3M',
          default: false,
          supported: true,
        },
        {
          id: '3',
          duration: 'P6M',
          default: false,
          supported: false,
          link: 'https://example.com/retention-3',
        },
      ];
      mockGetRetentions.mockResolvedValue(retentionsWithLink);

      // Act
      const { result } = renderHook(() => useRetentions({ resourceName, infrastructureId }), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(result.current.data).toEqual(retentionsWithLink);
        expect(result.current.data).toHaveLength(3);
        expect(result.current.data?.[0]?.link).toBe('https://example.com/retention-1');
        expect(result.current.data?.[1]?.link).toBeUndefined();
        expect(result.current.data?.[2]?.link).toBe('https://example.com/retention-3');
      });
    });

    it('should refetch when parameters change', async () => {
      // Arrange
      const resourceName = 'test-resource';
      const infrastructureId1 = 'infra-123';
      const infrastructureId2 = 'infra-456';
      const retentions1 = [mockRetentions[0]!];
      const retentions2 = [mockRetentions[1]!];

      mockGetRetentions.mockResolvedValueOnce(retentions1).mockResolvedValueOnce(retentions2);

      // Act
      const { result, rerender } = renderHook(
        ({ infra }) => useRetentions({ resourceName, infrastructureId: infra }),
        {
          wrapper: createWrapper(),
          initialProps: { infra: infrastructureId1 },
        },
      );

      // Assert - First render
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(result.current.data).toEqual(retentions1);
      });

      // Act - Change infrastructure ID
      rerender({ infra: infrastructureId2 });

      // Assert - Second render
      await waitFor(() => {
        expect(result.current.data).toEqual(retentions2);
      });

      expect(mockGetRetentions).toHaveBeenCalledTimes(2);
      expect(mockGetRetentions).toHaveBeenCalledWith({
        resourceName,
        infrastructureId: infrastructureId1,
        signal: expect.any(AbortSignal) as AbortSignal,
      });
      expect(mockGetRetentions).toHaveBeenCalledWith({
        resourceName,
        infrastructureId: infrastructureId2,
        signal: expect.any(AbortSignal) as AbortSignal,
      });
    });

    it('should provide refetch function', async () => {
      // Arrange
      const resourceName = 'test-resource';
      const infrastructureId = 'infra-123';
      mockGetRetentions.mockResolvedValue(mockRetentions);

      // Act
      const { result } = renderHook(() => useRetentions({ resourceName, infrastructureId }), {
        wrapper: createWrapper(),
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(typeof result.current.refetch).toBe('function');

      // Test refetch functionality
      mockGetRetentions.mockClear();
      await result.current.refetch();

      expect(mockGetRetentions).toHaveBeenCalledTimes(1);
    });
  });
});
