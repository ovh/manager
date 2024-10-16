import { fetchIcebergV2, v2 } from '@ovh-ux/manager-core-api';
import { OrganizationBodyParamsType, OrganizationType } from './type';
import { getApiPath } from '../utils/apiPath';

// GET

export const getZimbraPlatformOrganization = ({
  platformId,
  pageParam,
}: {
  platformId: string;
  pageParam?: unknown;
}) =>
  fetchIcebergV2<OrganizationType[]>({
    route: `${getApiPath(platformId)}organization`,
    pageSize: 25,
    cursor: pageParam as string,
  });

export const getZimbraPlatformOrganizationDetails = async (
  platformId: string,
  organizationId: string,
) => {
  const { data } = await v2.get(
    `${getApiPath(platformId)}organization/${organizationId}`,
  );
  return data;
};

// POST

export const postZimbraPlatformOrganization = async (
  platformId: string,
  params: OrganizationBodyParamsType,
) => {
  const { data } = await v2.post(`${getApiPath(platformId)}organization`, {
    targetSpec: params,
  });
  return data;
};

// PUT

export const putZimbraPlatformOrganization = async (
  platformId: string,
  organizationId: string,
  params: OrganizationBodyParamsType,
) => {
  const { data } = await v2.put(
    `${getApiPath(platformId)}organization/${organizationId}`,
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
    `${getApiPath(platformId)}organization/${organizationId}`,
  );
  return data;
};
