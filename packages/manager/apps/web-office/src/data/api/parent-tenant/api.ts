import { v6 } from '@ovh-ux/manager-core-api';

import { getApiPath } from '../utils/apiPath';
import { ParentTenantType } from './type';

export const getParentTenant = async (serviceName: string): Promise<ParentTenantType> => {
  const { data } = await v6.get<ParentTenantType>(`${getApiPath(serviceName)}parentTenant`);
  return data;
};

export const putParentTenant = async (
  serviceName: string,
  parentTenantData: Partial<ParentTenantType>,
) => {
  const { data } = await v6.put<void>(`${getApiPath(serviceName)}parentTenant`, parentTenantData);
  return data;
};
