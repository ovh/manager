import { v2 } from '@ovh-ux/manager-core-api';
import { AliasBodyParamsType, AliasType } from './type';
import { getApiPath } from '../utils/apiPath';

// GET

export const getZimbraPlatformAlias = async (platformId: string) => {
  const { data } = await v2.get<AliasType[]>(`${getApiPath(platformId)}alias`);
  return data;
};

export const getZimbraPlatformAliasDetail = async (
  platformId: string,
  aliasId: string,
) => {
  const { data } = await v2.get<AliasType>(
    `${getApiPath(platformId)}alias/${aliasId}`,
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
