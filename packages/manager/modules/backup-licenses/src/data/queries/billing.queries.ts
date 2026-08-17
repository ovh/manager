import { QueryClient, queryOptions } from '@tanstack/react-query';

import { getResourceServiceId } from '@ovh-ux/manager-module-common-api';

import { getBackupLicenses } from '@/data/api/backupLicenses/backupLicenses.requests';
import {
  getLicenseConsumption,
  getServiceConsumption,
} from '@/data/api/services/consumption.requests';
import { getVaults } from '@/data/api/vaults/vaults.requests';
import { matchLicenseToVault } from '@/data/selectors/licenses.selectors';
import { selectVaultConsumptionElement } from '@/data/selectors/vaultConsumption.selectors';
import { selectBackupLicensesVaults } from '@/data/selectors/vaults.selectors';
import {
  BACKUP_LICENSES_VAULT_BUNDLE_PLAN_CODE,
  INCLUDED_VAULT_STORAGE_GB,
} from '@/module.constants';
import { BackupLicenseResource } from '@/types/BackupLicense.type';
import { ServiceConsumption } from '@/types/Consumption.type';
import { VaultResource } from '@/types/Vault.type';
import { BillingPeriod, VaultConsumptionRow } from '@/types/VaultConsumption.type';

import { queryKeys } from './queryKeys';
import { tenantsQueries } from './tenants.queries';

export type BillingConsumption = {
  rows: VaultConsumptionRow[];
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

/**
 * Deux `Promise.allSettled` indépendants par vault (stockage et licence), pas un seul
 * (§4 de la spec) : chaque colonne de prix dégrade sur son propre échec sans affecter
 * l'autre. Un vault sans licence appariée (jointure non confirmée, §14) rejette
 * volontairement sa branche licence plutôt que d'appeler `resolveLicensePrice`.
 */
const buildRow = async (
  vault: VaultResource,
  licenses: BackupLicenseResource[],
): Promise<{ row: VaultConsumptionRow; period?: BillingPeriod }> => {
  const license = matchLicenseToVault(licenses, vault);

  const [storage, licensePrice] = await Promise.allSettled([
    resolveVaultStorageConsumption(vault),
    license ? resolveLicensePrice(license) : Promise.reject(new Error('No matching license')),
  ]);

  const storageElement = storage.status === 'fulfilled' ? storage.value : undefined;
  const licenseConsumption = licensePrice.status === 'fulfilled' ? licensePrice.value : undefined;

  return {
    row: {
      vaultId: vault.id,
      name: vault.currentState.name,
      quantityGb: storageElement?.quantity,
      includedStorageGb:
        storageElement?.planCode === BACKUP_LICENSES_VAULT_BUNDLE_PLAN_CODE
          ? INCLUDED_VAULT_STORAGE_GB
          : undefined,
      storagePriceText: storageElement?.price.text,
      storagePriceValue: storageElement?.price.value,
      licensePriceText: licenseConsumption?.price.text,
    },
    period: storageElement
      ? { beginDate: storageElement.beginDate, endDate: storageElement.endDate }
      : undefined,
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

      const results = await Promise.all(vaults.map((vault) => buildRow(vault, licenses)));

      return {
        rows: results.map(({ row }) => row),
        period: results.find(({ period }) => period)?.period ?? { beginDate: null, endDate: null },
      };
    },
  });

const withClient = (queryClient: QueryClient) => ({
  consumptionRows: consumptionRows(queryClient),
});

export const billingQueries = { withClient };
