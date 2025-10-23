import { fetchIcebergV2, v2 } from '@ovh-ux/manager-core-api';

import { getApiPath } from '@/data/api';
import { APIV2_DEFAULT_PAGESIZE } from '@/utils';

import { RedirectionBodyParamsType, RedirectionType } from './type';

// GET

export const getZimbraPlatformRedirections = ({
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
  fetchIcebergV2<RedirectionType[]>({
    route: `${getApiPath(platformId)}redirection${searchParams}`,
    pageSize,
    cursor: pageParam as string,
    disableCache,
  });

export const getZimbraPlatformRedirection = async (platformId: string, id: string) => {
  const { data } = await v2.get<RedirectionType>(`${getApiPath(platformId)}redirection/${id}`);
  return data;
};

// POST

export const postZimbraPlatformRedirection = async (
  platformId: string,
  params: RedirectionBodyParamsType,
) => {
  const { data } = await v2.post(`${getApiPath(platformId)}redirection`, {
    targetSpec: params,
  });
  return data;
};

// DELETE

export const deleteZimbraPlatformRedirection = async (
  platformId: string,
  redirectionId: string,
) => {
  const { data } = await v2.delete(`${getApiPath(platformId)}redirection/${redirectionId}`);
  return data;
};
