import { UseQueryOptions, useQueries } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import { Ipv4Detail, getVrackIpv4Detail } from '@/data/api/get/vrackIp';

import { getVrackIpv4ListKey, useGetVrackIpv4List } from './useGetVrackIpv4List';

export const getVrackIpv4DetailKey = (serviceName: string, ip: string) => [
  getVrackIpv4ListKey(serviceName),
  encodeURIComponent(ip),
];

export const useGetVrackIpv4ListDetails = (serviceName: string = '') => {
  const { ipv4List, isLoading: isLoadingList, isError } = useGetVrackIpv4List(serviceName);

  const results = useQueries({
    queries: (ipv4List ?? []).map(
      (ipv4: string): UseQueryOptions<Ipv4Detail, ApiError> => ({
        queryKey: getVrackIpv4DetailKey(serviceName, ipv4),
        queryFn: () => getVrackIpv4Detail(serviceName, ipv4),
        enabled: serviceName !== '' && !!ipv4List?.length && !isLoadingList,
      }),
    ),
  });

  return {
    isLoading: isLoadingList || !!results.find((result) => !!result.isLoading),
    isError: isError || !!results.find((result) => !!result.isError),
    ipsWithDetail: results.map(({ data }) => data).filter((ip) => !!ip),
  };
};
