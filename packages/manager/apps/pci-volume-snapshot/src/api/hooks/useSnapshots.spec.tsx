import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { Filter, FilterComparator } from '@ovh-ux/manager-core-api';
import * as reactQuery from '@tanstack/react-query';
import * as snapshotsData from '../data/snapshots';
import * as helpers from '@/helpers';

// Import the hooks after setting up the mocks
import {
  useAllSnapshots,
  useVolumeSnapshots,
  usePaginatedVolumeSnapshot,
} from './useSnapshots';

// Mock react-query before importing the components that use it
vi.mock('@tanstack/react-query', async () => {
  const actual = (await vi.importActual('@tanstack/react-query')) as Record<
    string,
    unknown
  >;
  return {
    ...actual,
    // useQuery: vi.fn(),
    // useQueries: vi.fn(),
  };
});

// Mock API functions
vi.mock('../data/snapshots', () => ({
  getSnapshots: vi.fn(),
  getVolume: vi.fn(),
}));

// Mock helpers
vi.mock('@/helpers', () => ({
  paginateResults: vi.fn(),
  sortResults: vi.fn(),
}));

// Sample data for testing
const mockSnapshots: snapshotsData.TSnapshot[] = [
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

const mockVolumes: Record<string, snapshotsData.TVolume> = {
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

// Create a wrapper with QueryClientProvider for testing hooks
const createWrapper = () => {
  const queryClient = new reactQuery.QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <reactQuery.QueryClientProvider client={queryClient}>
      {children}
    </reactQuery.QueryClientProvider>
  );
};

describe('useSnapshots hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks
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
      vi.spyOn(reactQuery, 'useQuery').mockReturnValueOnce({
        data: undefined,
        isLoading: false,
        isPending: false,
        error,
        fetchStatus: 'idle',
      } as any);

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
      vi.spyOn(reactQuery, 'useQuery').mockReturnValueOnce({
        data: [],
        isPending: false,
        isLoading: false,
        error: null,
      } as any);

      const volumeError = new Error('Failed to fetch volume');

      // Mock useQueries with an error
      vi.spyOn(reactQuery, 'useQueries').mockReturnValueOnce({
        isPending: false,
        isLoading: false,
        error: volumeError,
        data: [],
      } as any);

      const { result } = renderHook(() => useVolumeSnapshots('test-project'));

      // Should have error
      expect(result.current.error).toEqual(volumeError);
    });

    it('should deduplicate volume IDs when fetching volumes', async () => {
      // Mock useAllSnapshots
      vi.spyOn(reactQuery, 'useQuery').mockReturnValueOnce({
        data: mockSnapshots,
        isPending: false,
        isLoading: false,
        error: null,
      } as any);

      // We want to check uniqueVolumeIds here, so override useQueries to spy on queries parameter
      const queriesSpyOn = vi.spyOn(reactQuery, 'useQueries');
      queriesSpyOn.mockReturnValueOnce({
        isPending: false,
        isLoading: false,
        error: null,
        data: mockSnapshots.map((snapshot) => ({
          ...snapshot,
          volume: mockVolumes[snapshot.volumeId],
        })),
      } as any);

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
      vi.spyOn(reactQuery, 'useQuery').mockReturnValueOnce({
        isPending: false,
        isLoading: false,
        error: undefined,
        data: mockSnapshots,
      } as any);
      vi.spyOn(reactQuery, 'useQueries').mockReturnValueOnce({
        isPending: true,
        isLoading: true,
        error: testError,
        data: undefined,
      } as any);

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
});
