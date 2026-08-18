import { Resource } from '@/types/Resource.type';
import { SubscriptionStatus } from '@/types/Subscription.type';
import { VspcTenant } from '@/types/VspcTenant.type';
import { hasBackupLicensesAddon } from '@/utils/hasBackupLicensesAddon/hasBackupLicensesAddon';

export const selectSubscriptionStatus = (
  vspcTenantsByService: readonly Resource<VspcTenant>[][],
): SubscriptionStatus => {
  const tenants = vspcTenantsByService.flat().filter(hasBackupLicensesAddon);

  if (tenants.some(({ resourceStatus }) => resourceStatus === 'READY')) {
    return SubscriptionStatus.READY;
  }
  if (!tenants.length) {
    return SubscriptionStatus.NONE;
  }
  if (tenants.every(({ resourceStatus }) => resourceStatus === 'ERROR')) {
    return SubscriptionStatus.ERROR;
  }
  return SubscriptionStatus.PENDING;
};
