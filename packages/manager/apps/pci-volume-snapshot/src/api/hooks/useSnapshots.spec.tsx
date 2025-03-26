import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, render } from '@testing-library/react';
import { Filter, FilterComparator } from '@ovh-ux/manager-core-api';
import * as reactQuery from '@tanstack/react-query';
import * as snapshotsData from '../data/snapshots';
import * as helpers from '@/helpers';
import { TSnapshot, TVolume } from '../api.types';
import {
  useAllSnapshots,
  useVolumeSnapshots,
  usePaginatedVolumeSnapshot,
  useVolumeSnapshot,
  useDeleteSnapshot,
} from './useSnapshots';
import * as queryClient from '@/queryClient';
import { createWrapper } from '@/wrapperRenders';

// Mock react-query before importing the components that use it
vi.mock('@tanstack/react-query', async () => {
  const actual = (await vi.importActual('@tanstack/react-query')) as Record<
    string,
    unknown
  >;
  return {
    ...actual,
  };
});

// Mock API functions
vi.mock('../data/snapshots', () => ({
  getSnapshots: vi.fn(),
  getVolume: vi.fn(),
  getSnapshot: vi.fn(),
  deleteSnapshot: vi.fn(),
}));

// Mock helpers
vi.mock('@/helpers', () => ({
  paginateResults: vi.fn(),
  sortResults: vi.fn(),
}));

// Mock invalidateQueries function
vi.mock('@/queryClient', async () => {
  const actual = (await vi.importActual('@/queryClient')) as Record<
    string,
    unknown
  >;
  return {
    ...actual,
    default: {
      invalidateQueries: vi.fn(),
    },
  };
});

// Sample data for testing
const mockSnapshots: TSnapshot[] = [
  {
    id: 'snap-1',
    creationDate: '2023-01-01T00:00:00Z',
    name: 'Snapshot 1',
    description: 'Test snapshot 1',
    size: 20,
    volumeId: 'vol-1',
    region: 'us-east-1',
    status: 'available',
    planCode: 'snapshot.standard',
  },
  {
    id: 'snap-2',
    creationDate: '2023-01-02T00:00:00Z',
    name: 'Snapshot 2',
    description: 'Test snapshot 2',
    size: 30,
    volumeId: 'vol-2',
    region: 'us-west-1',
    status: 'creating',
    planCode: 'snapshot.standard',
  },
  {
    id: 'snap-3',
    creationDate: '2023-01-03T00:00:00Z',
    name: 'Snapshot 3',
    description: 'Test snapshot 3',
    size: 40,
    volumeId: 'vol-1', // Same volume as snap-1
    region: 'eu-west-1',
    status: 'available',
    planCode: 'snapshot.premium',
  },
];

const mockSnapshot: TSnapshot = {
  id: 'snap-1',
  volumeId: 'vol-1',
  name: 'Test Snapshot',
  creationDate: '2023-01-01T00:00:00Z',
  description: 'Test snapshot',
  size: 20,
  region: 'us-east-1',
  status: 'available',
  planCode: 'snapshot.standard',
};

const mockVolumes: Record<string, TVolume> = {
  'vol-1': {
    id: 'vol-1',
    attachedTo: ['instance-1'],
    creationDate: '2022-12-01T00:00:00Z',
    name: 'Volume 1',
    description: 'Test volume 1',
    size: 20,
    status: 'in-use',
    region: 'us-east-1',
    bootable: false,
    planCode: 'volume.standard',
    availabilityZone: 'us-east-1a',
    type: 'classic',
  },
  'vol-2': {
    id: 'vol-2',
    attachedTo: [],
    creationDate: '2022-12-02T00:00:00Z',
    name: 'Volume 2',
    description: 'Test volume 2',
    size: 30,
    status: 'available',
    region: 'us-west-1',
    bootable: true,
    planCode: 'volume.high-speed',
    availabilityZone: 'us-west-1b',
    type: 'high-speed',
  },
};

describe('useSnapshots hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mocks
    vi.mocked(snapshotsData.getSnapshot).mockResolvedValue(mockSnapshot);
    vi.mocked(snapshotsData.getSnapshots).mockResolvedValue(mockSnapshots);
    vi.mocked(
      snapshotsData.getVolume,
    ).mockImplementation((_projectId, volumeId) =>
      Promise.resolve(mockVolumes[volumeId]),
    );

    // Default helpers mocks
    vi.mocked(helpers.sortResults).mockImplementation((data) => data);
    vi.mocked(helpers.paginateResults).mockImplementation((data) => ({
      rows: data,
      totalRows: data.length,
      pageCount: Math.ceil(data.length / 10),
    }));
  });

  describe('useAllSnapshots', () => {
    it('should fetch snapshots from the API', async () => {
      const { result } = renderHook(() => useAllSnapshots('test-project'), {
        wrapper: createWrapper(),
      });

      // Initially should be in loading state
      expect(result.current.isLoading).toBe(true);

      // Wait for the query to resolve
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // Should have snapshots data
      expect(result.current.data).toEqual(mockSnapshots);
      expect(snapshotsData.getSnapshots).toHaveBeenCalledWith('test-project');
    });

    it('should handle API errors', async () => {
      const error = new Error('Failed to fetch snapshots');

      // Setup the useQuery mock to return an error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn(reactQuery, 'useQuery').mockReturnValueOnce({
        data: undefined,
        isLoading: false,
        isPending: false,
        error,
        fetchStatus: 'idle',
      } as reactQuery.QueryObserverLoadingErrorResult<unknown, unknown>);

      const { result } = renderHook(() => useAllSnapshots('test-project'));

      expect(result.current.error).toEqual(error);
      expect(result.current.data).toBeUndefined();
    });

    it('should not fetch if projectId is empty', async () => {
      renderHook(() => useAllSnapshots(''), {
        wrapper: createWrapper(),
      });

      // Check that enabled option is false when projectId is empty
      expect(reactQuery.useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: false,
        }),
      );
    });
  });

  describe('useVolumeSnapshots', () => {
    it('should fetch snapshots and corresponding volumes', async () => {
      const { result } = renderHook(() => useVolumeSnapshots('test-project'), {
        wrapper: createWrapper(),
      });

      // Initially should be in loading state
      expect(result.current.isLoading).toBe(true);

      // Wait for the query to resolve
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // Verify results are correct
      // Verify correct length
      expect(result.current.data).toHaveLength(mockSnapshots.length);

      // Verify all snapshot-volume mappings are correct
      expect(result.current.data[0].id).toBe('snap-1');
      expect(result.current.data[0].volume).toEqual(mockVolumes['vol-1']);

      expect(result.current.data[1].id).toBe('snap-2');
      expect(result.current.data[1].volume).toEqual(mockVolumes['vol-2']);

      expect(result.current.data[2].id).toBe('snap-3');
      expect(result.current.data[2].volume).toEqual(mockVolumes['vol-1']);

      // Verify loading state
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeUndefined();
    });

    it('should handle volume fetch errors', async () => {
      // Mock useAllSnapshots
      vi.spyOn(reactQuery, 'useQuery').mockReturnValueOnce(({
        data: [],
        isPending: false,
        isLoading: false,
        error: null,
      } as unknown) as reactQuery.QueryObserverLoadingErrorResult<unknown, unknown>);

      const volumeError = new Error('Failed to fetch volume');

      // Mock useQueries with an error
      vi.spyOn(reactQuery, 'useQueries').mockReturnValueOnce(({
        isPending: false,
        isLoading: false,
        error: volumeError,
        data: [],
      } as unknown) as reactQuery.QueryObserverLoadingErrorResult<unknown, unknown>);

      const { result } = renderHook(() => useVolumeSnapshots('test-project'));

      // Should have error
      expect(result.current.error).toEqual(volumeError);
    });

    it('should deduplicate volume IDs when fetching volumes', async () => {
      // Mock useAllSnapshots
      vi.spyOn(reactQuery, 'useQuery').mockReturnValueOnce(({
        data: mockSnapshots,
        isPending: false,
        isLoading: false,
        error: null,
      } as unknown) as reactQuery.QueryObserverLoadingErrorResult<unknown, unknown>);

      // We want to check uniqueVolumeIds here, so override useQueries to spy on queries parameter
      const queriesSpyOn = vi.spyOn(reactQuery, 'useQueries');
      queriesSpyOn.mockReturnValueOnce(({
        isPending: false,
        isLoading: false,
        error: null,
        data: mockSnapshots.map((snapshot) => ({
          ...snapshot,
          volume: mockVolumes[snapshot.volumeId],
        })),
      } as unknown) as reactQuery.QueryObserverLoadingErrorResult<unknown, unknown>);

      renderHook(() => useVolumeSnapshots('test-project'));

      // Get the queries passed to useQueries
      const queriesArg = queriesSpyOn.mock.calls[0][0].queries;

      // Extract volumeIds from the queries
      const volumeIds = queriesArg.map((query) => {
        const { queryKey } = query;
        return queryKey[3]; // The fourth element in the queryKey should be the volumeId
      });

      // Should only have unique volume IDs (vol-1 and vol-2)
      expect(volumeIds).toEqual(['vol-1', 'vol-2']);
      expect(volumeIds.length).toBe(2); // Not 3, because vol-1 is used twice in mockSnapshots
    });
  });

  describe('usePaginatedVolumeSnapshot', () => {
    it('should apply pagination, sorting, and filtering', async () => {
      // Set up parameters
      const pagination = { pageIndex: 0, pageSize: 10 };
      const sorting = { id: 'creationDate', desc: true };
      const filters = [
        {
          key: 'status',
          value: 'available',
          comparator: FilterComparator.IsEqual,
          label: 'Status',
        },
      ];

      // Mock filtered data
      const filteredData = mockSnapshots.filter(
        (snap) => snap.status === 'available',
      );
      vi.mocked(helpers.sortResults).mockReturnValue(filteredData);

      const paginatedData = {
        rows: filteredData,
        totalRows: filteredData.length,
        pageCount: 1,
      };
      vi.mocked(helpers.paginateResults).mockReturnValue(paginatedData);

      const { result } = renderHook(
        () =>
          usePaginatedVolumeSnapshot(
            'test-project',
            pagination,
            sorting,
            filters,
          ),
        { wrapper: createWrapper() },
      );

      // Should return the paginated result
      expect(result.current.paginatedSnapshots).toEqual(paginatedData);
    });

    it('should handle empty data', async () => {
      // Set up parameters
      const pagination = { pageIndex: 0, pageSize: 10 };
      const sorting = { id: 'creationDate', desc: true };
      const filters: Filter[] = [];

      // Mock the helpers for empty data
      vi.mocked(helpers.sortResults).mockReturnValue([]);
      vi.mocked(helpers.paginateResults).mockReturnValue({
        rows: [],
        totalRows: 0,
        pageCount: 0,
      });

      const { result } = renderHook(
        () =>
          usePaginatedVolumeSnapshot(
            'test-project',
            pagination,
            sorting,
            filters,
          ),
        { wrapper: createWrapper() },
      );

      // Should still work with empty data
      expect(result.current.paginatedSnapshots).toEqual({
        rows: [],
        totalRows: 0,
        pageCount: 0,
      });
    });

    it('should react to changes in pagination', async () => {
      // Set up initial parameters
      const initialPagination = { pageIndex: 0, pageSize: 2 };
      const sorting = { id: 'creationDate', desc: true };
      const filters: Filter[] = [];

      // First page result
      const firstPageResult = {
        rows: mockSnapshots.slice(0, 2),
        totalRows: mockSnapshots.length,
        pageCount: 2,
      };
      vi.mocked(helpers.paginateResults).mockReturnValueOnce(firstPageResult);

      const { result, rerender } = renderHook(
        ({ pagination }) =>
          usePaginatedVolumeSnapshot(
            'test-project',
            pagination,
            sorting,
            filters,
          ),
        {
          initialProps: { pagination: initialPagination },
          wrapper: createWrapper(),
        },
      );

      // Should have first page result
      expect(result.current.paginatedSnapshots).toEqual(firstPageResult);

      // Second page result
      const secondPageResult = {
        rows: mockSnapshots.slice(2),
        totalRows: mockSnapshots.length,
        pageCount: 2,
      };
      vi.mocked(helpers.paginateResults).mockReturnValueOnce(secondPageResult);

      // Change to second page
      rerender({ pagination: { pageIndex: 1, pageSize: 2 } });

      // Should have second page result
      expect(result.current.paginatedSnapshots).toEqual(secondPageResult);
      expect(helpers.paginateResults).toHaveBeenCalledTimes(2);
    });

    it('should pass loading and error states from useVolumeSnapshots', async () => {
      // Mock useVolumeSnapshots in loading state with error
      const testError = new Error('Test error');
      vi.spyOn(reactQuery, 'useQuery').mockReturnValueOnce(({
        isPending: false,
        isLoading: false,
        error: undefined,
        data: mockSnapshots,
      } as unknown) as reactQuery.QueryObserverLoadingErrorResult<unknown, unknown>);
      vi.spyOn(reactQuery, 'useQueries').mockReturnValueOnce(({
        isPending: true,
        isLoading: true,
        error: testError,
        data: undefined,
      } as unknown) as reactQuery.QueryObserverLoadingErrorResult<unknown, unknown>);

      // Set up parameters
      const pagination = { pageIndex: 0, pageSize: 10 };
      const sorting = { id: 'creationDate', desc: true };
      const filters: Filter[] = [];

      // Mock helpers for empty data
      vi.mocked(helpers.sortResults).mockReturnValue([]);
      vi.mocked(helpers.paginateResults).mockReturnValue({
        rows: [],
        totalRows: 0,
        pageCount: 0,
      });

      const { result } = renderHook(() =>
        usePaginatedVolumeSnapshot(
          'test-project',
          pagination,
          sorting,
          filters,
        ),
      );

      // Should propagate loading and error states
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isPending).toBe(true);
      expect(result.current.error).toBe(testError);

      // Should still have empty result structure
      expect(result.current.paginatedSnapshots).toEqual({
        rows: [],
        totalRows: 0,
        pageCount: 0,
      });
    });
  });

  describe('useVolumeSnapshot', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should fetch snapshot and volume data successfully', async () => {
      // Render the hook
      const { result } = renderHook(
        () => useVolumeSnapshot('test-project', 'snap-1'),
        { wrapper: createWrapper() },
      );

      // Initially should be in loading state
      expect(result.current.isLoading).toBe(true);

      // Wait for the query to resolve
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Verify API calls
      expect(snapshotsData.getSnapshot).toHaveBeenCalledWith(
        'test-project',
        'snap-1',
      );
      expect(snapshotsData.getVolume).toHaveBeenCalledWith(
        'test-project',
        'vol-1',
      );

      // Verify returned data
      expect(result.current.data).toEqual({
        ...mockSnapshot,
        volume: mockVolumes['vol-1'],
      });
    });

    it('should handle error when snapshot fetch fails', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => undefined);

      // Setup error response
      const error = new Error('Failed to fetch snapshot');
      vi.mocked(snapshotsData.getSnapshot).mockRejectedValue(error);

      function Page() {
        const { status } = useVolumeSnapshot('test-project', 'snap-1');

        return <div>{status}</div>;
      }

      const Wrapper = createWrapper();

      const rendered = render(
        <Wrapper>
          <Page />
        </Wrapper>,
      );

      await waitFor(() => rendered.getByText('error boundary'));
    });

    it('should be in loading state initially', async () => {
      // Setup delayed resolution
      vi.mocked(snapshotsData.getSnapshot).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  id: 'snap-1',
                  volumeId: 'vol-1',
                  creationDate: '2023-01-01T00:00:00Z',
                  name: 'Test Snapshot',
                  description: 'Test snapshot',
                  size: 20,
                  region: 'us-east-1',
                  status: 'available',
                  planCode: 'snapshot.standard',
                }),
              1000,
            ),
          ),
      );

      // Render the hook
      const { result } = renderHook(
        () => useVolumeSnapshot('test-project', 'snap-1'),
        { wrapper: createWrapper() },
      );

      // Verify loading state
      expect(result.current.isLoading).toBe(true);
    });

    it('should propagate error from volume fetch', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => undefined);

      const volumeError = new Error('Failed to fetch volume');
      vi.mocked(snapshotsData.getVolume).mockRejectedValue(volumeError);

      // Setup error response
      const error = new Error('Failed to fetch snapshot');
      vi.mocked(snapshotsData.getSnapshot).mockRejectedValue(error);

      function Page() {
        const { status } = useVolumeSnapshot('test-project', 'snap-1');

        return <div>{status}</div>;
      }

      const Wrapper = createWrapper();

      const rendered = render(
        <Wrapper>
          <Page />
        </Wrapper>,
      );

      await waitFor(() => rendered.getByText('error boundary'));
    });
  });

  describe('useDeleteSnapshot', () => {
    beforeEach(() => {
      vi.clearAllMocks();

      // Default mock implementation for deleteSnapshot
      vi.mocked(snapshotsData.deleteSnapshot).mockResolvedValue(undefined);
    });

    it('should call deleteSnapshot with correct parameters', async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();

      const { result } = renderHook(
        () =>
          useDeleteSnapshot({
            projectId: 'test-project',
            onSuccess,
            onError,
          }),
        { wrapper: createWrapper() },
      );

      // Call deleteSnapshot function
      result.current.deleteSnapshot('snap-1');

      // Verify deleteSnapshot was called with correct params
      await waitFor(() =>
        expect(snapshotsData.deleteSnapshot).toHaveBeenCalledWith(
          'test-project',
          'snap-1',
        ),
      );
    });

    it('should invalidate cache and call onSuccess when deletion is successful', async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();

      const { result } = renderHook(
        () =>
          useDeleteSnapshot({
            projectId: 'test-project',
            onSuccess,
            onError,
          }),
        { wrapper: createWrapper() },
      );

      // Call deleteSnapshot function
      result.current.deleteSnapshot('snap-1');

      // Wait for the mutation to complete
      await waitFor(() => expect(result.current.isPending).toBe(false));

      // Verify cache invalidation was called
      expect(queryClient.default.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['snapshots', 'test-project'],
      });

      // Verify onSuccess callback was called
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onError).not.toHaveBeenCalled();
    });

    it('should call onError when deletion fails', async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();
      const error = new Error('Failed to delete snapshot');

      // Mock deleteSnapshot to reject with error
      vi.mocked(snapshotsData.deleteSnapshot).mockRejectedValue(error);

      const { result } = renderHook(
        () =>
          useDeleteSnapshot({
            projectId: 'test-project',
            onSuccess,
            onError,
          }),
        { wrapper: createWrapper() },
      );

      // Call deleteSnapshot function
      result.current.deleteSnapshot('snap-1');

      // Wait for the mutation to complete with error
      await waitFor(() => expect(result.current.isError).toBe(true));

      // Verify onError callback was called with the error
      expect(onError).toHaveBeenCalledWith(error, 'snap-1', undefined);
      expect(onSuccess).not.toHaveBeenCalled();

      // Verify cache invalidation was NOT called
      expect(queryClient.default.invalidateQueries).not.toHaveBeenCalled();
    });

    it('should return isLoading state during deletion', async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();

      // Create a delayed resolution for deleteSnapshot
      vi.mocked(snapshotsData.deleteSnapshot).mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve(undefined), 100)),
      );

      const { result } = renderHook(
        () =>
          useDeleteSnapshot({
            projectId: 'test-project',
            onSuccess,
            onError,
          }),
        { wrapper: createWrapper() },
      );

      // Verify initial state
      await waitFor(() => expect(result.current.isPending).toBe(false));

      // Call deleteSnapshot function
      result.current.deleteSnapshot('snap-1');

      // Verify loading state during deletion
      await waitFor(() => expect(result.current.isPending).toBe(true));
    });
  });
});
