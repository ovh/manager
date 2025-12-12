import { v2 } from '@ovh-ux/manager-core-api';

import { getDetailsVspcTenantRoute } from '@/data/api/tenants/tenants.requests';

export const getBackupPoliciesRoute = (tenantId: string, vspcTenantId: string) =>
  `${getDetailsVspcTenantRoute(tenantId, vspcTenantId)}/backupPolicies`;

export const getBackupPolicies = async (tenantId: string, vspcTenantId: string) =>
  (await v2.get<string[]>(getBackupPoliciesRoute(tenantId, vspcTenantId))).data;
