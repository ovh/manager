import { useMemo } from 'react';
import { useQuery, useQueries, useMutation } from '@tanstack/react-query';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { applyFilters, Filter, ApiError } from '@ovh-ux/manager-core-api';
import {
  getSnapshots,
  getVolume,
  getSnapshot,
  deleteSnapshot,
} from '../data/snapshots';
import { paginateResults, sortResults } from '@/helpers';
import { TVolumeSnapshot } from '@/api/api.types';
import queryClient from '@/queryClient';

export type TDeleteProps = Readonly<{
  projectId: string;
  onSuccess?: () => void;
  onError?: (cause: ApiError) => void;
}>;

export const invalidateGetVolumeSnapshotsCache = (projectId: string) => {
  queryClient.invalidateQueries({
    queryKey: ['snapshots', projectId],
  });
};

export const useAllSnapshots = (projectId: string | undefined | null) =>
  useQuery({
    queryKey: ['snapshots', projectId],
    enabled: !!projectId,
    queryFn: () => getSnapshots(projectId || ''),
  });

export const useVolumeSnapshots = (projectId: string | undefined | null) => {
  const { data: snapshots, isPending, isLoading } = useAllSnapshots(projectId);

  const uniqueVolumeIds = [
    ...new Set(snapshots?.map((snapshot) => snapshot.volumeId)),
  ];

  return useQueries({
    queries: uniqueVolumeIds?.map((volumeId) => ({
      queryKey: ['snapshots', projectId, 'volume', volumeId],
      enabled: !!projectId,
      queryFn: () => getVolume(projectId || '', volumeId),
    })),
    combine: (volumes) => ({
      isPending: isPending || volumes.some((result) => result.isPending),
      isLoading: isLoading || volumes.some((result) => result.isLoading),
      error: volumes.find((result) => result.error),
      data: (snapshots || []).map((snapshot) => ({
        ...snapshot,
        volume: volumes.find(({ data }) => data?.id === snapshot.volumeId)
          ?.data,
      })),
    }),
  });
};

export const useVolumeSnapshot = (
  projectId: string | undefined | null,
  snapshotId: string | undefined | null,
) =>
  useQuery({
    queryKey: ['snapshots', projectId, 'snapshot', snapshotId],
    retry: false,
    throwOnError: true,
    queryFn: () =>
      getSnapshot(projectId || '', snapshotId || '').then((snapshot) =>
        getVolume(projectId || '', snapshot.volumeId).then((volume) => ({
          ...snapshot,
          volume,
        })),
      ),
  });

export const usePaginatedVolumeSnapshot = (
  projectId: string | undefined | null,
  pagination: PaginationState,
  sorting: ColumnSort,
  filters: Filter[],
) => {
  const { data: snapshots, error, isLoading, isPending } = useVolumeSnapshots(
    projectId,
  );

  return useMemo(() => {
    const sortedAndFilteredSnapshots = sortResults<TVolumeSnapshot>(
      applyFilters<TVolumeSnapshot>(snapshots || [], filters),
      sorting,
    );
    return {
      isLoading,
      isPending,
      paginatedSnapshots: paginateResults<TVolumeSnapshot>(
        sortedAndFilteredSnapshots,
        pagination,
      ),
      error,
    };
  }, [snapshots, error, isLoading, isPending, pagination, sorting, filters]);
};

export const useDeleteSnapshot = ({
  projectId,
  onError,
  onSuccess,
}: TDeleteProps) => {
  const mutation = useMutation({
    mutationFn: (snapshotId: string) => deleteSnapshot(projectId, snapshotId),
    onError,
    onSuccess: () => {
      invalidateGetVolumeSnapshotsCache(projectId);
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  return {
    deleteSnapshot: (snapshotId: string) => mutation.mutate(snapshotId),
    ...mutation,
  };
};
