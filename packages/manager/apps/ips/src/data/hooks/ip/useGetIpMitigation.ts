import { useQuery } from '@tanstack/react-query';
import { ApiError, IcebergFetchResultV6 } from '@ovh-ux/manager-core-api';
import {
  IpMitigationType,
  getIpMitigation,
  getIpMitigationQueryKey,
} from '@/data/api';

export type UseGetIpMitigationParams = {
  ipGroup: string;
  enabled?: boolean;
};

export const useGetIpMitigation = ({
  ipGroup,
  enabled = true,
}: UseGetIpMitigationParams) => {
  const { data: ipMitigationResponse, isLoading, isError, error } = useQuery<
    IcebergFetchResultV6<IpMitigationType>,
    ApiError
  >({
    queryKey: getIpMitigationQueryKey({ ipGroup }),
    queryFn: () => getIpMitigation({ ipGroup }),
    enabled,
  });

  return {
    ipMitigation: ipMitigationResponse?.data,
    isLoading,
    isError,
    error,
  };
};
