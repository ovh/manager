import { apiClient } from '@ovh-ux/manager-core-api';
import { OrganizationBodyParams } from '@/api/api.type';

export const postZimbraPlatformOrganization = async (
  platformId: string,
  params: OrganizationBodyParams,
) => {
  const { data } = await apiClient.v2.post(
    `/zimbra/platform/${platformId}/organization`,
    params,
  );
  return data;
};
