/**
 * Whether the legacy Veeam Managed Backup offer can still be ordered on a
 * Hosted Private Cloud datacenter (BKP-1758).
 *
 * Managed Backup for VMware (MBV) replaces it: wherever MBV is open to the
 * account, the legacy offer is no longer sold. Customers who already have it
 * keep it and keep managing it. Managed Bare Metal is out of scope: its
 * routing keeps reading `dedicated-cloud:canOrderBackup` alone.
 */
export const CAN_ORDER_BACKUP_FEATURE = 'dedicated-cloud:canOrderBackup';
export const MANAGED_BACKUP_FOR_VMWARE_CONTAINER_FEATURE =
  'hpc-managed-backup-for-vmware:container';
export const MANAGED_BACKUP_FOR_VMWARE_CONTAINER_SNC_FEATURE =
  'hpc-managed-backup-for-vmware:container-snc';

/**
 * MBV is open to a normal account as soon as its container key is on, and to
 * a trusted (SNC) account only once the SNC sub-key is on too.
 */
export const isManagedBackupForVmwareOpen = ({
  isTrusted,
  isContainerAvailable,
  isContainerSncAvailable,
}) => Boolean(isContainerAvailable && (!isTrusted || isContainerSncAvailable));

const readCanOrderBackupAlone = (ovhFeatureFlipping) =>
  ovhFeatureFlipping
    .checkFeatureAvailability(CAN_ORDER_BACKUP_FEATURE)
    .then((featureAvailability) => ({
      canOrderBackup: featureAvailability.isFeatureAvailable(
        CAN_ORDER_BACKUP_FEATURE,
      ),
      isManagedBackupForVmwareOpen: false,
    }));

/**
 * Reads the three keys in a single request. If that request fails, the
 * legacy sale is not blocked on an error: MBV is considered closed and
 * `dedicated-cloud:canOrderBackup` is read alone, as it was before.
 */
export const getBackupOrderAvailability = (ovhFeatureFlipping, isTrusted) =>
  ovhFeatureFlipping
    .checkFeatureAvailability([
      CAN_ORDER_BACKUP_FEATURE,
      MANAGED_BACKUP_FOR_VMWARE_CONTAINER_FEATURE,
      MANAGED_BACKUP_FOR_VMWARE_CONTAINER_SNC_FEATURE,
    ])
    .then((featureAvailability) => ({
      canOrderBackup: featureAvailability.isFeatureAvailable(
        CAN_ORDER_BACKUP_FEATURE,
      ),
      isManagedBackupForVmwareOpen: isManagedBackupForVmwareOpen({
        isTrusted: Boolean(isTrusted),
        isContainerAvailable: featureAvailability.isFeatureAvailable(
          MANAGED_BACKUP_FOR_VMWARE_CONTAINER_FEATURE,
        ),
        isContainerSncAvailable: featureAvailability.isFeatureAvailable(
          MANAGED_BACKUP_FOR_VMWARE_CONTAINER_SNC_FEATURE,
        ),
      }),
    }))
    .catch(() => readCanOrderBackupAlone(ovhFeatureFlipping));

/**
 * Activation is blocked because of MBV only on a datacenter without backup
 * (`disabled`): an existing customer (`enabled`, `enabling`, `removing`)
 * keeps state, offer change, daily report and deactivation.
 */
export const isLegacyBackupOrderBlockedByManagedBackupForVmware = (
  backup,
  { isManagedBackupForVmwareOpen: mbvOpen },
) => Boolean(mbvOpen && backup.isInactive());

export const DATACENTER_BACKUP_STATE =
  'app.dedicatedCloud.details.datacenter.details.backup';

/**
 * `redirectTo` of the activation sub-routes (`new`, `spla-licence`,
 * `minimum-hosts`): reached by direct URL while the activation is blocked
 * because of MBV, they send back to the Backup tab, which shows why.
 */
export const redirectToBackupTabWhenOrderBlockedByManagedBackupForVmware = (
  transition,
) =>
  transition
    .injector()
    .getAsync('isOrderBlockedByManagedBackupForVmware')
    .then((isOrderBlocked) =>
      isOrderBlocked ? { state: DATACENTER_BACKUP_STATE } : false,
    );

export default {
  getBackupOrderAvailability,
  isLegacyBackupOrderBlockedByManagedBackupForVmware,
  isManagedBackupForVmwareOpen,
  redirectToBackupTabWhenOrderBlockedByManagedBackupForVmware,
};
