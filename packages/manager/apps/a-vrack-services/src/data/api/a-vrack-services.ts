import {
  fetchIcebergV2,
  fetchIcebergV6,
  apiClient,
} from '@ovh-ux/manager-core-api';

export type GetvrackServicesResourceListParams = {
  /** Pagination cursor */
  'X-Pagination-Cursor': any;
  /** Filter resources on IAM tags */
  iamTags: any;
};

export const getvrackServicesResourceListQueryKey = [
  'get/vrackServices/resource',
];

/**
 * Operations on vRack Services : List all vRack Services
 */
export const getvrackServicesResourceList = async (
  params: GetvrackServicesResourceListParams,
): Promise<any> =>
  apiClient.v2.get('/vrackServices/resource', { data: params });

export type GetvrackServicesResourceVrackServicesIdParams = {
  /** Vrack services ID */
  vrackServicesId?: any;
};

export const getvrackServicesResourceVrackServicesIdQueryKey = (
  params: GetvrackServicesResourceVrackServicesIdParams,
) => [`get/vrackServices/resource/${params.vrackServicesId}`];

/**
 * Operations on vRack Services : Retrieve a vRack Services
 */
export const getvrackServicesResourceVrackServicesId = async (
  params: GetvrackServicesResourceVrackServicesIdParams,
): Promise<any> =>
  apiClient.v2.get(`/vrackServices/resource/${params.vrackServicesId}`);

/**
 *  Get listing with iceberg V2
 */

export const getListingIcebergV2 = async ({
  pageSize,
  cursor,
}: {
  pageSize: number;
  cursor?: string;
}) => {
  const { data, status, cursorNext } = await fetchIcebergV2({
    route: `/iam/policy`,
    pageSize,
    cursor,
  });
  if (status > 400) {
    throw new Error();
  }
  return { data, status, cursorNext };
};

export const getListingVpsIcebergV6 = async ({
  pageSize,
  cursor,
  page,
}: {
  pageSize: number;
  cursor?: string;
  page: number;
}) => {
  const { data, status, totalCount } = await fetchIcebergV6({
    route: `/vps`,
    pageSize,
    page,
  });
  if (status > 400) {
    throw new Error();
  }
  return { data, status, totalCount };
};
