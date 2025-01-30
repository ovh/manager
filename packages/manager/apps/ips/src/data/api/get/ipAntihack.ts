import { IcebergFetchResultV6, fetchIcebergV6 } from '@ovh-ux/manager-core-api';

export type GetIpAntihackParams = {
  ipGroup: string;
};

export enum IpAntihackStateEnum {
  BLOCKED = 'blocked',
  UNBLOCKING = 'unblocking',
}

export type IpAntihackType = {
  blockedSince: string;
  ipBlocked: string;
  state: IpAntihackStateEnum;
  time: number;
  logs: string;
};

export const getIpAntihackQueryKey = (params: GetIpAntihackParams) => [
  `get/ip/${encodeURIComponent(params.ipGroup)}/antihack`,
];

/**
 * Your IP : Get this object properties
 */
export const getIpAntihack = async (
  params: GetIpAntihackParams,
): Promise<IcebergFetchResultV6<IpAntihackType>> =>
  fetchIcebergV6<IpAntihackType>({
    route: `/ip/${encodeURIComponent(params.ipGroup)}/antihack`,
    page: 1,
  });
