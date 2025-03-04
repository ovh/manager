import { fetchIcebergV6, apiClient } from '@ovh-ux/manager-core-api';
import { taskMeDomain } from '@/constants';
import { TArgument, TOngoingOperations } from '@/types';

/**
 * Get information about domain related tasks : Get this object properties
 */
export const getmeTaskDomainId = async (
  id: number,
): Promise<TOngoingOperations> =>
  apiClient.v6.get(`${taskMeDomain}/${id}`).then((res) => res.data);

/**
 * Get information about domain related tasks : Get the domain task nic
 */
export const getmeTaskDomainNicList = async (id: number): Promise<string[]> =>
  apiClient.v6.get(`/me/task/domain/${id}/argument`).then((res) => res.data);

/**
 * Get information about domain related tasks : Get the domain task argument
 */
export const getmeTaskDomainArgument = async (
  id: number,
  nic: string,
): Promise<TArgument> =>
  apiClient.v6
    .get(`/me/task/domain/${id}/argument/${nic}`)
    .then((res) => res.data);

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

/**
 * Update an argument of a domain task
 */
export type UpdateTaskBody = {
  value: string;
};

export const updateTask = async (
  taskID: number,
  key: string,
  body: UpdateTaskBody,
): Promise<void> => {
  return apiClient.v6.put(`/me/task/domain/${taskID}/argument/${key}`, body);
};
