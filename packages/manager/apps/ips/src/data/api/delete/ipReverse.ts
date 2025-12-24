import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export type DeleteIpReverseParams = {
  ip: string;
  ipReverse: string;
};

export const deleteIpReverseQueryKey = ({
  ip,
  ipReverse,
}: DeleteIpReverseParams) => [
  `delete/ip/${encodeURIComponent(ip)}/reverse/${encodeURIComponent(ipReverse)}`,
];

/**
 * Your IP : Get this object properties
 */
export const deleteIpReverse = async ({
  ip,
  ipReverse,
}: DeleteIpReverseParams): Promise<ApiResponse<null>> =>
  apiClient.v6.delete<null>(
    `/ip/${encodeURIComponent(ip)}/reverse/${encodeURIComponent(ipReverse)}`,
  );
