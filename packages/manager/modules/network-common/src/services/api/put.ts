import { apiClient } from '@ovh-ux/manager-core-api';

export type UpdateServiceParams = {
  serviceId: number;
  displayName?: string;
  renew?: {
    mode?: 'automatic' | 'manual';
    period?: string;
  };
  terminationPolicy?:
    | 'empty'
    | 'terminateAtEngagementDate'
    | 'terminateAtExpirationDate';
};

/**
 * Update a service's properties (e.g. display name, renew settings, termination policy).
 * Only the provided fields will be updated.
 */
export const updateService = async ({
  serviceId,
  ...params
}: UpdateServiceParams) => apiClient.v6.put(`/services/${serviceId}`, params);
