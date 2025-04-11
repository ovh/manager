import { fetchIcebergV2, v2 } from '@ovh-ux/manager-core-api';
import { AliasBodyParamsType, AliasType } from './type';
import { getApiPath } from '../utils/apiPath';
import { APIV2_DEFAULT_PAGESIZE } from '@/utils';

// GET

export const getZimbraPlatformAliases = ({
  platformId,
  searchParams,
  pageParam,
  pageSize = APIV2_DEFAULT_PAGESIZE,
}: {
  platformId: string;
  searchParams?: string;
  pageParam?: unknown;
  pageSize?: number;
}) =>
  fetchIcebergV2<AliasType[]>({
    route: `${getApiPath(platformId)}alias${searchParams}`,
    pageSize,
    cursor: pageParam as string,
  });

export const getZimbraPlatformAlias = async (
  platformId: string,
  id: string,
) => {
  const { data } = await v2.get<AliasType>(
    `${getApiPath(platformId)}alias/${id}`,
  );
  return data;
};

// POST

export const postZimbraPlatformAlias = async (
  platformId: string,
  params: AliasBodyParamsType,
) => {
  const { data } = await v2.post(`${getApiPath(platformId)}alias`, {
    targetSpec: params,
  });
  return data;
};

// DELETE

export const deleteZimbraPlatformAlias = async (
  platformId: string,
  aliasId: string,
) => {
  const { data } = await v2.delete(`${getApiPath(platformId)}alias/${aliasId}`);
  return data;
};
