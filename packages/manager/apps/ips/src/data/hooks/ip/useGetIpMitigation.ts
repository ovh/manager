import { useQuery } from '@tanstack/react-query';
import { ApiError, IcebergFetchResultV6 } from '@ovh-ux/manager-core-api';
import {
  IpMitigationType,
  getIpMitigation,
  getIpMitigationQueryKey,
} from '@/data/api';

export type UseGetIpMitigationParams = {
  ip: string;
  enabled?: boolean;
};

export const useGetIpMitigation = ({
  ip,
  enabled = true,
}: UseGetIpMitigationParams) => {
  const { data: ipMitigationResponse, isLoading, isError, error } = useQuery<
    IcebergFetchResultV6<IpMitigationType>,
    ApiError
  >({
    queryKey: getIpMitigationQueryKey({ ip }),
    queryFn: () => getIpMitigation({ ip }),
    enabled,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  return {
    ipMitigation: ipMitigationResponse?.data,
    isLoading,
    isError,
    error,
  };
};
