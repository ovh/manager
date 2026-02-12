import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { createGrafana } from '@/data/api/grafana.api';
import { CreateGrafanaPayload } from '@/data/api/grafana.props';
import { useCreateGrafana } from '@/data/hooks/grafana/useCreateGrafana.hook';
import { getGrafanasQueryKey } from '@/data/hooks/grafana/useGrafana.hook';
import { Grafana } from '@/types/managedDashboards.type';

// Mock the grafana api
vi.mock('@/data/api/grafana.api', () => ({
  createGrafana: vi.fn(),
}));

const mockCreateGrafana = vi.mocked(createGrafana);

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
  TestWrapper.displayName = 'TestWrapper';
  return { TestWrapper, queryClient };
};

describe('useCreateGrafana', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPayload: CreateGrafanaPayload = {
    resourceName: 'test-service-123',
    targetSpec: {
      title: 'Test Grafana',
      description: 'Test grafana description',
      datasource: {
        fullySynced: true,
        metrics: {
          tenants: [{ id: 'tenant-1' }],
        },
      },
      infrastructure: {
        id: 'infra-1',
      },
      release: {
        id: 'release-1',
      },
    },
  };

  const mockGrafana: Grafana = {
    id: 'grafana-123',
    createdAt: '2025-11-01T08:00:00.001Z',
    updatedAt: '2025-11-01T08:00:00.001Z',
    resourceStatus: 'READY',
    currentState: {
      title: 'Test Grafana',
      description: 'Test grafana description',
      datasource: {
        fullySynced: true,
      },
      release: { id: 'release-1' },
    },
  };

  it('should call createGrafana with correct payload', async () => {
    mockCreateGrafana.mockResolvedValue(mockGrafana);
    const { TestWrapper } = createWrapper();

    const { result } = renderHook(() => useCreateGrafana(), {
      wrapper: TestWrapper,
    });

    result.current.mutate(mockPayload);

    await waitFor(() => {
      expect(mockCreateGrafana).toHaveBeenCalledWith(mockPayload);
    });
  });

  describe('mutation states', () => {
    it.each([
      {
        scenario: 'success',
        setupMock: () => mockCreateGrafana.mockResolvedValue(mockGrafana),
        expectedState: {
          isSuccess: true,
          isError: false,
          data: mockGrafana,
          error: null,
        },
      },
      {
        scenario: 'error',
        setupMock: () => mockCreateGrafana.mockRejectedValue(new Error('Failed to create grafana')),
        expectedState: {
          isSuccess: false,
          isError: true,
          data: undefined,
          error: new Error('Failed to create grafana'),
        },
      },
    ])(
      'should return $scenario state when createGrafana resolves/rejects',
      async ({ setupMock, expectedState }) => {
        setupMock();
        const { TestWrapper } = createWrapper();

        const { result } = renderHook(() => useCreateGrafana(), {
          wrapper: TestWrapper,
        });

        result.current.mutate(mockPayload);

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(expectedState.isSuccess);
          expect(result.current.isError).toBe(expectedState.isError);
          if (expectedState.data) {
            expect(result.current.data).toEqual(expectedState.data);
          } else {
            expect(result.current.data).toBeUndefined();
          }
          if (expectedState.error) {
            expect(result.current.error).toEqual(expectedState.error);
          } else {
            expect(result.current.error).toBe(null);
          }
        });
      },
    );
  });

  it('should invalidate grafanas query on success', async () => {
    mockCreateGrafana.mockResolvedValue(mockGrafana);
    const { TestWrapper, queryClient } = createWrapper();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useCreateGrafana(), {
      wrapper: TestWrapper,
    });

    result.current.mutate(mockPayload);

    await waitFor(() => {
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: getGrafanasQueryKey(mockPayload.resourceName),
      });
    });
  });

  describe('custom callbacks', () => {
    it.each([
      {
        callbackName: 'onSuccess',
        setupMock: () => mockCreateGrafana.mockResolvedValue(mockGrafana),
        expectedArgs: [mockGrafana, mockPayload, undefined],
      },
      {
        callbackName: 'onError',
        setupMock: () => mockCreateGrafana.mockRejectedValue(new Error('Custom error')),
        expectedArgs: [new Error('Custom error'), mockPayload, undefined],
      },
    ] as const)(
      'should call custom $callbackName callback when provided',
      async ({ callbackName, setupMock, expectedArgs }) => {
        setupMock();
        const mockCallback = vi.fn();
        const { TestWrapper } = createWrapper();

        const { result } = renderHook(
          () =>
            useCreateGrafana({
              [callbackName]: mockCallback,
            }),
          {
            wrapper: TestWrapper,
          },
        );

        result.current.mutate(mockPayload);

        await waitFor(() => {
          expect(mockCallback).toHaveBeenCalledWith(...expectedArgs);
        });
      },
    );
  });

  it('should return loading state during mutation', async () => {
    let resolvePromise: (value: Grafana) => void;
    const pendingPromise = new Promise<Grafana>((resolve) => {
      resolvePromise = resolve;
    });
    mockCreateGrafana.mockReturnValue(pendingPromise);
    const { TestWrapper } = createWrapper();

    const { result } = renderHook(() => useCreateGrafana(), {
      wrapper: TestWrapper,
    });

    result.current.mutate(mockPayload);

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBe(null);

    // Clean up - resolve the promise to avoid hanging
    resolvePromise!(mockGrafana);
  });

  it('should handle mutation with all custom options', async () => {
    mockCreateGrafana.mockResolvedValue(mockGrafana);
    const mockCallbacks = {
      onSuccess: vi.fn(),
      onError: vi.fn(),
      onMutate: vi.fn().mockReturnValue(undefined),
      onSettled: vi.fn(),
    };
    const { TestWrapper } = createWrapper();

    const { result } = renderHook(() => useCreateGrafana(mockCallbacks), {
      wrapper: TestWrapper,
    });

    result.current.mutate(mockPayload);

    await waitFor(() => {
      expect(mockCallbacks.onMutate).toHaveBeenCalledWith(mockPayload);
      expect(mockCallbacks.onSuccess).toHaveBeenCalledWith(mockGrafana, mockPayload, undefined);
      expect(mockCallbacks.onSettled).toHaveBeenCalledWith(
        mockGrafana,
        null,
        mockPayload,
        undefined,
      );
    });

    expect(mockCallbacks.onError).not.toHaveBeenCalled();
  });

  it('should reset mutation state correctly', async () => {
    mockCreateGrafana.mockResolvedValue(mockGrafana);
    const { TestWrapper } = createWrapper();

    const { result } = renderHook(() => useCreateGrafana(), {
      wrapper: TestWrapper,
    });

    result.current.mutate(mockPayload);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    result.current.reset();

    await waitFor(() => {
      expect(result.current.isIdle).toBe(true);
    });
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBe(null);
  });

  it('should handle multiple consecutive mutations', async () => {
    const secondPayload = { ...mockPayload, resourceName: 'second-service' };
    const secondGrafana = { ...mockGrafana, id: 'grafana-456' };

    mockCreateGrafana.mockResolvedValueOnce(mockGrafana).mockResolvedValueOnce(secondGrafana);

    const { TestWrapper } = createWrapper();

    const { result } = renderHook(() => useCreateGrafana(), {
      wrapper: TestWrapper,
    });

    // First mutation
    result.current.mutate(mockPayload);
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockGrafana);
    });

    // Second mutation
    result.current.mutate(secondPayload);
    await waitFor(() => {
      expect(result.current.data).toEqual(secondGrafana);
    });

    expect(mockCreateGrafana).toHaveBeenCalledTimes(2);
    expect(mockCreateGrafana).toHaveBeenNthCalledWith(1, mockPayload);
    expect(mockCreateGrafana).toHaveBeenNthCalledWith(2, secondPayload);
  });
});
