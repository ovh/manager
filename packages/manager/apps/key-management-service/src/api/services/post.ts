import { apiClient } from '@ovh-ux/manager-core-api';

export type TerminateKmsParams = {
  serviceId: number;
};

export const terminateOKmsQueryKey = (kms: string) => [`terminateKms-${kms}`];

/**
 * Terminiate a kms
 */
export const terminateOKms = async ({ serviceId }: TerminateKmsParams) =>
  apiClient.v6.post<{ message: string }>(`/services/${serviceId}/terminate`);
