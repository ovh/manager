import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export type UnblockAntiHackIpParams = {
  ip: string;
  ipBlocked: string;
};

export const unblockAntiHackIp = async ({
  ip,
  ipBlocked,
}: UnblockAntiHackIpParams): Promise<ApiResponse<void>> => {
  return apiClient.v6.post<void>(
    `/ip/${encodeURIComponent(ip)}/antihack/${encodeURIComponent(ipBlocked)}/unblock`,
    {},
  );
};
