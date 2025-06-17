import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDomainService,
  getHostingService,
  getServiceInfos,
  updateHostingService,
} from '@/data/api/dashboard';

export const useGetHostingService = (serviceName: string) =>
  useQuery({
    queryKey: ['hosting', 'web', serviceName],
    queryFn: () => getHostingService(serviceName),
    enabled: Boolean(serviceName),
  });

export const useGetServiceInfos = (serviceName: string) =>
  useQuery({
    queryKey: ['hosting', 'web', serviceName, 'serviceInfos'],
    queryFn: () => getServiceInfos(serviceName),
    enabled: Boolean(serviceName),
  });

export const useGetDomainService = (serviceName: string) =>
  useQuery({
    queryKey: ['domain', serviceName],
    queryFn: () => getDomainService(serviceName),
    enabled: Boolean(serviceName),
  });

export const useUpdateHostingService = (
  serviceName: string,
  onSuccess: () => void,
  onError: () => void,
) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ displayName }: { displayName?: string }) =>
      updateHostingService(serviceName, displayName),
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: ['hosting', 'web', serviceName],
      });
    },
    onError,
  });

  return {
    updateHostingService: mutation.mutate,
    ...mutation,
  };
};
