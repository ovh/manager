import { AxiosResponse } from 'axios';
import { fetchIcebergV6, apiClient } from '@ovh-ux/manager-core-api';
import { IHycuDetails } from '@/type/hycu.details.interface';

export type GetlicenseHycuListParams = {
  /** Filter resources on IAM tags */
  iamTags: string;
};

export const getlicenseHycuListQueryKey = ['get/license/hycu'];

/**
 * Manage HYCU licenses : Get list of owned HYCU licenses
 */
export const getlicenseHycuList = (
  params: GetlicenseHycuListParams,
): Promise<unknown> => apiClient.v6.get('/license/hycu', { data: params });

export type GetlicenseHycuServiceParams = {
  /** Service name */
  serviceName?: string;
};

/**
 * Manage HYCU licenses : Get HYCU license info
 */
export const getlicenseHycuService = (
  params: GetlicenseHycuServiceParams,
): Promise<AxiosResponse<IHycuDetails>> =>
  apiClient.v6.get<IHycuDetails>(`/license/hycu/${params.serviceName}`);

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
