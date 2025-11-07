import { VSPCTenant } from '@/types/VspcTenant.type';

export const countBackupAgents = (tenants: VSPCTenant[] = []): number => {
  return tenants.reduce((sum, tenant) => {
    const agentCount = tenant.backupAgents?.length ?? 0;
    return sum + agentCount;
  }, 0);
};
