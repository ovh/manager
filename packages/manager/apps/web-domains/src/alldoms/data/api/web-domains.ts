import { fetchIcebergV2, fetchIcebergV6, apiClient } from '@ovh-ux/manager-core-api';


export type GetallDomListParams = {
  /** Filter resources on IAM tags */
  'iamTags': any;
};

export const getallDomListQueryKey = ['get/allDom'];

/**
 *  : List available AllDom services
 */
export const getallDomList = async (params: GetallDomListParams): Promise<any> =>
  apiClient.v6.get('/allDom', { data: params });

export type GetallDomServiceParams = {
  /** Service name */
  'serviceName'?: any;
};

export const getallDomServiceQueryKey = (params: GetallDomServiceParams) => [`get/allDom/${params.serviceName}`];

/**
 *  : Get this AllDom properties
 */
export const getallDomService = async (params: GetallDomServiceParams): Promise<any> =>
  apiClient.v6.get(`/allDom/${params.serviceName}`);

/**
 *  Get listing with iceberg V6
 */
export const getListingIcebergV6 = async ({ pageSize, page }: { pageSize: number, page: number }) => {
  const { data, status, totalCount } = await fetchIcebergV6({
    route: `/allDom`,
    pageSize,
    page
  });
  if (status > 400) {
    throw new Error();
  }
  return { data, status, totalCount };
};

