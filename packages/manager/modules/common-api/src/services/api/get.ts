import { apiClient } from '@ovh-ux/manager-core-api';
import { ServiceDetails } from '../services.type';

export type GetResourceServiceIdParams = {
  /** Filter on a specific service family */
  resourceName: string;
};

export const getResourceServiceIdQueryKey = ({
  resourceName = '',
}: GetResourceServiceIdParams) => [`get/services${resourceName}`];

/**
 * allowedServices operations : List all services allowed by resource
 */
export const getResourceServiceId = async ({
  resourceName,
}: GetResourceServiceIdParams) =>
  apiClient.v6.get<number[]>(
    `/services${resourceName ? `?resourceName=${resourceName}` : ''}`,
  );

export const getServiceDetails = async (serviceId: number | string) =>
  apiClient.v6.get<ServiceDetails>(`/services/${serviceId}`);
