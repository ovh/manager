import { apiClient } from '@ovh-ux/manager-core-api';

export type UpdateServiceNameParams = {
  /** Service id */
  serviceId: number;
  /** Service new display name */
  displayName: string;
};

/**
 * Update a service's display name
 */
export const updateServiceName = async ({
  serviceId,
  displayName,
}: UpdateServiceNameParams) =>
  apiClient.v6.put(`/services/${serviceId}`, {
    displayName,
  });
