import { queryClient } from '@ovh-ux/manager-react-core-application';
import {
  fetchIcebergV2,
  fetchIcebergV6,
  apiClient,
} from '@ovh-ux/manager-core-api';

type ProjectWithIAM = unknown;

export type GetcloudProjectListParams = {
  /** Filter resources on IAM tags */
  iamTags: unknown;
};

export const getcloudProjectListQueryKey = ['get/cloud/project'];

/**
 * Operations about the PUBLICCLOUD service : List available services
 */
export const getcloudProjectList = async (
  params: GetcloudProjectListParams,
): Promise<string[]> => apiClient.v6.get('/cloud/project', { data: params });

export type GetcloudProjectServiceParams = {
  /** Service name */
  serviceName?: string;
};

export const getcloudProjectServiceQueryKey = (
  params: GetcloudProjectServiceParams,
) => [`get/cloud/project/${params.serviceName}`];

/**
 * Operations about the PUBLICCLOUD service : Get this object properties
 */
export const getcloudProjectService = async (
  params: GetcloudProjectServiceParams,
): Promise<ProjectWithIAM> =>
  apiClient.v6.get(`/cloud/project/${params.serviceName}`);

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
  try {
    const List = await fetchIcebergV6({
      route: '/cloud/project',
      pageSize,
      page,
    }).then(({ data, status, totalCount }) => ({ data, status, totalCount }));
    return List;
  } catch (error) {
    return null;
  }
};

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
  try {
    const List = await fetchIcebergV2({
      route: '/cloud/project',
      pageSize,
      cursor,
    }).then(({ data, status, cursorNext }) => ({ data, status, cursorNext }));
    return List;
  } catch (error) {
    return null;
  }
};
