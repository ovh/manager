import { renderHook } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { vi } from 'vitest';
import { useServiceList } from './useServiceList';
import { useVrackService } from '../index';

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<Promise<any>>();
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

vi.mock('../index', async (importOriginal) => {
  const actual = await importOriginal<Promise<any>>();
  return {
    ...actual,
    useVrackService: vi.fn(),
  };
});

describe('useServiceList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // it('Should return services and IAM resources when they are loaded', async () => {
  //   const mockServiceListResponse = {
  //     data: [{ managedServiceURNs: ['urn:service:1'] }],
  //   };
  //   const mockIamResources = {
  //     data: [{ id: 'iam-1', name: 'IAM Resource 1' }],
  //   };
  //   const mockVrackService = {
  //     data: {
  //       currentState: {
  //         subnets: [
  //           { serviceEndpoints: [{ managedServiceURN: 'urn:service:2' }] },
  //         ],
  //       },
  //       checksum: '1234',
  //     },
  //   };

  //   vi.mocked(useQuery).mockImplementation(({ queryKey }: any) => {
  //     if (queryKey.includes('eligible-managed-service')) {
  //       return { data: mockServiceListResponse, isLoading: false, error: null };
  //     }
  //     if (queryKey.includes('iam-resource')) {
  //       return { data: mockIamResources, isLoading: false, error: null };
  //     }
  //     return { data: undefined, isLoading: false, error: null };
  //   });

  //   vi.mocked(useVrackService).mockReturnValue({
  //     data: {
  //       currentState: {
  //         subnets: [],
  //         displayName: '',
  //         productStatus: 'ACTIVE' as ProductStatus,
  //         vrackId: '',
  //         region: '',
  //       },
  //       checksum: '1234',
  //     } as VrackServicesWithIAM,
  //     error: undefined,
  //     isError: false,
  //     isPending: false,
  //     isLoading: false,
  //     isLoadingError: false,
  //     isRefetchError: false,
  //     isSuccess: true,
  //     status: 'success',
  //     dataUpdatedAt: 0,
  //     errorUpdatedAt: 0,
  //     failureCount: 0,
  //     failureReason: undefined,
  //     errorUpdateCount: 0,
  //     isFetched: false,
  //     isFetchedAfterMount: false,
  //     isFetching: false,
  //     isInitialLoading: false,
  //     isPaused: false,
  //     isPlaceholderData: false,
  //     isRefetching: false,
  //     isStale: false,
  //     refetch: () => {
  //       throw new Error('Function not implemented.');
  //     },
  //     fetchStatus: 'fetching',
  //   });

  //   const { result } = renderHook(() => useServiceList('test-vrack-id'));

  //   await waitFor(() => {
  //     expect(result.current.serviceListResponse).toEqual(
  //       mockServiceListResponse,
  //     );
  //     expect(result.current.iamResources).toEqual(mockIamResources);
  //   });
  // });

  // it('Should handle query errors correctly', async () => {
  //   vi.mocked(useQuery).mockImplementation((input) => {
  //     if (input.queryKey.includes('eligible-managed-service')) {
  //       return {
  //         data: undefined,
  //         isLoading: false,
  //         error: new Error('Service error'),
  //       };
  //     }
  //     if (input.queryKey.includes('iam-resource')) {
  //       return {
  //         data: undefined,
  //         isLoading: false,
  //         error: new Error('IAM error'),
  //       };
  //     }
  //     return { data: undefined, isLoading: false, error: null };
  //   });

  //   vi.mocked(useVrackService).mockReturnValue({
  //     data: null,
  //     error: undefined,
  //     isError: false,
  //     isPending: true,
  //     isLoading: false,
  //     isLoadingError: false,
  //     isRefetchError: false,
  //     isSuccess: false,
  //     status: 'pending',
  //     dataUpdatedAt: 0,
  //     errorUpdatedAt: 0,
  //     failureCount: 0,
  //     failureReason: undefined,
  //     errorUpdateCount: 0,
  //     isFetched: false,
  //     isFetchedAfterMount: false,
  //     isFetching: false,
  //     isInitialLoading: false,
  //     isPaused: false,
  //     isPlaceholderData: false,
  //     isRefetching: false,
  //     isStale: false,
  //     refetch: () => {
  //       throw new Error('Function not implemented.');
  //     },
  //     fetchStatus: 'fetching',
  //   });

  //   const { result } = renderHook(() => useServiceList('test-vrack-id'));

  //   await waitFor(() => {
  //     expect(result.current.serviceListError).toBeInstanceOf(Error);
  //     expect(result.current.iamResourcesError).toBeInstanceOf(Error);
  //   });
  // });

  it('Should be in loading state when queries are in progress', async () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      isError: false,
      isPending: true,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: false,
      status: null,
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
      refetch: () => {
        throw new Error('Function not implemented.');
      },
      fetchStatus: 'fetching',
    });

    vi.mocked(useVrackService).mockReturnValue({
      data: null,
      error: undefined,
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
      refetch: () => {
        throw new Error('Function not implemented.');
      },
      fetchStatus: 'fetching',
    });

    const { result } = renderHook(() => useServiceList('test-vrack-id'));

    expect(result.current.isServiceListLoading).toBe(true);
    expect(result.current.isIamResourcesLoading).toBe(true);
  });

  it('Should call `useQuery` with correct parameters', () => {
    renderHook(() => useServiceList('test-vrack-id'));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: expect.arrayContaining([
          'eligible-managed-service',
          'test-vrack-id',
        ]),
      }),
    );

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: expect.arrayContaining(['iam-resource']),
      }),
    );
  });
});
