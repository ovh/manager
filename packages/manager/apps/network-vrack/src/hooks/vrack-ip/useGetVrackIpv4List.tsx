import { useQuery } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import { getVrackIpv4List, getVrackIpv4ListKey } from '@/data/api/get/vrackIp';

export const useGetVrackIpv4List = (serviceName: string = '') => {
  const { data, isLoading, isError } = useQuery<string[], ApiError>({
    queryKey: getVrackIpv4ListKey(serviceName),
    queryFn: () => getVrackIpv4List(serviceName),
    retry: false,
    enabled: serviceName !== '',
  });
  return { ipv4List: data, isLoading, isError };
};
