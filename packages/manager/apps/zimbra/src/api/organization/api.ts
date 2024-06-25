import { v2 } from '@ovh-ux/manager-core-api';
import { OrganizationBodyParamsType, OrganizationType } from './type';

// GET

export const getZimbraPlatformOrganization = async (platformId: string) => {
  const { data } = await v2.get<OrganizationType[]>(
    `/zimbra/platform/${platformId}/organization`,
  );
  return data;
};

export const getZimbraPlatformOrganizationDetails = async (
  platformId: string,
  organizationId: string,
) => {
  const { data } = await v2.get(
    `/zimbra/platform/${platformId}/organization/${organizationId}`,
  );
  return data;
};

// POST

export const postZimbraPlatformOrganization = async (
  platformId: string,
  params: OrganizationBodyParamsType,
) => {
  const { data } = await v2.post(
    `/zimbra/platform/${platformId}/organization`,
    params,
  );
  return data;
};

// PUT

export const putZimbraPlatformOrganization = async (
  platformId: string,
  organizationId: string,
  params: OrganizationBodyParamsType,
) => {
  const {
    data,
  } = await v2.put(
    `/zimbra/platform/${platformId}/organization/${organizationId}`,
    { targetSpec: params },
  );
  return data;
};

// DELETE

export const deleteZimbraPlatformOrganization = async (
  platformId: string,
  organizationId: string,
) => {
  const { data } = await v2.delete(
    `/zimbra/platform/${platformId}/organization/${organizationId}`,
  );
  return data;
};
