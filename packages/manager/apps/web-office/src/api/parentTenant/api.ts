import { v6 } from '@ovh-ux/manager-core-api';
import { getApiPath } from '../utils/apiPath';
import { ParentTenantType } from './type';

// GET
export const getParentTenant = async (
  serviceName: string,
): Promise<ParentTenantType> => {
  const { data } = await v6.get<ParentTenantType>(
    `${getApiPath(serviceName)}parentTenant`,
  );
  return data;
};
// POST

// PUT
export const updateParentTenant = async (
  serviceName: string,
  parentTenantData: Partial<ParentTenantType>,
): Promise<ParentTenantType> => {
  const { data } = await v6.put<ParentTenantType>(
    `${getApiPath(serviceName)}parentTenant`,
    parentTenantData,
  );
  return data;
};

// DELETE
