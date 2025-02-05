import { useQuery } from '@tanstack/react-query';
import { ApiError, IcebergFetchResultV6 } from '@ovh-ux/manager-core-api';
import { IpReverseType, getIpReverse, getIpReverseQueryKey } from '@/data/api';

export type UseGetIpReverseParams = {
  ip: string;
  enabled?: boolean;
};

export const useGetIpReverse = ({
  ip,
  enabled = true,
}: UseGetIpReverseParams) => {
  const { data: ipReverseResponse, isLoading, isError, error } = useQuery<
    IcebergFetchResultV6<IpReverseType>,
    ApiError
  >({
    queryKey: getIpReverseQueryKey({ ip }),
    queryFn: () => getIpReverse({ ip }),
    enabled,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  return { ipReverse: ipReverseResponse?.data, isLoading, isError, error };
};
