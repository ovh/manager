import { IcebergFetchResultV6, fetchIcebergV6 } from '@ovh-ux/manager-core-api';

export type GetIpReverseParams = {
  /**  */
  ip: string;
};

export type IpReverseType = {
  ipReverse: string;
  reverse: string;
};

export const getIpReverseQueryKey = (params: GetIpReverseParams) => [
  `get/ip/${encodeURIComponent(params.ip)}/reverse`,
];

/**
 * Your IP : Get this object properties
 */
export const getIpReverse = async (
  params: GetIpReverseParams,
): Promise<IcebergFetchResultV6<IpReverseType>> =>
  fetchIcebergV6<IpReverseType>({
    route: `/ip/${encodeURIComponent(params.ip)}/reverse`,
    page: 1,
  });
