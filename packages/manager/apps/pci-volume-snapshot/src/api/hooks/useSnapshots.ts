import { useMemo } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { getSnapshots, getVolume, TSnapshot, TVolume } from '../data/snapshots';
import { paginateResults, sortResults } from '@/helpers';

export type TVolumeSnapshot = TSnapshot & {
  volume?: TVolume | null;
};

export const useAllSnapshots = (projectId: string) =>
  useQuery({
    queryKey: ['snapshots', projectId],
    enabled: !!projectId,
    queryFn: () => getSnapshots(projectId),
  });

export const useVolumeSnapshots = (projectId: string) => {
  const { data: snapshots, isPending, isLoading } = useAllSnapshots(projectId);

  const volumeIds = snapshots?.map((volume) => volume.volumeId);
  const uniqueVolumeIds = [...new Set(volumeIds)];

  return useQueries({
    queries: uniqueVolumeIds?.map((volumeId) => ({
      queryKey: ['snapshots', projectId, 'volume', volumeId],
      queryFn: () => getVolume(projectId, volumeId),
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

export const usePaginatedVolumeSnapshot = (
  projectId: string,
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
