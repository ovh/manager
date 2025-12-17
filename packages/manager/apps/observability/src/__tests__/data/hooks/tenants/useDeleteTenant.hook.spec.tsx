import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { deleteTenant } from '@/data/api/tenants.api';
import type { GetTenantPayload } from '@/data/api/tenants.props';
import { useDeleteTenant } from '@/data/hooks/tenants/useDeleteTenant.hook';
import type { Tenant } from '@/types/tenants.type';

vi.mock('@/data/api/tenants.api', () => ({
  deleteTenant: vi.fn(),
}));

const mockDeleteTenant = vi.mocked(deleteTenant);

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

describe('useDeleteTenant', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const payload: GetTenantPayload = {
    resourceName: 'service-a',
  } as unknown as GetTenantPayload;

  const deletedTenant: Tenant = {
    id: 'tenant-123',
    createdAt: '2025-11-01T08:00:00.001Z',
    updatedAt: '2025-11-01T08:00:00.001Z',
    resourceStatus: 'DELETING',
    currentState: {
      title: 'Tenant 123',
    },
  };

  it('calls deleteTenant with correct payload', async () => {
    mockDeleteTenant.mockResolvedValue(deletedTenant);
    const { TestWrapper } = createWrapper();

    const { result } = renderHook(() => useDeleteTenant(), { wrapper: TestWrapper });

    result.current.mutate(payload);

    await waitFor(() => {
      expect(mockDeleteTenant).toHaveBeenCalledWith(payload);
    });
  });

  it('returns success state on resolve', async () => {
    mockDeleteTenant.mockResolvedValue(deletedTenant);
    const { TestWrapper } = createWrapper();

    const { result } = renderHook(() => useDeleteTenant(), { wrapper: TestWrapper });

    result.current.mutate(payload);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(deletedTenant);
      expect(result.current.error).toBe(null);
    });
  });

  it('returns error state on reject', async () => {
    const err = new Error('Failed');
    mockDeleteTenant.mockRejectedValue(err);
    const { TestWrapper } = createWrapper();

    const { result } = renderHook(() => useDeleteTenant(), { wrapper: TestWrapper });

    result.current.mutate(payload);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toEqual(err);
      expect(result.current.data).toBeUndefined();
    });
  });

  it('supports custom lifecycle callbacks', async () => {
    mockDeleteTenant.mockResolvedValue(deletedTenant);
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const onMutate = vi.fn();
    const onSettled = vi.fn();
    const { TestWrapper } = createWrapper();

    const { result } = renderHook(
      () =>
        useDeleteTenant({
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
      expect(onSuccess).toHaveBeenCalled();
      expect(onSettled).toHaveBeenCalled();
    });

    expect(onError).not.toHaveBeenCalled();
  });

  it('exposes loading state during mutation', async () => {
    let resolveFn: (v: Tenant) => void;
    const pending = new Promise<Tenant>((resolve) => {
      resolveFn = resolve;
    });
    mockDeleteTenant.mockReturnValue(pending);
    const { TestWrapper } = createWrapper();

    const { result } = renderHook(() => useDeleteTenant(), { wrapper: TestWrapper });

    result.current.mutate(payload);

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBe(null);

    resolveFn!(deletedTenant);
  });

  it('can reset mutation state', async () => {
    mockDeleteTenant.mockResolvedValue(deletedTenant);
    const { TestWrapper } = createWrapper();
    const { result } = renderHook(() => useDeleteTenant(), { wrapper: TestWrapper });

    result.current.mutate(payload);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    result.current.reset();
    await waitFor(() => expect(result.current.isIdle).toBe(true));
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBe(null);
  });
});
