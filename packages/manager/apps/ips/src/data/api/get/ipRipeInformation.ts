import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export type IpRipeInformation = {
  description: string;
  netname: string;
};

export type GetIpRipeInformationParams = {
  ip: string;
};

export const getIpRipeInformationQueryKey = (
  params: GetIpRipeInformationParams,
) => [`get/ip/${encodeURIComponent(params.ip)}/ripe`];

/**
 * Get IP Ripe Information
 */
export const getIpRipeInformation = async (
  params: GetIpRipeInformationParams,
): Promise<ApiResponse<IpRipeInformation>> =>
  apiClient.v6.get<IpRipeInformation>(
    `/ip/${encodeURIComponent(params.ip)}/ripe`,
  );
