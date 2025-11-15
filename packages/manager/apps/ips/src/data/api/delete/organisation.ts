import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';

/**
 * Delete an IP organisation.
 *
 * @param organisationId the id of the organisation to delete
 * @returns a promise that resolves when the HTTP DELETE succeeds
 */
export const deleteOrganisation = async (
  organisationId: string,
): Promise<ApiResponse<null>> =>
  apiClient.v6.delete<null>(`/me/ipOrganisation/${organisationId}`);
