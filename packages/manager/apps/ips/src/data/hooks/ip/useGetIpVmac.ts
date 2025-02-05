import { useQuery } from '@tanstack/react-query';
import { ApiError, IcebergFetchResultV6 } from '@ovh-ux/manager-core-api';
import {
  DedicatedServerVmacType,
  getdedicatedServerVmac,
  getdedicatedServerVmacQueryKey,
} from '@/data/api';

export type UseGetIpVmacParams = {
  serviceName: string;
  enabled?: boolean;
};

// Only for dedicated server for now
export const useGetIpVmac = ({
  serviceName,
  enabled = true,
}: UseGetIpVmacParams) => {
  const {
    data: dedicatedServerVmacResponse,
    isLoading,
    isError,
    error,
  } = useQuery<IcebergFetchResultV6<DedicatedServerVmacType>, ApiError>({
    queryKey: getdedicatedServerVmacQueryKey({ serviceName }),
    queryFn: () => getdedicatedServerVmac({ serviceName }),
    enabled,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  return {
    vmacs: dedicatedServerVmacResponse?.data,
    isLoading,
    isError,
    error,
  };
};
