import { v6 } from '@ovh-ux/manager-core-api';
import { describe, it, vi } from 'vitest';
import { getSnapshotsByRegion } from '@/api/data/snapshot';

vi.mock('@ovh-ux/manager-core-api');

describe('getSnapshotsByRegion', () => {
  it('should fetche volume snapshots for given projectId and region', async () => {
    const mockVolumeSnapshots = [
      { id: '1', name: 'Snapshot 1' },
      { id: '2', name: 'Snapshot 2' },
    ];
    vi.mocked(v6.get).mockResolvedValue({ data: mockVolumeSnapshots });

    const volumeSnapshots = await getSnapshotsByRegion('123', 'paris-a');

    expect(v6.get).toHaveBeenCalledWith('/cloud/project/123/volume/snapshot', {
      params: {
        region: 'paris-a',
      },
    });
    expect(volumeSnapshots).toEqual(mockVolumeSnapshots);
  });
});
