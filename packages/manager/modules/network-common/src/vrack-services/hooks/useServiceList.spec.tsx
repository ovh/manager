import { QueryKey, UseQueryResult, useQuery } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { Mock, vi } from 'vitest';

import { VrackServicesProductStatus, VrackServicesWithIAM } from '../../types';
import { useServiceList } from './useServiceList';
import { useVrackService } from './useVrackServices';

vi.mock('@tanstack/react-query', async () => {
  const actual =
    await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query');
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

vi.mock('./useVrackServices', async () => {
  const actual = await vi.importActual<typeof import('./useVrackServices')>('./useVrackServices');
  return {
    ...actual,
    useVrackService: vi.fn(),
  };
});

describe('useServiceList', () => {
  let getIamResourceQueryKeyMock: Mock<(urnList: string[]) => QueryKey>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();

    getIamResourceQueryKeyMock = vi.fn().mockImplementation((val) => [`iam/resource/${val}`]);

    vi.mocked(useVrackService).mockReturnValue({
      data: {
        currentState: {
          vrackId: 'vrack-id',
          displayName: '',
          productStatus: 'ACTIVE' as VrackServicesProductStatus,
          subnets: [],
          region: '',
        },
      } as unknown as VrackServicesWithIAM,
      error: null,
      isError: false,
      isPending: false,
      isLoading: false,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: true,
      status: 'success',
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: false,
      isFetchedAfterMount: false,
      isFetching: false,
      isInitialLoading: false,
      isPaused: false,
      isPlaceholderData: false,
      isRefetching: false,
      isStale: false,
      refetch: vi.fn(),
      fetchStatus: 'fetching',
    });
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isPending: true,
      isFetching: true,
      error: null,
      isError: false,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: false,
      status: 'pending',
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: undefined,
      errorUpdateCount: 0,
      isFetched: false,
      isFetchedAfterMount: false,
      isInitialLoading: true,
      isPaused: false,
      isPlaceholderData: false,
      isRefetching: false,
      isStale: false,
      refetch: vi.fn(),
      fetchStatus: 'fetching',
    });
  });

  it('Should return services and IAM resources when they are loaded', async () => {
    const mockServiceListResponse = {
      data: [{ managedServiceURNs: ['urn:service:1'] }],
    };
    const mockIamResources = {
      data: [{ id: 'iam-1', name: 'IAM Resource 1' }],
    };

    vi.mocked(useQuery).mockImplementation(({ queryKey }) => {
      if (queryKey.includes('get/vrackServices/resource/test-vrack-id/eligibleManagedService')) {
        return {
          data: mockServiceListResponse,
          isLoading: false,
          isFetching: false,
          error: null,
          isError: false,
          isFetched: true,
          isFetchedAfterMount: true,
          isFetchingNextPage: false,
          isFetchingPreviousPage: false,
          fetchStatus: 'idle',
          refetch: vi.fn(),
          status: 'success',
        } as unknown as UseQueryResult;
      }
      if (queryKey.includes('iam/resource/urn:service:2,urn:service:1')) {
        return {
          data: mockIamResources,
          isLoading: false,
          isFetching: false,
          error: null,
          isError: false,
          isFetched: true,
          isFetchedAfterMount: true,
          isFetchingNextPage: false,
          isFetchingPreviousPage: false,
          fetchStatus: 'idle',
          refetch: vi.fn(),
          status: 'success',
        } as unknown as UseQueryResult;
      }
      return {
        data: undefined,
        isLoading: true,
        isFetching: true,
        error: null,
        isError: false,
        isFetched: false,
        isFetchedAfterMount: false,
        isFetchingNextPage: false,
        isFetchingPreviousPage: false,
        fetchStatus: 'fetching',
        refetch: vi.fn(),
        status: 'loading',
      } as unknown as UseQueryResult;
    });

    vi.mocked(useVrackService).mockReturnValue({
      data: {
        currentState: {
          subnets: [{ serviceEndpoints: [{ managedServiceURN: 'urn:service:2' }] }],
          displayName: '',
          productStatus: 'ACTIVE' as VrackServicesProductStatus,
          vrackId: '',
          region: '',
        },
        checksum: '1234',
      } as VrackServicesWithIAM,
      error: null,
      isError: false,
      isPending: false,
      isLoading: false,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: true,
      status: 'success',
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: false,
      isFetchedAfterMount: false,
      isFetching: false,
      isInitialLoading: false,
      isPaused: false,
      isPlaceholderData: false,
      isRefetching: false,
      isStale: false,
      refetch: () => {
        throw new Error('Function not implemented.');
      },
      fetchStatus: 'fetching',
    });

    const { result } = renderHook(() =>
      useServiceList('test-vrack-id', {
        getIamResource: vi.fn(),
        getIamResourceQueryKey: getIamResourceQueryKeyMock,
      }),
    );
    await waitFor(() => {
      expect(result.current.serviceListResponse).toEqual(mockServiceListResponse);
      expect(result.current.iamResources).toEqual(mockIamResources);
    });
  });

  it('Should handle query errors correctly', async () => {
    vi.mocked(useQuery).mockImplementation((input): UseQueryResult => {
      if (
        input.queryKey.includes('get/vrackServices/resource/test-vrack-id/eligibleManagedService')
      ) {
        return {
          data: undefined,
          isLoading: false,
          isFetching: false,
          error: new Error('Service error'),
          isError: true,
          isFetched: true,
          isFetchedAfterMount: true,
          isFetchingNextPage: false,
          isFetchingPreviousPage: false,
          fetchStatus: 'idle',
          refetch: vi.fn(),
          status: 'error',
        } as unknown as UseQueryResult;
      }
      if (input.queryKey.includes('iam/resource/urn:service:2,urn:service:1')) {
        return {
          data: undefined,
          isLoading: false,
          isFetching: false,
          error: new Error('IAM error'),
          isError: true,
          isFetched: true,
          isFetchedAfterMount: true,
          isFetchingNextPage: false,
          isFetchingPreviousPage: false,
          fetchStatus: 'idle',
          refetch: vi.fn(),
          status: 'error',
        } as unknown as UseQueryResult;
      }

      return {
        data: undefined,
        isLoading: false,
        isFetching: false,
        error: null,
        isError: false,
        isFetched: false,
        isFetchedAfterMount: false,
        isFetchingNextPage: false,
        isFetchingPreviousPage: false,
        fetchStatus: 'idle',
        refetch: vi.fn(),
        status: 'idle',
      } as unknown as UseQueryResult;
    });

    vi.mocked(useVrackService).mockReturnValue({
      data: undefined,
      error: null,
      isError: false,
      isPending: true,
      isLoading: false,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: false,
      status: 'pending',
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: false,
      isFetchedAfterMount: false,
      isFetching: false,
      isInitialLoading: false,
      isPaused: false,
      isPlaceholderData: false,
      isRefetching: false,
      isStale: false,
      refetch: () => {
        throw new Error('Function not implemented.');
      },
      fetchStatus: 'fetching',
    });

    const { result } = renderHook(() =>
      useServiceList('test-vrack-id', {
        getIamResource: vi.fn(),
        getIamResourceQueryKey: getIamResourceQueryKeyMock,
      }),
    );
    await waitFor(() => {
      expect(result.current.serviceListError).toBeInstanceOf(Error);
    });
  });

  it('Should be in loading state when queries are in progress', () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      isError: false,
      isPending: true,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: false,
      status: 'pending',
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: undefined,
      errorUpdateCount: 0,
      isFetched: false,
      isFetchedAfterMount: false,
      isFetching: false,
      isInitialLoading: false,
      isPaused: false,
      isPlaceholderData: false,
      isRefetching: false,
      isStale: false,
      refetch: vi.fn(),
      fetchStatus: 'fetching',
    });

    vi.mocked(useVrackService).mockReturnValue({
      data: {
        currentState: {
          vrackId: 'vrack-id',
          displayName: '',
          productStatus: 'ACTIVE' as VrackServicesProductStatus,
          subnets: [],
          region: '',
        },
      } as unknown as VrackServicesWithIAM,
      error: null,
      isError: false,
      isLoading: false,
      isLoadingError: false,
      isRefetchError: false,
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      isFetched: false,
      isFetchedAfterMount: false,
      isFetching: true,
      isInitialLoading: false,
      isPaused: false,
      isPlaceholderData: false,
      isRefetching: false,
      isStale: false,
      refetch: vi.fn(),
      fetchStatus: 'fetching',
      isPending: false,
      isSuccess: true,
      status: 'success',
    });

    const { result } = renderHook(() =>
      useServiceList('test-vrack-id', {
        getIamResource: vi.fn(),
        getIamResourceQueryKey: getIamResourceQueryKeyMock,
      }),
    );

    expect(result.current.isServiceListLoading).toBe(true);
    expect(result.current.isIamResourcesLoading).toBe(true);
  });
});
