import { describe, it, expect, vi, beforeEach } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { Query } from '@tanstack/react-query';
import { TVolumeBackup } from './api.types';
import {
  isVolumeBackupPending,
  refetchInterval,
  getVolumeBackups,
  getVolumeBackup,
} from './volumeBackup';
import { ApiData } from '../hooks/useVolumeBackups';
import {
  MOCKED_BACKUP,
  MOCKED_PROJECT_ID,
  MOCKED_REGION_NAME,
  MOCKED_VOLUME_BACKUP_ID,
} from '@/__tests__/mocks';

describe('pci-volume-backup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isVolumeBackupPending', () => {
    it('should return true for creating status', () => {
      const backupWithStatusCreating = {
        ...MOCKED_BACKUP,
        status: 'creating',
      };

      expect(isVolumeBackupPending(backupWithStatusCreating)).toBe(true);
    });

    it('should return true for deleting status', () => {
      const backupWithStatusDeleting = {
        ...MOCKED_BACKUP,
        status: 'deleting',
      };

      expect(isVolumeBackupPending(backupWithStatusDeleting)).toBe(true);
    });

    it('should return true for restoring status', () => {
      const backupWithStatusRestoring = {
        ...MOCKED_BACKUP,
        status: 'restoring',
      };

      expect(isVolumeBackupPending(backupWithStatusRestoring)).toBe(true);
    });

    it('should return false for ok status', () => {
      expect(isVolumeBackupPending(MOCKED_BACKUP)).toBe(false);
    });

    it('should return false for error status', () => {
      const backupWithStatusError = {
        ...MOCKED_BACKUP,
        status: 'error',
      };

      expect(isVolumeBackupPending(backupWithStatusError)).toBe(false);
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
                ...MOCKED_BACKUP,
                id: 'backup-id-1',
                status: 'creating',
              },
              {
                ...MOCKED_BACKUP,
                id: 'backup-id-2',
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
                ...MOCKED_BACKUP,
                id: 'backup-id-1',
                status: 'error',
              },
              {
                ...MOCKED_BACKUP,
                id: 'backup-id-2',
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
      const mockResponse = {
        data: {
          resources: MOCKED_BACKUP,
        },
      };

      vi.mocked(v6.get).mockResolvedValueOnce(mockResponse);

      const result = await getVolumeBackups(MOCKED_PROJECT_ID)();

      expect(v6.get).toHaveBeenCalledWith(
        `/cloud/project/${MOCKED_PROJECT_ID}/aggregated/volumeBackup`,
      );
      expect(result).toEqual({
        data: MOCKED_BACKUP,
      });
    });
  });

  describe('getVolumeBackup', () => {
    it('should return a specific volume backup', async () => {
      const mockResponse = {
        data: MOCKED_BACKUP,
      };

      vi.mocked(v6.get).mockResolvedValueOnce(mockResponse);

      const result = await getVolumeBackup(
        MOCKED_PROJECT_ID,
        MOCKED_REGION_NAME,
        MOCKED_VOLUME_BACKUP_ID,
      );

      expect(v6.get).toHaveBeenCalledWith(
        `/cloud/project/${MOCKED_PROJECT_ID}/region/${MOCKED_REGION_NAME}/volumeBackup/${MOCKED_VOLUME_BACKUP_ID}`,
      );
      expect(result).toEqual(MOCKED_BACKUP);
    });
  });
});
