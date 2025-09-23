import { fetchIcebergV6, v6 } from '@ovh-ux/manager-core-api';

import { ServiceType } from '@/utils/ServiceType.utils';

import { UserChangePasswordType, UserOrderParamsType, UserParamsType } from '../ApiType';
import { getApiPath } from '../utils/apiPath';
import { PendingTaskType, UserNativeType } from './type';

// GET

export const getOfficeUsers = async (serviceName: string) => {
  const { data } = await fetchIcebergV6<UserNativeType>({
    route: `${getApiPath(serviceName)}user`,
    disableCache: true,
  });
  return data;
};
export const getOfficeUsersDomain = async (serviceName: string) => {
  const { data } = await v6.get<string>(`${getApiPath(serviceName)}domain`);
  return data?.length > 0 ? data[0] : null;
};
export const getOfficeUserDetail = async (serviceName: string, activationEmail: string) => {
  const { data } = await v6.get<UserNativeType>(
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
  const serviceType = ServiceType(serviceName);
  const apiPath = getApiPath(serviceName);

  const endpoint =
    serviceType === 'payAsYouGo'
      ? `${apiPath}user/${activationEmail}/changePassword`
      : `${apiPath}changePassword`;

  const { data } = await v6.post<PendingTaskType>(endpoint, params);
  return data;
};
export const postOrderUsers = async (serviceName: string, params: UserOrderParamsType) => {
  const modifiedParams = {
    ...params,
    usageLocation: params.usageLocation.toLowerCase(),
  };
  const { data } = await v6.post<PendingTaskType>(
    `/license/office/${serviceName}/user`,
    modifiedParams,
  );
  return data;
};

// PUT

export const putOfficeUserDetail = async (
  serviceName: string,
  activationEmail: string,
  params: UserParamsType,
) => {
  const { data } = await v6.put<void>(`${getApiPath(serviceName)}user/${activationEmail}`, params);
  return data;
};

// DELETE

export const deleteOfficeUser = async (serviceName: string, activationEmail: string) => {
  const { data } = await v6.delete<PendingTaskType>(
    `${getApiPath(serviceName)}user/${activationEmail}`,
  );
  return data;
};
