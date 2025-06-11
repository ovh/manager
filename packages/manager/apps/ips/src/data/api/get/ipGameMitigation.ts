import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export type GetIpGameMitigationParams = {
  ip: string;
};

export const getIpGameMitigationQueryKey = (
  params: GetIpGameMitigationParams,
) => [`get/ip/${encodeURIComponent(params.ip)}/game`];

export const getIpGameMitigation = async (
  params: GetIpGameMitigationParams,
): Promise<ApiResponse<string[]>> =>
  apiClient.v6.get<string[]>(`/ip/${encodeURIComponent(params.ip)}/game`);
