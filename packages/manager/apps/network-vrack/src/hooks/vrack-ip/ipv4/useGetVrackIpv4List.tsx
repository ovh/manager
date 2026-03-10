import { useQuery } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import { getVrackIpv4List } from '@/data/api/get/vrackIp';

export const getVrackIpv4ListKey = (serviceName: string) => [`/vrack/${serviceName}/ip`];

export const useGetVrackIpv4List = (serviceName: string = '') => {
  const { data, isLoading, isError } = useQuery<string[], ApiError>({
    queryKey: getVrackIpv4ListKey(serviceName),
    queryFn: () => getVrackIpv4List(serviceName),
    retry: false,
    enabled: serviceName !== '',
  });
  return { ipv4List: data, isLoading, isError };
};
