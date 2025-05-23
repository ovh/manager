import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export type UpdateIpReverseParams = {
  /**
   * IP block
   */
  ip: string;
  /**
   * Single IP contained in the IP Block "ip"
   */
  ipReverse: string;
  /**
   * Reverse DNS
   */
  reverse: string;
};

export type IpReverseResponseType = {
  ipReverse: string;
  reverse: string;
};

export const updateIpReverseQueryKey = ({
  ip,
  ipReverse,
}: UpdateIpReverseParams) => [
  `post/ip/${encodeURIComponent(ip)}/reverse/${encodeURIComponent(ipReverse)}`,
];

export const updateIpReverse = async ({
  ip,
  ipReverse,
  reverse,
}: UpdateIpReverseParams): Promise<ApiResponse<IpReverseResponseType>> => {
  return apiClient.v6.post<IpReverseResponseType>(
    `/ip/${encodeURIComponent(ip)}/reverse`,
    {
      ipReverse,
      reverse,
    },
  );
};
