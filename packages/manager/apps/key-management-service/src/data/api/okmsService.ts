import { apiClient } from '@ovh-ux/manager-core-api';
import { KMSServiceInfos } from '@/types/okmsService.type';

export type UpdateOkmsNameParams = {
  serviceId: number;
  displayName: string;
};

export const updateOkmsNameQueryKey = () => [`put/services/displayName`];

export const updateOkmsName = async ({
  serviceId,
  displayName,
}: UpdateOkmsNameParams) =>
  apiClient.v6.put(`/services/${serviceId}`, {
    displayName,
  });

export type GetOkmsServiceIdParams = {
  /** Filter on a specific service family */
  okms: string;
};

export const getOkmsServiceIdQueryKey = ({
  okms = '',
}: GetOkmsServiceIdParams) => [`get/services${okms}`];
/**
 * allowedServices operations : List all services allowed in this kms
 */
export const getOkmsServiceId = async ({ okms }: GetOkmsServiceIdParams) => {
  const resourceName = okms ? `?resourceName=${okms}` : '';
  return apiClient.v6.get<number[]>(`/services${resourceName}`);
};

export const getServiceInfos = async ({ okms }: GetOkmsServiceIdParams) => {
  const serviceId = await getOkmsServiceId({ okms });
  return apiClient.v6.get<KMSServiceInfos>(`/services/${serviceId.data[0]}`);
};

export type TerminateKmsParams = {
  serviceId: number;
};

export const terminateOKmsQueryKey = (kms: string) => [`terminateKms-${kms}`];

/**
 * Terminiate a kms
 */
export const terminateOKms = async ({ serviceId }: TerminateKmsParams) =>
  apiClient.v6.post<{ message: string }>(`/services/${serviceId}/terminate`);
