import { apiClient } from '@ovh-ux/manager-core-api';
import {
  OrganizationBodyParams,
  DomainBodyParams,
  AccountBodyParams,
} from '@/api/api.type';

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

export const postZimbraDomain = async (
  platformId: string,
  params: DomainBodyParams,
) => {
  const { data } = await apiClient.v2.post(
    `/zimbra/platform/${platformId}/domain`,
    params,
  );
  return data;
};

export const postZimbraPlatformAccount = async (
  platformId: string,
  params: AccountBodyParams,
) => {
  const { data } = await apiClient.v2.post(
    `/zimbra/platform/${platformId}/account`,
    params,
  );
  return data;
};
