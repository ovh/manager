import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export type DeleteIpReverseParams = {
  /**  */
  ipGroup: string;
  ip: string;
};

export const deleteIpReverseQueryKey = (params: DeleteIpReverseParams) => [
  `delete/ip/${encodeURIComponent(params.ip)}/reverse/${encodeURIComponent(
    params.ip,
  )}`,
];

/**
 * Your IP : Get this object properties
 */
export const deleteIpReverse = async (
  params: DeleteIpReverseParams,
): Promise<ApiResponse<Record<string, never>>> => {
  return apiClient.v6.delete<Record<string, never>>(
    `/ip/${encodeURIComponent(params.ipGroup)}/reverse/${encodeURIComponent(
      params.ip,
    )}`,
  );
};
