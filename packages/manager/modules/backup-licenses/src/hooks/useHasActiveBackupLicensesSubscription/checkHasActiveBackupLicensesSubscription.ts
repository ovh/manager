import { getBackupServicesTenants, getVspcTenants } from '@/data/api/tenants/tenants.requests';
import { ApiError } from '@/types/ClientApi.type';
import { hasBackupLicensesAddon } from '@/utils/hasBackupLicensesAddon/hasBackupLicensesAddon';

const NOT_FOUND_STATUS = 404;

export const checkHasActiveBackupLicensesSubscription = async (): Promise<boolean> => {
  let tenants;
  try {
    tenants = await getBackupServicesTenants();
  } catch (error) {
    if ((error as ApiError)?.response?.status === NOT_FOUND_STATUS) {
      return false;
    }
    throw error;
  }

  if (!tenants.length) {
    return false;
  }

  const vspcTenantsByBackupService = await Promise.all(
    tenants.map((tenant) => getVspcTenants(tenant.id)),
  );

  return vspcTenantsByBackupService.some((vspcTenants) => vspcTenants.some(hasBackupLicensesAddon));
};
