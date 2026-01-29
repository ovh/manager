import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { vpsSnapshotQueryKey } from '@/adapters/tanstack/vps/vps.queryKey';
import {
  getSnapshot,
  createSnapshot,
  restoreSnapshot,
  deleteSnapshot,
  downloadSnapshot,
} from '@/api/data/snapshot.api';
import type { TSnapshot } from '@/domain/entities/snapshot';
import type { TSelectOptions } from './types';

export const useSnapshot = <TData = TSnapshot | null>(
  serviceName: string,
  { select }: TSelectOptions<TSnapshot | null, TData> = {},
) => {
  return useQuery({
    queryKey: vpsSnapshotQueryKey(serviceName),
    queryFn: () => getSnapshot(serviceName),
    select,
    enabled: !!serviceName,
  });
};

export const useCreateSnapshot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSnapshot,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: vpsSnapshotQueryKey(variables.serviceName),
      });
    },
  });
};

export const useRestoreSnapshot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreSnapshot,
    onSuccess: (_, serviceName) => {
      queryClient.invalidateQueries({
        queryKey: vpsSnapshotQueryKey(serviceName),
      });
    },
  });
};

export const useDeleteSnapshot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSnapshot,
    onSuccess: (_, serviceName) => {
      queryClient.invalidateQueries({
        queryKey: vpsSnapshotQueryKey(serviceName),
      });
    },
  });
};

export const useDownloadSnapshot = () => {
  return useMutation({
    mutationFn: downloadSnapshot,
  });
};
