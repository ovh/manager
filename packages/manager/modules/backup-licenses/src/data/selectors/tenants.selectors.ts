import { Resource } from '@/types/Resource.type';
import { VspcTenant } from '@/types/VspcTenant.type';
import { hasBackupLicensesAddon } from '@/utils/hasBackupLicensesAddon/hasBackupLicensesAddon';

export const selectBackupLicensesVspcTenants = (
  tenants: Resource<VspcTenant>[],
): Resource<VspcTenant>[] => tenants.filter(hasBackupLicensesAddon);
