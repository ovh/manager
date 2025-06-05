import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export type UpsertIpDescriptionParams = {
  ip: string;
  description: string;
};

export const upsertIpDescriptionQueryKey = (
  params: UpsertIpDescriptionParams,
) => [`put/ip/${encodeURIComponent(params.ip)})}`];

export const upsertIpDescription = async (
  params: UpsertIpDescriptionParams,
): Promise<ApiResponse<void>> => {
  return apiClient.v6.put<void>(`/ip/${encodeURIComponent(params.ip)}`, {
    description: params.description,
  });
};
