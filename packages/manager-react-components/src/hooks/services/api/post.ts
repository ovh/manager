/**
 * @deprecated This file is deprecated. Do not use any of its exports.
 * @deprecated file will be removed in MRC v3, all code will be move in @ovh-ux/manager-module-common-api' or already moved
 */
import { apiClient } from '@ovh-ux/manager-core-api';

/**
 * @deprecated The type is deprecated and will be removed in MRC V3.
 */
export type DeleteServiceParams = {
  serviceId: number;
};

/**
 * Terminiate a service
 * @deprecated This function is deprecated and will be removed in MRC V3.
 */
export const deleteService = async ({ serviceId }: DeleteServiceParams) =>
  apiClient.v6.post<{ message: string }>(`/services/${serviceId}/terminate`);
