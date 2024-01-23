import { queryClient } from '@ovh-ux/manager-react-core-application';
import {
  fetchIcebergV2,
  fetchIcebergV6,
  apiClient,
} from '@ovh-ux/manager-core-api';

type Response = unknown;
type Uuid = unknown;

export type GetzimbraPlatformListParams = {
  /** Pagination cursor */
  'X-Pagination-Cursor': string;
  /** Add extra information about resources in output */
  details: boolean;
  /** Filter on the readOnly attribute */
  readOnly: boolean;
};

export const getzimbraPlatformListQueryKey = ['get/zimbra/platform'];

/**
 *  : Retrieve all platforms
 */
export const getzimbraPlatformList = async (
  params: GetzimbraPlatformListParams,
): Promise<Response[]> => {
  const fetchData = async () => {
    const response: any = await apiClient.v2.get('/zimbra/platform', {
      data: params,
    });
    return response;
  };
  try {
    return queryClient.fetchQuery(getzimbraPlatformListQueryKey, fetchData);
  } catch (error) {
    return Promise.reject(error);
  }
};

export type GetzimbraPlatformPlatformIdParams = {
  /** Add extra information about resources in output */
  details: boolean;
  /** Platform ID */
  platformId?: Uuid;
};

export const getzimbraPlatformPlatformIdQueryKey = (
  params: GetzimbraPlatformPlatformIdParams,
) => [`get/zimbra/platform/${params.platformId}`];

/**
 *  : Retrieve the given platform
 */
export const getzimbraPlatformPlatformId = async (
  params: GetzimbraPlatformPlatformIdParams,
): Promise<Response> => {
  const fetchData = async () => {
    const response: any = await apiClient.v2.get(
      `/zimbra/platform/${params.platformId}`,
      { data: params },
    );
    return response;
  };
  try {
    return queryClient.fetchQuery(
      getzimbraPlatformPlatformIdQueryKey(params),
      fetchData,
    );
  } catch (error) {
    return Promise.reject(error);
  }
};

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
      route: '/zimbra/platform/',
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
      route: '/zimbra/platform/',
      pageSize,
      cursor,
    }).then(({ data, status, cursorNext }) => ({ data, status, cursorNext }));
    return List;
  } catch (error) {
    return null;
  }
};
