import { Resource } from '@/types/Resource.type';
import { VSPCTenant } from '@/types/VspcTenant.type';
import { hasBackupAgentAddon } from '@/utils/hasBackupAgentAddon/hasBackupAgentAddon';

export const selectBackupAgentVspcTenants = (
  tenants: Resource<VSPCTenant>[],
): Resource<VSPCTenant>[] => tenants.filter(hasBackupAgentAddon);
