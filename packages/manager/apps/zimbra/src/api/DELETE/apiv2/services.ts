import { apiClient } from '@ovh-ux/manager-core-api';

export const deleteZimbraPlatformOrganization = async (
  platformId: string,
  organizationId: string,
) => {
  const { data } = await apiClient.v2.delete(
    `/zimbra/platform/${platformId}/organization/${organizationId}`,
  );
  return data;
};

export const deleteZimbraPlatformAccount = async (
  platformId: string,
  accountId: string,
) => {
  const { data } = await apiClient.v2.delete(
    `/zimbra/platform/${platformId}/account/${accountId}`,
  );
  return data;
};
