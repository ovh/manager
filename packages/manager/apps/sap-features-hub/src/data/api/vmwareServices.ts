import apiClient, { ApiResponse, v6 } from '@ovh-ux/manager-core-api';
import {
  SwsResponse,
  VMwareDatacentre,
  VMwareDatacentreCluster,
  VMwareService,
} from '@/types/vmwareService.type';

export type GetClustersIdsProps = {
  serviceName: string;
  datacenterId: string;
};
export type GetOneClusterProps = GetClustersIdsProps & { clusterId: number };

const vmwareServicesRoute =
  '/service?type=/dedicatedCloud&subType=EPCC&external=false';

const getVMwareDatacentreRoute = (serviceName: string) =>
  `/sws/dedicatedCloud/${serviceName}/datacenters-summary`;

const getDatacentreClusterIdsRoute = ({
  serviceName,
  datacenterId,
}: GetClustersIdsProps) =>
  `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/cluster`;

const getDatacentreClusterRoute = ({
  serviceName,
  datacenterId,
  clusterId,
}: GetOneClusterProps) =>
  `/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/cluster/${clusterId}`;

export const getVMwareServices = async (): Promise<ApiResponse<
  VMwareService[]
>> => apiClient.aapi.get(vmwareServicesRoute);

export const getVMwareDatacentres = async (
  serviceName: string,
): Promise<ApiResponse<SwsResponse<VMwareDatacentre>>> =>
  apiClient.aapi.get(getVMwareDatacentreRoute(serviceName));

export const getDatacentreClusterIds = async ({
  serviceName,
  datacenterId,
}: GetClustersIdsProps): Promise<ApiResponse<number[]>> =>
  v6.get(getDatacentreClusterIdsRoute({ serviceName, datacenterId }));

export const getDatacentreCluster = async ({
  serviceName,
  datacenterId,
  clusterId,
}: GetOneClusterProps): Promise<ApiResponse<VMwareDatacentreCluster>> =>
  v6.get(getDatacentreClusterRoute({ serviceName, datacenterId, clusterId }));
