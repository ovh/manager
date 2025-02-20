import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as archiveApi from '@/api/data/archive';
import queryClient from '@/queryClient';
import { wrapper } from '@/wrapperRenders';
import {
  invalidateGetArchivesCache,
  useAddUser,
  useArchiveRegion,
  useArchives,
  useCreateContainer,
  useDeleteArchive,
  useFlushArchive,
  useGetArchiveByName,
  usePaginatedArchive,
  useRestoreArchive,
  useStartArchive,
} from './useArchive';
import * as useRegionsModule from './useRegions';

vi.mock('@/api/data/archive');

vi.mock('@/queryClient', () => ({
  default: {
    invalidateQueries: vi.fn(),
  },
}));

vi.mock('./useRegions', () => ({
  useProductRegionsAvailability: vi.fn(),
}));

const mockProjectId = 'project-123';
const mockRegion = 'GRA';
const mockArchives = [
  { name: 'archive1', status: 'active' },
  { name: 'archive2', status: 'inactive' },
] as archiveApi.TArchiveContainer[];

describe('Archive Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useRegionsModule.useProductRegionsAvailability).mockReturnValue({
      data: [mockRegion],
      isLoading: false,
      error: null,
    } as ReturnType<typeof useRegionsModule.useProductRegionsAvailability>);

    vi.mocked(archiveApi.getArchiveContainers).mockResolvedValue(mockArchives);
  });

  describe('useArchiveRegion', () => {
    it('should return the first available region', () => {
      const { result } = renderHook(() => useArchiveRegion(), { wrapper });
      expect(result.current).toBe(mockRegion);
    });
  });

  describe('useArchives', () => {
    it('should fetch archives for a project and region', async () => {
      const { result } = renderHook(() => useArchives(mockProjectId), {
        wrapper,
      });

      await waitFor(() => expect(result.current.data).toEqual(mockArchives));

      expect(archiveApi.getArchiveContainers).toHaveBeenCalledWith(
        mockProjectId,
        mockRegion,
      );
    });
  });

  describe('useGetArchiveByName', () => {
    it('should return archive with the specified name', async () => {
      const { result } = renderHook(
        () => useGetArchiveByName(mockProjectId, 'archive1'),
        { wrapper },
      );

      await waitFor(() => expect(result.current).toEqual(mockArchives[0]));
    });

    it('should return undefined if archive not found', async () => {
      const { result } = renderHook(
        () => useGetArchiveByName(mockProjectId, 'nonexistent'),
        { wrapper },
      );

      await waitFor(() => expect(result.current).toBeUndefined());
    });
  });

  describe('usePaginatedArchive', () => {
    it('should return paginated and sorted archives', async () => {
      const pagination = { pageIndex: 0, pageSize: 10 };
      const sorting = { id: 'name', desc: false };
      const filters = [];

      const { result } = renderHook(
        () =>
          usePaginatedArchive(
            mockProjectId,
            mockRegion,
            pagination,
            sorting,
            filters,
          ),
        { wrapper },
      );

      await waitFor(() =>
        expect(result.current.allArchives).toEqual(mockArchives),
      );

      expect(result.current.paginatedArchives.rows).toEqual(mockArchives);
    });
  });

  describe('useDeleteArchive', () => {
    it('should call deleteArchive API and invalidate cache on success', async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();

      vi.mocked(archiveApi.deleteArchive).mockResolvedValue({});

      const { result } = renderHook(
        () =>
          useDeleteArchive({ projectId: mockProjectId, onSuccess, onError }),
        { wrapper },
      );

      result.current.deleteArchive('archive1');

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());

      expect(archiveApi.deleteArchive).toHaveBeenCalledWith({
        projectId: mockProjectId,
        region: mockRegion,
        name: 'archive1',
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalled();
    });
  });

  describe('useRestoreArchive', () => {
    it('should call restoreArchive API and invalidate cache on success', async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();

      vi.mocked(archiveApi.restoreArchive).mockResolvedValue({});

      const { result } = renderHook(
        () =>
          useRestoreArchive({ projectId: mockProjectId, onSuccess, onError }),
        { wrapper },
      );

      result.current.restoreArchive('archive1');

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());

      expect(archiveApi.restoreArchive).toHaveBeenCalledWith({
        projectId: mockProjectId,
        region: mockRegion,
        name: 'archive1',
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalled();
    });
  });

  describe('useAddUser', () => {
    it('should call addUserToContainer API and invalidate cache on success', async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();
      const mockStorageId = 'storage-123';
      const mockUserId = 456;
      const mockRole = 'admin';

      vi.mocked(archiveApi.addUserToContainer).mockResolvedValue({});

      const { result } = renderHook(
        () =>
          useAddUser({
            projectId: mockProjectId,
            storageId: mockStorageId,
            userId: mockUserId,
            role: mockRole,
            onSuccess,
            onError,
          }),
        { wrapper },
      );

      result.current.addUser();

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());

      expect(archiveApi.addUserToContainer).toHaveBeenCalledWith({
        projectId: mockProjectId,
        region: mockRegion,
        storageId: mockStorageId,
        userId: mockUserId,
        role: mockRole,
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalled();
    });
  });

  describe('useStartArchive', () => {
    it('should call startArchive API and invalidate cache on success', async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();
      const mockName = 'archive1';
      const mockLockedUntilDays = 30;

      vi.mocked(archiveApi.startArchive).mockResolvedValue({});

      const { result } = renderHook(
        () => useStartArchive({ projectId: mockProjectId, onSuccess, onError }),
        { wrapper },
      );

      result.current.startArchive({
        name: mockName,
        lockedUntilDays: mockLockedUntilDays,
      });

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());

      expect(archiveApi.startArchive).toHaveBeenCalledWith({
        projectId: mockProjectId,
        region: mockRegion,
        name: mockName,
        lockedUntilDays: mockLockedUntilDays,
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalled();
    });
  });

  describe('useFlushArchive', () => {
    it('should call flushArchive API and invalidate cache on success', async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();

      vi.mocked(archiveApi.flushArchive).mockResolvedValue({});

      const { result } = renderHook(
        () => useFlushArchive({ projectId: mockProjectId, onSuccess, onError }),
        { wrapper },
      );

      result.current.flushArchive('archive1');

      await waitFor(() => expect(onSuccess).toHaveBeenCalled());

      expect(archiveApi.flushArchive).toHaveBeenCalledWith({
        projectId: mockProjectId,
        region: mockRegion,
        name: 'archive1',
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalled();
    });
  });

  describe('useCreateContainer', () => {
    it('should call createArchiveContainer API and invalidate cache on success', async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();
      const mockContainer = { name: 'newArchive', ownerId: 456 };
      const mockResponse = { id: '3', ...mockContainer, status: 'created' };

      vi.mocked(archiveApi.createArchiveContainer).mockResolvedValue(
        mockResponse,
      );

      const { result } = renderHook(
        () =>
          useCreateContainer({ projectId: mockProjectId, onSuccess, onError }),
        { wrapper },
      );

      result.current.createContainer(mockContainer);

      await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(mockResponse));

      expect(archiveApi.createArchiveContainer).toHaveBeenCalledWith({
        projectId: mockProjectId,
        region: mockRegion,
        ...mockContainer,
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalled();
    });
  });

  describe('invalidateGetArchivesCache', () => {
    it('should call queryClient.invalidateQueries with the correct cache key', () => {
      invalidateGetArchivesCache(mockProjectId, mockRegion);

      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: [mockProjectId, mockRegion, 'allArchives'],
      });
    });
  });
});
