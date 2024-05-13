import { apiClient } from '@ovh-ux/manager-core-api';

export type DeleteVrackServicesParams = {
  /** vrackServices service name */
  serviceId: number;
};

export const deleteVrackServicesQueryKey = (vrackServices: string) => [
  `deleteVrackServices-${vrackServices}`,
];

/**
 * Terminiate a vrackServices
 */
export const deleteVrackServices = async ({
  serviceId,
}: DeleteVrackServicesParams) =>
  apiClient.v6.post<{ message: string }>(`/services/${serviceId}/terminate`);
