import { apiClient } from '@ovh-ux/manager-core-api';
import { IpTypeEnum } from './ipDetails';

export type GetIpListParams = {
  /** Filter the value of campus property (ilike) (alpha) */
  campus?: string;
  /** Filter the value of description property (like) */
  description?: string;
  /** Filter resources on IAM tags */
  iamTags?: any;
  /** Filter the value of ip property (contains or equals) */
  ip?: string;
  /** Filter the value of isAdditionalIp property (&#x3D;) (alpha) */
  isAdditionalIp?: boolean;
  /** Filter the value of routedTo.serviceName property (like) */
  routedToserviceName?: string;
  /** Filter the value of type property (&#x3D;) */
  type?: IpTypeEnum;
  /** Filter the value of version property (&#x3D;) (alpha) */
  version?: number;
};

export const getIpListQueryKey = (params: GetIpListParams) => [
  `get/ip:${encodeURIComponent(JSON.stringify(params))}`,
];

/**
 * List the ip.Ip objects : Your OVH IPs
 */
export const getIpList = (params: GetIpListParams) =>
  apiClient.v6.get<string[]>('/ip', { params });
