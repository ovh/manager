import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';

import {
  getHostingLocalSeo,
  getHostingLocalSeoAccount,
  hostingDeleteLocation,
  hostingLocalSeoLogin,
} from '@/data/api/local-seo';
import { ITEMS_PER_PAGE } from '@/constants';

export const useGetHostingLocalSeo = (serviceName: string) => {
  return useInfiniteQuery({
    queryKey: ['hosting', 'web', serviceName, 'localSeo', 'location'],
    queryFn: ({ pageParam }) => getHostingLocalSeo(serviceName, pageParam),
    initialPageParam: { pageNumber: 1 },
    enabled: !!serviceName,
    staleTime: 0,

    getNextPageParam: (lastPage) => {
      if (lastPage?.pageParam?.pageNumber < lastPage?.pageParam?.totalPage) {
        return { pageNumber: lastPage?.pageParam?.pageNumber + 1 };
      }
      return undefined;
    },
    select: (data) => {
      return data.pages.flatMap((page) =>
        page.data.length > ITEMS_PER_PAGE
          ? page.data.slice(0, ITEMS_PER_PAGE)
          : page.data,
      );
    },
  });
};

export const useGetHostingLocalSeoAccount = (serviceName: string, id: string) =>
  useQuery({
    queryKey: ['hosting', 'web', serviceName, 'localSeo', 'account', id],
    queryFn: () => getHostingLocalSeoAccount(serviceName, id),
    enabled: Boolean(id),
  });

export const useHostingLocalSeoLogin = (serviceName: string) => {
  const mutation = useMutation({
    mutationFn: (accountId: string) =>
      hostingLocalSeoLogin(serviceName, accountId),
  });

  return {
    hostingLocalSeoLogin: mutation.mutateAsync,
    ...mutation,
  };
};

export const useHostingDeleteLocation = (
  serviceName: string,
  onSuccess: () => void,
  onError: (error: ApiError) => void,
) => {
  const mutation = useMutation({
    mutationFn: (locationId: string) =>
      hostingDeleteLocation(serviceName, locationId),
    onSuccess,
    onError,
  });

  return {
    hostingDeleteLocation: mutation.mutate,
    ...mutation,
  };
};
