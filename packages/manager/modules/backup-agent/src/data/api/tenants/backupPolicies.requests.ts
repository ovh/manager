import { getDetailsVspcTenantRoute } from '@/data';

export const getBackupPoliciesRoute = (tenantId: string) =>
  `${getDetailsVspcTenantRoute(tenantId)}/backupPolicies`;
