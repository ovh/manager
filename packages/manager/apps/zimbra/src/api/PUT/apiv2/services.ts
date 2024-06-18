import { apiClient } from '@ovh-ux/manager-core-api';
import { OrganizationBodyParams, AccountBodyParams } from '@/api/api.type';

export const putZimbraPlatformOrganization = async (
  platformId: string,
  organizationId: string,
  params: OrganizationBodyParams,
) => {
  const {
    data,
  } = await apiClient.v2.put(
    `/zimbra/platform/${platformId}/organization/${organizationId}`,
    { targetSpec: params },
  );
  return data;
};

export const putZimbraPlatformAccount = async (
  platformId: string,
  accountId: string,
  params: AccountBodyParams,
) => {
  const {
    data,
  } = await apiClient.v2.put(
    `/zimbra/platform/${platformId}/account/${accountId}`,
    { targetSpec: params },
  );
  return data;
};
