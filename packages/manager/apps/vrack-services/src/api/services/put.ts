import { apiClient } from '@ovh-ux/manager-core-api';

export type UpdateVrackServicesNameParams = {
  /** vrackServices service id */
  serviceId: number;
  /** vrackServices new name */
  displayName: string;
};

export const updateVrackServicesNameQueryKey = () => [
  `put/services/displayName`,
];

/**
 * Update a vrack services name
 */
export const updateVrackServicesName = async ({
  serviceId,
  displayName,
}: UpdateVrackServicesNameParams) =>
  apiClient.v6.put(`/services/${serviceId}`, {
    displayName,
  });
