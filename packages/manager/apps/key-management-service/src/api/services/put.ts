import { apiClient } from '@ovh-ux/manager-core-api';

export type UpdateOkmsNameParams = {
  /** okms service id */
  serviceId: number;
  /** okms new name */
  displayName: string;
};

export const updateOkmsNameQueryKey = () => [`put/services/displayName`];

/**
 * Update a okms service name
 */
export const updateOkmsName = async ({
  serviceId,
  displayName,
}: UpdateOkmsNameParams) =>
  apiClient.v6.put(`/services/${serviceId}`, {
    displayName,
  });
