import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export type UpsertIpRipeInformationParams = {
  ip: string;
  description: string;
  netname: string;
};

export const upsertIpRipeInformationQueryKey = (
  params: UpsertIpRipeInformationParams,
) => [`put/ip/${encodeURIComponent(params.ip)}/ripe`];

export const upsertIpRipeInformation = async (
  params: UpsertIpRipeInformationParams,
): Promise<ApiResponse<void>> => {
  return apiClient.v6.put<void>(`/ip/${encodeURIComponent(params.ip)}/ripe`, {
    description: params.description,
    netname: params.netname,
  });
};
