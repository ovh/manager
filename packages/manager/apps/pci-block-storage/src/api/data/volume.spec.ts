import { v6 } from '@ovh-ux/manager-core-api';
import { describe, it, vi } from 'vitest';
import {
  attachVolume,
  deleteVolume,
  detachVolume,
  getAllVolumes,
  getVolume,
  retypeVolume,
} from './volume';

vi.mock('@ovh-ux/manager-core-api');

const PROJECT_ID = '123';

describe('getVolume', () => {
  it('fetches volume data for given projectId and volumeId', async () => {
    const mockVolume = { id: '1', name: 'Volume 1' };
    vi.mocked(v6.get).mockResolvedValue({ data: mockVolume });

    const volume = await getVolume(PROJECT_ID, '1');

    expect(v6.get).toHaveBeenCalledWith('/cloud/project/123/volume/1');
    expect(volume).toEqual(mockVolume);
  });
});

describe('getAllVolumes', () => {
  it('fetches all volumes for given projectId', async () => {
    const mockVolumes = [
      { id: '1', name: 'Volume 1' },
      { id: '2', name: 'Volume 2' },
    ];
    vi.mocked(v6.get).mockResolvedValue({ data: mockVolumes });

    const volumes = await getAllVolumes(PROJECT_ID);

    expect(v6.get).toHaveBeenCalledWith('/cloud/project/123/volume');
    expect(volumes).toEqual(mockVolumes);
  });
});

describe('deleteVolume', () => {
  it('deletes a volume', async () => {
    const volumeId = '1';
    vi.mocked(v6.delete).mockResolvedValue({});

    await deleteVolume(PROJECT_ID, volumeId);

    expect(v6.delete).toHaveBeenCalledWith('/cloud/project/123/volume/1');
  });
  // test rror while trying to delete volume
  it('throws an error when trying to delete a volume', async () => {
    const volumeId = '1';
    const error = new Error('Failed to delete volume');
    vi.mocked(v6.delete).mockRejectedValue(error);

    try {
      await deleteVolume(PROJECT_ID, volumeId);
    } catch (e) {
      expect(e).toEqual(error);
    }
  });
});

describe('attachVolume', () => {
  it('attaches a volume to an instance', async () => {
    const volumeId = '1';
    const instanceId = '2';
    vi.mocked(v6.post).mockResolvedValue({});

    await attachVolume(PROJECT_ID, volumeId, instanceId);

    expect(v6.post).toHaveBeenCalledWith('/cloud/project/123/volume/1/attach', {
      instanceId: '2',
    });
  });
  // test error while trying to attach volume
  it('throws an error when trying to attach a volume', async () => {
    const volumeId = '1';
    const instanceId = '2';
    const error = new Error('Failed to attach volume');
    vi.mocked(v6.post).mockRejectedValue(error);

    try {
      await attachVolume(PROJECT_ID, volumeId, instanceId);
    } catch (e) {
      expect(e).toEqual(error);
    }
  });
});

describe('detachVolume', () => {
  it('detaches a volume from an instance', async () => {
    const volumeId = '1';
    const instanceId = '2';
    vi.mocked(v6.post).mockResolvedValue({});

    await detachVolume(PROJECT_ID, volumeId, instanceId);

    expect(v6.post).toHaveBeenCalledWith('/cloud/project/123/volume/1/detach', {
      instanceId: '2',
    });
  });
  // test error while trying to detach volume
  it('throws an error when trying to detach a volume', async () => {
    const volumeId = '1';
    const instanceId = '2';
    const error = new Error('Failed to detach volume');
    vi.mocked(v6.post).mockRejectedValue(error);

    try {
      await detachVolume(PROJECT_ID, volumeId, instanceId);
    } catch (e) {
      expect(e).toEqual(error);
    }
  });
});

describe('retypeVolume', () => {
  it('should retype a volume', async () => {
    const mockVolume = { id: '1', region: 'par-a' };
    const newType = 'classic-luks';
    vi.mocked(v6.put).mockResolvedValue({});

    await retypeVolume({
      projectId: PROJECT_ID,
      originalVolume: mockVolume,
      newType,
    });

    expect(v6.put).toHaveBeenCalledWith(
      `/cloud/project/${PROJECT_ID}/region/${mockVolume.region}/volume/${mockVolume.id}`,
      {
        type: newType,
      },
    );
  });

  it('should throw an error when failing trying to retype a volume', async () => {
    const mockVolume = { id: '1', region: 'par-a' };
    const newType = 'classic-luks';
    const error = new Error('Failed to retype a volume');
    vi.mocked(v6.put).mockRejectedValue(error);

    try {
      await retypeVolume({
        projectId: PROJECT_ID,
        originalVolume: mockVolume,
        newType,
      });
    } catch (e) {
      expect(e).toEqual(error);
    }
  });
});
