import { apiClient } from '@ovh-ux/manager-core-api';

export type DeleteServiceParams = {
  serviceId: number;
};

/**
 * Terminiate a service
 */
export const deleteService = async ({ serviceId }: DeleteServiceParams) =>
  apiClient.v6.post<{ message: string }>(`/services/${serviceId}/terminate`);
