import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export type UpdateIpReverseParams = {
  /**  */
  ipGroup: string;
  ip: string;
  reverse: string;
};

export type IpReverseResponseType = {
  ipReverse: string;
  reverse: string;
};

export const updateIpReverseQueryKey = (params: UpdateIpReverseParams) => [
  `post/ip/${encodeURIComponent(params.ip)}/reverse/${encodeURIComponent(
    params.ip,
  )}`,
];

/**
 * Your IP : Get this object properties
 */
export const updateIpReverse = async (
  params: UpdateIpReverseParams,
): Promise<ApiResponse<IpReverseResponseType>> => {
  return apiClient.v6.post<IpReverseResponseType>(
    `/ip/${encodeURIComponent(params.ipGroup)}/reverse`,
    {
      ipReverse: params.ip,
      reverse: params.reverse,
    },
  );
};
