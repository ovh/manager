import { useQuery } from '@tanstack/react-query';

import { ApiError, IcebergFetchResultV6 } from '@ovh-ux/manager-core-api';

import {
  DedicatedServerVmacType,
  getdedicatedServerVmac,
  getdedicatedServerVmacQueryKey,
} from '@/data/api';
import { IpTypeEnum } from '@/data/constants';
import { getTypeByServiceName } from '@/utils';

export type UseGetIpVmacParams = {
  serviceName?: string | null;
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
    queryFn: async () => {
      try {
        return await getdedicatedServerVmac({ serviceName });
      } catch {
        return {
          data: [],
          totalCount: 0,
          status: 200,
        };
      }
    },
    enabled:
      enabled &&
      !!serviceName &&
      getTypeByServiceName(serviceName) === IpTypeEnum.DEDICATED,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  return {
    vmacs: dedicatedServerVmacResponse?.data || [],
    isLoading,
    isError,
    error,
  };
};
