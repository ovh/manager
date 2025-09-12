import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useVolume } from '@/api/hooks/useVolume';
import { deleteSnapshots, getSnapshotsByRegion } from '@/api/data/snapshot';
import { selectSnapshotForVolume } from '@/api/select/snapshot';
import queryClient from '@/queryClient';

export const getVolumeSnapshotsQueryKey = (
  projectId: string,
  volumeId: string,
) => ['volume-snapshot', projectId, volumeId];

export const useVolumeSnapshots = (projectId: string, volumeId: string) => {
  const { data: volume } = useVolume(projectId, volumeId);

  const select = useMemo(
    () => (volume ? selectSnapshotForVolume(volumeId) : undefined),
    [volume],
  );

  return useQuery({
    queryKey: getVolumeSnapshotsQueryKey(projectId, volumeId),
    queryFn: () => getSnapshotsByRegion(projectId, volume?.region),
    enabled: !!volume,
    select,
  });
};

interface DeleteVolumeSnapshotsProps {
  projectId: string;
  volumeId: string;
  snapshotsIds: string[];
}

export const useDeleteVolumeSnapshots = ({
  projectId,
  volumeId,
  snapshotsIds,
}: DeleteVolumeSnapshotsProps) => {
  const mutation = useMutation({
    mutationFn: async () => deleteSnapshots(projectId, volumeId, snapshotsIds),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: getVolumeSnapshotsQueryKey(projectId, volumeId),
      });
    },
  });
  return {
    deleteVolumeSnapshots: () => mutation.mutate(),
    ...mutation,
  };
};
