import { ApiResponse, v6 } from '@ovh-ux/manager-core-api';

export type GetDedicatedServerVmacVirtualAddressParams = {
  serviceName: string;
  macAddress: string;
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
