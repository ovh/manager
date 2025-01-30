import { useQuery } from '@tanstack/react-query';
import { ApiError, IcebergFetchResultV6 } from '@ovh-ux/manager-core-api';
import {
  IpAntihackType,
  getIpAntihack,
  getIpAntihackQueryKey,
} from '@/data/api';

export type UseGetIpAntihackParams = {
  ipGroup: string;
};

export const useGetIpAntihack = ({ ipGroup }: UseGetIpAntihackParams) => {
  const { data: ipAntihackResponse, isLoading, isError, error } = useQuery<
    IcebergFetchResultV6<IpAntihackType>,
    ApiError
  >({
    queryKey: getIpAntihackQueryKey({ ipGroup }),
    queryFn: () => getIpAntihack({ ipGroup }),
  });

  return { ipAntihack: ipAntihackResponse?.data, isLoading, isError, error };
};
