import { apiClient } from '@ovh-ux/manager-core-api';
import { Task } from '../api.type';

export type AssociateVrackServicesParams = {
  /** The internal name of your vrack */
  vrack: string;
  /** vrackServices service name */
  vrackServices: string;
};

export const associateVrackServicesQueryKey = (vrackServicesId: string) => [
  `associateVrackServices-${vrackServicesId}`,
];

/**
 * Add a vrackServices to the vrack
 */
export const associateVrackServices = async ({
  vrack,
  vrackServices,
}: AssociateVrackServicesParams) =>
  apiClient.v6.post<Task>(`/vrack/${vrack}/vrackServices`, { vrackServices });
