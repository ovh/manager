import { AxiosResponse } from 'axios';
import { fetchIcebergV6, apiClient } from '@ovh-ux/manager-core-api';
import { IHycuDetails } from '@/types/hycu.details.interface';

export type GetlicenseHycuListParams = {
  /** Filter resources on IAM tags */
  iamTags: string;
};

export const getlicenseHycuListQueryKey = () => ['license/hycu', 'get', 'list'];
export const getlicenseHycuQueryKey = (serviceName: string) => [
  'license/hycu',
  'get',
  serviceName,
];
export const postActivateLicenseHycuMutationKey = () => [
  'license/hycu/activate',
  'post',
];

/**
 * Manage HYCU licenses : Get list of owned HYCU licenses
 */
export const getlicenseHycu = (
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

export type PostLicenseHycuActivateServiceParams = {
  /** Service name */
  serviceName: string;
  licenseContent: string;
};

/**
 * Activate HYCU licenses : Post HYCU license content
 */
export const postLicenseHycuActivateService = (
  params: PostLicenseHycuActivateServiceParams,
): Promise<AxiosResponse> =>
  apiClient.v6.post(`/license/hycu/${params.serviceName}/activate`, {
    licenseRequest: params.licenseContent,
  });

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
