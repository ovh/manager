import { useMutation, useQuery } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import {
  getHostingLocalSeoAccount,
  hostingDeleteLocation,
  hostingLocalSeoLogin,
} from '@/data/api/local-seo';

export const useGetHostingLocalSeoAccount = (serviceName: string, id: string) =>
  useQuery({
    queryKey: ['hosting', 'web', serviceName, 'localSeo', 'account', id],
    queryFn: () => getHostingLocalSeoAccount(serviceName, id),
    enabled: Boolean(id),
  });

export const useHostingLocalSeoLogin = (serviceName: string) => {
  const mutation = useMutation({
    mutationFn: (accountId: string) => hostingLocalSeoLogin(serviceName, accountId),
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
    mutationFn: (locationId: string) => hostingDeleteLocation(serviceName, locationId),
    onSuccess,
    onError,
  });

  return {
    hostingDeleteLocation: mutation.mutate,
    ...mutation,
  };
};
