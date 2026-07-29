import { Resource } from '@/types/Resource.type';
import { ADVANCED_VSPC_TYPE, BACKUP_LICENSES_ADDON, VspcTenant } from '@/types/VspcTenant.type';

export const hasBackupLicensesAddon = (vspcTenant: Resource<VspcTenant>): boolean =>
  vspcTenant.currentState.vspcType === ADVANCED_VSPC_TYPE &&
  Boolean(vspcTenant.currentState.enabledAddons?.includes(BACKUP_LICENSES_ADDON));
