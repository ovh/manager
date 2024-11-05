import { fetchIcebergV6, apiClient } from '@ovh-ux/manager-core-api';

export type GetlicenseOfficeListParams = {
  /** Filter resources on IAM tags */
  iamTags: any;
};

export const getlicenseOfficeListQueryKey = ['get/license/office'];

/**
 * Operations about Office services : List available services
 */
export const getlicenseOfficeList = async (
  params: GetlicenseOfficeListParams,
): Promise<any> => apiClient.v6.get('/license/office', { data: params });

export type GetlicenseOfficeServiceParams = {
  /** Service name */
  serviceName?: any;
};

export const getlicenseOfficeServiceQueryKey = (
  params: GetlicenseOfficeServiceParams,
) => [`get/license/office/${params.serviceName}`];

/**
 * Operations about Office services : Get this object properties
 */
export const getlicenseOfficeService = async (
  params: GetlicenseOfficeServiceParams,
): Promise<any> => apiClient.v6.get(`/license/office/${params.serviceName}`);

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
    route: `/license/office`,
    pageSize,
    page,
  });
  if (status > 400) {
    throw new Error();
  }
  return { data, status, totalCount };
};
