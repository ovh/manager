import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { editGrafana } from '@/__mocks__/grafana/grafana.adapter';
import type { EditGrafanaPayload } from '@/data/api/grafana.props';
import { useEditGrafana } from '@/data/hooks/grafana/useEditGrafana.hook';
import { getGrafanaQueryKey, getGrafanasQueryKey } from '@/data/hooks/grafana/useGrafana.hook';
import { Grafana } from '@/types/managedDashboards.type';

vi.mock('@/__mocks__/grafana/grafana.adapter', () => ({
  editGrafana: vi.fn(),
}));

const mockEditGrafana = vi.mocked(editGrafana);

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

describe('useEditGrafana', () => {
  const payload: EditGrafanaPayload = {
    resourceName: 'service-a',
    grafanaId: 'grafana-123',
    targetSpec: {
      title: 'Updated grafana',
      description: 'Updated description',
      datasource: { fullySynced: false },
      release: { id: 'release-1', status: 'SUPPORTED', version: '12.0.0' },
    },
  };

  const editedGrafana: Grafana = {
    id: 'grafana-123',
    createdAt: '2025-11-01T08:00:00.001Z',
    updatedAt: '2025-11-01T08:00:00.001Z',
    resourceStatus: 'READY',
    currentState: {
      title: 'Updated grafana',
      description: 'Updated description',
      datasource: { fullySynced: false },
      release: { id: 'release-1', status: 'SUPPORTED', version: '12.0.0' },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls editGrafana with the provided payload', async () => {
    mockEditGrafana.mockResolvedValue(editedGrafana);
    const { TestWrapper } = createWrapper();

    const { result } = renderHook(() => useEditGrafana(), { wrapper: TestWrapper });

    result.current.mutate(payload);

    await waitFor(() => {
      expect(mockEditGrafana).toHaveBeenCalledWith(payload);
    });
  });

  it('returns success state when mutation resolves', async () => {
    mockEditGrafana.mockResolvedValue(editedGrafana);
    const { TestWrapper } = createWrapper();

    const { result } = renderHook(() => useEditGrafana(), { wrapper: TestWrapper });
    result.current.mutate(payload);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(editedGrafana);
      expect(result.current.error).toBe(null);
    });
  });

  it('returns error state when mutation rejects', async () => {
    const error = new Error('Failed to edit grafana');
    mockEditGrafana.mockRejectedValue(error);
    const { TestWrapper } = createWrapper();

    const { result } = renderHook(() => useEditGrafana(), { wrapper: TestWrapper });
    result.current.mutate(payload);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toEqual(error);
      expect(result.current.data).toBeUndefined();
    });
  });

  it('invalidates grafanas list and updates grafana cache on success', async () => {
    mockEditGrafana.mockResolvedValue(editedGrafana);
    const { TestWrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const setQueryDataSpy = vi.spyOn(queryClient, 'setQueryData');

    const { result } = renderHook(() => useEditGrafana(), { wrapper: TestWrapper });
    result.current.mutate(payload);

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: getGrafanasQueryKey(payload.resourceName),
      });
      expect(setQueryDataSpy).toHaveBeenCalledWith(
        getGrafanaQueryKey(payload.resourceName, payload.grafanaId),
        editedGrafana,
      );
    });
  });

  it('supports custom lifecycle callbacks', async () => {
    mockEditGrafana.mockResolvedValue(editedGrafana);
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const onMutate = vi.fn();
    const onSettled = vi.fn();
    const { TestWrapper } = createWrapper();

    const { result } = renderHook(
      () =>
        useEditGrafana({
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
      expect(onSuccess).toHaveBeenCalledWith(editedGrafana, payload, undefined);
      expect(onSettled).toHaveBeenCalledWith(editedGrafana, null, payload, undefined);
    });
    expect(onError).not.toHaveBeenCalled();
  });

  it('reports pending state while mutation is in flight', async () => {
    let resolveMutation: (value: Grafana) => void;
    const pendingPromise = new Promise<Grafana>((resolve) => {
      resolveMutation = resolve;
    });
    mockEditGrafana.mockReturnValue(pendingPromise);
    const { TestWrapper } = createWrapper();

    const { result } = renderHook(() => useEditGrafana(), { wrapper: TestWrapper });
    result.current.mutate(payload);

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBe(null);

    resolveMutation!(editedGrafana);
  });

  it('can reset mutation state', async () => {
    mockEditGrafana.mockResolvedValue(editedGrafana);
    const { TestWrapper } = createWrapper();

    const { result } = renderHook(() => useEditGrafana(), { wrapper: TestWrapper });
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
