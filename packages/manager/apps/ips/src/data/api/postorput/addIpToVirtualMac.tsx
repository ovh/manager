import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export type AddIpToVirtualMacParams = {
  serviceName: string;
  macAddress: string;
  ip: string;
  virtualMachineName: string;
};

export const addIpToVirtualMacQueryKey = (params: AddIpToVirtualMacParams) => [
  `put/dedicated/server/${params.serviceName}/virtualMac/${params.macAddress}/virtualAddress`,
];

export const addIpToVirtualMac = async ({
  serviceName,
  macAddress,
  ip,
  virtualMachineName,
}: AddIpToVirtualMacParams): Promise<ApiResponse<void>> => {
  return apiClient.v6.post<void>(
    `/dedicated/server/${serviceName}/virtualMac/${macAddress}/virtualAddress`,
    {
      ipAddress: ip,
      virtualMachineName,
    },
  );
};
