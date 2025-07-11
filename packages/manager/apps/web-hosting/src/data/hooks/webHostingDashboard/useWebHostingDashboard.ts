import { useQuery, useMutation } from '@tanstack/react-query';
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
import { TCreateAttachedDomain } from '@/data/type';
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

export const useGetAddDomainExisting = (
  serviceName: string,
  path: string,
  enabled: boolean,
) =>
  useQuery({
    queryKey: ['sws', 'hosting', 'web', serviceName, 'add-domain-existing'],
    queryFn: () => getAddDomainExisting(serviceName, path),
    enabled,
  });

export const useUpdateHostingService = (
  serviceName: string,
  onSuccess: () => void,
  onError: () => void,
) => {
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

export const useCreateAttachedDomainService = (
  serviceName: string,
  onSuccess: () => void,
  onError: () => void,
) => {
  const mutation = useMutation({
    mutationFn: ({
      domain,
      cdn,
      firewall,
      ownLog,
      path,
      runtimeId,
      ssl,
      bypassDNSConfiguration,
      ipLocation,
    }: TCreateAttachedDomain) =>
      createAttachedDomainService({
        serviceName,
        domain,
        cdn,
        firewall,
        ownLog,
        path,
        runtimeId,
        ssl,
        bypassDNSConfiguration,
        ipLocation,
      }),
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: ['hosting', 'web', serviceName, 'attachedDomain'],
      });
    },
    onError,
  });

  return {
    createAttachedDomainService: mutation.mutate,
    ...mutation,
  };
};

export const useCreateAttachedDomainsService = (
  serviceName: string,
  onSuccess: () => void,
  onError: () => void,
) => {
  const mutation = useMutation({
    mutationFn: ({
      domain,
      cdn,
      firewall,
      ownLog,
      path,
      runtimeId,
      ssl,
      bypassDNSConfiguration,
      ipLocation,
      wwwNeeded,
    }: TCreateAttachedDomain) =>
      createAttachedDomainsService({
        serviceName,
        domain,
        cdn,
        firewall,
        ownLog,
        path,
        runtimeId,
        ssl,
        bypassDNSConfiguration,
        ipLocation,
        wwwNeeded,
      }),
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: ['hosting', 'web', serviceName, 'attachedDomain'],
      });
    },
    onError,
  });

  return {
    createAttachedDomainsService: mutation.mutate,
    ...mutation,
  };
};
