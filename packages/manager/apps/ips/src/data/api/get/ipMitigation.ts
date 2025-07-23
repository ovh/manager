import {
  ApiResponse,
  IcebergFetchResultV6,
  fetchIcebergV6,
  v6,
} from '@ovh-ux/manager-core-api';

export type GetIpMitigationParams = {
  /**  */
  ip: string;
};

export type GetIpMitigationWithBlockParams = GetIpMitigationParams & {
  /**  */
  ipBlockip: string;
};

export enum IpMitigationStateEnum {
  CREATION_PENDING = 'creationPending',
  OK = 'ok',
  REMOVAL_PENDING = 'removalPending',
}

export type IpMitigationType = {
  permanent: boolean;
  ipOnMitigation: string;
  state: IpMitigationStateEnum;
  auto: boolean;
};

export const getIpMitigationQueryKey = (params: GetIpMitigationParams) => [
  `get/ip/${encodeURIComponent(params.ip)}/mitigation`,
];

/**
 * Your IP : Get this object properties
 */
export const getIpMitigation = async (
  params: GetIpMitigationParams,
): Promise<IcebergFetchResultV6<IpMitigationType>> =>
  fetchIcebergV6<IpMitigationType>({
    route: `/ip/${encodeURIComponent(params.ip)}/mitigation`,
    page: 1,
  });

export const getIpMitigationWithoutIcebergQueryKey = (
  params: GetIpMitigationWithBlockParams,
) => [
  `get/ip/${encodeURIComponent(
    params.ipBlockip,
  )}/mitigation/${encodeURIComponent(params.ip)}`,
];

/**
 * Your IP : Get this object properties
 */
export const getIpMitigationWithoutIceberg = async (
  params: GetIpMitigationWithBlockParams,
): Promise<ApiResponse<IpMitigationType>> =>
  v6.get<IpMitigationType>(
    `/ip/${encodeURIComponent(
      params.ipBlockip,
    )}/mitigation/${encodeURIComponent(params.ip)}`,
  );
