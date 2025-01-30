import { IcebergFetchResultV6, fetchIcebergV6 } from '@ovh-ux/manager-core-api';

export type GetIpReverseParams = {
  /**  */
  ipGroup: string;
};

export type IpReverseType = {
  ipReverse: string;
  reverse: string;
};

export const getIpReverseQueryKey = (params: GetIpReverseParams) => [
  `get/ip/${encodeURIComponent(params.ipGroup)}/reverse`,
];

/**
 * Your IP : Get this object properties
 */
export const getIpReverse = async (
  params: GetIpReverseParams,
): Promise<IcebergFetchResultV6<IpReverseType>> =>
  fetchIcebergV6<IpReverseType>({
    route: `/ip/${encodeURIComponent(params.ipGroup)}/reverse`,
    page: 1,
  });
