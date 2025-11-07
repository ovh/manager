import { useMutation, useQuery } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import {
  getWebHostingWebsiteDomain,
  getWebHostingWebsiteDomainQueryKey,
  postWebHostingWebsites,
} from '@/data/api/webHosting';
import { PostWebHostingWebsitePayload } from '@/data/types/product/webHosting';
import queryClient from '@/utils/queryClient';

export const useWebHostingWebsiteDomain = (serviceName: string, id: number) => {
  return useQuery({
    queryKey: getWebHostingWebsiteDomainQueryKey(serviceName, id),
    queryFn: () => getWebHostingWebsiteDomain(serviceName, id),
    enabled: false,
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
