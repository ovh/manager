import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createAttachedDomainService,
  createAttachedDomainsService,
  getAddDomainExisting,
  getDomainService,
  getDomainZone,
  getHostingService,
  getServiceInfos,
  updateHostingService,
} from '@/data/api/dashboard';
import { TAttachedDomain, TCreateAttachedDomain } from '@/data/types/product/domain';
import queryClient from '@/utils/queryClient';

export const useGetHostingService = (serviceName: string) =>
  useQuery({
    queryKey: ['hosting', 'web', serviceName],
    queryFn: () => getHostingService(serviceName),
    enabled: Boolean(serviceName),
  });

export const useGetDomainZone = () =>
  useQuery({
    queryKey: ['domain', 'zone'],
    queryFn: () => getDomainZone(),
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

export const useGetAddDomainExisting = (serviceName: string, path: string, enabled: boolean) =>
  useQuery({
    queryKey: ['sws', 'hosting', 'web', serviceName, 'add-domain-existing', path],
    queryFn: () => getAddDomainExisting(serviceName, path),
    enabled,
  });

export const useUpdateHostingService = (
  serviceName: string,
  onSuccess?: () => void,
  onError?: (err: Error) => void,
) => {
  const mutation = useMutation<void, Error, { displayName?: string }>({
    mutationFn: async ({ displayName }) => {
      await updateHostingService(serviceName, displayName);
    },
    onSuccess: () => {
      onSuccess?.();
      void queryClient.invalidateQueries({
        queryKey: ['hosting', 'web', serviceName],
      });
    },
    onError,
  });

  return {
    updateHostingService: mutation.mutate,
    updateHostingServiceAsync: mutation.mutateAsync,
    ...mutation,
  };
};

export const useCreateAttachedDomainService = (
  serviceName: string,
  onSuccess?: () => void,
  onError?: (err: Error) => void,
) => {
  const mutation = useMutation<TAttachedDomain, Error, TCreateAttachedDomain>({
    mutationFn: (payload) =>
      createAttachedDomainService({
        serviceName,
        ...payload,
      }),
    onSuccess: () => {
      onSuccess?.();
      void queryClient.invalidateQueries({
        queryKey: ['hosting', 'web', serviceName, 'attachedDomain'],
      });
    },
    onError,
  });

  return {
    createAttachedDomainService: mutation.mutate,
    createAttachedDomainServiceAsync: mutation.mutateAsync,
    ...mutation,
  };
};

export const useCreateAttachedDomainsService = (
  serviceName: string,
  onSuccess?: () => void,
  onError?: (err: Error) => void,
) => {
  const mutation = useMutation<void, Error, TCreateAttachedDomain>({
    mutationFn: (payload) =>
      (async () => {
        await createAttachedDomainsService({
          serviceName,
          ...payload,
        });
      })(),
    onSuccess: () => {
      onSuccess?.();
      void queryClient.invalidateQueries({
        queryKey: ['hosting', 'web', serviceName, 'attachedDomain'],
      });
    },
    onError,
  });

  return {
    createAttachedDomainsService: mutation.mutate,
    createAttachedDomainsServiceAsync: mutation.mutateAsync,
    ...mutation,
  };
};
