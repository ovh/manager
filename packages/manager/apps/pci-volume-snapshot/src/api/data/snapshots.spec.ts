import { describe, it, expect, vi, beforeEach } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getSnapshots, getVolume, TSnapshot, TVolume } from './snapshots';

// Mock the API
vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    get: vi.fn(),
  },
}));

describe('Snapshots API', () => {
  const projectId = 'test-project-id';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSnapshots', () => {
    it('should call the API with the correct URL', async () => {
      // Mock API response
      const mockResponse = { data: [] };
      vi.mocked(v6.get).mockResolvedValue(mockResponse);

      await getSnapshots(projectId);

      expect(v6.get).toHaveBeenCalledTimes(1);
      expect(v6.get).toHaveBeenCalledWith(
        `/cloud/project/${projectId}/volume/snapshot`,
      );
    });

    it('should return the data from the API response', async () => {
      // Sample snapshot data
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
      ];

      // Mock API response
      vi.mocked(v6.get).mockResolvedValue({ data: mockSnapshots });

      const result = await getSnapshots(projectId);

      expect(result).toEqual(mockSnapshots);
      expect(result.length).toBe(2);
      expect(result[0].id).toBe('snap-1');
      expect(result[1].id).toBe('snap-2');
    });

    it('should throw an error if the API call fails', async () => {
      // Mock API error
      const apiError = new Error('API Error');
      vi.mocked(v6.get).mockRejectedValue(apiError);

      await expect(getSnapshots(projectId)).rejects.toThrow('API Error');
    });
  });

  describe('getVolume', () => {
    const volumeId = 'vol-1';

    it('should call the API with the correct URL', async () => {
      // Mock API response
      const mockResponse = { data: {} };
      vi.mocked(v6.get).mockResolvedValue(mockResponse);

      await getVolume(projectId, volumeId);

      expect(v6.get).toHaveBeenCalledTimes(1);
      expect(v6.get).toHaveBeenCalledWith(
        `/cloud/project/${projectId}/volume/${volumeId}`,
      );
    });

    it('should return the data from the API response', async () => {
      // Sample volume data
      const mockVolume: TVolume = {
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
      };

      // Mock API response
      vi.mocked(v6.get).mockResolvedValue({ data: mockVolume });

      const result = await getVolume(projectId, volumeId);

      expect(result).toEqual(mockVolume);
      expect(result.id).toBe('vol-1');
      expect(result.name).toBe('Volume 1');
      expect(result.type).toBe('classic');
    });

    it('should throw an error if the API call fails', async () => {
      // Mock API error
      const apiError = new Error('API Error');
      vi.mocked(v6.get).mockRejectedValue(apiError);

      await expect(getVolume(projectId, volumeId)).rejects.toThrow('API Error');
    });
  });
});
