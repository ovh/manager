import { useQuery } from '@tanstack/react-query';
import { ApiError, IcebergFetchResultV6 } from '@ovh-ux/manager-core-api';
import {
  getIpSpamStats,
  getIpSpamStatsQueryKey,
  IpSpamStatType,
} from '@/data/api';

export type UseGetIpSpamStatsParams = {
  ip: string;
  ipSpamming: string;
  enabled?: boolean;
};

export const useGetIpSpamStats = ({
  ip,
  ipSpamming,
  enabled = true,
}: UseGetIpSpamStatsParams) => {
  const { data: ipSpamStatsResponse, isLoading, isError, error } = useQuery<
    IcebergFetchResultV6<IpSpamStatType>,
    ApiError
  >({
    queryKey: getIpSpamStatsQueryKey({ ip, ipSpamming }),
    queryFn: () => getIpSpamStats({ ip, ipSpamming }),
    enabled,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  return { ipSpamStats: ipSpamStatsResponse.data, isLoading, isError, error };
};
