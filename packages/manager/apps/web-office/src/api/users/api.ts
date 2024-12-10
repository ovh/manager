import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';
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
