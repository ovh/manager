import { fetchIcebergV2, apiClient } from '@ovh-ux/manager-core-api';

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
