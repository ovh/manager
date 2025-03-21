import { renderHook } from '@testing-library/react-hooks';
import { useQuery, QueryClient, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { vi } from 'vitest';
import { useVrackService } from './useVrackServices';
import {
  VrackServicesWithIAM,
  getVrackServicesResource,
} from '../../vrack-services';

vi.mock('../../vrack-services', async () => {
  const actual = await vi.importActual<typeof import('../../vrack-services')>(
    '../../vrack-services',
  );
  return {
    ...actual,
    getVrackServicesResource: vi.fn(),
  };
});

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual<typeof import('@tanstack/react-query')>(
    '@tanstack/react-query',
  );
  return {
    ...actual,
    useQuery: vi.fn(),
    useQueryClient: vi.fn(),
  };
});

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}));

const queryClient = new QueryClient();

describe('useVrackService Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    queryClient.clear();
    vi.mocked(useParams).mockReturnValue({ id: 'test-id' });
    vi.mocked(getVrackServicesResource).mockResolvedValue({
      data: ({} as unknown) as VrackServicesWithIAM,
      status: 200,
      statusText: '',
      headers: undefined,
      config: undefined,
    });
    vi.mocked(useQueryClient).mockImplementation(() => {
      return ({
        setQueryData: vi.fn(),
      } as unknown) as QueryClient;
    });
  });

  it('should return vrack service data on success', async () => {
    vi.mocked(useQuery).mockImplementation(({ queryFn }: any) => {
      const mockResponse = {
        id: 'test-id',
        name: 'Test Vrack',
        currentTasks: [],
      };
      queryFn();
      return {
        data: mockResponse,
        isLoading: false,
        isFetching: false,
        isPending: false,
        isSuccess: true,
        isError: false,
        isRefetching: false,
        error: null,
        refetch: vi.fn(),
        status: 'success',
        dataUpdatedAt: 0,
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: null,
        isLoadingError: false,
        isRefetchError: false,
        errorUpdateCount: 0,
        isFetched: true,
        isFetchedAfterMount: true,
        isInitialLoading: false,
        isPaused: false,
        isPlaceholderData: false,
        isStale: false,
        fetchStatus: 'idle',
      };
    });

    const { result } = renderHook(() => useVrackService());
    expect(result.current.data).toEqual({
      id: 'test-id',
      name: 'Test Vrack',
      currentTasks: [],
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(true);
  });

  it('should handle a loading state', () => {
    vi.mocked(useQuery).mockImplementation(({ queryFn }: any) => {
      queryFn();
      return {
        data: undefined,
        isLoading: true,
        isFetching: true,
        isPending: true,
        isSuccess: false,
        isError: false,
        isRefetching: false,
        error: null,
        refetch: vi.fn(),
        status: 'pending',
        dataUpdatedAt: 0,
        errorUpdatedAt: 0,
        failureCount: 0,
        failureReason: null,
        isLoadingError: false,
        isRefetchError: false,
        errorUpdateCount: 0,
        isFetched: false,
        isFetchedAfterMount: false,
        isInitialLoading: true,
        isPaused: false,
        isPlaceholderData: false,
        isStale: false,
        fetchStatus: 'fetching',
      };
    });

    const { result } = renderHook(() => useVrackService());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('should handle an error state', () => {
    vi.mocked(useQuery).mockImplementation(({ queryFn }: any) => {
      queryFn();
      return {
        data: undefined,
        isLoading: false,
        isFetching: false,
        isPending: false,
        isSuccess: false,
        isError: true,
        isRefetching: false,
        error: new Error('Network error'),
        refetch: vi.fn(),
        status: 'error',
        dataUpdatedAt: 0,
        errorUpdatedAt: Date.now(),
        failureCount: 0,
        failureReason: new Error('Network error'),
        isLoadingError: false,
        isRefetchError: true,
        errorUpdateCount: 0,
        isFetched: true,
        isFetchedAfterMount: true,
        isInitialLoading: false,
        isPaused: false,
        isPlaceholderData: false,
        isStale: false,
        fetchStatus: 'idle',
      };
    });

    const { result } = renderHook(() => useVrackService());

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toEqual(new Error('Network error'));
  });
});
