import { fetchIcebergV2, v2 } from '@ovh-ux/manager-core-api';

import { getApiPath } from '@/data/api';
import { APIV2_DEFAULT_PAGESIZE } from '@/utils';

import { AliasBodyParamsType, AliasType } from './type';

// GET

export const getZimbraPlatformAliases = ({
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
  fetchIcebergV2<AliasType[]>({
    route: `${getApiPath(platformId)}alias${searchParams}`,
    pageSize,
    cursor: pageParam as string,
    disableCache,
  });

export const getZimbraPlatformAlias = async (platformId: string, id: string) => {
  const { data } = await v2.get<AliasType>(`${getApiPath(platformId)}alias/${id}`);
  return data;
};

// POST

export const postZimbraPlatformAlias = async (platformId: string, params: AliasBodyParamsType) => {
  const { data } = await v2.post(`${getApiPath(platformId)}alias`, {
    targetSpec: params,
  });
  return data;
};

// DELETE

export const deleteZimbraPlatformAlias = async (platformId: string, aliasId: string) => {
  const { data } = await v2.delete(`${getApiPath(platformId)}alias/${aliasId}`);
  return data;
};
