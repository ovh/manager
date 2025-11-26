import { useQuery } from '@tanstack/react-query';

import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

// TODO this hook should be in a common module
const meBaseKey = 'me';
const meGeolocationKey = 'geolocation';

type IpResponse = string;

type IpLocation = {
  continent: string;
  countryCode: string;
  ip: IpResponse;
};

export const getCurrentIpRoute = () => `${meBaseKey}/${meGeolocationKey}`;

export const getCurrentIpQueryKey = () => [meBaseKey, meGeolocationKey];

export const getCurrentIp = (): Promise<ApiResponse<IpLocation>> =>
  apiClient.v6.post(getCurrentIpRoute());

interface UseCurrentIpResult {
  ip: IpResponse | null;
  retrieveCurrentIp: () => Promise<IpResponse | null>;
  isLoading: boolean;
  error: unknown;
}

export const useCurrentIp = (autoFetch = false): UseCurrentIpResult => {
  const { data, refetch, isLoading, error } = useQuery<ApiResponse<IpLocation>>({
    queryKey: getCurrentIpQueryKey(),
    queryFn: () => getCurrentIp(),
    enabled: autoFetch,
  });

  const retrieveCurrentIp = async (): Promise<IpResponse | null> => {
    const result = await refetch();
    return result.data?.data.ip ?? null;
  };

  return {
    ip: data?.data.ip ?? null,
    retrieveCurrentIp,
    isLoading,
    error,
  };
};
