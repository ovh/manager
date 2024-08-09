import { v2 } from '@ovh-ux/manager-core-api';
import { AliasType } from './type';
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
