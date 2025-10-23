import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export type UnblockAntiSpamIpParams = {
  ip: string;
  ipBlocked: string;
};

export const unblockAntiSpamIpQueryKey = (params: UnblockAntiSpamIpParams) => [
  `post/ip/${encodeURIComponent(params.ip)}/spam/${encodeURIComponent(
    params.ipBlocked,
  )}/unblock`,
];

export const unblockAntiSpamIp = async ({
  ip,
  ipBlocked,
}: UnblockAntiSpamIpParams): Promise<ApiResponse<void>> => {
  return apiClient.v6.post<void>(
    `/ip/${encodeURIComponent(ip)}/spam/${encodeURIComponent(
      ipBlocked,
    )}/unblock`,
    {},
  );
};
