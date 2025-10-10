import { UseQueryOptions, useQueries } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  DedicatedServerVmacType,
  getDedicatedServerVmacVirtualAddress,
  getdedicatedServerVmacQueryKey,
  getDedicatedServerVmacVirtualAddressQueryKey,
} from '@/data/api';
import { useGetDedicatedServerTasks } from './useGetDedicatedServerTasks';
import { VMAC_UPDATE_TASKS_QUERY_KEY_PARAMS } from '@/utils';
import { useGetIpVmac } from './useGetIpVmac';

export type UseGetIpVmacWithIpParams = {
  serviceName: string;
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
  const { vmacs, isLoading, isError } = useGetIpVmac({ serviceName, enabled });

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

  const formattedResult = {
    isLoading:
      isLoading ||
      !!results.find((result) => !!result.isLoading) ||
      hasVmacTasks,
    isError: isError || !!results.find((result) => !!result.isError),
    vmacsWithIp: results?.map(({ data }, index) => ({
      ...vmacs?.[index],
      ip: data?.data,
    })) as VmacWithIpType[],
  };

  return formattedResult;
};
