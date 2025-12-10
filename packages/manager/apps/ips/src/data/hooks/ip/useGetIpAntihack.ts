import { useQuery } from '@tanstack/react-query';
import { ApiError, IcebergFetchResultV6 } from '@ovh-ux/manager-core-api';
import {
  IpAntihackType,
  getIpAntihack,
  getIpAntihackQueryKey,
} from '@/data/api';

export type UseGetIpAntihackParams = {
  ip: string;
  enabled?: boolean;
};

export const useGetIpAntihack = ({
  ip,
  enabled = true,
}: UseGetIpAntihackParams) => {
  const { data: ipAntihackResponse, isLoading, isError, error } = useQuery<
    IcebergFetchResultV6<IpAntihackType>,
    ApiError
  >({
    queryKey: getIpAntihackQueryKey({ ip }),
    queryFn: () => getIpAntihack({ ip }),
    enabled,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  return { ipAntihack: ipAntihackResponse?.data, isLoading, isError, error };
};
