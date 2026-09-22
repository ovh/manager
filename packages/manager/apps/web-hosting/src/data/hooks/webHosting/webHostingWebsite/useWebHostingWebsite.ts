import { useMutation, useQuery } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import { getWebHostingWebsite, putWebHostingWebsite } from '@/data/api/webHosting';
import { DATAGRID_REFRESH_INTERVAL, DATAGRID_REFRESH_ON_MOUNT } from '@/utils';
import queryClient from '@/utils/queryClient';

export const getWebHostingWebsiteQueryKey = (serviceName: string) => [
  'get',
  'webhosting',
  'resource',
  serviceName,
  'website',
];

export const useWebHostingWebsite = (serviceName: string) => {
  return useQuery({
    queryKey: getWebHostingWebsiteQueryKey(serviceName),
    queryFn: () => getWebHostingWebsite(serviceName),
    refetchInterval: DATAGRID_REFRESH_INTERVAL,
    refetchOnMount: DATAGRID_REFRESH_ON_MOUNT,
  });
};

export type PutWebHostingWebsiteVariables = {
  websiteId: string;
  name: string;
  path: string;
};

export const usePutWebHostingWebsite = (
  serviceName: string,
  onSuccess?: () => void,
  onError?: (err: ApiError) => void,
) => {
  const mutation = useMutation<void, ApiError, PutWebHostingWebsiteVariables>({
    mutationFn: async ({ websiteId, name, path }) => {
      await putWebHostingWebsite(serviceName, websiteId, {
        targetSpec: { name, path },
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: getWebHostingWebsiteQueryKey(serviceName),
      });
      onSuccess?.();
    },
    onError,
  });

  return {
    putWebHostingWebsite: mutation.mutate,
    putWebHostingWebsiteAsync: mutation.mutateAsync,
    ...mutation,
  };
};
