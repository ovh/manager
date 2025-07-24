import apiClient, {
  ApiResponse,
  fetchIcebergV6,
  IcebergFetchResultV6,
  v6,
} from '@ovh-ux/manager-core-api';
import {
  DatacentrePortGroup,
  VMwareDatacentre,
  VMwareDatacentreCluster,
  VMwareService,
  VMwareStoragePolicy,
} from '@/types/vmwareService.type';
import {
  getClusterIdsRoute,
  getClusterRoute,
  getDatacentrePortGroupRoute,
  getDatastoresRoute,
  getVMwareDatacentreRoute,
  getVMwareStoragePolicyRoute,
  getVsanDatastoresRoute,
  VMWARE_SERVICES_ROUTE,
} from '@/utils/apiRoutes.constants';
import { Datastore, VsanDatastore } from '@/types/datastore.type';

export type TGetDatacentreParams = {
  serviceName: string;
  datacenterId: string;
};
export type TGetClusterParams = TGetDatacentreParams & {
  clusterId: number;
};

const cachedPaginationHeaders = {
  'X-Pagination-Mode': 'CachedObjectList-Pages',
};

export const getVMwareServices = async (): Promise<ApiResponse<
  VMwareService[]
>> => apiClient.aapi.get(VMWARE_SERVICES_ROUTE);

export const getVMwareStoragePolicy = async (
  serviceName: string,
): Promise<ApiResponse<VMwareStoragePolicy[]>> =>
  v6.get(getVMwareStoragePolicyRoute(serviceName), {
    headers: cachedPaginationHeaders,
  });

export const getVMwareDatacentres = async (
  serviceName: string,
): Promise<IcebergFetchResultV6<VMwareDatacentre>> =>
  fetchIcebergV6({ route: getVMwareDatacentreRoute(serviceName) });

export const getClusterIds = async ({
  serviceName,
  datacenterId,
}: TGetDatacentreParams): Promise<ApiResponse<number[]>> =>
  v6.get(getClusterIdsRoute({ serviceName, datacenterId }));

export const getCluster = async ({
  serviceName,
  datacenterId,
  clusterId,
}: TGetClusterParams): Promise<ApiResponse<VMwareDatacentreCluster>> =>
  v6.get(getClusterRoute({ serviceName, datacenterId, clusterId }));

export const getDatastores = async ({
  serviceName,
  datacenterId,
}: TGetDatacentreParams): Promise<ApiResponse<Datastore[]>> =>
  v6.get(getDatastoresRoute({ serviceName, datacenterId }), {
    headers: cachedPaginationHeaders,
  });

export const getVsanDatastores = async ({
  serviceName,
  datacenterId,
  clusterId,
}: TGetClusterParams): Promise<ApiResponse<VsanDatastore[]>> =>
  v6.get(getVsanDatastoresRoute({ serviceName, datacenterId, clusterId }), {
    headers: cachedPaginationHeaders,
  });

export const getDatacentrePortGroup = async ({
  serviceName,
  datacenterId,
}: TGetDatacentreParams): Promise<ApiResponse<DatacentrePortGroup[]>> =>
  v6.get(getDatacentrePortGroupRoute({ serviceName, datacenterId }), {
    headers: cachedPaginationHeaders,
  });
