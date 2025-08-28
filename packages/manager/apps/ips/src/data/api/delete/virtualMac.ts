import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export type DeleteVirtualMacParams = {
  serviceName: string;
  macAddresses: string[];
  ip: string;
};

export const deleteVirtualMACs = async ({
  serviceName,
  macAddresses,
  ip,
}: DeleteVirtualMacParams): Promise<Array<ApiResponse<null>>> => {
  const encodedServiceName = encodeURIComponent(serviceName);
  const encodedIp = encodeURIComponent(ip);
  return Promise.all<ApiResponse<null>>(
    macAddresses.map((macAddress) => {
      const encodedMacAdress = encodeURIComponent(macAddress);
      return apiClient.v6.delete<null>(
        `dedicated/server/${encodedServiceName}/virtualMac/${encodedMacAdress}/virtualAddress/${encodedIp}`,
      );
    }),
  );
};
