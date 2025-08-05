/**
 * @deprecated This file is deprecated. Do not use any of its exports.
 * @deprecated file will be removed in MRC v3, all code will be move in @ovh-ux/manager-module-common-api' or already moved
 */
import { apiClient } from '@ovh-ux/manager-core-api';
import { ServiceDetails } from '../services.type';

/**
 * @deprecated The type is deprecated and will be removed in MRC V3.
 */
export type GetResourceServiceIdParams = {
  /** Filter on a specific service family */
  resourceName: string;
};

/**
 * @deprecated This function is deprecated and will be removed in MRC V3.
 */
export const getResourceServiceIdQueryKey = ({
  resourceName = '',
}: GetResourceServiceIdParams) => [`get/services${resourceName}`];

/**
 * allowedServices operations : List all services allowed in this vrack
 * @deprecated This function is deprecated and will be removed in MRC V3.
 */
export const getResourceServiceId = async ({
  resourceName,
}: GetResourceServiceIdParams) =>
  apiClient.v6.get<number[]>(
    `/services${resourceName ? `?resourceName=${resourceName}` : ''}`,
  );

/**
 * @deprecated This function is deprecated and will be removed in MRC V3.
 */
export const getServiceDetails = async (serviceId: number | string) =>
  apiClient.v6.get<ServiceDetails>(`/services/${serviceId}`);
