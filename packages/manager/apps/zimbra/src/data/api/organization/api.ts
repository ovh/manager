import { fetchIcebergV2, v2 } from '@ovh-ux/manager-core-api';

import { getApiPath } from '@/data/api';
import { APIV2_DEFAULT_PAGESIZE } from '@/utils';

import { OrganizationBodyParamsType, OrganizationType } from './type';

// GET

export const getZimbraPlatformOrganization = ({
  platformId,
  searchParams,
  pageParam,
  pageSize = APIV2_DEFAULT_PAGESIZE,
  disableCache,
}: {
  platformId: string;
  searchParams?: string;
  pageParam?: unknown;
  pageSize?: number;
  disableCache?: boolean;
}) =>
  fetchIcebergV2<OrganizationType[]>({
    route: `${getApiPath(platformId)}organization${searchParams}`,
    pageSize,
    cursor: pageParam as string,
    disableCache,
  });

export const getZimbraPlatformOrganizationDetails = async (
  platformId: string,
  organizationId: string,
) => {
  const { data } = await v2.get(`${getApiPath(platformId)}organization/${organizationId}`);
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
  const { data } = await v2.put(`${getApiPath(platformId)}organization/${organizationId}`, {
    targetSpec: params,
  });
  return data;
};

// DELETE

export const deleteZimbraPlatformOrganization = async (
  platformId: string,
  organizationId: string,
) => {
  const { data } = await v2.delete(`${getApiPath(platformId)}organization/${organizationId}`);
  return data;
};
