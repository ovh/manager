import { QueryClient } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getBackupLicenses } from '@/data/api/backupLicenses/backupLicenses.requests';
import {
  getLicenseConsumption,
  getServiceConsumption,
} from '@/data/api/services/consumption.requests';
import { getBackupServicesTenants, getVspcTenants } from '@/data/api/tenants/tenants.requests';
import { getVaults } from '@/data/api/vaults/vaults.requests';
import { BackupLicenseResource } from '@/types/BackupLicense.type';
import { BackupServicesTenant } from '@/types/BackupServicesTenant.type';
import { ServiceConsumption } from '@/types/Consumption.type';
import { Resource } from '@/types/Resource.type';
import { VaultResource } from '@/types/Vault.type';
import { VspcTenant } from '@/types/VspcTenant.type';

import { billingQueries } from './billing.queries';

vi.mock('@/data/api/vaults/vaults.requests');
vi.mock('@/data/api/backupLicenses/backupLicenses.requests');
vi.mock('@/data/api/services/consumption.requests');
vi.mock('@/data/api/tenants/tenants.requests');

// Le service Agora d'une ressource : les fixtures de consommation ci-dessous sont indexées par
// `resourceName`, donc la résolution le rend tel quel.
vi.mock('@ovh-ux/manager-module-common-api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@ovh-ux/manager-module-common-api')>()),
  getResourceServiceId: vi.fn(({ resourceName }: { resourceName: string }) =>
    Promise.resolve({ data: [resourceName] }),
  ),
}));

const buildVault = (id: string, resourceName: string): VaultResource => ({
  id,
  resourceStatus: 'READY',
  currentState: {
    id,
    name: id,
    resourceName,
    region: 'EU-WEST-PAR',
    type: 'PAYGO',
    vaultProductLine: 'BACKUP_LICENSES',
  },
});

const buildLicense = (id: string, resourceName: string): BackupLicenseResource => ({
  id,
  resourceStatus: 'READY',
  currentState: { id, resourceName },
});

const buildConsumption = (
  planCode: string,
  quantity: number,
  priceText: string,
): ServiceConsumption => ({
  beginDate: '2026-07-01T00:00:00Z',
  endDate: '2026-07-31T23:59:59Z',
  pricingMode: 'consumption',
  quantity,
  planCode,
  planFamily: 'backup',
  price: { currencyCode: 'EUR', text: priceText, value: 0 },
  uniqueId: null,
});

describe('billingQueries', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient();
    vi.mocked(getBackupServicesTenants).mockResolvedValue([
      {
        id: 'service-1',
        resourceStatus: 'READY',
        currentState: { id: 'service-1', name: 'service' },
      } as Resource<BackupServicesTenant>,
    ]);
    vi.mocked(getVspcTenants).mockResolvedValue([
      {
        id: 'vspc-1',
        resourceStatus: 'READY',
        currentState: { id: 'vspc-1' },
      } as Resource<VspcTenant>,
    ]);
  });

  const fetchRows = () =>
    queryClient.fetchQuery(billingQueries.withClient(queryClient).consumptionRows());

  it('builds an independent vault row and license row, with no matching between them', async () => {
    vi.mocked(getVaults).mockResolvedValue([buildVault('vault-1', 'resource-1')]);
    vi.mocked(getBackupLicenses).mockResolvedValue([buildLicense('license-1', 'lic-resource-1')]);
    vi.mocked(getServiceConsumption).mockResolvedValue([
      buildConsumption('backup-vault-backuplicenses-paygo-consumption', 7, '0,05 €'),
    ]);
    vi.mocked(getLicenseConsumption).mockResolvedValue([
      buildConsumption('backup-license-backuplicenses-foundation', 1, '4,90 €'),
    ]);

    const { vaultRows, licenseRows } = await fetchRows();

    expect(vaultRows).toEqual([
      {
        vaultId: 'vault-1',
        name: 'vault-1',
        quantityGb: 7,
        storagePriceText: '0,05 €',
        storagePriceValue: 0,
      },
    ]);
    expect(licenseRows).toEqual([
      { licenseId: 'license-1', name: 'lic-resource-1', licensePriceText: '4,90 €' },
    ]);
  });

  it('degrades the storage columns to undefined without dropping the vault row when storage fails', async () => {
    vi.mocked(getVaults).mockResolvedValue([buildVault('vault-1', 'resource-1')]);
    vi.mocked(getBackupLicenses).mockResolvedValue([]);
    vi.mocked(getServiceConsumption).mockRejectedValue(new Error('boom'));

    const { vaultRows } = await fetchRows();

    expect(vaultRows).toEqual([
      {
        vaultId: 'vault-1',
        name: 'vault-1',
        quantityGb: undefined,
        storagePriceText: undefined,
        storagePriceValue: undefined,
      },
    ]);
  });

  it('degrades the license price to undefined without dropping the license row when it fails', async () => {
    vi.mocked(getVaults).mockResolvedValue([]);
    vi.mocked(getBackupLicenses).mockResolvedValue([buildLicense('license-1', 'lic-resource-1')]);
    vi.mocked(getLicenseConsumption).mockRejectedValue(new Error('boom'));

    const { licenseRows } = await fetchRows();

    expect(licenseRows).toEqual([
      { licenseId: 'license-1', name: 'lic-resource-1', licensePriceText: undefined },
    ]);
  });

  it('resolves more licenses than vaults without dropping either side', async () => {
    vi.mocked(getVaults).mockResolvedValue([buildVault('vault-1', 'resource-1')]);
    vi.mocked(getBackupLicenses).mockResolvedValue([
      buildLicense('license-1', 'lic-resource-1'),
      buildLicense('license-2', 'lic-resource-2'),
    ]);
    vi.mocked(getServiceConsumption).mockResolvedValue([
      buildConsumption('backup-vault-backuplicenses-paygo-consumption', 7, '0,05 €'),
    ]);
    vi.mocked(getLicenseConsumption).mockResolvedValue([
      buildConsumption('backup-license-backuplicenses-foundation', 1, '4,90 €'),
    ]);

    const { vaultRows, licenseRows } = await fetchRows();

    expect(vaultRows).toHaveLength(1);
    expect(licenseRows).toHaveLength(2);
  });

  it('does not let one vault failure prevent the other rows from resolving', async () => {
    vi.mocked(getVaults).mockResolvedValue([
      buildVault('vault-1', 'resource-1'),
      buildVault('vault-2', 'resource-2'),
    ]);
    vi.mocked(getBackupLicenses).mockResolvedValue([]);
    vi.mocked(getServiceConsumption).mockImplementation(async (serviceId) =>
      serviceId === 'resource-1'
        ? Promise.reject(new Error('boom'))
        : [buildConsumption('backup-vault-backuplicenses-paygo-consumption', 142, '0,99 €')],
    );

    const { vaultRows } = await fetchRows();

    expect(vaultRows).toHaveLength(2);
    expect(vaultRows[0]).toMatchObject({ vaultId: 'vault-1', quantityGb: undefined });
    expect(vaultRows[1]).toMatchObject({ vaultId: 'vault-2', quantityGb: 142 });
  });

  it('derives the billing period from the first resolved storage consumption element', async () => {
    vi.mocked(getVaults).mockResolvedValue([buildVault('vault-1', 'resource-1')]);
    vi.mocked(getBackupLicenses).mockResolvedValue([]);
    vi.mocked(getServiceConsumption).mockResolvedValue([
      buildConsumption('backup-vault-backuplicenses-paygo-consumption', 7, '0,05 €'),
    ]);

    const { period } = await fetchRows();

    expect(period).toEqual({ beginDate: '2026-07-01T00:00:00Z', endDate: '2026-07-31T23:59:59Z' });
  });
});
