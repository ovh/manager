import { TVolumeSnapshot } from '@/api/data/snapshot';

export const selectSnapshotForVolume = (volumeId: string) => (
  snapshots: TVolumeSnapshot[],
) => snapshots.filter((snapshot) => snapshot.volumeId === volumeId);
