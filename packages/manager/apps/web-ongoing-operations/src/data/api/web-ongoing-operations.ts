import { fetchIcebergV6, apiClient } from '@ovh-ux/manager-core-api';
import { taskMeDns, taskMeDomain } from '@/constants';
import { TOngoingOperations } from '@/types';

export const getmeTaskDomainListQueryKey = ['get', 'me', 'task', 'domain'];

/**
 * Get information about domain related tasks : List of domain tasks
 */
export const getmeTaskDomainList = async (): Promise<TOngoingOperations[]> =>
  apiClient.v6.get(taskMeDomain).then((res) => res.data);

export const getmeTaskDomainIdQueryKey = (id: number) => [
  ['get', 'me', 'task', 'domain', id],
];

/**
 * Get information about domain related tasks : Get this object properties
 */
export const getmeTaskDomainId = async (
  id: number,
): Promise<TOngoingOperations> =>
  apiClient.v6.get(`${taskMeDomain}/${id}`).then((res) => res.data);

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

// DNS
/**
 * Get information about dns related tasks : List of dns tasks
 */
export const getmeTaskDnsList = async (): Promise<TOngoingOperations[]> =>
  apiClient.v6.get(taskMeDns).then((res) => res.data);
