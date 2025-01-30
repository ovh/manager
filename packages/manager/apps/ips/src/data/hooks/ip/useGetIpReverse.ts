import { useQuery } from '@tanstack/react-query';
import { ApiError, IcebergFetchResultV6 } from '@ovh-ux/manager-core-api';
import { IpReverseType, getIpReverse, getIpReverseQueryKey } from '@/data/api';

export type UseGetIpReverseParams = {
  ipGroup: string;
  enabled?: boolean;
};

export const useGetIpReverse = ({
  ipGroup,
  enabled = true,
}: UseGetIpReverseParams) => {
  const { data: ipReverseResponse, isLoading, isError, error } = useQuery<
    IcebergFetchResultV6<IpReverseType>,
    ApiError
  >({
    queryKey: getIpReverseQueryKey({ ipGroup }),
    queryFn: () => getIpReverse({ ipGroup }),
    enabled,
  });

  return { ipReverse: ipReverseResponse?.data, isLoading, isError, error };
};
