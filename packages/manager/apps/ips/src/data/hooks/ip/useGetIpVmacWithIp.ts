import { UseQueryOptions, useQueries } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import {
  DedicatedServerVmacType,
  getDedicatedServerVmacVirtualAddress,
  getDedicatedServerVmacVirtualAddressQueryKey,
  getdedicatedServerVmacQueryKey,
} from '@/data/api';
import { VMAC_UPDATE_TASKS_QUERY_KEY_PARAMS } from '@/utils';

import { useGetDedicatedServerTasks } from './useGetDedicatedServerTasks';
import { useGetIpVmac } from './useGetIpVmac';

export type UseGetIpVmacWithIpParams = {
  serviceName?: string | null;
  enabled?: boolean;
};

export type VmacWithIpType = DedicatedServerVmacType & {
  ip: string[];
};

// Only for dedicated server for now
export const useGetIpVmacWithIp = ({
  serviceName,
  enabled = true,
}: UseGetIpVmacWithIpParams) => {
  const { vmacs, loading, isError } = useGetIpVmac({ serviceName, enabled });

  const results = useQueries({
    queries: (vmacs || []).map(
      (
        vmac: DedicatedServerVmacType,
      ): UseQueryOptions<ApiResponse<string[]>, ApiError> => ({
        queryKey: getDedicatedServerVmacVirtualAddressQueryKey({
          serviceName,
          macAddress: vmac.macAddress,
        }),
        queryFn: () =>
          getDedicatedServerVmacVirtualAddress({
            serviceName,
            macAddress: vmac.macAddress,
          }),
        enabled: !!serviceName && !!vmacs?.length,
      }),
    ),
  });

  const { hasOnGoingTask: hasVmacTasks } = useGetDedicatedServerTasks({
    ...VMAC_UPDATE_TASKS_QUERY_KEY_PARAMS,
    serviceName,
    enabled,
    queryKeyToInvalidate: getdedicatedServerVmacQueryKey({ serviceName }),
  });

  return {
    loading:
      loading || !!results.find((result) => !!result.isLoading) || hasVmacTasks,
    isError: isError || !!results.find((result) => !!result.isError),
    vmacsWithIp:
      results?.map(
        ({ data }, index) =>
          ({
            ...vmacs?.[index],
            ip: data?.data,
          } as VmacWithIpType),
      ) || [],
  };
};
