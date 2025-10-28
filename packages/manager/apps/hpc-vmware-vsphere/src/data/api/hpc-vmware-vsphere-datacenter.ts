import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { Datacenter } from '@/types/datacenter';

export const getDedicatedCloudServiceDatacenterQueryKey = (
  serviceName: string,
  datacenterId: number,
) => ['get/dedicatedCloud/datacenter', serviceName, datacenterId];

export const getDedicatedCloudServiceDatacenter = async (
  serviceName: string,
  datacenterId: number,
): Promise<ApiResponse<Datacenter>> =>
  apiClient.v6.get<Datacenter>(
    `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}`,
  );

export const getDedicatedCloudDatacenterListQueryKey = [
  'get/dedicatedCloud/datacenter',
];

export const getDedicatedCloudDatacenterList = async (
  serviceName: string,
): Promise<ApiResponse<number[]>> =>
  apiClient.v6.get<number[]>(`/dedicatedCloud/${serviceName}/datacenter`);
