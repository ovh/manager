import { Query, UseQueryOptions, useQueries, useQuery } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import { INVALIDATED_REFRESH_PERIOD } from '@/App.constants';
import type { IpDetail } from '@/data/api/get/ip';
import { getIpDetail } from '@/data/api/get/ip';
import type { VrackEligibleServices } from '@/data/api/get/vrackEligibleServices';
import { getVrackEligibleServices } from '@/data/api/get/vrackEligibleServices';

export const getIpDetailKey = (ip: string) => [`/ip/${ip}`];
export const getGetEligibleServicesKey = (serviceName: string) => [
  `/vrack/${serviceName}/eligibleServices`,
];

export const useGetEligibleServices = (serviceName: string = '', region: string) => {
  const {
    data,
    isLoading: isLoadingEligibleServices,
    isFetching: isFetchingEligibleServices,
    isError,
  } = useQuery<VrackEligibleServices, ApiError>({
    queryKey: getGetEligibleServicesKey(serviceName),
    queryFn: () => getVrackEligibleServices(serviceName),
    retry: false,
    enabled: serviceName !== '',
    refetchInterval: (query: Query<VrackEligibleServices, ApiError>) => {
      if (!query.state.error && query.state.data?.status === 'pending') {
        return INVALIDATED_REFRESH_PERIOD;
      }
      return false;
    },
  });

  const ipv4Results = useQueries({
    queries: (data?.result.ip ?? []).map(
      (ip: string): UseQueryOptions<IpDetail, ApiError> => ({
        queryKey: getIpDetailKey(ip),
        queryFn: () => getIpDetail(ip),
        enabled: serviceName !== '',
      }),
    ),
  });

  const ipv6Results = useQueries({
    queries: (data?.result.ipv6 ?? []).map(
      (ip: string): UseQueryOptions<IpDetail, ApiError> => ({
        queryKey: getIpDetailKey(ip),
        queryFn: () => getIpDetail(ip),
        enabled: serviceName !== '',
      }),
    ),
  });

  const defaultIpDetailValue = {
    ip: '',
    regions: [],
    description: '',
  };

  return {
    ipv4List: ipv4Results
      .filter((result) => result.data?.regions.includes(region))
      .map(({ data }) => data ?? defaultIpDetailValue),
    ipv6List: ipv6Results
      .filter((result) => result.data?.regions.includes(region))
      .map(({ data }) => data ?? defaultIpDetailValue),
    isComplete: data?.status !== 'pending',
    isLoading:
      isLoadingEligibleServices ||
      ipv4Results.some((result) => result.isLoading) ||
      ipv6Results.some((result) => result.isLoading),
    isFetching: isFetchingEligibleServices,
    isError,
  };
};
