import { fetchIcebergV6, apiClient } from '@ovh-ux/manager-core-api';
import { taskMeDns, taskMeDomain } from '@/constants';
import { TApiResponseData } from '@/types';

export const getmeTaskDomainListQueryKey = ['get', 'me', 'task', 'domain'];

/**
 * Get information about domain related tasks : List of domain tasks
 */
export const getmeTaskDomainList = async (): Promise<TApiResponseData> =>
  apiClient.v6.get(taskMeDomain);

export const getmeTaskDomainIdQueryKey = (id: number) => [
  ['get', 'me', 'task', 'domain', id],
];

/**
 * Get information about domain related tasks : Get this object properties
 */
export const getmeTaskDomainId = async (
  id: number,
): Promise<TApiResponseData> => apiClient.v6.get(`${taskMeDomain}/${id}`);

/**
 * Get information about domain related tasks : Get the domain task nic
 */
export const getmeTaskDomainNicList = async (
  id: number,
): Promise<TApiResponseData> =>
  apiClient.v6.get(`/me/task/domain/${id}/argument`);

/**
 * Get information about domain related tasks : Get the domain task argument
 */
export const getmeTaskDomainArgument = async (
  id: number,
  nic: string,
): Promise<TApiResponseData> =>
  apiClient.v6.get(`/me/task/domain/${id}/argument/${nic}`);

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
export const getmeTaskDnsList = async (): Promise<TApiResponseData> =>
  apiClient.v6.get(taskMeDns);

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
