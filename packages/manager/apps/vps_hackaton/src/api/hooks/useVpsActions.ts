import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  vpsDetailQueryKey,
  vpsListQueryKey,
  vpsImagesQueryKey,
} from '@/adapters/tanstack/vps/vps.queryKey';
import {
  rebootVps,
  stopVps,
  startVps,
  rescueVps,
  resetPasswordVps,
  getKvmConsoleUrl,
  rebuildVps,
  updateVpsDisplayName,
  exitRescueMode,
} from '@/api/data/vpsActions.api';
import { getAvailableImages } from '@/api/data/vps.api';
import type { TVpsImage } from '@/domain/entities/vps';
import type { TSelectOptions } from './types';

export const useRebootVps = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rebootVps,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: vpsDetailQueryKey(variables.serviceName),
      });
    },
  });
};

export const useStopVps = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: stopVps,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: vpsDetailQueryKey(variables.serviceName),
      });
    },
  });
};

export const useStartVps = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startVps,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: vpsDetailQueryKey(variables.serviceName),
      });
    },
  });
};

export const useRescueVps = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rescueVps,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: vpsDetailQueryKey(variables.serviceName),
      });
    },
  });
};

export const useExitRescueMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: exitRescueMode,
    onSuccess: (_, serviceName) => {
      queryClient.invalidateQueries({
        queryKey: vpsDetailQueryKey(serviceName),
      });
    },
  });
};

export const useResetPasswordVps = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetPasswordVps,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: vpsDetailQueryKey(variables.serviceName),
      });
    },
  });
};

export const useKvmConsoleUrl = (serviceName: string, enabled = false) => {
  return useQuery({
    queryKey: ['vps', serviceName, 'kvmUrl'],
    queryFn: () => getKvmConsoleUrl(serviceName),
    enabled,
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useRebuildVps = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rebuildVps,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: vpsDetailQueryKey(variables.serviceName),
      });
      queryClient.invalidateQueries({
        queryKey: vpsListQueryKey(),
      });
    },
  });
};

export const useAvailableImages = <TData = Array<TVpsImage>>(
  serviceName: string,
  { select }: TSelectOptions<Array<TVpsImage>, TData> = {},
) => {
  return useQuery({
    queryKey: vpsImagesQueryKey(serviceName),
    queryFn: () => getAvailableImages(serviceName),
    select,
    enabled: !!serviceName,
  });
};

export const useUpdateVpsDisplayName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      serviceName,
      displayName,
    }: {
      serviceName: string;
      displayName: string;
    }) => updateVpsDisplayName(serviceName, displayName),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: vpsDetailQueryKey(variables.serviceName),
      });
      queryClient.invalidateQueries({
        queryKey: vpsListQueryKey(),
      });
    },
  });
};
