import apiClient, { ApiResponse } from '@ovh-ux/manager-core-api';
import {
  SwsListResponse,
  SwsResponse,
  VMwareDatacentre,
  VMwareDatacentreCluster,
  VMwareService,
} from '@/types/vmwareService.type';

export type GetClusterProps = {
  serviceName: string;
  datacenterId: string;
};

const vmwareServicesRoute =
  '/service?type=/dedicatedCloud&subType=EPCC&external=false';

const getVMwareDatacentreRoute = (serviceName: string) =>
  `/sws/dedicatedCloud/${serviceName}/datacenters-summary`;

const getDatacentreClusterRoute = ({
  serviceName,
  datacenterId,
}: GetClusterProps) =>
  `sws/dedicatedCloud/${serviceName}/datacenters/${datacenterId}/hosts`;

export const getVMwareServices = async (): Promise<ApiResponse<
  VMwareService[]
>> => apiClient.aapi.get(vmwareServicesRoute);

export const getVMwareDatacentres = async (
  serviceName: string,
): Promise<ApiResponse<SwsResponse<VMwareDatacentre>>> =>
  apiClient.aapi.get(getVMwareDatacentreRoute(serviceName));

export const getDatacentreClusters = async ({
  serviceName,
  datacenterId,
}: GetClusterProps): Promise<ApiResponse<
  SwsListResponse<VMwareDatacentreCluster>
>> =>
  apiClient.aapi.get(getDatacentreClusterRoute({ serviceName, datacenterId }));
