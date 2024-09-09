import { fetchIcebergV6, apiClient } from '@ovh-ux/manager-core-api';

export type GetlicenseHycuListParams = {
  /** Filter resources on IAM tags */
  iamTags: any;
};

export const getlicenseHycuListQueryKey = ['get/license/hycu'];

/**
 * Manage HYCU licenses : Get list of owned HYCU licenses
 */
export const getlicenseHycuList = async (
  params: GetlicenseHycuListParams,
): Promise<any> => apiClient.v6.get('/license/hycu', { data: params });

export type GetlicenseHycuServiceParams = {
  /** Service name */
  serviceName?: any;
};

export const getlicenseHycuServiceQueryKey = (
  params: GetlicenseHycuServiceParams,
) => [`get/license/hycu/${params.serviceName}`];

/**
 * Manage HYCU licenses : Get HYCU license info
 */
export const getlicenseHycuService = async (
  params: GetlicenseHycuServiceParams,
): Promise<any> => apiClient.v6.get(`/license/hycu/${params.serviceName}`);

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
    route: `/license/hycu`,
    pageSize,
    page,
  });
  if (status > 400) {
    throw new Error();
  }
  return { data, status, totalCount };
};
