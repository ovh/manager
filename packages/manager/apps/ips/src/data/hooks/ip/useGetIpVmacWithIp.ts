import { UseQueryOptions, useQueries, useQuery } from '@tanstack/react-query';
import {
  ApiError,
  ApiResponse,
  IcebergFetchResultV6,
} from '@ovh-ux/manager-core-api';
import {
  DedicatedServerVmacType,
  getDedicatedServerVmacVirtualAddress,
  getdedicatedServerVmac,
  getdedicatedServerVmacQueryKey,
  getDedicatedServerVmacVirtualAddressQueryKey,
} from '@/data/api';
import { useGetDedicatedServerTasks } from './useGetDedicatedServerTasks';
import { VMAC_UPDATE_TASKS_QUERY_KEY_PARAMS } from '@/utils';

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
  const { data: dedicatedServerVmacResponse, isLoading, isError } = useQuery<
    IcebergFetchResultV6<DedicatedServerVmacType>,
    ApiError
  >({
    queryKey: getdedicatedServerVmacQueryKey({ serviceName }),
    queryFn: () => getdedicatedServerVmac({ serviceName }),
    enabled,
    retry: false,
  });

  const results = useQueries({
    queries: (dedicatedServerVmacResponse?.data || []).map(
      (vmac: any): UseQueryOptions<ApiResponse<string[]>, ApiError> => ({
        queryKey: getDedicatedServerVmacVirtualAddressQueryKey({
          serviceName,
          macAddress: vmac.macAddress,
        }),
        queryFn: () =>
          getDedicatedServerVmacVirtualAddress({
            serviceName,
            macAddress: vmac.macAddress,
          }),
        enabled: !!dedicatedServerVmacResponse?.data?.length,
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
      ...dedicatedServerVmacResponse?.data?.[index],
      ip: data?.data,
    })) as VmacWithIpType[],
  };

  return formattedResult;
};
