import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { editObservabilityService } from '@/data/api/observability.api';
import { EditObservabilityServicePayload } from '@/data/api/observability.props';
import { useEditObservabilityService } from '@/data/hooks/services/useEditObservabilityService.hook';
import { getObservabilityServicesQueryKey } from '@/data/hooks/services/useObservabilityServices.hook';
import { ObservabilityService } from '@/types/observability.type';

vi.mock('@/data/api/observability.api', () => ({
  editObservabilityService: vi.fn(),
}));

const mockEditObservabilityService = vi.mocked(editObservabilityService);

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

describe('useEditObservabilityService', () => {
  const payload: EditObservabilityServicePayload = {
    resourceName: 'service-123',
    targetSpec: {
      displayName: 'Updated Service Name',
    },
  };

  const updatedService: ObservabilityService = {
    id: 'service-123',
    createdAt: '2025-11-01T08:00:00.001Z',
    updatedAt: '2025-11-01T09:00:00.001Z',
    currentState: { displayName: 'Updated Service Name' },
    resourceStatus: 'READY',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls editObservabilityService with the provided payload', async () => {
    mockEditObservabilityService.mockResolvedValue(updatedService);
    const { TestWrapper } = createWrapper();

    const { result } = renderHook(() => useEditObservabilityService(), {
      wrapper: TestWrapper,
    });

    result.current.mutate(payload);

    await waitFor(() => {
      expect(mockEditObservabilityService).toHaveBeenCalledWith(payload);
    });
  });

  it('returns success state when mutation resolves', async () => {
    mockEditObservabilityService.mockResolvedValue(updatedService);
    const { TestWrapper } = createWrapper();

    const { result } = renderHook(() => useEditObservabilityService(), {
      wrapper: TestWrapper,
    });
    result.current.mutate(payload);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(updatedService);
      expect(result.current.error).toBe(null);
    });
  });

  it('returns error state when mutation rejects', async () => {
    const error = new Error('Failed to edit service');
    mockEditObservabilityService.mockRejectedValue(error);
    const { TestWrapper } = createWrapper();

    const { result } = renderHook(() => useEditObservabilityService(), {
      wrapper: TestWrapper,
    });
    result.current.mutate(payload);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toEqual(error);
      expect(result.current.data).toBeUndefined();
    });
  });

  it('invalidates observability services query on success', async () => {
    mockEditObservabilityService.mockResolvedValue(updatedService);
    const { TestWrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useEditObservabilityService(), {
      wrapper: TestWrapper,
    });
    result.current.mutate(payload);

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: getObservabilityServicesQueryKey(),
      });
    });
  });

  it('supports custom lifecycle callbacks', async () => {
    mockEditObservabilityService.mockResolvedValue(updatedService);
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const onMutate = vi.fn();
    const onSettled = vi.fn();
    const { TestWrapper } = createWrapper();

    const { result } = renderHook(
      () =>
        useEditObservabilityService({
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
      expect(onSuccess).toHaveBeenCalledWith(updatedService, payload, undefined);
      expect(onSettled).toHaveBeenCalledWith(updatedService, null, payload, undefined);
    });
    expect(onError).not.toHaveBeenCalled();
  });

  it('calls onError callback when mutation fails', async () => {
    const error = new Error('Failed to edit service');
    mockEditObservabilityService.mockRejectedValue(error);
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const { TestWrapper } = createWrapper();

    const { result } = renderHook(
      () =>
        useEditObservabilityService({
          onSuccess,
          onError,
        }),
      { wrapper: TestWrapper },
    );

    result.current.mutate(payload);

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(error, payload, undefined);
    });
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('reports pending state while mutation is in flight', async () => {
    let resolveMutation: (value: ObservabilityService) => void;
    const pendingPromise = new Promise<ObservabilityService>((resolve) => {
      resolveMutation = resolve;
    });
    mockEditObservabilityService.mockReturnValue(pendingPromise);
    const { TestWrapper } = createWrapper();

    const { result } = renderHook(() => useEditObservabilityService(), {
      wrapper: TestWrapper,
    });
    result.current.mutate(payload);

    await waitFor(() => {
      expect(result.current.isPending).toBe(true);
    });
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBe(null);

    resolveMutation!(updatedService);
  });

  it('can reset mutation state', async () => {
    mockEditObservabilityService.mockResolvedValue(updatedService);
    const { TestWrapper } = createWrapper();

    const { result } = renderHook(() => useEditObservabilityService(), {
      wrapper: TestWrapper,
    });
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
