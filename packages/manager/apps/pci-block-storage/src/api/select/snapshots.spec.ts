import { selectSnapshotForVolume } from '@/api/select/snapshot';
import { TVolumeSnapshot } from '@/api/data/snapshot';

describe('snapshots', () => {
  describe('selectSnapshotForVolume', () => {
    it('should keep only shnapshot which have the same volumeId as the input', () => {
      const selectedVolumeId = '1';
      const snapshots = [
        { id: '1', volumeId: 'wrong' },
        { id: '2', volumeId: 'wrong' },
        { id: '3', volumeId: selectedVolumeId },
        { id: '4', volumeId: selectedVolumeId },
        { id: '5', volumeId: 'wrong' },
        { id: '6', volumeId: selectedVolumeId },
        { id: '7', volumeId: 'wrong' },
      ] as TVolumeSnapshot[];

      const result = selectSnapshotForVolume(selectedVolumeId)(snapshots);

      expect(result).toEqual([
        { id: '3', volumeId: selectedVolumeId },
        { id: '4', volumeId: selectedVolumeId },
        { id: '6', volumeId: selectedVolumeId },
      ]);
    });
  });
});
