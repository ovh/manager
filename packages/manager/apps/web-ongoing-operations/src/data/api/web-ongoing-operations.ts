import { fetchIcebergV6, apiClient } from '@ovh-ux/manager-core-api';
import { taskMeDns, taskMeDomain } from '@/constants';

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
  id: string,
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

// DNS
/**
 * Get information about dns related tasks : List of dns tasks
 */
export const getmeTaskDnsList = async (): Promise<any> =>
  apiClient.v6.get(taskMeDns);
