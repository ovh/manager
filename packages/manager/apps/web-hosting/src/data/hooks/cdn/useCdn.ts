import { useMutation, useQuery } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

//@TO DO comments for nexts dev
import {
  // getSharedCDNDomainDetails,
  // getSharedCDNDomains,
  createCdnOption,
  deleteCdnOption,
  // getCDNDomainOptionDetails,
  //getCDNDomainsOptions,
  getCDNProperties,
  getCdnOption,
  getServiceNameCdn,
  updateCdnOption,
  updateCdnOptions,
} from '@/data/api/cdn';
import { TCdnOption, TCdnOptions } from '@/data/types/product/cdn';
import queryClient from '@/utils/queryClient';

const baseCdnQueryKey = (serviceName: string) => ['hosting', 'web', serviceName, 'cdn'];

export const useGetCDNProperties = (serviceName: string) =>
  useQuery({
    queryKey: [baseCdnQueryKey(serviceName)],
    queryFn: () => getCDNProperties(serviceName),
    enabled: Boolean(serviceName),
  });

/* export const useGetSharedCDNAvailableOptions = (serviceName: string) =>
  useQuery({
    queryKey: [baseCdnQueryKey(serviceName), 'availableOptions'],
    queryFn: () => getCDNProperties(serviceName),
    enabled: Boolean(serviceName),
  });

export const useGetSharedCDNDomains = (serviceName: string) =>
  useQuery({
    queryKey: [baseCdnQueryKey(serviceName), 'domain'],
    queryFn: () => getSharedCDNDomains(serviceName),
    enabled: Boolean(serviceName),
  });

export const useGetSharedCDNDomainDetails = (serviceName: string, domain: string) =>
  useQuery({
    queryKey: [baseCdnQueryKey(serviceName), 'domain', domain],
    queryFn: () => getSharedCDNDomainDetails(serviceName, domain),
    enabled: Boolean(serviceName),
  });

export const useGetCDNDomainsOptions = (serviceName: string, domain: string) =>
  useQuery({
    queryKey: [baseCdnQueryKey(serviceName), 'domain', domain, 'option'],
    queryFn: () => getCDNDomainsOptions(serviceName, domain),
    enabled: Boolean(serviceName),
  });

export const useGetCDNDomainOptionDetails = (serviceName: string, domain: string, option: string) =>
  useQuery({
    queryKey: [baseCdnQueryKey(serviceName), 'domain', domain, 'option', option],
    queryFn: () => getCDNDomainOptionDetails(serviceName, domain, option),
    enabled: Boolean(serviceName),
  });
 */

export const useGetServiceNameCdn = (serviceName: string) =>
  useQuery({
    queryKey: ['hosting', 'web', serviceName, 'cdn'],
    queryFn: () => getServiceNameCdn(serviceName),
    enabled: Boolean(serviceName),
  });

export const useGetCdnOption = (serviceName: string, domain: string) =>
  useQuery({
    queryKey: ['hosting', 'web', serviceName, 'cdn', 'domain', domain, 'option'],
    queryFn: () => getCdnOption(serviceName, domain),
    enabled: Boolean(serviceName && domain),
  });

export const useCreateCdnOption = (
  serviceName: string,
  domain: string,
  onSuccess?: () => void,
  onError?: (err: Error) => void,
) => {
  const mutation = useMutation<void, Error, TCdnOption>({
    mutationFn: (payload) =>
      (async () => {
        await createCdnOption({
          serviceName,
          domain,
          ...payload,
        });
      })(),
    onSuccess: () => {
      onSuccess?.();
      void queryClient.invalidateQueries({
        queryKey: ['hosting', 'web', serviceName, 'cdn', 'domain', domain, 'option'],
      });
    },
    onError,
  });

  return {
    createCdnOption: mutation.mutate,
    createCdnOptionAsync: mutation.mutateAsync,
    ...mutation,
  };
};

export const useUpdateCdnOption = (
  serviceName: string,
  domain: string,
  onSuccess?: () => void,
  onError?: (err: Error) => void,
) => {
  const mutation = useMutation<void, Error, TCdnOption>({
    mutationFn: (payload) =>
      (async () => {
        await updateCdnOption({
          serviceName,
          domain,
          ...payload,
        });
      })(),
    onSuccess: () => {
      onSuccess?.();
      void queryClient.invalidateQueries({
        queryKey: ['hosting', 'web', serviceName, 'cdn', 'domain', domain, 'option'],
      });
    },
    onError,
  });

  return {
    updateCdnOption: mutation.mutate,
    updateCdnOptionAsync: mutation.mutateAsync,
    ...mutation,
  };
};

export const useUpdateCdnOptions = (
  serviceName: string,
  domain: string,
  onSuccess?: () => void,
  onError?: (err: Error) => void,
) => {
  const mutation = useMutation<void, Error, TCdnOptions>({
    mutationFn: (payload) =>
      (async () => {
        await updateCdnOptions({
          serviceName,
          domain,
          ...payload,
        });
      })(),
    onSuccess: () => {
      onSuccess?.();
      void queryClient.invalidateQueries({
        queryKey: ['hosting', 'web', serviceName, 'cdn', 'domain', domain, 'option'],
      });
    },
    onError,
  });

  return {
    updateCdnOptions: mutation.mutate,
    updateCdnOptionsAsync: mutation.mutateAsync,
    ...mutation,
  };
};

export const useDeleteCdnOption = (
  serviceName: string,
  domain: string,
  onSuccess?: () => void,
  onError?: (error: ApiError) => void,
) => {
  const mutation = useMutation({
    mutationFn: (option: string) => deleteCdnOption({ serviceName, domain, option }),
    onSuccess: () => {
      onSuccess?.();
      void queryClient.invalidateQueries({
        queryKey: ['hosting', 'web', serviceName, 'cdn', 'domain', domain, 'option'],
      });
    },
    onError,
  });

  return {
    deleteCdnOption: mutation.mutate,
    ...mutation,
  };
};
