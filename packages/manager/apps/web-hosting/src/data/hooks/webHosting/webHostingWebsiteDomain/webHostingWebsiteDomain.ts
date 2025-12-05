import { useMutation, useQueries, useQuery } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import {
  getWebHostingWebsiteDomain,
  getWebHostingWebsiteDomainQueryKey,
  postWebHostingWebsites,
} from '@/data/api/webHosting';
import {
  PostWebHostingWebsitePayload,
  WebHostingWebsiteType,
} from '@/data/types/product/webHosting';
import queryClient from '@/utils/queryClient';

export const useWebHostingWebsiteDomain = (serviceName: string, id: string) => {
  return useQuery({
    queryKey: getWebHostingWebsiteDomainQueryKey(serviceName, id),
    queryFn: () => getWebHostingWebsiteDomain(serviceName, id),
    enabled: false,
  });
};

export const useWebHostingWebsiteDomains = (
  serviceName: string,
  websites: WebHostingWebsiteType[] | undefined,
) => {
  return useQueries({
    queries:
      websites?.map((website) => ({
        queryKey: getWebHostingWebsiteDomainQueryKey(serviceName, website.id),
        queryFn: () => getWebHostingWebsiteDomain(serviceName, website.id),
        enabled: !!website.id,
      })) ?? [],
  });
};

export const usePostWebHostingWebsites = (
  serviceName: string,
  onSuccess?: () => void,
  onError?: (err: ApiError) => void,
) => {
  const mutation = useMutation<void, ApiError, [PostWebHostingWebsitePayload, boolean]>({
    mutationFn: async ([payload, wwwNeeded]) => {
      await postWebHostingWebsites(serviceName, payload, wwwNeeded);
    },
    onSuccess: () => {
      onSuccess?.();
      void queryClient.invalidateQueries({
        queryKey: ['webhosting', 'resource', serviceName, 'website'],
      });
    },
    onError,
  });

  return {
    postWebHostingWebsites: mutation.mutate,
    postWebHostingWebsitesAsync: mutation.mutateAsync,
    ...mutation,
  };
};
