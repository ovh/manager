import { useMutation, useQuery } from '@tanstack/react-query';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { useMemo } from 'react';
import {
  deleteVolume,
  getAllVolumes,
  getVolume,
  getVolumeSnapshot,
  paginateResults,
  sortResults,
  TVolume,
  TVolumeSnapshot,
  VolumeOptions,
} from '@/api/data/volume';
import queryClient from '@/queryClient';
import { useTranslatedMicroRegions } from '@/hooks/useTranslatedMicroRegions';

export const useAllVolumes = (projectId: string) => {
  const { translateRegion } = useTranslatedMicroRegions();
  return useQuery({
    queryKey: ['project', projectId, 'volumes'],
    queryFn: () => getAllVolumes(projectId),
    select: (data) =>
      data.map((volume: TVolume) => {
        let statusGroup = '';
        if (['available', 'in-use'].includes(volume.status)) {
          statusGroup = 'ACTIVE';
        }
        if (
          [
            'creating',
            'attaching',
            'detaching',
            'deleting',
            'backing-up',
            'restoring-backup',
            'snapshotting',
            'awaiting-transfer',
          ].includes(volume.status)
        ) {
          statusGroup = 'PENDING';
        }
        if (
          [
            'error',
            'error_deleting',
            'error_restoring',
            'error_extending',
          ].includes(volume.status)
        ) {
          statusGroup = 'ERROR';
        }
        return {
          ...volume,
          statusGroup,
          regionName: translateRegion(volume.region),
        };
      }),
  });
};

export const useVolumes = (
  projectId: string,
  { pagination, sorting }: VolumeOptions,
  filters: Filter[] = [],
) => {
  const { data: volumes, error, isLoading, isPending } = useAllVolumes(
    projectId,
  );

  return useMemo(
    () => ({
      isLoading,
      isPending,
      error,
      data: paginateResults<TVolume>(
        sortResults(applyFilters(volumes || [], filters), sorting),
        pagination,
      ),
    }),
    [isLoading, isPending, error, volumes, pagination, sorting, filters],
  );
};

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
