import { apiClient } from '@ovh-ux/manager-core-api';

export type GetVrackServicesServiceIdParams = {
  /** Filter on a specific service family */
  vrackServices: string;
};

export const GetVrackServicesServiceIdQueryKey = ({
  vrackServices,
}: GetVrackServicesServiceIdParams) => [`get/services${vrackServices || ''}`];

/**
 * allowedServices operations : List all services allowed in this vrack
 */
export const GetVrackServicesServiceId = async ({
  vrackServices,
}: GetVrackServicesServiceIdParams) => {
  return apiClient.v6.get<number[]>(
    `/services${vrackServices ? `?resourceName=${vrackServices}` : ''}`,
  );
};
