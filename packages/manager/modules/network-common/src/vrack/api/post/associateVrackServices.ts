import { apiClient } from '@ovh-ux/manager-core-api';
import { AssociateVrackServicesParams, Task } from '../../types';

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
