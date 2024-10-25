import { ColumnSort } from '@ovh-ux/manager-react-components';
import {
  fetchIcebergV2,
  fetchIcebergV6,
  apiClient,
} from '@ovh-ux/manager-core-api';
import { OKMS } from '@/types/okms.type';
import { defaultCompareFunction } from '@/data/api/utils';

type Response = unknown;
type Uuid = unknown;

export type GetiamPolicyListParams = {
  /** Pagination cursor */
  'X-Pagination-Cursor': string;
  /** Add extra information about resources in output */
  details: boolean;
  /** Filter on the readOnly attribute */
  readOnly: boolean;
};

export const getiamPolicyListQueryKey = ['get/iam/policy'];

/**
 *  : Retrieve all policies
 */
export const getiamPolicyList = async (
  params: GetiamPolicyListParams,
): Promise<Response[]> => apiClient.v2.get('/iam/policy', { data: params });

export type GetiamPolicyPolicyIdParams = {
  /** Add extra information about resources in output */
  details: boolean;
  /** Policy ID */
  policyId?: Uuid;
};

export const getiamPolicyPolicyIdQueryKey = (
  params: GetiamPolicyPolicyIdParams,
) => [`get/iam/policy/${params.policyId}`];

/**
 *  : Retrieve the given policy
 */
export const getiamPolicyPolicyId = async (
  params: GetiamPolicyPolicyIdParams,
): Promise<Response> =>
  apiClient.v2.get(`/iam/policy/${params.policyId}`, { data: params });

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
      route: '/iam/policy',
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
      route: '/iam/policy',
      pageSize,
      cursor,
    }).then(({ data, status, cursorNext }) => ({ data, status, cursorNext }));
    return List;
  } catch (error) {
    return null;
  }
};

/**
 *  Get okms listing with iceberg V2
 */
export const getListingIceberg = async () => {
  try {
    const List = await fetchIcebergV2({
      route: '/okms/resource',
    });
    return List.data as OKMS[];
  } catch (error) {
    return null;
  }
};

export const getOkmsResourceQueryKey = (okmsId: string) => [
  `get/okms/resource/${okmsId}`,
];

export const getOkmsServicesResourceListQueryKey = ['get/okms/resource'];

export const sortOKMS = (okms: OKMS[], sorting: ColumnSort): OKMS[] => {
  const data = [...okms];

  if (sorting) {
    const { id: sortKey, desc } = sorting;

    data.sort(defaultCompareFunction(sortKey as keyof OKMS));
    if (desc) {
      data.reverse();
    }
  }

  return data;
};
