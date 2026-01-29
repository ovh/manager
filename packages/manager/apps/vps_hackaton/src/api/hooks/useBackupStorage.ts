import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  vpsBackupStorageQueryKey,
  vpsBackupStorageAclsQueryKey,
} from '@/adapters/tanstack/vps/vps.queryKey';
import {
  getBackupStorage,
  getBackupStorageAcls,
  resetBackupStoragePassword,
  addBackupStorageAcl,
  deleteBackupStorageAcl,
} from '@/api/data/backupStorage.api';
import type {
  TBackupStorage,
  TBackupStorageAcl,
} from '@/domain/entities/backupStorage';
import type { TSelectOptions } from './types';

export const useBackupStorage = <TData = TBackupStorage | null>(
  serviceName: string,
  { select }: TSelectOptions<TBackupStorage | null, TData> = {},
) => {
  return useQuery({
    queryKey: vpsBackupStorageQueryKey(serviceName),
    queryFn: () => getBackupStorage(serviceName),
    select,
    enabled: !!serviceName,
  });
};

export const useBackupStorageAcls = <TData = Array<TBackupStorageAcl>>(
  serviceName: string,
  { select }: TSelectOptions<Array<TBackupStorageAcl>, TData> = {},
) => {
  return useQuery({
    queryKey: vpsBackupStorageAclsQueryKey(serviceName),
    queryFn: () => getBackupStorageAcls(serviceName),
    select,
    enabled: !!serviceName,
  });
};

export const useResetBackupStoragePassword = () => {
  return useMutation({
    mutationFn: resetBackupStoragePassword,
  });
};

export const useAddBackupStorageAcl = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBackupStorageAcl,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: vpsBackupStorageAclsQueryKey(variables.serviceName),
      });
      queryClient.invalidateQueries({
        queryKey: vpsBackupStorageQueryKey(variables.serviceName),
      });
    },
  });
};

export const useDeleteBackupStorageAcl = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      serviceName,
      ipBlock,
    }: {
      serviceName: string;
      ipBlock: string;
    }) => deleteBackupStorageAcl(serviceName, ipBlock),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: vpsBackupStorageAclsQueryKey(variables.serviceName),
      });
      queryClient.invalidateQueries({
        queryKey: vpsBackupStorageQueryKey(variables.serviceName),
      });
    },
  });
};
