import { useQuery } from '@tanstack/react-query';
import { ApiError, IcebergFetchResultV6 } from '@ovh-ux/manager-core-api';
import { IpSpamType, getIpSpam, getIpSpamQueryKey } from '@/data/api';

export type UseGetIpSpamParams = {
  ip: string;
  enabled?: boolean;
};

export const useGetIpSpam = ({ ip, enabled = true }: UseGetIpSpamParams) => {
  const { data: ipSpamResponse, isLoading, isError, error } = useQuery<
    IcebergFetchResultV6<IpSpamType>,
    ApiError
  >({
    queryKey: getIpSpamQueryKey({ ip }),
    queryFn: () => getIpSpam({ ip }),
    enabled,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  return { ipSpam: ipSpamResponse?.data, isLoading, isError, error };
};
