import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { vpsDetailQueryKey } from '@/adapters/tanstack/vps/vps.queryKey';
import {
  getServiceInfo,
  terminateService,
  changeContact,
  subscribeCommitment,
  type TServiceInfo,
} from '@/api/data/service.api';
import type { TSelectOptions } from './types';

export const useServiceInfo = <TData = TServiceInfo>(
  serviceName: string,
  { select }: TSelectOptions<TServiceInfo, TData> = {},
) => {
  return useQuery({
    queryKey: ['vps', serviceName, 'serviceInfo'],
    queryFn: () => getServiceInfo(serviceName),
    select,
    enabled: !!serviceName,
  });
};

export const useTerminateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: terminateService,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: vpsDetailQueryKey(variables.serviceName),
      });
    },
  });
};

export const useChangeContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeContact,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['vps', variables.serviceName, 'serviceInfo'],
      });
    },
  });
};

export const useSubscribeCommitment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subscribeCommitment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: vpsDetailQueryKey(variables.serviceName),
      });
    },
  });
};
