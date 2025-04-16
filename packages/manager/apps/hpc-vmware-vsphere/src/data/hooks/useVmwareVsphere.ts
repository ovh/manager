import {
  DefinedInitialDataOptions,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  getDedicatedCloudService,
  getDedicatedCloudServiceQueryKey,
} from '@/data/api/hpc-vmware-vsphere';
import { TVMwareVSphere } from '@/types/vsphere';

export function useVmwareVsphere(
  serviceName?: string,
  options: Partial<
    DefinedInitialDataOptions<ApiResponse<TVMwareVSphere>, ApiError>
  > = {},
): UseQueryResult<ApiResponse<TVMwareVSphere>, ApiError> {
  return useQuery<ApiResponse<TVMwareVSphere>, ApiError>({
    queryKey: getDedicatedCloudServiceQueryKey({ serviceName }),
    queryFn: ({ signal }) => getDedicatedCloudService({ serviceName, signal }),
    enabled: !!serviceName,
    ...options,
  });
}
