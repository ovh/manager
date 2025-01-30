import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

export type GetIpDetailsParams = {
  /**  */
  ip: string;
};

export type IpRoutedToType = {
  serviceName: string;
};

export enum IpTypeEnum {
  CDN = 'cdn',
  CLOUD = 'cloud',
  DEDICATED = 'dedicated',
  ADDITIONAL = 'failover',
  HOSTED_SSL = 'hosted_ssl',
  HOUSING = 'housing',
  LOAD_BALANCING = 'loadBalancing',
  MAIL = 'mail',
  OVERTHEBOX = 'overthebox',
  PCC = 'pcc',
  PCI = 'pci',
  PRIVATE = 'private',
  VPN = 'vpn',
  VPS = 'vps',
  VRACK = 'vrack',
  XDSL = 'xdsl',
}

export type IpDetails = {
  type: IpTypeEnum;
  regions: string[];
  campus: string;
  routedTo?: IpRoutedToType;
  version: number;
};

export const getIpDetailsQueryKey = (params: GetIpDetailsParams) => [
  `get/ip/${encodeURIComponent(params.ip)}`,
];

/**
 * Your IP : Get this object properties
 */
export const getIpdetails = async (
  params: GetIpDetailsParams,
): Promise<ApiResponse<IpDetails>> =>
  apiClient.v6.get<IpDetails>(`/ip/${encodeURIComponent(params.ip)}`);
