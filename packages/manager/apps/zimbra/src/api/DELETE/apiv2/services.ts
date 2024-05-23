import { apiClient } from '@ovh-ux/manager-core-api';

export const deleteZimbraPlatformOrganization = async (
  platformId: string,
  organizationId: string,
) => {
  try {
    const response = await apiClient.v2.delete<void>(
      `/zimbra/platform/${platformId}/organizations/${organizationId}`,
    );

    return response.data;
  } catch (error) {
    console.log('Error deleting Zimbra organization:', error.message);
    throw error;
  }
};
