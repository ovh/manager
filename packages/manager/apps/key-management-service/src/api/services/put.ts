import { apiClient } from '@ovh-ux/manager-core-api';

export type UpdateOkmsNameParams = {
  serviceId: number;
  displayName: string;
};

export const updateOkmsNameQueryKey = () => [`put/services/displayName`];

export const updateOkmsName = async ({
  serviceId,
  displayName,
}: UpdateOkmsNameParams) =>
  apiClient.v6.put(`/services/${serviceId}`, {
    displayName,
  });
