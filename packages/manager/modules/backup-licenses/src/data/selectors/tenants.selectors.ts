import { Resource } from '@/types/Resource.type';
import { VspcTenant } from '@/types/VspcTenant.type';
import { hasBackupLicensesAddon } from '@/utils/hasBackupLicensesAddon/hasBackupLicensesAddon';

/**
 * `.../vspc` est partagée avec Backup Agent. Contrairement aux vaults, les deux discriminants ne
 * sont pas nullables au contrat : un tenant qui ne déclare rien n'est pas « à confirmer », il est
 * d'en face.
 */
export const selectBackupLicensesVspcTenants = (
  tenants: Resource<VspcTenant>[],
): Resource<VspcTenant>[] => tenants.filter(hasBackupLicensesAddon);
