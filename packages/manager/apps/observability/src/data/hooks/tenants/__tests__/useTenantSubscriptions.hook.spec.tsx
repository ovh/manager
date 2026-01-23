import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { getTenantSubscriptions } from '@/__mocks__/tenants/tenant.adapter';
import {
  getTenantSubscriptionsQueryKey,
  useTenantSubscriptions,
} from '@/data/hooks/tenants/useTenantSubscriptions.hook';
import { TenantSubscription } from '@/types/tenants.type';

// Mock the tenant adapter
vi.mock('@/__mocks__/tenants/tenant.adapter', () => ({
  getTenantSubscriptions: vi.fn(),
}));

const mockGetTenantSubscriptions = vi.mocked(getTenantSubscriptions);

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
const mockSubscriptions: TenantSubscription[] = [
  {
    id: 'subscription-1',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    resourceStatus: 'READY',
    currentState: {
      kind: 'logs',
      link: 'https://logs.example.com',
      resource: {
        name: 'logs-resource',
        type: 'logs',
      },
    },
  },
  {
    id: 'subscription-2',
    createdAt: '2025-01-02T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
    resourceStatus: 'READY',
    currentState: {
      kind: 'traces',
      link: 'https://traces.example.com',
      resource: {
        name: 'traces-resource',
        type: 'traces',
      },
    },
  },
];

describe('useTenantSubscriptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTenantSubscriptionsQueryKey', () => {
    it.each([
      [
        'resource-1',
        'tenant-1',
        ['tenants', 'resource-1', 'tenantId', 'tenant-1', 'subscriptions'],
      ],
      [
        'resource-2',
        'tenant-2',
        ['tenants', 'resource-2', 'tenantId', 'tenant-2', 'subscriptions'],
      ],
      [
        'my-service',
        'my-tenant',
        ['tenants', 'my-service', 'tenantId', 'my-tenant', 'subscriptions'],
      ],
    ])(
      'should return correct query key for resourceName "%s" and tenantId "%s"',
      (resourceName, tenantId, expectedKey) => {
        expect(getTenantSubscriptionsQueryKey(resourceName, tenantId)).toEqual(expectedKey);
      },
    );
  });

  describe('API Call', () => {
    it.each([
      ['test-resource', 'test-tenant'],
      ['my-service', 'my-tenant-id'],
      ['another-resource', 'another-tenant'],
    ])(
      'should call getTenantSubscriptions with resourceName "%s" and tenantId "%s"',
      async (resourceName, tenantId) => {
        mockGetTenantSubscriptions.mockResolvedValue(mockSubscriptions);

        renderHook(() => useTenantSubscriptions(resourceName, tenantId), {
          wrapper: createWrapper(),
        });

        await waitFor(() => {
          expect(mockGetTenantSubscriptions).toHaveBeenCalledWith({
            resourceName,
            tenantId,
            signal: expect.any(AbortSignal) as AbortSignal,
          });
        });
      },
    );
  });

  describe('Query States', () => {
    it('should return loading state initially', () => {
      mockGetTenantSubscriptions.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useTenantSubscriptions('test-resource', 'test-tenant'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBe(null);
    });

    it.each([
      ['success with data', mockSubscriptions, true, false, false, mockSubscriptions],
      ['success with empty array', [], true, false, false, []],
    ])(
      'should handle %s state',
      async (_description, resolvedData, isSuccess, isLoading, isError, expectedData) => {
        mockGetTenantSubscriptions.mockResolvedValue(resolvedData);

        const { result } = renderHook(
          () => useTenantSubscriptions('test-resource', 'test-tenant'),
          { wrapper: createWrapper() },
        );

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(isSuccess);
          expect(result.current.isLoading).toBe(isLoading);
          expect(result.current.isError).toBe(isError);
          expect(result.current.data).toEqual(expectedData);
        });
      },
    );

    it('should return error state when getTenantSubscriptions rejects', async () => {
      const mockError = new Error('Failed to fetch subscriptions');
      mockGetTenantSubscriptions.mockRejectedValue(mockError);

      const { result } = renderHook(
        () => useTenantSubscriptions('error-resource', 'error-tenant'),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toBeUndefined();
        expect(result.current.error).toEqual(mockError);
      });
    });
  });

  describe('Enabled State', () => {
    it.each([
      ['empty resourceName', '', 'tenant-1', false],
      ['empty tenantId', 'resource-1', '', false],
      ['both empty', '', '', false],
      ['both provided', 'resource-1', 'tenant-1', true],
    ])(
      'when %s (resourceName="%s", tenantId="%s"), query enabled should be %s',
      async (_description, resourceName, tenantId, shouldBeEnabled) => {
        mockGetTenantSubscriptions.mockResolvedValue(mockSubscriptions);

        const { result } = renderHook(() => useTenantSubscriptions(resourceName, tenantId), {
          wrapper: createWrapper(),
        });

        if (shouldBeEnabled) {
          await waitFor(() => {
            expect(mockGetTenantSubscriptions).toHaveBeenCalled();
          });
        } else {
          expect(result.current.fetchStatus).toBe('idle');
          expect(mockGetTenantSubscriptions).not.toHaveBeenCalled();
        }
      },
    );
  });

  describe('Query Options', () => {
    it.each([
      ['select option', { select: (data: TenantSubscription[]) => data }],
      ['staleTime option', { staleTime: 5000 }],
      ['refetchOnWindowFocus option', { refetchOnWindowFocus: false }],
    ])('should accept %s', async (_description, options) => {
      mockGetTenantSubscriptions.mockResolvedValue(mockSubscriptions);

      const { result } = renderHook(() => useTenantSubscriptions('resource', 'tenant', options), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });

    it('should allow disabling the query via queryOptions', () => {
      mockGetTenantSubscriptions.mockResolvedValue(mockSubscriptions);

      const { result } = renderHook(
        () => useTenantSubscriptions('resource', 'tenant', { enabled: false }),
        { wrapper: createWrapper() },
      );

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockGetTenantSubscriptions).not.toHaveBeenCalled();
    });
  });

  describe('Data Integrity', () => {
    it.each([
      ['id', 'subscription-1'],
      ['resourceStatus', 'READY'],
      ['createdAt', '2025-01-01T00:00:00.000Z'],
    ])('should return subscription with correct %s', async (property, expectedValue) => {
      mockGetTenantSubscriptions.mockResolvedValue(mockSubscriptions);

      const { result } = renderHook(() => useTenantSubscriptions('resource', 'tenant'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(result.current.data?.[0]).toHaveProperty(property, expectedValue);
      });
    });

    it.each([
      ['kind', 'logs'],
      ['link', 'https://logs.example.com'],
    ])(
      'should return subscription currentState with correct %s',
      async (property, expectedValue) => {
        mockGetTenantSubscriptions.mockResolvedValue(mockSubscriptions);

        const { result } = renderHook(() => useTenantSubscriptions('resource', 'tenant'), {
          wrapper: createWrapper(),
        });

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true);
          expect(result.current.data?.[0]?.currentState).toHaveProperty(property, expectedValue);
        });
      },
    );
  });
});
