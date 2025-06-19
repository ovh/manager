import { useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { Datacenter } from '@/types/datacenter';
import {
  getDedicatedCloudDatacenterList,
  getDedicatedCloudDatacenterListQueryKey,
  getDedicatedCloudServiceDatacenter,
  getDedicatedCloudServiceDatacenterQueryKey,
} from '../api/hpc-vmware-vsphere-datacenter';

export function useVmwareVsphereDatacenter(serviceName?: string) {
  const datacenterListQuery = useQuery<ApiResponse<number[]>, ApiError>({
    queryKey: [...getDedicatedCloudDatacenterListQueryKey, serviceName],
    queryFn: () => getDedicatedCloudDatacenterList(serviceName),
    enabled: !!serviceName,
  });

  const datacenterId = datacenterListQuery.data?.data?.[0];

  const datacenterDetailsQuery = useQuery<ApiResponse<Datacenter>, ApiError>({
    queryKey: getDedicatedCloudServiceDatacenterQueryKey(
      serviceName,
      datacenterId,
    ),
    queryFn: () =>
      getDedicatedCloudServiceDatacenter(serviceName, datacenterId),
    enabled: !!serviceName && !!datacenterId,
  });
  return {
    isLoading:
      datacenterListQuery.isLoading || datacenterDetailsQuery.isLoading,
    error: datacenterListQuery.error || datacenterDetailsQuery.error,
    datacenter: datacenterDetailsQuery.data?.data,
  };
}
