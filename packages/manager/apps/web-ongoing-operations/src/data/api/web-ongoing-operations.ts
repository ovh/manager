import { v6 } from '@ovh-ux/manager-core-api';
import { taskMeDomain } from '@/constants';
import { TArgument, TOngoingOperations } from '@/types';

/**
 * Get information about domain related tasks : Get this object properties
 */
export const getmeTaskDomainId = async (
  id: number,
): Promise<TOngoingOperations> =>
  v6.get(`${taskMeDomain}/${id}`).then((res) => res.data);

/**
 * Get information about domain related tasks : Get the domain argument names
 */
export const getmeTaskDomainArgumentNames = async (
  id: number,
): Promise<string[]> =>
  v6.get(`/me/task/domain/${id}/argument`).then((res) => res.data);

/**
 * Get information about domain related tasks : Get the domain task argument
 */
export const getmeTaskDomainArgument = async (
  id: number,
  nic: string,
): Promise<TArgument> =>
  v6.get(`/me/task/domain/${id}/argument/${nic}`).then((res) => res.data);

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
  return v6.put(`/me/task/domain/${taskID}/argument/${key}`, body);
};
