import { v6 } from '@ovh-ux/manager-core-api';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createVolumeFromBackup, detachVolume, getVolume } from './volume';
import {
  MOCKED_INSTANCE_ID,
  MOCKED_PROJECT_ID,
  MOCKED_REGION_NAME,
  MOCKED_VOLUME,
  MOCKED_VOLUME_BACKUP_ID,
  MOCKED_VOLUME_ID,
  MOCKED_VOLUME_NAME,
} from '@/__tests__/mocks';

describe('Volume API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getVolume', () => {
    it('should fetch a volume by ID', async () => {
      vi.mocked(v6.get).mockResolvedValueOnce({
        data: MOCKED_VOLUME,
      });

      const result = await getVolume(MOCKED_PROJECT_ID, MOCKED_VOLUME_ID);

      expect(v6.get).toHaveBeenCalledTimes(1);
      expect(v6.get).toHaveBeenCalledWith(
        `/cloud/project/${MOCKED_PROJECT_ID}/volume/${MOCKED_VOLUME_ID}`,
      );

      expect(result).toEqual(MOCKED_VOLUME);
    });

    it('should propagate errors from the API', async () => {
      const mockError = new Error('API Error');
      vi.mocked(v6.get).mockRejectedValueOnce(mockError);

      await expect(
        getVolume(MOCKED_PROJECT_ID, MOCKED_VOLUME_ID),
      ).rejects.toThrow('API Error');
      expect(v6.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('createVolumeFromBackup', () => {
    it('should create a volume from a backup', async () => {
      const mockResponse = {
        id: 'new-volume-id',
        name: MOCKED_VOLUME_NAME,
        status: 'creating',
      };

      vi.mocked(v6.post).mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await createVolumeFromBackup(
        MOCKED_PROJECT_ID,
        MOCKED_REGION_NAME,
        MOCKED_VOLUME_BACKUP_ID,
        MOCKED_VOLUME_NAME,
      );

      expect(v6.post).toHaveBeenCalledTimes(1);
      expect(
        v6.post,
      ).toHaveBeenCalledWith(
        `/cloud/project/${MOCKED_PROJECT_ID}/region/${MOCKED_REGION_NAME}/volumeBackup/${MOCKED_VOLUME_BACKUP_ID}/volume`,
        { name: MOCKED_VOLUME_NAME },
      );

      expect(result).toEqual(mockResponse);
    });

    it('should propagate errors when creating volume from backup', async () => {
      const mockError = new Error('Backup not found');
      vi.mocked(v6.post).mockRejectedValueOnce(mockError);

      await expect(
        createVolumeFromBackup(
          MOCKED_PROJECT_ID,
          MOCKED_REGION_NAME,
          MOCKED_VOLUME_BACKUP_ID,
          MOCKED_VOLUME_NAME,
        ),
      ).rejects.toThrow('Backup not found');

      expect(v6.post).toHaveBeenCalledTimes(1);
    });
  });

  describe('detachVolume', () => {
    it('should detach a volume from an instance', async () => {
      vi.mocked(v6.post).mockResolvedValueOnce({
        data: {
          ...MOCKED_VOLUME,
          status: 'detaching',
        },
      });

      const result = await detachVolume(
        MOCKED_PROJECT_ID,
        MOCKED_VOLUME_ID,
        MOCKED_INSTANCE_ID,
      );

      expect(v6.post).toHaveBeenCalledTimes(1);
      expect(
        v6.post,
      ).toHaveBeenCalledWith(
        `/cloud/project/${MOCKED_PROJECT_ID}/volume/${MOCKED_VOLUME_ID}/detach`,
        { instanceId: MOCKED_INSTANCE_ID },
      );

      expect(result).toEqual({
        ...MOCKED_VOLUME,
        status: 'detaching',
      });
    });

    it('should propagate errors when detaching a volume', async () => {
      const errorMessage = 'Cannot detach volume that is in use';
      const mockError = new Error(errorMessage);
      vi.mocked(v6.post).mockRejectedValueOnce(mockError);

      await expect(
        detachVolume(MOCKED_PROJECT_ID, MOCKED_VOLUME_ID, MOCKED_INSTANCE_ID),
      ).rejects.toThrow(errorMessage);

      expect(v6.post).toHaveBeenCalledTimes(1);
    });
  });
});
