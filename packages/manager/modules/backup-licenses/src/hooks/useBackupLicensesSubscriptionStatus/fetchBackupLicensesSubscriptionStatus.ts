import { ApiError } from '@ovh-ux/manager-core-api';

import { getBackupServicesTenants, getVspcTenants } from '@/data/api/tenants/tenants.requests';
import { selectSubscriptionStatus } from '@/data/selectors/subscription.selectors';
import { SubscriptionStatus } from '@/types/Subscription.type';

const NOT_FOUND_STATUS = 404;

export const fetchBackupLicensesSubscriptionStatus = async (): Promise<SubscriptionStatus> => {
  let services;
  try {
    services = await getBackupServicesTenants();
  } catch (error) {
    if ((error as ApiError)?.response?.status === NOT_FOUND_STATUS) {
      return SubscriptionStatus.NONE;
    }
    throw error;
  }

  if (!services.length) {
    return SubscriptionStatus.NONE;
  }

  const vspcTenantsByService = await Promise.all(
    services.map((service) => getVspcTenants(service.id)),
  );

  return selectSubscriptionStatus(vspcTenantsByService);
};
