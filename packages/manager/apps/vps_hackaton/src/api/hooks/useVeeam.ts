import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  vpsVeeamQueryKey,
  vpsRestorePointsQueryKey,
} from '@/adapters/tanstack/vps/vps.queryKey';
import {
  getVeeamBackup,
  getRestorePoints,
  restoreVeeamBackup,
  rescheduleVeeamBackup,
  detachVeeamBackup,
} from '@/api/data/veeam.api';
import type { TVeeamBackup, TRestorePoint } from '@/domain/entities/veeam';
import type { TSelectOptions } from './types';

export const useVeeamBackup = <TData = TVeeamBackup | null>(
  serviceName: string,
  { select }: TSelectOptions<TVeeamBackup | null, TData> = {},
) => {
  return useQuery({
    queryKey: vpsVeeamQueryKey(serviceName),
    queryFn: () => getVeeamBackup(serviceName),
    select,
    enabled: !!serviceName,
  });
};

export const useRestorePoints = <TData = Array<TRestorePoint>>(
  serviceName: string,
  { select }: TSelectOptions<Array<TRestorePoint>, TData> = {},
) => {
  return useQuery({
    queryKey: vpsRestorePointsQueryKey(serviceName),
    queryFn: () => getRestorePoints(serviceName),
    select,
    enabled: !!serviceName,
  });
};

export const useRestoreVeeamBackup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreVeeamBackup,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: vpsVeeamQueryKey(variables.serviceName),
      });
      queryClient.invalidateQueries({
        queryKey: vpsRestorePointsQueryKey(variables.serviceName),
      });
    },
  });
};

export const useRescheduleVeeamBackup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rescheduleVeeamBackup,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: vpsVeeamQueryKey(variables.serviceName),
      });
    },
  });
};

export const useDetachVeeamBackup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: detachVeeamBackup,
    onSuccess: (_, serviceName) => {
      queryClient.invalidateQueries({
        queryKey: vpsVeeamQueryKey(serviceName),
      });
    },
  });
};
