import { ApiResponse, v6 } from '@ovh-ux/manager-core-api';

export type GetDedicatedServerVmacVirtualAddressParams = {
  serviceName: string;
  macAddress: string;
};

export type GetDedicatedServerVmacDetailsParams = GetDedicatedServerVmacVirtualAddressParams & {
  ip: string;
};

export const getDedicatedServerVmacVirtualAddressQueryKey = ({
  serviceName,
  macAddress,
}: GetDedicatedServerVmacVirtualAddressParams) => [
  `get/dedicated/server/${encodeURIComponent(
    serviceName,
  )}/virtualMac/${encodeURIComponent(macAddress)}/virtualAddress`,
];

export const getDedicatedServerVmacVirtualAddress = async ({
  serviceName,
  macAddress,
}: GetDedicatedServerVmacVirtualAddressParams): Promise<ApiResponse<
  string[]
>> =>
  v6.get<string[]>(
    `/dedicated/server/${serviceName}/virtualMac/${macAddress}/virtualAddress`,
  );

export type DedicatedServerVmacDetailsType = {
  ipAddress: string;
  virtualMachineName: string;
};

export const getDedicatedServerVmacDetailsQueryKey = ({
  serviceName,
  macAddress,
  ip,
}: GetDedicatedServerVmacDetailsParams) => [
  `get/dedicated/server/${encodeURIComponent(
    serviceName,
  )}/virtualMac/${encodeURIComponent(macAddress)}/virtualAddress/${ip}`,
];

export const getDedicatedServerVmacDetails = async ({
  serviceName,
  macAddress,
  ip,
}: GetDedicatedServerVmacDetailsParams): Promise<ApiResponse<
  DedicatedServerVmacDetailsType
>> =>
  v6.get<DedicatedServerVmacDetailsType>(
    `/dedicated/server/${serviceName}/virtualMac/${macAddress}/virtualAddress/${ip}`,
  );
