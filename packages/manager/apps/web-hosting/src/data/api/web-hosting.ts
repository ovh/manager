import { apiClient } from '@ovh-ux/manager-core-api';

export type GetDomainNameListParams = {
  /** Pagination cursor */
  'X-Pagination-Cursor': string;
  /** Pagination size */
  'X-Pagination-Size': string;
  /** Filter resources on IAM tags */
  iamTags: string[];
};

export const getDomainNameListQueryKey = ['get', 'domain', 'name'];

/**
 * List domain resources : List all domain name resources
 */
export const getDomainNameList = async (
  params: GetDomainNameListParams,
): Promise<string[]> => apiClient.v2.get('/domain/name', { data: params });
