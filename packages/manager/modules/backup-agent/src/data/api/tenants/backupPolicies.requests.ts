import { getDetailsVspcTenantRoute } from '@/data/api/tenants/tenants.requests';

export const getBackupPoliciesRoute = (tenantId: string) =>
  `${getDetailsVspcTenantRoute(tenantId)}/backupPolicies`;
