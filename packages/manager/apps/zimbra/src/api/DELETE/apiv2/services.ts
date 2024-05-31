import { apiClient } from '@ovh-ux/manager-core-api';

export const deleteZimbraPlatformOrganization = async (
  platformId: string,
  organizationId: string,
) => {
  try {
    const response = await apiClient.v2.delete<void>(
      `/zimbra/platform/${platformId}/organization/${organizationId}`,
    );

    return response.data;
  } catch (error) {
    return error;
  }
};
