import { useQuery } from '@tanstack/react-query';

import {
  getIpRipeInformation,
  getIpRipeInformationQueryKey,
} from '@/data/api/get/ipRipeInformation';

export type UseGetIpRipeInformationParams = {
  ip: string;
};

export type IpRipeInformation = {
  description: string;
  netname: string;
};

export const useGetIpRipeInformation = ({
  ip,
}: UseGetIpRipeInformationParams) => {
  const {
    data: ipRipeInfo,
    isLoading,
    isError,
    error,
  } = useQuery<IpRipeInformation>({
    queryKey: getIpRipeInformationQueryKey({ ip }),
    queryFn: () =>
      getIpRipeInformation({ ip }).then((response) => response.data),
    retry: false,
    staleTime: Number.POSITIVE_INFINITY,
  });

  return { ipRipeInfo, isLoading, isError, error };
};
