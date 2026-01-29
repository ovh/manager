import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import {
  createAttachedDomainService,
  createAttachedDomainsService,
  getAddDomainExisting,
  getDomainService,
  getDomainZone,
  getHostingService,
  getServiceDetails,
  getServiceInfos,
  getServicesId,
  getSshKey,
  getVcsWebhookUrls,
  postWebsiteV6,
  putWebsiteV6,
  updateAttachedDomainService,
  updateHostingService,
} from '@/data/api/dashboard';
import {
  fetchDeploymentLogs,
  fetchHostingWebsiteIds,
  fetchWebsiteDeployments,
  postWebsiteDeploy,
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

export const usePostWebsiteDeploy = (
  serviceName: string,
  websiteId?: number,
  {
    onSuccess,
    onError,
  }: {
    onSuccess?: () => void;
    onError?: (err: Error) => void;
  } = {},
) => {
  return useMutation<void, Error, { reset: boolean }>({
    mutationFn: async ({ reset }) => {
      if (!serviceName) {
        throw new Error('serviceName is required to trigger a deployment');
      }
      if (websiteId === undefined) {
        throw new Error('websiteId is required to trigger a deployment');
      }
      await postWebsiteDeploy(serviceName, websiteId, reset);
    },
    onSuccess,
    onError,
  });
};

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

export const useGetServicesId = (serviceId: string) =>
  useQuery({
    queryKey: ['services', serviceId],
    queryFn: () => getServicesId(serviceId),
    enabled: Boolean(serviceId),
  });

export const useGetServiceDetails = (serviceId: number) =>
  useQuery({
    queryKey: ['services', serviceId],
    queryFn: () => getServiceDetails(serviceId),
    enabled: Boolean(serviceId),
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

export const useUpdateAttachedDomainService = (
  serviceName: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void,
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<TAttachedDomain, Error, { domain: string; cdn: string }>({
    mutationFn: async ({ domain, cdn }) => {
      return updateAttachedDomainService(serviceName, domain, cdn);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['hosting', 'web', serviceName, 'attachedDomain'],
      });
      void queryClient.invalidateQueries({
        queryKey: ['hosting', 'web', serviceName, 'website'],
      });
      onSuccess?.();
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  return {
    updateAttachedDomainService: mutation.mutate,
    updateAttachedDomainServiceAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
};

export const useGetVcsWebhookUrls = (serviceName: string, path: string, vcs: string) =>
  useQuery({
    queryKey: ['hosting', 'web', serviceName, 'vcs', 'webhooks', path, vcs],
    queryFn: () => getVcsWebhookUrls(serviceName, path, vcs),
    enabled: Boolean(serviceName),
  });

export const useGetSshKey = (serviceName: string) =>
  useQuery({
    queryKey: ['hosting', 'web', serviceName, 'key', 'ssh'],
    queryFn: () => getSshKey(serviceName),
    enabled: Boolean(serviceName),
  });

export const usePostWebsiteV6 = (
  serviceName: string,
  onSuccess: () => void,
  onError: (error: ApiError) => void,
) => {
  const mutation = useMutation({
    mutationFn: ({
      path,
      vcsBranch,
      vcsUrl,
    }: {
      path?: string;
      vcsBranch?: string;
      vcsUrl?: string;
    }) => postWebsiteV6(serviceName, path, vcsBranch, vcsUrl),
    onSuccess,
    onError,
  });

  return {
    postWebsiteV6: mutation.mutate,
    ...mutation,
  };
};

export const usePutWebsiteV6 = (
  serviceName: string,
  onSuccess: () => void,
  onError: (error: ApiError) => void,
) => {
  const mutation = useMutation({
    mutationFn: ({ id, vcsBranch }: { id?: string; vcsBranch?: string }) =>
      putWebsiteV6(serviceName, id, vcsBranch),
    onSuccess,
    onError,
  });

  return {
    putWebsiteV6: mutation.mutate,
    ...mutation,
  };
};
