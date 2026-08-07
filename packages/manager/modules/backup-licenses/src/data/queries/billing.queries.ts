import { QueryClient, queryOptions } from '@tanstack/react-query';

import { getResourceServiceId } from '@ovh-ux/manager-module-common-api';

import { getBackupLicenses } from '@/data/api/backupLicenses/backupLicenses.requests';
import {
  getLicenseConsumption,
  getServiceConsumption,
} from '@/data/api/services/consumption.requests';
import { getVaults } from '@/data/api/vaults/vaults.requests';
import { selectVaultConsumptionElement } from '@/data/selectors/vaultConsumption.selectors';
import { selectBackupLicensesVaults } from '@/data/selectors/vaults.selectors';
import {
  BACKUP_LICENSES_VAULT_BUNDLE_PLAN_CODE,
  INCLUDED_VAULT_STORAGE_GB,
} from '@/module.constants';
import { BackupLicenseResource } from '@/types/BackupLicense.type';
import { ServiceConsumption } from '@/types/Consumption.type';
import { VaultResource } from '@/types/Vault.type';
import {
  BillingPeriod,
  LicenseConsumptionRow,
  VaultConsumptionRow,
} from '@/types/VaultConsumption.type';

import { queryKeys } from './queryKeys';
import { tenantsQueries } from './tenants.queries';

export type BillingConsumption = {
  vaultRows: VaultConsumptionRow[];
  licenseRows: LicenseConsumptionRow[];
  period: BillingPeriod;
};

const resolveServiceId = async (resourceName: string): Promise<string> => {
  const { data } = await getResourceServiceId({ resourceName });
  const serviceId = data[0];
  if (serviceId === undefined) throw new Error(`No service found for resource ${resourceName}`);
  return String(serviceId);
};

const resolveVaultStorageConsumption = async (
  vault: VaultResource,
): Promise<ServiceConsumption | undefined> => {
  const serviceId = await resolveServiceId(vault.currentState.resourceName);
  return selectVaultConsumptionElement(await getServiceConsumption(serviceId));
};

const resolveLicensePrice = async (license: BackupLicenseResource) => {
  const serviceId = await resolveServiceId(license.currentState.resourceName);
  return (await getLicenseConsumption(serviceId))[0];
};

const buildVaultRow = async (
  vault: VaultResource,
): Promise<{ row: VaultConsumptionRow; period?: BillingPeriod }> => {
  const storage = await resolveVaultStorageConsumption(vault).catch(() => undefined);

  return {
    row: {
      vaultId: vault.id,
      name: vault.currentState.name,
      quantityGb: storage?.quantity,
      includedStorageGb:
        storage?.planCode === BACKUP_LICENSES_VAULT_BUNDLE_PLAN_CODE
          ? INCLUDED_VAULT_STORAGE_GB
          : undefined,
      storagePriceText: storage?.price.text,
      storagePriceValue: storage?.price.value,
    },
    period: storage ? { beginDate: storage.beginDate, endDate: storage.endDate } : undefined,
  };
};

const buildLicenseRow = async (license: BackupLicenseResource): Promise<LicenseConsumptionRow> => {
  const licenseConsumption = await resolveLicensePrice(license).catch(() => undefined);

  return {
    licenseId: license.id,
    name: license.currentState.resourceName,
    licensePriceText: licenseConsumption?.price.text,
  };
};

const consumptionRows = (queryClient: QueryClient) => () =>
  queryOptions({
    queryKey: queryKeys.billing.consumptionRows(),
    queryFn: async (): Promise<BillingConsumption> => {
      const backupServicesId = await tenantsQueries.withClient(queryClient).backupServicesId();
      const vspcTenantId = await tenantsQueries.withClient(queryClient).vspcTenantId();
      const vaults = selectBackupLicensesVaults(await getVaults(backupServicesId));
      const licenses = await getBackupLicenses({ backupServicesId, vspcTenantId });

      const [vaultResults, licenseRows] = await Promise.all([
        Promise.all(vaults.map(buildVaultRow)),
        Promise.all(licenses.map(buildLicenseRow)),
      ]);

      return {
        vaultRows: vaultResults.map(({ row }) => row),
        licenseRows,
        period: vaultResults.find(({ period }) => period)?.period ?? {
          beginDate: null,
          endDate: null,
        },
      };
    },
  });

const withClient = (queryClient: QueryClient) => ({
  consumptionRows: consumptionRows(queryClient),
});

export const billingQueries = { withClient };
