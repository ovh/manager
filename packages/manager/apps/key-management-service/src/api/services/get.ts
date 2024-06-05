import { apiClient } from '@ovh-ux/manager-core-api';
import { KMSServiceInfos } from '../hooks/useKMSServiceInfos';

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
