import {
  fetchIcebergV6,
  apiClient,
  ApiResponse,
} from '@ovh-ux/manager-core-api';

export type GetIpListParams = {
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

export const getIpListQueryKey = ['get/ip'];

/**
 * List the ip.Ip objects : Your OVH IPs
 */
export const getIpList = async (params: GetIpListParams): Promise<any> =>
  apiClient.v6.get('/ip', { data: params });

export type GetIpIpParams = {
  /**  */
  ip?: any;
};

export const getIpIpQueryKey = (params: GetIpIpParams) => [
  `get/ip/${params.ip}`,
];

/**
 * Your IP : Get this object properties
 */
export const getIpIp = async (params: GetIpIpParams): Promise<any> =>
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

export const getOrganisationList = async (): Promise<ApiResponse<string[]>> =>
  apiClient.v6.get<string[]>('/me/ipOrganisation');

export type Organisation = {
  city: string;
  country: string;
  abuse_mailbox: string;
  lastname: string;
  zip: string;
  firstname: string;
  address: string;
  registry: 'RIPE' | 'ARIN';
  state: string;
  phone: string;
  organisationId: string;
};

export const getOrganisation = async (
  orgId: string,
): Promise<ApiResponse<Organisation>> =>
  apiClient.v6.get<Organisation>(`/me/ipOrganisation/${orgId}`);

export enum ServiceType {
  vrack = 'vrack',
  vps = 'vps',
  dedicatedCloud = 'dedicatedCloud',
  ipParking = 'ipParking',
  server = 'server',
  unknown = 'unknown',
}
