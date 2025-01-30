import { useQuery } from '@tanstack/react-query';
import { ApiError, IcebergFetchResultV6 } from '@ovh-ux/manager-core-api';
import { IpSpamType, getIpSpam, getIpSpamQueryKey } from '@/data/api';

export type UseGetIpSpamParams = {
  ipGroup: string;
};

export const useGetIpSpam = ({ ipGroup }: UseGetIpSpamParams) => {
  const { data: ipSpamResponse, isLoading, isError, error } = useQuery<
    IcebergFetchResultV6<IpSpamType>,
    ApiError
  >({
    queryKey: getIpSpamQueryKey({ ipGroup }),
    queryFn: () => getIpSpam({ ipGroup }),
  });

  return { ipSpam: ipSpamResponse?.data, isLoading, isError, error };
};
