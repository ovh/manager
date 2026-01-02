import { v2 } from '@ovh-ux/manager-core-api';

import { Resource } from '@/types/Resource.type';
import { Tenant } from '@/types/Tenant.type';
import { BACKUP_SERVICES_ROUTE } from '@/utils/apiRoutes';

export const getBackupServices = async (): Promise<Resource<Tenant>[]> => {
  const { data } = await v2.get<Resource<Tenant>[]>(BACKUP_SERVICES_ROUTE);
  return data;
};
