import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createVolumeBackup,
  createVolumeSnapshot,
  deleteBackup,
  getVolumeBackups,
  restoreVolume,
} from '@/data/api/volumeBackup';
import { createWrapper } from '@/wrapperRenders';
import { TVolumeStatus } from '../api/api.types';
import {
  useBackup,
  useBackups,
  useCreateVolumeBackup,
  useCreateVolumeSnapshot,
  useDeleteBackup,
  useRestoreVolume,
} from './useVolumeBackup';

vi.mock('@/data/api/volumeBackup', () => ({
  getVolumeBackups: vi.fn(),
  restoreVolume: vi.fn(),
  deleteBackup: vi.fn(),
  createVolumeBackup: vi.fn(),
  createVolumeSnapshot: vi.fn(),
}));

describe('volumeBackup hooks', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('useBackups', () => {
    it('should return undefined when projectId is undefined', async () => {
      const { result } = renderHook(() => useBackups(undefined), {
        wrapper: createWrapper(),
      });

      expect(result.current.data).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
    });

    it('should fetch backups when projectId is provided', async () => {
      const mockBackups = {
        data: [
          { id: 'backup1', volumeId: 'vol1' },
          { id: 'backup2', volumeId: 'vol2' },
        ],
      };

      const mockGetVolumeBackups = vi.fn().mockResolvedValue(mockBackups);
      vi.mocked(getVolumeBackups).mockReturnValue(mockGetVolumeBackups);

      const { result } = renderHook(() => useBackups('project1'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockBackups);
      expect(getVolumeBackups).toHaveBeenCalledWith('project1');
    });
  });

  describe('useBackup', () => {
    it('should return the specific backup for the given volumeId', async () => {
      const mockBackups = {
        data: [
          { id: 'backup1', volumeId: 'vol1' },
          { id: 'backup2', volumeId: 'vol2' },
        ],
      };

      const mockGetVolumeBackups = vi.fn().mockResolvedValue(mockBackups);
      vi.mocked(getVolumeBackups).mockReturnValue(mockGetVolumeBackups);

      const { result } = renderHook(
        () => useBackup({ projectId: 'project1', volumeId: 'vol1' }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual({ id: 'backup1', volumeId: 'vol1' });
    });

    it('should return undefined when no backup matches the volumeId', async () => {
      const mockBackups = {
        data: [
          { id: 'backup1', volumeId: 'vol1' },
          { id: 'backup2', volumeId: 'vol2' },
        ],
      };

      const mockGetVolumeBackups = vi.fn().mockResolvedValue(mockBackups);
      vi.mocked(getVolumeBackups).mockReturnValue(mockGetVolumeBackups);

      const { result } = renderHook(
        () => useBackup({ projectId: 'project1', volumeId: 'vol3' }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBeUndefined();
    });
  });

  describe('useRestoreVolume', () => {
    it('should restore a volume on success', async () => {
      const onSuccessMock = vi.fn();
      const onErrorMock = vi.fn();
      vi.mocked(restoreVolume).mockResolvedValue({ status: 'success' });

      const { result } = renderHook(
        () =>
          useRestoreVolume({
            projectId: 'project1',
            regionName: 'region1',
            onSuccess: onSuccessMock,
            onError: onErrorMock,
          }),
        { wrapper: createWrapper() },
      );

      result.current.restoreVolume({
        volumeId: 'vol1',
        backupId: 'backup1',
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(restoreVolume).toHaveBeenCalledWith({
        projectId: 'project1',
        regionName: 'region1',
        volumeId: 'vol1',
        backupId: 'backup1',
      });

      expect(onSuccessMock).toHaveBeenCalled();
      expect(onErrorMock).not.toHaveBeenCalled();
    });

    it('should call onError when restore fails', async () => {
      const errorMessage = 'Failed to restore volume';
      const error = new Error(errorMessage);
      const onSuccessMock = vi.fn();
      const onErrorMock = vi.fn();
      vi.mocked(restoreVolume).mockRejectedValue(error);

      const { result } = renderHook(
        () =>
          useRestoreVolume({
            projectId: 'project1',
            regionName: 'region1',
            onSuccess: onSuccessMock,
            onError: onErrorMock,
          }),
        { wrapper: createWrapper() },
      );

      result.current.restoreVolume({
        volumeId: 'vol1',
        backupId: 'backup1',
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe(errorMessage);
      expect(onSuccessMock).not.toHaveBeenCalled();
    });
  });

  describe('useDeleteBackup', () => {
    it('should delete a backup on success', async () => {
      const onSuccessMock = vi.fn();
      const onErrorMock = vi.fn();
      vi.mocked(deleteBackup).mockResolvedValue();

      const { result } = renderHook(
        () =>
          useDeleteBackup({
            projectId: 'project1',
            regionName: 'region1',
            onSuccess: onSuccessMock,
            onError: onErrorMock,
          }),
        { wrapper: createWrapper() },
      );

      result.current.deleteBackup('backup1');

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(deleteBackup).toHaveBeenCalledWith({
        projectId: 'project1',
        regionName: 'region1',
        backupId: 'backup1',
      });

      expect(onSuccessMock).toHaveBeenCalled();
      expect(onErrorMock).not.toHaveBeenCalled();
    });

    it('should call onError when delete fails', async () => {
      const errorMessage = 'Failed to delete backup';
      const error = new Error(errorMessage);
      const onSuccessMock = vi.fn();
      const onErrorMock = vi.fn();
      vi.mocked(deleteBackup).mockRejectedValue(error);

      const { result } = renderHook(
        () =>
          useDeleteBackup({
            projectId: 'project1',
            regionName: 'region1',
            onSuccess: onSuccessMock,
            onError: onErrorMock,
          }),
        { wrapper: createWrapper() },
      );

      result.current.deleteBackup('backup1');

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe(errorMessage);
      expect(onSuccessMock).not.toHaveBeenCalled();
    });
  });

  describe('useCreateVolumeBackup', () => {
    it('should create a backup on success', async () => {
      const onSuccessMock = vi.fn();
      const onErrorMock = vi.fn();
      vi.mocked(createVolumeBackup).mockResolvedValue({
        id: 'new-volume-backup-id',
        name: 'new-volume-backup-name',
        region: '',
        volumeId: 'volume-id',
        creationDate: '2025-05-07T09:03:57.411969325Z',
        status: 'creating' as TVolumeStatus,
        size: 10,
      });

      const { result } = renderHook(
        () =>
          useCreateVolumeBackup({
            projectId: 'project1',
            onSuccess: onSuccessMock,
            onError: onErrorMock,
          }),
        { wrapper: createWrapper() },
      );

      result.current.createVolumeBackup({
        volumeId: 'vol1',
        regionName: 'region1',
        backupName: 'My Backup',
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(createVolumeBackup).toHaveBeenCalledWith(
        'project1',
        'vol1',
        'region1',
        'My Backup',
      );

      expect(onSuccessMock).toHaveBeenCalled();
      expect(onErrorMock).not.toHaveBeenCalled();
    });

    it('should call onError when create backup fails', async () => {
      const errorMessage = 'Failed to create backup';
      const error = new Error(errorMessage);
      const onSuccessMock = vi.fn();
      const onErrorMock = vi.fn();
      vi.mocked(createVolumeBackup).mockRejectedValue(error);

      const { result } = renderHook(
        () =>
          useCreateVolumeBackup({
            projectId: 'project1',
            onSuccess: onSuccessMock,
            onError: onErrorMock,
          }),
        { wrapper: createWrapper() },
      );

      result.current.createVolumeBackup({
        volumeId: 'vol1',
        regionName: 'region1',
        backupName: 'My Backup',
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe(errorMessage);
      expect(onSuccessMock).not.toHaveBeenCalled();
    });
  });

  describe('useCreateVolumeSnapshot', () => {
    it('should create a snapshot successfully', async () => {
      vi.mocked(createVolumeSnapshot).mockResolvedValue({
        id: 'volume-snapshot-id',
        creationDate: '2025-05-07T09:08:54.338805Z',
        name: 'volume-snapshot-name',
        size: 10,
        volumeId: '6423d077-1211-404e-9f75-00787c06a928',
        region: 'region',
        status: 'creating',
      });

      const onSuccessMock = vi.fn();
      const onErrorMock = vi.fn();

      const { result } = renderHook(
        () =>
          useCreateVolumeSnapshot({
            projectId: 'project1',
            onSuccess: onSuccessMock,
            onError: onErrorMock,
          }),
        { wrapper: createWrapper() },
      );

      result.current.createVolumeSnapshot({
        volumeId: 'vol1',
        backupName: 'My Snapshot',
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(createVolumeSnapshot).toHaveBeenCalledWith(
        'project1',
        'vol1',
        'My Snapshot',
      );

      expect(onSuccessMock).toHaveBeenCalled();
      expect(onErrorMock).not.toHaveBeenCalled();
    });

    it('should call onError when create snapshot fails', async () => {
      const errorMessage = 'Failed to create snapshot';
      const error = new Error(errorMessage);
      const onSuccessMock = vi.fn();
      const onErrorMock = vi.fn();

      vi.mocked(createVolumeSnapshot).mockRejectedValue(error);

      const { result } = renderHook(
        () =>
          useCreateVolumeSnapshot({
            projectId: 'project1',
            onSuccess: onSuccessMock,
            onError: onErrorMock,
          }),
        { wrapper: createWrapper() },
      );

      result.current.createVolumeSnapshot({
        volumeId: 'vol1',
        backupName: 'My Snapshot',
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe(errorMessage);
      expect(onSuccessMock).not.toHaveBeenCalled();
    });
  });
});
