import { v2 } from '@ovh-ux/manager-core-api';

import { getDetailsVspcTenantRoute } from '@/data/api/tenants/tenants.requests';

export const getBackupPoliciesRoute = (tenantId: string) =>
  `${getDetailsVspcTenantRoute(tenantId)}/backupPolicies`;

export const getBackupPolicies = async (vspcTenantId: string) =>
  (await v2.get<string[]>(getBackupPoliciesRoute(vspcTenantId))).data;
