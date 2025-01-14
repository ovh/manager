import { fetchIcebergV6, v6 } from '@ovh-ux/manager-core-api';
import { getApiPath } from '../utils/apiPath';
import { UserChangePasswordType, UserParamsType } from '../api.type';
import { UserNativeType } from './type';
import { useOfficeServiceType } from '@/hooks';

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
export const postUsersPassword = async (
  serviceName: string,
  activationEmail: string,
  params: UserChangePasswordType,
) => {
  const serviceType = useOfficeServiceType(serviceName);
  const apiPath = getApiPath(serviceName);

  const endpoint =
    serviceType === 'payAsYouGo'
      ? `${apiPath}user/${activationEmail}/changePassword`
      : `${apiPath}changePassword`;

  const { data } = await v6.post(endpoint, params);
  return data;
};
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
