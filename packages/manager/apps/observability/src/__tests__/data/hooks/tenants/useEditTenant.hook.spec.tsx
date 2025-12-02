import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { editTenant } from '@/__mocks__/tenants/tenant.adapter';
import { EditTenantPayload } from '@/data/api/tenants.props';
import { useEditTenant } from '@/data/hooks/tenants/useEditTenant.hook';
import { getTenantQueryKey, getTenantsQueryKey } from '@/data/hooks/tenants/useTenants.hook';
import { Tenant } from '@/types/tenants.type';

vi.mock('@/__mocks__/tenants/tenant.adapter', () => ({
  editTenant: vi.fn(),
}));

const mockEditTenant = vi.mocked(editTenant);

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false, gcTime: 0 },
    },
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  TestWrapper.displayName = 'TestWrapper';

  return { TestWrapper, queryClient };
};

describe('useEditTenant', () => {
  const payload: EditTenantPayload = {
    resourceName: 'service-a',
    tenantId: 'tenant-123',
    targetSpec: {
      title: 'Updated tenant',
      description: 'Updated description',
      limits: {
        mimir: {
          compactor_blocks_retention_period: '30d',
          max_global_series_per_user: 2000,
        },
      },
      infrastructure: {
        id: 'infra-1',
      },
    },
  };

  const editedTenant: Tenant = {
    id: 'tenant-123',
    createdAt: '2025-11-01T08:00:00.001Z',
    updatedAt: '2025-11-01T08:00:00.001Z',
    currentState: {
      title: 'Updated tenant',
      description: 'Updated description',
      limits: {
        mimir: {
          compactor_blocks_retention_period: '30d',
          max_global_series_per_user: 2000,
        },
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls editTenant with the provided payload', async () => {
    mockEditTenant.mockResolvedValue(editedTenant);
    const { TestWrapper } = createWrapper();

    const { result } = renderHook(() => useEditTenant(), { wrapper: TestWrapper });

    result.current.mutate(payload);

    await waitFor(() => {
      expect(mockEditTenant).toHaveBeenCalledWith(payload);
    });
  });

  it('returns success state when mutation resolves', async () => {
    mockEditTenant.mockResolvedValue(editedTenant);
    const { TestWrapper } = createWrapper();

    const { result } = renderHook(() => useEditTenant(), { wrapper: TestWrapper });
    result.current.mutate(payload);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(editedTenant);
      expect(result.current.error).toBe(null);
    });
  });

  it('returns error state when mutation rejects', async () => {
    const error = new Error('Failed to edit tenant');
    mockEditTenant.mockRejectedValue(error);
    const { TestWrapper } = createWrapper();

    const { result } = renderHook(() => useEditTenant(), { wrapper: TestWrapper });
    result.current.mutate(payload);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toEqual(error);
      expect(result.current.data).toBeUndefined();
    });
  });

  it('invalidates tenants list and updates tenant cache on success', async () => {
    mockEditTenant.mockResolvedValue(editedTenant);
    const { TestWrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const setQueryDataSpy = vi.spyOn(queryClient, 'setQueryData');

    const { result } = renderHook(() => useEditTenant(), { wrapper: TestWrapper });
    result.current.mutate(payload);

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: getTenantsQueryKey(payload.resourceName),
      });
      expect(setQueryDataSpy).toHaveBeenCalledWith(
        getTenantQueryKey(payload.resourceName, payload.tenantId),
        editedTenant,
      );
    });
  });

  it('supports custom lifecycle callbacks', async () => {
    mockEditTenant.mockResolvedValue(editedTenant);
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const onMutate = vi.fn();
    const onSettled = vi.fn();
    const { TestWrapper } = createWrapper();

    const { result } = renderHook(
      () =>
        useEditTenant({
          onSuccess,
          onError,
          onMutate,
          onSettled,
        }),
      { wrapper: TestWrapper },
    );

    result.current.mutate(payload);

    await waitFor(() => {
      expect(onMutate).toHaveBeenCalledWith(payload);
      expect(onSuccess).toHaveBeenCalledWith(editedTenant, payload, undefined);
      expect(onSettled).toHaveBeenCalledWith(editedTenant, null, payload, undefined);
    });
    expect(onError).not.toHaveBeenCalled();
  });

  it('reports pending state while mutation is in flight', async () => {
    let resolveMutation: (value: Tenant) => void;
    const pendingPromise = new Promise<Tenant>((resolve) => {
      resolveMutation = resolve;
    });
    mockEditTenant.mockReturnValue(pendingPromise);
    const { TestWrapper } = createWrapper();

    const { result } = renderHook(() => useEditTenant(), { wrapper: TestWrapper });
    result.current.mutate(payload);

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBe(null);

    resolveMutation!(editedTenant);
  });

  it('can reset mutation state', async () => {
    mockEditTenant.mockResolvedValue(editedTenant);
    const { TestWrapper } = createWrapper();

    const { result } = renderHook(() => useEditTenant(), { wrapper: TestWrapper });
    result.current.mutate(payload);

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
});
