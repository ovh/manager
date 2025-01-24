import { fetchIcebergV2, apiClient } from '@ovh-ux/manager-core-api';


export type GetokmsResourceListParams = {
  /** Pagination cursor */
  'X-Pagination-Cursor': any;
  /** Pagination size */
  'X-Pagination-Size': any;
  /** Filter resources on IAM tags */
  'iamTags': any;
};

export const getokmsResourceListQueryKey = ['get/okms/resource'];

/**
 * Manage OKMS services : List OVHcloud KMS services
 */
export const getokmsResourceList = async (params: GetokmsResourceListParams): Promise<any> =>
  apiClient.v2.get('/okms/resource', { data: params });

export type GetokmsResourceOkmsIdParams = {
  /** Okms ID */
  'okmsId'?: any;
  /** Add KMS public CA (Certificate Authority) in the output */
  'publicCA': any;
};

export const getokmsResourceOkmsIdQueryKey = (params: GetokmsResourceOkmsIdParams) => [`get/okms/resource/${params.okmsId}`];

/**
 * Manage OKMS services : Get an OVHcloud KMS service
 */
export const getokmsResourceOkmsId = async (params: GetokmsResourceOkmsIdParams): Promise<any> =>
  apiClient.v2.get(`/okms/resource/${params.okmsId}`, { data: params });


