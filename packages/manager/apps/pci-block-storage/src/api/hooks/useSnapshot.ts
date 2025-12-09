import { useMutation, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useVolume } from '@/api/hooks/useVolume';
import {
  deleteSnapshots,
  getSnapshotsByRegion,
  TVolumeSnapshot,
} from '@/api/data/snapshot';
import { selectSnapshotForVolume } from '@/api/select/snapshot';
import queryClient from '@/queryClient';
import { TOperation } from '@/api/data/operation';
import { useOperationPolling } from '@/api/hooks/operation/useOperationPolling';
import {
  isOperationASuccess,
  isOperationInFailedState,
  isOperationInProgress,
} from '@/api/select/operation';

const MAX_NUMBER_OF_TRIES = 10;

export const getVolumeSnapshotsQueryKey = (
  projectId: string,
  volumeId: string,
) => ['volume-snapshot', projectId, volumeId];

export const useVolumeSnapshots = (
  projectId: string,
  volumeId: string,
  forceReload = false,
) => {
  const { data: volume } = useVolume(projectId, volumeId);

  const select = useMemo(
    () => (volume ? selectSnapshotForVolume(volumeId) : undefined),
    [volume],
  );

  const forceReloadOption: Pick<
    UseQueryOptions,
    'refetchOnMount' | 'refetchOnWindowFocus' | 'refetchOnReconnect'
  > = forceReload
    ? {
        refetchOnMount: 'always',
        refetchOnWindowFocus: 'always',
        refetchOnReconnect: 'always',
      }
    : {};

  return useQuery<TVolumeSnapshot[]>({
    queryKey: getVolumeSnapshotsQueryKey(projectId, volumeId),
    queryFn: () => getSnapshotsByRegion(projectId, volume?.region),
    enabled: !!volume,
    select,
    ...forceReloadOption,
  });
};

interface DeleteVolumeSnapshotsProps {
  projectId: string;
  volumeId: string;
}

export const useDeleteVolumeSnapshots = ({
  projectId,
  volumeId,
}: DeleteVolumeSnapshotsProps) => {
  const { data: volume } = useVolume(projectId, volumeId);

  const [deleteOperation, setDeleteOperation] = useState<TOperation>(null);
  const [hadAnError, setHadAnError] = useState(false);

  const deleteSnapshotsMutation = useMutation({
    mutationFn: async () => deleteSnapshots(projectId, volumeId, volume.region),
    onSuccess: (data) => setDeleteOperation(data),
    onError: () => setHadAnError(true),
  });

  const resetVolumeSnapshots = async () => {
    await queryClient.invalidateQueries({
      queryKey: getVolumeSnapshotsQueryKey(projectId, volumeId),
    });
  };

  const onSuccess = (data: TOperation) => {
    setDeleteOperation(data);

    if (isOperationASuccess(data)) {
      resetVolumeSnapshots();
    }
  };

  const onError = () => {
    setHadAnError(true);
    setDeleteOperation(null);
  };

  const fetchOperationPolling = useOperationPolling(
    projectId,
    deleteOperation?.id,
    {
      onSuccess,
      onError,
    },
    {
      refetchInterval: (query) => {
        if (query.state.dataUpdateCount >= MAX_NUMBER_OF_TRIES) {
          setHadAnError(true);
          return false;
        }
        return 1000;
      },
      retry: false,
      enabled: useMemo(
        () => !hadAnError && isOperationInProgress(deleteOperation),
        [hadAnError, deleteOperation],
      ),
    },
  );

  return {
    deleteVolumeSnapshots: () => deleteSnapshotsMutation.mutate(),
    isPending: useMemo(() => {
      const isACallPending =
        deleteSnapshotsMutation.isPending || fetchOperationPolling.isLoading;

      return (
        !hadAnError &&
        (isACallPending || isOperationInProgress(deleteOperation))
      );
    }, [
      deleteSnapshotsMutation.isPending,
      fetchOperationPolling.isLoading,
      deleteOperation,
      hadAnError,
    ]),
    isError: useMemo(
      () => hadAnError || isOperationInFailedState(deleteOperation),
      [hadAnError, deleteOperation],
    ),
  };
};
