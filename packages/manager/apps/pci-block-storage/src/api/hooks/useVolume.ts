import { useQuery, useMutation } from '@tanstack/react-query';
import {
  deleteVolume,
  getVolume,
  getVolumeSnapshot,
  TVolume,
  TVolumeSnapshot,
} from '@/api/data/volume';
import queryClient from '@/queryClient';

export const getVolumeQueryKey = (projectId: string, volumeId: string) => [
  'volume',
  projectId,
  volumeId,
];

export const useVolume = (projectId: string, volumeId: string) =>
  useQuery({
    queryKey: getVolumeQueryKey(projectId, volumeId),
    queryFn: (): Promise<TVolume> => getVolume(projectId, volumeId),
  });

export const getVolumeSnapshotQueryKey = (projectId: string) => [
  'volume-snapshot',
  projectId,
];

export const useVolumeSnapshot = (projectId: string) =>
  useQuery({
    queryKey: ['volume-snapshot', projectId],
    queryFn: (): Promise<TVolumeSnapshot[]> => getVolumeSnapshot(projectId),
  });

interface DeleteVolumeProps {
  projectId: string;
  volumeId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
}

export const useDeleteVolume = ({
  projectId,
  volumeId,
  onError,
  onSuccess,
}: DeleteVolumeProps) => {
  const mutation = useMutation({
    mutationFn: async () => deleteVolume(projectId, volumeId),
    onError,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getVolumeQueryKey(projectId, volumeId),
      });
      // @TODO invalidate list of volumes
      onSuccess();
    },
  });
  return {
    deleteVolume: () => mutation.mutate(),
    ...mutation,
  };
};
