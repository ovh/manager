import { fetchIcebergV6, v6 } from '@ovh-ux/manager-core-api';
import { getApiPath } from '../utils/apiPath';
import { UserNativeType } from './type';
import { UserParamsType } from '../api.type';

// GET

export const getOfficeUsers = async (
  serviceName: string,
): Promise<UserNativeType[]> => {
  const { data } = await fetchIcebergV6<UserNativeType>({
    route: `${getApiPath(serviceName)}user`,
    disableCache: true,
  });
  return data;
};

export const getOfficeUserDetail = async (
  serviceName: string,
  activationEmail: string,
) => {
  const { data } = await v6.get(
    `${getApiPath(serviceName)}user/${activationEmail}`,
  );
  return data;
};

// POST

// PUT

export const putOfficeUserDetail = async (
  serviceName: string,
  activationEmail: string,
  params: UserParamsType,
) => {
  const { data } = await v6.put(
    `${getApiPath(serviceName)}user/${activationEmail}`,
    params,
  );
  return data;
};

// DELETE

export const deleteOfficeUser = async (
  serviceName: string,
  activationEmail: string,
) => {
  const { data } = await v6.delete(
    `${getApiPath(serviceName)}user/${activationEmail}`,
  );
  return data;
};
