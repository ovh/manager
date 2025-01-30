import { IcebergFetchResultV6, fetchIcebergV6 } from '@ovh-ux/manager-core-api';

export type GetDedicatedServerVmacParams = {
  serviceName: string;
};

export enum MacAddressTypeEnum {
  OVH = 'ovh',
  VMWARE = 'vmware',
}

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
