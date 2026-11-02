/**
 * What the Backup tab of a Hosted Private Cloud datacenter leads to
 * (BKP-1775), checked in this order:
 *
 * - Managed Backup for VMware (MBV) is closed to the account (SNC), or the
 *   legacy Veeam Managed Backup offer is enabled on this datacenter, or being
 *   enabled or removed: the current tab, unchanged;
 * - the PCC has an MBV Service: a link that opens the MBV app in a new
 *   browser tab;
 * - otherwise: the MBV onboarding, inside the tab.
 *
 * Managed Bare Metal is out of scope: it never reads this.
 */
import { isLegacyBackupOrderBlockedByManagedBackupForVmware } from './backup-order-availability';

export const BACKUP_TAB = {
  LEGACY: 'legacy',
  MANAGED_BACKUP_FOR_VMWARE_ONBOARDING: 'managed-backup-for-vmware-onboarding',
  MANAGED_BACKUP_FOR_VMWARE_APP: 'managed-backup-for-vmware-app',
};

/**
 * The MBV Services are read as the MBV app reads them: the account's Backup
 * Services tenants, the VSPC tenant that carries the MBV add-on, then its
 * Services, one per protected Hosted Private Cloud.
 */
export const MANAGED_BACKUP_FOR_VMWARE_API = {
  TENANTS: '/engine/api/v2/backupServices/tenant',
  VSPC_TENANTS: (backupServicesId) =>
    `/engine/api/v2/backupServices/tenant/${backupServicesId}/vspc`,
  MANAGED_BACKUPS: (backupServicesId, vspcTenantId) =>
    `/engine/api/v2/backupServices/tenant/${backupServicesId}/vspc/${vspcTenantId}/managedBackup`,
};

const MANAGED_BACKUP_ADDON = 'MANAGED_BACKUP';
const ADVANCED_VSPC_TYPE = 'ADVANCED';

/**
 * The VSPC tenant routes are shared with Backup Licenses: only an ADVANCED
 * tenant with the MBV add-on carries MBV Services.
 */
export const selectManagedBackupVspcTenant = (vspcTenants = []) =>
  vspcTenants.find(
    ({ currentState }) =>
      currentState?.vspcType === ADVANCED_VSPC_TYPE &&
      (currentState?.enabledAddons || []).includes(MANAGED_BACKUP_ADDON),
  );

/**
 * A PCC is protected as long as one MBV Service has it as its infrastructure,
 * whatever the Service's state: deployed, active, or terminated and still
 * reactivable. A Service deleted at the end of its reactivation window is no
 * longer listed.
 */
export const isProtectedByManagedBackupForVmware = (
  managedBackups = [],
  serviceName,
) =>
  managedBackups.some(
    ({ currentState }) =>
      currentState?.hostedPrivateCloudServiceName === serviceName,
  );

const getApiv2 = ($http, url) =>
  $http({ method: 'get', url, serviceType: 'apiv2' }).then(({ data }) => data);

/**
 * The account's MBV Services, `[]` when no tenant carries the add-on. Each
 * Backup Services tenant is read in turn until one carries it; a failure
 * rejects.
 */
export const getManagedBackupForVmwareServices = ($http, $q) => {
  const readTenant = ([tenant, ...others]) => {
    if (!tenant) {
      return $q.when([]);
    }
    return getApiv2(
      $http,
      MANAGED_BACKUP_FOR_VMWARE_API.VSPC_TENANTS(tenant.id),
    ).then((vspcTenants) => {
      const vspcTenant = selectManagedBackupVspcTenant(vspcTenants);
      return vspcTenant
        ? getApiv2(
            $http,
            MANAGED_BACKUP_FOR_VMWARE_API.MANAGED_BACKUPS(
              tenant.id,
              vspcTenant.id,
            ),
          )
        : readTenant(others);
    });
  };
  return getApiv2(
    $http,
    MANAGED_BACKUP_FOR_VMWARE_API.TENANTS,
  ).then((tenants) => readTenant(tenants || []));
};

/**
 * Resolves to one of `BACKUP_TAB`. If the MBV Services cannot be read, the
 * onboarding is shown: the MBV order page already refuses a protected PCC.
 * If the legacy backup or the feature keys cannot be read, the tab stays as
 * it was.
 */
export const getBackupTab = ({
  $http,
  $q,
  backupOrderAvailability,
  getBackup,
  serviceName,
}) =>
  $q
    .all([getBackup(), backupOrderAvailability])
    .then(([backup, availability]) => {
      if (
        !isLegacyBackupOrderBlockedByManagedBackupForVmware(
          backup,
          availability,
        )
      ) {
        return BACKUP_TAB.LEGACY;
      }
      return getManagedBackupForVmwareServices($http, $q)
        .then((managedBackups) =>
          isProtectedByManagedBackupForVmware(managedBackups, serviceName)
            ? BACKUP_TAB.MANAGED_BACKUP_FOR_VMWARE_APP
            : BACKUP_TAB.MANAGED_BACKUP_FOR_VMWARE_ONBOARDING,
        )
        .catch(() => BACKUP_TAB.MANAGED_BACKUP_FOR_VMWARE_ONBOARDING);
    })
    .catch(() => BACKUP_TAB.LEGACY);

export default {
  BACKUP_TAB,
  getBackupTab,
  getManagedBackupForVmwareServices,
  isProtectedByManagedBackupForVmware,
  selectManagedBackupVspcTenant,
};
