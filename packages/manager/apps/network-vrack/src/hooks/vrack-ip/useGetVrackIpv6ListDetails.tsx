import { UseQueryOptions, useQueries } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import { Ipv6Detail, getVrackIpv6Detail } from '@/data/api/get/vrackIp';

import { getVrackIpv6ListKey, useGetVrackIpv6List } from './useGetVrackIpv6List';

export const getVrackIpv6DetailKey = (serviceName: string, ip: string) => [
  getVrackIpv6ListKey(serviceName),
  encodeURIComponent(ip),
];

export const useGetVrackIpv6ListDetails = (serviceName: string = '') => {
  const { ipv6List, isLoading: isLoadingList, isError } = useGetVrackIpv6List(serviceName);

  const results = useQueries({
    queries: (ipv6List ?? []).map(
      (ipv6: string): UseQueryOptions<Ipv6Detail, ApiError> => ({
        queryKey: getVrackIpv6DetailKey(serviceName, ipv6),
        queryFn: () => getVrackIpv6Detail(serviceName, ipv6),
        enabled: serviceName !== '' && !!ipv6List?.length,
      }),
    ),
  });

  return {
    isLoading: isLoadingList || !!results.find((result) => !!result.isLoading),
    isError: isError || !!results.find((result) => !!result.isError),
    ipsWithDetail: results.map(({ data }) => data).filter((ip) => !!ip),
  };
};
