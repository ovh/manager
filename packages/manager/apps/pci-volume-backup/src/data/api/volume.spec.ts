import { v6 } from '@ovh-ux/manager-core-api';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createVolumeFromBackup, detachVolume, getVolume } from './volume';

describe('Volume API Service', () => {
  const mockProjectId = 'project-123';
  const mockVolumeId = 'volume-456';
  const mockInstanceId = 'instance-789';
  const mockRegionName = 'GRA7';
  const mockVolumeBackupId = 'backup-xyz';
  const mockVolumeName = 'test-volume';

  const sampleVolumeData = {
    id: mockVolumeId,
    name: mockVolumeName,
    description: 'Test volume',
    size: 50,
    status: 'available',
    region: mockRegionName,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getVolume', () => {
    it('should fetch a volume by ID', async () => {
      vi.mocked(v6.get).mockResolvedValueOnce({
        data: sampleVolumeData,
      });

      const result = await getVolume(mockProjectId, mockVolumeId);

      expect(v6.get).toHaveBeenCalledTimes(1);
      expect(v6.get).toHaveBeenCalledWith(
        `/cloud/project/${mockProjectId}/volume/${mockVolumeId}`,
      );

      expect(result).toEqual(sampleVolumeData);
    });

    it('should propagate errors from the API', async () => {
      const mockError = new Error('API Error');
      vi.mocked(v6.get).mockRejectedValueOnce(mockError);

      await expect(getVolume(mockProjectId, mockVolumeId)).rejects.toThrow(
        'API Error',
      );
      expect(v6.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('createVolumeFromBackup', () => {
    it('should create a volume from a backup', async () => {
      const mockResponse = {
        id: 'new-volume-id',
        name: mockVolumeName,
        status: 'creating',
      };

      vi.mocked(v6.post).mockResolvedValueOnce({
        data: mockResponse,
      });

      const result = await createVolumeFromBackup(
        mockProjectId,
        mockRegionName,
        mockVolumeBackupId,
        mockVolumeName,
      );

      expect(v6.post).toHaveBeenCalledTimes(1);
      expect(
        v6.post,
      ).toHaveBeenCalledWith(
        `/cloud/project/${mockProjectId}/region/${mockRegionName}/volumeBackup/${mockVolumeBackupId}/volume`,
        { name: mockVolumeName },
      );

      expect(result).toEqual(mockResponse);
    });

    it('should propagate errors when creating volume from backup', async () => {
      // Mock API error
      const mockError = new Error('Backup not found');
      vi.mocked(v6.post).mockRejectedValueOnce(mockError);

      await expect(
        createVolumeFromBackup(
          mockProjectId,
          mockRegionName,
          mockVolumeBackupId,
          mockVolumeName,
        ),
      ).rejects.toThrow('Backup not found');

      expect(v6.post).toHaveBeenCalledTimes(1);
    });
  });

  describe('detachVolume', () => {
    it('should detach a volume from an instance', async () => {
      vi.mocked(v6.post).mockResolvedValueOnce({
        data: {
          ...sampleVolumeData,
          status: 'detaching',
        },
      });

      const result = await detachVolume(
        mockProjectId,
        mockVolumeId,
        mockInstanceId,
      );

      expect(v6.post).toHaveBeenCalledTimes(1);
      expect(
        v6.post,
      ).toHaveBeenCalledWith(
        `/cloud/project/${mockProjectId}/volume/${mockVolumeId}/detach`,
        { instanceId: mockInstanceId },
      );

      expect(result).toEqual({
        ...sampleVolumeData,
        status: 'detaching',
      });
    });

    it('should propagate errors when detaching a volume', async () => {
      const errorMessage = 'Cannot detach volume that is in use';
      const mockError = new Error(errorMessage);
      vi.mocked(v6.post).mockRejectedValueOnce(mockError);

      await expect(
        detachVolume(mockProjectId, mockVolumeId, mockInstanceId),
      ).rejects.toThrow(errorMessage);

      expect(v6.post).toHaveBeenCalledTimes(1);
    });
  });
});
