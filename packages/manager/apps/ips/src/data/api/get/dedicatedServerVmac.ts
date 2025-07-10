import apiClient, {
  ApiResponse,
  IcebergFetchResultV6,
  fetchIcebergV6,
} from '@ovh-ux/manager-core-api';

export type GetDedicatedServerVmacParams = {
  serviceName: string;
};

export enum MacAddressTypeEnum {
  OVH = 'ovh',
  VMWARE = 'vmware',
}

export type VirtualMac = {
  type: string;
  vmacName: string;
  vmac: string;
};

export type DedicatedServerVmacType = {
  macAddress: string;
  type: MacAddressTypeEnum;
};

export const getdedicatedServerVmacQueryKey = (
  params: GetDedicatedServerVmacParams,
) => [
  `get/dedicated/server/${encodeURIComponent(params.serviceName)}/virtualMac`,
];

export const getdedicatedServerVmac = async (
  params: GetDedicatedServerVmacParams,
): Promise<IcebergFetchResultV6<DedicatedServerVmacType>> =>
  fetchIcebergV6<DedicatedServerVmacType>({
    route: `/dedicated/server/${encodeURIComponent(
      params.serviceName,
    )}/virtualMac`,
    page: 1,
  });

type ApiStatus = {
  description: string;
  value: string;
};

type ApiOperation = {
  apiStatus: ApiStatus;
  httpMethod: string;
};

type ApiEntry = {
  path: string;
  description: string;
  operations: ApiOperation[];
};

type ModelProperty = {
  type: string;
  canBeNull: boolean;
  readOnly: boolean;
  required: boolean;
};

type ModelDescription = {
  id: string;
  namespace: string;
  description: string;
  generics?: string[];
  properties?: Record<string, ModelProperty>;
  enumType?: string;
  enum?: string[];
};

type ModelsType = Record<string, ModelDescription>;
export type ServerModelsType = {
  apiVersion?: string;
  apis?: ApiEntry[];
  basePath?: string;
  models: ModelsType;
  resourcePath?: string;
};

export const getServerModelsQueryKey = () => [`get/dedicated/server.json`];

export const getServerModels = async (): Promise<ApiResponse<
  ServerModelsType
>> => apiClient.v6.get<ServerModelsType>(`/dedicated/server.json`);
