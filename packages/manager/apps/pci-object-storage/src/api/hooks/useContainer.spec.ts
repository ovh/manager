import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { getServerContainer, TServerContainer } from '@/api/data/container';
import { usePaginatedObjects, useServerContainer } from './useContainer';
import { wrapper } from '@/wrapperRenders';
import UseStandardInfrequentAccessAvailability from '@/hooks/useStandardInfrequentAccessAvailability';

vi.mock('@/api/data/container');

vi.mock('@/hooks/useFeatureAvailability', () => ({
  useFeatureAvailability: vi.fn(() => ({
    data: {
      'storage:standard-infrequent-access': true,
    },
  })),
}));

vi.mock('@/hooks/useStandardInfrequentAccessAvailability', () => ({
  default: vi.fn(() => true),
}));

vi.mock('@/constants', async () => {
  const actual = await vi.importActual('@/constants');
  return {
    ...actual,
    standardInfrequentAcess: 'storage:standard-infrequent-access',
  };
});

const mockProjectId = 'project-123';
const mockRegion = 'GRA';
const mockName = 'container-1';
const mockId = 'id-123';

describe('useContainer hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches container data successfully', async () => {
    vi.mocked(getServerContainer).mockResolvedValueOnce({
      id: mockId,
      name: mockName,
    } as TServerContainer);

    const { result } = renderHook(
      () => useServerContainer(mockProjectId, mockRegion, mockName, mockId),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ id: mockId, name: mockName });
    expect(getServerContainer).toHaveBeenCalledWith(
      mockProjectId,
      mockRegion,
      mockName,
      mockId,
    );
  });
});

describe('usePaginatedObjects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mock implementations
    vi.mocked(useFeatureAvailability).mockReturnValue({
      data: {
        'storage:standard-infrequent-access': true,
      },
      error: null,
      isError: false,
      isPending: false,
      isLoading: false,
      isLoadingError: false,
      isSuccess: true,
      status: 'success',
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isPlaceholderData: false,
      isRefetching: false,
      isStale: false,
      refetch: vi.fn(),
      isRefetchError: false,
      failureReason: null,
      errorUpdateCount: 0,
      isFetching: false,
      fetchStatus: 'idle',
      isInitialLoading: false,
      isPaused: false,
    });
    vi.mocked(UseStandardInfrequentAccessAvailability).mockReturnValue(true);
  });

  it('should return paginated and sorted objects of container', async () => {
    const mockData = ({
      id: '1',
      name: 'listener1',
      objects: [
        {
          id: '1',
          index: 0,
          name: 'object1',
          key: 'key',
          storageClass: 'storageClass',
          search:
            'key object1 pci_projects_project_storages_containers_container_storage_class_standard_infrequent_access_storageClass',
        },
      ],
    } as unknown) as TServerContainer;

    vi.mocked(getServerContainer).mockResolvedValue(mockData);

    const pagination = { pageIndex: 0, pageSize: 10 };
    const sorting = { id: 'name', desc: false };
    const filters = [];

    const { result } = renderHook(
      () =>
        usePaginatedObjects(
          mockProjectId,
          mockRegion,
          mockName,
          mockId,
          pagination,
          sorting,
          filters,
        ),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.allObjects?.length).toBe(1);
      expect(result.current.paginatedObjects).toEqual({
        rows: mockData.objects,
        pageCount: 1,
        totalRows: 1,
      });
    });
  });
});
