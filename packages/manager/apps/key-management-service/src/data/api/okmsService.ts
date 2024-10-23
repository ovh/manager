import { apiClient } from '@ovh-ux/manager-core-api';
import { ServiceDetails } from '@ovh-ux/manager-react-components';

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

export const getOkmsServiceIdQueryKey = (okmsId: string) => [
  `get/okms/services`,
  okmsId,
];
/**
 * allowedServices operations : List all services allowed in this kms
 */
export const getOkmsServiceId = async (okmsId: string) => {
  const resourceName = okmsId ? `?resourceName=${okmsId}` : '';
  return apiClient.v6.get<number[]>(`/services${resourceName}`);
};

export const getServiceInfos = async (okmsId: string) => {
  const serviceId = await getOkmsServiceId(okmsId);
  return apiClient.v6.get<ServiceDetails>(`/services/${serviceId.data[0]}`);
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
