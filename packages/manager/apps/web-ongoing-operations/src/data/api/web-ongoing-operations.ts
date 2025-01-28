import { fetchIcebergV6, apiClient } from '@ovh-ux/manager-core-api';
import { taskMeDomain } from '@/constants';

export const getmeTaskDomainListQueryKey = ['get', 'me', 'task', 'domain'];

/**
 * Get information about domain related tasks : List of domain tasks
 */
export const getmeTaskDomainList = async (): Promise<any> =>
  apiClient.v6.get(taskMeDomain);

export type GetmeTaskDomainIdParams = {
  /** Id */
  id?: any;
};

export const getmeTaskDomainIdQueryKey = (params: GetmeTaskDomainIdParams) => [
  ['get', 'me', 'task', 'domain', params.id],
];

/**
 * Get information about domain related tasks : Get this object properties
 */
export const getmeTaskDomainId = async (
  params: GetmeTaskDomainIdParams,
): Promise<any> => apiClient.v6.get(`${taskMeDomain}/${params.id}`);

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
    route: taskMeDomain,
    pageSize,
    page,
  });
  if (status > 400) {
    throw new Error();
  }
  return { data, status, totalCount };
};
