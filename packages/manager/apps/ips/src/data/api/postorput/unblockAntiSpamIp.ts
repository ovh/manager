import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export type UnblockAntiSpamIpParams = {
  ip: string;
  ipBlocked: string;
};

export const unblockAntiSpamIp = async ({
  ip,
  ipBlocked,
}: UnblockAntiSpamIpParams): Promise<ApiResponse<void>> =>
  apiClient.v6.post<void>(
    `/ip/${encodeURIComponent(ip)}/spam/${encodeURIComponent(ipBlocked)}/unblock`,
    {},
  );
