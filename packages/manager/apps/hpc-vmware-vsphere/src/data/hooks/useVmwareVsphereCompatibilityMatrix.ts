import {
  DefinedInitialDataOptions,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { SecurityOption } from '@/types/compatibilityMatrix';
import {
  getDedicatedCloudServiceCompatibilityMatrix,
  getDedicatedCloudServiceCompatibilityMatrixQueryKey,
} from '../api/hpc-vmware-vsphere-compatibilityMatrix';

export function useVmwareVsphereCompatibilityMatrix(
  serviceName?: string,
  options: Partial<
    DefinedInitialDataOptions<ApiResponse<SecurityOption[]>, ApiError>
  > = {},
): UseQueryResult<ApiResponse<SecurityOption[]>, ApiError> {
  return useQuery<ApiResponse<SecurityOption[]>, ApiError>({
    queryKey: getDedicatedCloudServiceCompatibilityMatrixQueryKey(serviceName),
    queryFn: () => getDedicatedCloudServiceCompatibilityMatrix(serviceName),
    enabled: !!serviceName,
    refetchInterval: (query) => {
      const refetchOptions = query.state.data?.data ?? [];

      const isLogForwarderDelivered = refetchOptions.some(
        (refetchOption) =>
          refetchOption.name === 'logForwarder' &&
          refetchOption.state === 'delivered',
      );

      return !isLogForwarderDelivered && 30_000;
    },
    ...options,
  });
}
