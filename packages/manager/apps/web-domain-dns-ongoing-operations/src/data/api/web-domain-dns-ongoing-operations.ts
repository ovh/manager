import { fetchIcebergV6, apiClient } from '@ovh-ux/manager-core-api';

export type GetmeTaskDomainListParams = {
  /** Filter the value of domain property (like) */
  domain: any;
  /** Filter the value of function property (like) */
  function: any;
  /** Filter the value of status property (&#x3D;) */
  status: any;
};

// === DOMAINE === //

export const getmeTaskDomainListQueryKey = ['get/me/task/domain'];

/**
 * Get information about domain related tasks : List of domain tasks
 */
export const getmeTaskDomainList = async (
  params: GetmeTaskDomainListParams,
): Promise<any> => apiClient.v6.get('/me/task/domain', { data: params });

export type GetmeTaskDomainIdParams = {
  /** Id */
  id?: number;
};

export const getmeTaskDomainIdQueryKey = (params: GetmeTaskDomainIdParams) => [
  `get/me/task/domain/${params.id}`,
];

/**
 * Get information about domain related tasks : Get this object properties
 */
export const getmeTaskDomainId = async (id: string): Promise<any> =>
  apiClient.v6.get(`/me/task/domain/${id}`);

/**
 * Get information about domain related tasks : Get the domain task nic
 */
export const getmeTaskDomainNicList = async (id: string): Promise<any> =>
  apiClient.v6.get(`/me/task/domain/${id}/argument`);

/**
 * Get information about domain related tasks : Get the domain task argument
 */
export const getmeTaskDomainArgument = async (
  id: string,
  nic: string,
): Promise<any> => apiClient.v6.get(`/me/task/domain/${id}/argument/${nic}`);

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
    route: `/me/task/domain`,
    pageSize,
    page,
  });
  if (status > 400) {
    throw new Error();
  }
  return { data, status, totalCount };
};

// === DNS === //
