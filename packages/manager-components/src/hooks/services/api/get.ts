import { apiClient } from '@ovh-ux/manager-core-api';

export type GetResourceServiceIdParams = {
  /** Filter on a specific service family */
  resourceName: string;
};

export const getResourceServiceIdQueryKey = ({
  resourceName = '',
}: GetResourceServiceIdParams) => [`get/services${resourceName}`];

/**
 * allowedServices operations : List all services allowed in this vrack
 */
export const getResourceServiceId = async ({
  resourceName,
}: GetResourceServiceIdParams) => {
  return apiClient.v6.get<number[]>(
    `/services${resourceName ? `?resourceName=${resourceName}` : ''}`,
  );
};
