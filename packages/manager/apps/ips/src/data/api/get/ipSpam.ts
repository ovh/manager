import { IcebergFetchResultV6, fetchIcebergV6 } from '@ovh-ux/manager-core-api';

export type GetIpSpamParams = {
  /**  */
  ip: string;
};

export enum IpSpamStateEnum {
  BLOCKED = 'blockedForSpam',
  UNBLOCKED = 'unblocked',
  UNBLOCKING = 'unblocking',
}

export type IpSpamType = {
  date: string;
  ipSpamming: string;
  state: IpSpamStateEnum;
  time: number;
};

export const getIpSpamQueryKey = (params: GetIpSpamParams) => [
  `get/ip/${encodeURIComponent(params.ip)}/spam`,
];

/**
 * Your IP : Get this object properties
 */
export const getIpSpam = async (
  params: GetIpSpamParams,
): Promise<IcebergFetchResultV6<IpSpamType>> =>
  fetchIcebergV6<IpSpamType>({
    route: `/ip/${encodeURIComponent(params.ip)}/spam`,
    page: 1,
  });
