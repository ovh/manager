import { fetchIcebergV6, apiClient } from '@ovh-ux/manager-core-api';

export type GetipListParams = {
  /** Filter the value of campus property (ilike) (alpha) */
  campus: any;
  /** Filter the value of description property (like) */
  description: any;
  /** Filter resources on IAM tags */
  iamTags: any;
  /** Filter the value of ip property (contains or equals) */
  ip: any;
  /** Filter the value of isAdditionalIp property (&#x3D;) (alpha) */
  isAdditionalIp: any;
  /** Filter the value of routedTo.serviceName property (like) */
  routedToserviceName: any;
  /** Filter the value of type property (&#x3D;) */
  type: any;
  /** Filter the value of version property (&#x3D;) (alpha) */
  version: any;
};

export const getipListQueryKey = ['get/ip'];

/**
 * List the ip.Ip objects : Your OVH IPs
 */
export const getipList = async (params: GetipListParams): Promise<any> =>
  apiClient.v6.get('/ip', { data: params });

export type GetipIpParams = {
  /**  */
  ip?: any;
};

export const getipIpQueryKey = (params: GetipIpParams) => [
  `get/ip/${params.ip}`,
];

/**
 * Your IP : Get this object properties
 */
export const getipIp = async (params: GetipIpParams): Promise<any> =>
  apiClient.v6.get(`/ip/${params.ip}`);

/**
 *  Get listing with iceberg V6
 */
export const getListingIcebergV6 = async ({
  pageSize,
  page,
}: {
  pageSize: number;
  page: number;
}) => {
  const { data, status, totalCount } = await fetchIcebergV6({
    route: `/ip`,
    pageSize,
    page,
  });
  if (status > 400) {
    throw new Error();
  }
  return { data, status, totalCount };
};
