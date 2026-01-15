import { v2 } from '@ovh-ux/manager-core-api';

import { getBackupPoliciesRoute } from '@/utils/apiRoutes';

export const getBackupPolicies = async (backupServicesId: string, vspcTenantId: string) => {
  const { data } = await v2.get<string[]>(getBackupPoliciesRoute(backupServicesId, vspcTenantId));
  return data;
};
