import React from 'react';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getBackupLicenses } from '@/data/api/backupLicenses/backupLicenses.requests';
import { getBackupServicesTenants, getVspcTenants } from '@/data/api/tenants/tenants.requests';
import { buildBackupLicensesVspcTenant } from '@/mocks/tenants/tenants.mock';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { setupMswMock } from '@/test-utils/setupMsw';
import { BackupLicenseResource } from '@/types/BackupLicense.type';
import { BackupServicesTenant } from '@/types/BackupServicesTenant.type';
import { Resource } from '@/types/Resource.type';

import GeneralInformationPage from './GeneralInformation.page';

vi.mock('@/data/api/tenants/tenants.requests');
vi.mock('@/data/api/backupLicenses/backupLicenses.requests');

// NB : le harness i18n du module ne résout que les clés de premier niveau (cf. LinkedServers.page.spec.tsx).

describe('GeneralInformationPage', () => {
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
      buildBackupLicensesVspcTenant('vspc-1', { accessUrl: 'https://vspc.example.com' }),
    ]);
    vi.mocked(getBackupLicenses).mockResolvedValue([
      {
        id: 'license-1',
        resourceStatus: 'READY',
        currentState: { id: 'license-1' },
      } as BackupLicenseResource,
    ]);
    setupMswMock();
  });

  it('renders both tiles once the whole cascade has resolved', async () => {
    await renderWithProviders(<GeneralInformationPage />);

    // La cascade ③→④ enchaîne deux appels /services (chacun mocké avec un délai par défaut de
    // 1s, cf. `toMswHandlers`) : le timeout par défaut de `waitFor` (1s) est trop court.
    await waitFor(() => expect(screen.getByText('Test')).toBeInTheDocument(), { timeout: 5000 });
    expect(screen.getByText('service-1')).toBeInTheDocument();
    expect(screen.getByText('adminCustomerCode')).toBeInTheDocument();
  });

  it('shows skeletons while the cascade is still pending', async () => {
    vi.mocked(getBackupLicenses).mockReturnValue(new Promise(() => {}));

    await renderWithProviders(<GeneralInformationPage />);

    expect(document.querySelectorAll('ods-skeleton').length).toBeGreaterThan(0);
  });

  it('renders an error banner and refetches on retry when the license lookup fails', async () => {
    vi.mocked(getBackupLicenses).mockRejectedValue(new Error('boom'));

    await renderWithProviders(<GeneralInformationPage />);

    await waitFor(() =>
      expect(
        screen.getByText("Les informations du service n'ont pas pu être chargées."),
      ).toBeInTheDocument(),
    );

    vi.mocked(getBackupLicenses).mockResolvedValue([
      {
        id: 'license-1',
        resourceStatus: 'READY',
        currentState: { id: 'license-1' },
      } as BackupLicenseResource,
    ]);
    fireEvent.click(screen.getByTestId('general-information-retry'));

    await waitFor(() => expect(screen.getByText('Test')).toBeInTheDocument(), { timeout: 5000 });
  });

  it('renders an error banner when the service details request fails', async () => {
    setupMswMock({ getDetailsServicesKo: true });

    await renderWithProviders(<GeneralInformationPage />);

    await waitFor(
      () =>
        expect(
          screen.getByText("Les informations du service n'ont pas pu être chargées."),
        ).toBeInTheDocument(),
      {
        timeout: 5000,
      },
    );
  });
});
