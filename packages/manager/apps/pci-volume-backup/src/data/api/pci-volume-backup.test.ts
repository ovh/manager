import { describe, it, expect, vi, beforeEach } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { Query } from '@tanstack/react-query';
import { TVolumeBackup } from './api.types';
import {
  isVolumeBackupPending,
  refetchInterval,
  getVolumeBackups,
  getVolumeBackup,
} from './pci-volume-backup';
import { ApiData } from '../hooks/useVolumeBackups';

describe('pci-volume-backup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isVolumeBackupPending', () => {
    it('should return true for creating status', () => {
      const backup: TVolumeBackup = {
        id: '123',
        creationDate: '2023-01-01',
        name: 'backup-1',
        size: 50,
        volumeId: 'vol-1',
        region: 'GRA',
        status: 'creating',
        search: 'backup-1 123 GRA',
      };

      expect(isVolumeBackupPending(backup)).toBe(true);
    });

    it('should return true for deleting status', () => {
      const backup: TVolumeBackup = {
        id: '123',
        creationDate: '2023-01-01',
        name: 'backup-1',
        size: 50,
        volumeId: 'vol-1',
        region: 'GRA',
        status: 'deleting',
        search: 'backup-1 123 GRA',
      };

      expect(isVolumeBackupPending(backup)).toBe(true);
    });

    it('should return true for restoring status', () => {
      const backup: TVolumeBackup = {
        id: '123',
        creationDate: '2023-01-01',
        name: 'backup-1',
        size: 50,
        volumeId: 'vol-1',
        region: 'GRA',
        status: 'restoring',
        search: 'backup-1 123 GRA',
      };

      expect(isVolumeBackupPending(backup)).toBe(true);
    });

    it('should return false for ok status', () => {
      const backup: TVolumeBackup = {
        id: '123',
        creationDate: '2023-01-01',
        name: 'backup-1',
        size: 50,
        volumeId: 'vol-1',
        region: 'GRA',
        status: 'ok',
        search: 'backup-1 123 GRA',
      };

      expect(isVolumeBackupPending(backup)).toBe(false);
    });

    it('should return false for error status', () => {
      const backup: TVolumeBackup = {
        id: '123',
        creationDate: '2023-01-01',
        name: 'backup-1',
        size: 50,
        volumeId: 'vol-1',
        region: 'GRA',
        status: 'error',
        search: 'backup-1 123 GRA',
      };

      expect(isVolumeBackupPending(backup)).toBe(false);
    });
  });

  describe('refetchInterval', () => {
    const REFETCH_INTERVAL = 3500;

    it('should return false if data is undefined', () => {
      const query = ({
        state: {
          data: undefined,
        },
      } as unknown) as Query<ApiData<TVolumeBackup[]>>;

      expect(refetchInterval(query)).toBe(false);
    });

    it('should return REFETCH_INTERVAL when there are pending backups', () => {
      const query = ({
        state: {
          data: {
            data: [
              {
                id: '123',
                creationDate: '2023-01-01',
                name: 'backup-1',
                size: 50,
                volumeId: 'vol-1',
                region: 'GRA',
                status: 'creating',
              },
              {
                id: '456',
                creationDate: '2023-01-02',
                name: 'backup-2',
                size: 100,
                volumeId: 'vol-2',
                region: 'GRA',
                status: 'ok',
              },
            ],
          },
        },
      } as unknown) as Query<ApiData<TVolumeBackup[]>>;

      expect(refetchInterval(query)).toBe(REFETCH_INTERVAL);
    });

    it('should return false when there are no pending backups', () => {
      const query = ({
        state: {
          data: {
            data: [
              {
                id: '123',
                creationDate: '2023-01-01',
                name: 'backup-1',
                size: 50,
                volumeId: 'vol-1',
                region: 'GRA',
                status: 'ok',
              },
              {
                id: '456',
                creationDate: '2023-01-02',
                name: 'backup-2',
                size: 100,
                volumeId: 'vol-2',
                region: 'GRA',
                status: 'error',
              },
            ],
          },
        },
      } as unknown) as Query<ApiData<TVolumeBackup[]>>;

      const result = refetchInterval(query);
      expect(result).toBe(false);
    });
  });

  describe('getVolumeBackups', () => {
    it('should return volume backups for a project', async () => {
      const mockBackups: TVolumeBackup[] = [
        {
          id: '123',
          creationDate: '2023-01-01',
          name: 'backup-1',
          size: 50,
          volumeId: 'vol-1',
          region: 'GRA',
          status: 'ok',
          search: 'backup-1 123 GRA',
        },
      ];

      const mockResponse = {
        data: {
          resources: mockBackups,
        },
      };

      vi.mocked(v6.get).mockResolvedValueOnce(mockResponse);

      const projectId = 'project-123';
      const result = await getVolumeBackups(projectId)();

      expect(v6.get).toHaveBeenCalledWith(
        `/cloud/project/${projectId}/aggregated/volumeBackup`,
      );
      expect(result).toEqual({
        data: mockBackups,
      });
    });
  });

  describe('getVolumeBackup', () => {
    it('should return a specific volume backup', async () => {
      const mockBackup: TVolumeBackup = {
        id: '123',
        creationDate: '2023-01-01',
        name: 'backup-1',
        size: 50,
        volumeId: 'vol-1',
        region: 'GRA',
        status: 'ok',
        search: 'backup-1 123 GRA',
      };

      const mockResponse = {
        data: mockBackup,
      };

      vi.mocked(v6.get).mockResolvedValueOnce(mockResponse);

      const projectId = 'project-123';
      const regionName = 'GRA';
      const backupId = '123';

      const result = await getVolumeBackup(projectId, regionName, backupId);

      expect(v6.get).toHaveBeenCalledWith(
        `/cloud/project/${projectId}/region/${regionName}/volumeBackup/${backupId}`,
      );
      expect(result).toEqual(mockBackup);
    });
  });
});
