import {
  fetchIcebergV2,
  fetchIcebergV6,
  apiClient,
} from '@ovh-ux/manager-core-api';
import { ColumnSort } from '@ovhcloud/manager-components';
import { OKMS } from '@/interface';
import { defaultCompareFunction } from '@/api/utils';

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

export type OKMSOptions = {
  sorting: ColumnSort;
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

type OKMSCatalogPlanConfiguration = {
  isCustom: boolean;
  isMandatory: boolean;
  name: string;
  values: string[];
};

type OKMSCatalogPlan = {
  configurations: OKMSCatalogPlanConfiguration[];
};

export type ErrorResponse = {
  response: {
    status: number;
    data: { message: string };
  };
};

export type OKMSCatalog = {
  plans: OKMSCatalogPlan[];
};

export const getOrderCatalogOKMS = async (
  ovhSubsidiary: string,
): Promise<OKMSCatalog> => {
  const { data } = await apiClient.v6.get<OKMSCatalog>(
    `/order/catalog/public/okms?ovhSubsidiary=${ovhSubsidiary}`,
  );
  return data;
};
