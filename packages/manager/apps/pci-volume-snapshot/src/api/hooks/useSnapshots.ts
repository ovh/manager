import { useQuery, useQueries } from '@tanstack/react-query';
import { getSnapshots, getVolume, TSnapshot, TVolume } from '../data/snapshots';

export type TVolumeSnapshot = TSnapshot & {
  volume: TVolume | null;
};

export const useAllSnapshots = (projectId: string) =>
  useQuery({
    queryKey: ['snapshots', projectId],
    queryFn: () => getSnapshots(projectId),
  });

export const useVolumeSnapshots = (projectId: string) => {
  const { data: snapshots, isPending, isLoading } = useAllSnapshots(projectId);

  return useQueries({
    queries: (snapshots || [])?.map((snapshot) => ({
      queryKey: ['snapshots', projectId, 'volume', snapshot.volumeId],
      queryFn: () => getVolume(projectId, snapshot.volumeId),
    })),
    combine: (volumes) => ({
      isPending: isPending || volumes.some((result) => result.isPending),
      isLoading: isLoading || volumes.some((result) => result.isLoading),
      error: volumes.find((result) => result.error),
      data: (snapshots || []).map((snapshot) => ({
        ...snapshot,
        volume: volumes.find(({ data }) => data?.id === snapshot.volumeId),
      })),
    }),
  });
};
