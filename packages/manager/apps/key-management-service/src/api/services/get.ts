import { apiClient } from '@ovh-ux/manager-core-api';

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
  return apiClient.v6.get<number[]>(
    `/services${okms ? `?resourceName=${okms}` : ''}`,
  );
};
