import { useQuery } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import { getVrackIpv6List } from '@/data/api/get/vrackIp';

export const getVrackIpv6ListKey = (serviceName: string) => [`/vrack/${serviceName}/ipv6`];

export const useGetVrackIpv6List = (serviceName: string) => {
  const { data, isLoading, isError } = useQuery<string[], ApiError>({
    queryKey: getVrackIpv6ListKey(serviceName),
    queryFn: () => getVrackIpv6List(serviceName),
    enabled: serviceName !== '',
    retry: false,
  });

  return { ipv6List: data, isLoading, isError };
};
