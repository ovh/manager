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
import {
  fetchDeploymentLogs,
  fetchHostingWebsiteIds,
  fetchWebsiteDeployments,
} from '@/data/api/git';
import { getWebHostingWebsiteV6 } from '@/data/api/webHosting';
import { TAttachedDomain, TCreateAttachedDomain } from '@/data/types/product/domain';
import { Logs } from '@/data/types/product/git';
import queryClient from '@/utils/queryClient';

export const useGetHostingService = (serviceName: string) =>
  useQuery({
    queryKey: ['hosting', 'web', serviceName],
    queryFn: () => getHostingService(serviceName),
    enabled: Boolean(serviceName),
  });

export const useGetHostingWebsiteIds = (serviceName: string, path?: string) =>
  useQuery<number[]>({
    queryKey: ['hosting', 'web', serviceName, 'website', path, 'ids'],
    queryFn: () => fetchHostingWebsiteIds(serviceName, path),
    enabled: Boolean(serviceName),
  });

export const useGetWebsiteDeployments = (serviceName: string, websiteId?: number) =>
  useQuery<number[]>({
    queryKey: ['hosting', 'web', serviceName, 'website', websiteId, 'deployment'],
    queryFn: () => fetchWebsiteDeployments(serviceName, websiteId),
    enabled: Boolean(serviceName && websiteId !== undefined),
  });

export const useGetDeploymentLogs = (
  serviceName: string,
  websiteId?: number,
  deploymentId?: number,
) =>
  useQuery<Logs[]>({
    queryKey: [
      'hosting',
      'web',
      serviceName,
      'website',
      websiteId,
      'deployment',
      deploymentId,
      'logs',
    ],
    queryFn: () => fetchDeploymentLogs(serviceName, websiteId, deploymentId),
    enabled: Boolean(serviceName && websiteId !== undefined && deploymentId !== undefined),
  });

export const useGetHostingServiceWebsite = (serviceName: string, path?: string) =>
  useQuery<string[]>({
    queryKey: ['hosting', 'web', serviceName, 'website', path],
    queryFn: () => getWebHostingWebsiteV6(serviceName, path),
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
  tokenNeeded: boolean,
  enabled: boolean,
) =>
  useQuery({
    queryKey: ['sws', 'hosting', 'web', serviceName, 'add-domain-existing', tokenNeeded],
    queryFn: () => getAddDomainExisting(serviceName, tokenNeeded),
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
