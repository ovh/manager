import { apiClient } from '@ovh-ux/manager-core-api';
import { ZimbraPlatform, Organization } from '@/api/api.type';

export const getZimbraPlatformListQueryKey = ['get/zimbra/platform'];

export const getZimbraPlatformList = async () => {
  try {
    const response = await apiClient.v2.get<ZimbraPlatform[]>(
      '/zimbra/platform',
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching Zimbra platform list:', error);
    throw error;
  }
};

export const getZimbraPlatformOrganizationQueryKey = (platformId: string) => [
  `get/zimbra/platform/${platformId}/organization`,
];

export const getZimbraPlatformOrganization = async (platformId: string) => {
  try {
    const response = await apiClient.v2.get<Organization[]>(
      `/zimbra/platform/${platformId}/organization`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching Zimbra organization list:', error);
    throw error;
  }
};
export const getZimbraPlatformOrganizationDetailsQueryKey = (
  platformId: string,
  organizationId: string,
) => [`get/zimbra/platform/${platformId}/organization/${organizationId}`];
export const getZimbraPlatformOrganizationDetails = async (
  platformId: string,
  organizationId: string,
) => {
  try {
    const response = await apiClient.v2.get(
      `/zimbra/platform/${platformId}/organization/${organizationId}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching Zimbra organization details id', error);
    throw error;
  }
};
