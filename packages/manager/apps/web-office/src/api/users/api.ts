import { fetchIcebergV6, v6 } from '@ovh-ux/manager-core-api';
import { getApiPath } from '../utils/apiPath';
import { UserNativeType } from './type';

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

// POST

// PUT

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
