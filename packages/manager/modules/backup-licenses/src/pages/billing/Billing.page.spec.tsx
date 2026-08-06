import React from 'react';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getBackupLicenses } from '@/data/api/backupLicenses/backupLicenses.requests';
import { getServiceConsumption } from '@/data/api/services/consumption.requests';
import { getBackupServicesTenants, getVspcTenants } from '@/data/api/tenants/tenants.requests';
import { getVaults } from '@/data/api/vaults/vaults.requests';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { BackupServicesTenant } from '@/types/BackupServicesTenant.type';
import { ServiceConsumption } from '@/types/Consumption.type';
import { Resource } from '@/types/Resource.type';
import { VaultResource } from '@/types/Vault.type';
import { VspcTenant } from '@/types/VspcTenant.type';

import BillingPage from './Billing.page';

vi.mock('@/data/api/vaults/vaults.requests');
vi.mock('@/data/api/backupLicenses/backupLicenses.requests');
vi.mock('@/data/api/services/consumption.requests');
vi.mock('@/data/api/tenants/tenants.requests');

// Les fixtures de consommation sont indexées par `resourceName` : la résolution le rend tel quel.
vi.mock('@ovh-ux/manager-module-common-api', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@ovh-ux/manager-module-common-api')>()),
  getResourceServiceId: vi.fn(({ resourceName }: { resourceName: string }) =>
    Promise.resolve({ data: [resourceName] }),
  ),
}));

const mockedGetVaults = vi.mocked(getVaults);

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

const buildConsumption = (
  quantity: number,
  priceText: string,
  priceValue = 5000000,
): ServiceConsumption => ({
  beginDate: '2026-07-01T00:00:00Z',
  endDate: '2026-07-31T23:59:59Z',
  pricingMode: 'consumption',
  quantity,
  planCode: 'backup-vault-backuplicenses-paygo-consumption',
  planFamily: 'backup',
  price: { currencyCode: 'EUR', text: priceText, value: priceValue },
  uniqueId: null,
});

describe('BillingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
    vi.mocked(getBackupLicenses).mockResolvedValue([]);
  });

  it('renders the fetched rows', async () => {
    mockedGetVaults.mockResolvedValue([buildVault('vault-1', 'resource-1')]);
    vi.mocked(getServiceConsumption).mockResolvedValue([buildConsumption(7, '0,05 €')]);

    await renderWithProviders(<BillingPage />);

    await waitFor(() => expect(screen.getByText('vault-1')).toBeInTheDocument());
    expect(screen.getByText('0,05 €')).toBeInTheDocument();
  });

  it('renders the empty state label on an empty vault list', async () => {
    mockedGetVaults.mockResolvedValue([]);

    await renderWithProviders(<BillingPage />);

    await waitFor(() =>
      expect(
        screen.getByText('Aucune consommation enregistrée pour la période en cours.'),
      ).toBeInTheDocument(),
    );
  });

  it('renders an error message and refetches on retry', async () => {
    mockedGetVaults.mockRejectedValue(new Error('boom'));

    await renderWithProviders(<BillingPage />);

    await waitFor(() =>
      expect(screen.getByText("Votre consommation n'a pas pu être chargée.")).toBeInTheDocument(),
    );

    mockedGetVaults.mockResolvedValue([]);
    fireEvent.click(screen.getByTestId('billing-retry'));

    await waitFor(() => expect(mockedGetVaults).toHaveBeenCalledTimes(2));
  });

  it('refetches when clicking the refresh button', async () => {
    mockedGetVaults.mockResolvedValue([]);

    await renderWithProviders(<BillingPage />);

    await waitFor(() => expect(mockedGetVaults).toHaveBeenCalledTimes(1));
    fireEvent.click(screen.getByTestId('refresh-billing'));

    await waitFor(() => expect(mockedGetVaults).toHaveBeenCalledTimes(2));
  });
});
