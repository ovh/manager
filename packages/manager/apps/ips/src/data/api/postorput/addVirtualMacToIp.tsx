import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export type AddVirtualMacToIpParams = {
  serviceName: string;
  ip: string;
  type: string;
  virtualMachineName: string;
};

export const addVirtualMacToIpQueryKey = (params: AddVirtualMacToIpParams) => [
  `put/dedicated/server/${params.serviceName}/virtualMac`,
];

export const addVirtualMacToIp = async ({
  serviceName,
  ip,
  type,
  virtualMachineName,
}: AddVirtualMacToIpParams): Promise<ApiResponse<void>> => {
  return apiClient.v6.post<void>(
    `/dedicated/server/${serviceName}/virtualMac`,
    {
      ipAddress: ip,
      type,
      virtualMachineName,
    },
  );
};
