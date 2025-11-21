import { UseQueryOptions, useQueries } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  DedicatedServerVmacType,
  getDedicatedServerVmacVirtualAddress,
  getDedicatedServerVmacVirtualAddressQueryKey,
} from '@/data/api';
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

  return {
    isLoading: isLoading || !!results.find((result) => !!result.isLoading),
    isError: isError || !!results.find((result) => !!result.isError),
    vmacsWithIp: results?.map(
      ({ data }, index): VmacWithIpType => ({
        ...vmacs?.[index],
        ip: data?.data,
      }),
    ),
  };
};
