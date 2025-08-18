/**
 * @deprecated This file is deprecated. Do not use any of its exports.
 * @deprecated file will be removed in MRC v3, all code will be move in @ovh-ux/manager-module-common-api' or already moved
 */
import { apiClient } from '@ovh-ux/manager-core-api';

/**
 * @deprecated The type is deprecated and will be removed in MRC V3.
 */
export type UpdateServiceNameParams = {
  /** Service id */
  serviceId: number;
  /** Service new display name */
  displayName: string;
};

/**
 * Update a service's display name
 * @deprecated This function is deprecated and will be removed in MRC V3.
 */
export const updateServiceName = async ({
  serviceId,
  displayName,
}: UpdateServiceNameParams) =>
  apiClient.v6.put(`/services/${serviceId}`, {
    displayName,
  });
