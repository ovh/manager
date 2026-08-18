import React from 'react';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getBackupLicenses } from '@/data/api/backupLicenses/backupLicenses.requests';
import { getBackupServers } from '@/data/api/backupServers/backupServers.requests';
import { getBackupServicesTenants, getVspcTenants } from '@/data/api/tenants/tenants.requests';
import { mockBackupLicenses } from '@/mocks/backupLicenses/backupLicenses.mock';
import { mockBackupServers } from '@/mocks/backupServers/backupServers.mock';
import { buildBackupLicensesVspcTenant } from '@/mocks/tenants/tenants.mock';
import { labels } from '@/test-utils/i18ntest.utils';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { BackupServicesTenant } from '@/types/BackupServicesTenant.type';
import { Resource } from '@/types/Resource.type';

import LinkedServersPage from './LinkedServers.page';

vi.mock('@/data/api/backupServers/backupServers.requests');
vi.mock('@/data/api/tenants/tenants.requests');
vi.mock('@/data/api/backupLicenses/backupLicenses.requests');

const mockedGetBackupServers = vi.mocked(getBackupServers);

describe('LinkedServersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getBackupServicesTenants).mockResolvedValue([
      {
        id: 'service-1',
        resourceStatus: 'READY',
        currentState: { id: 'service-1', name: 'service' },
      } as Resource<BackupServicesTenant>,
    ]);
    vi.mocked(getVspcTenants).mockResolvedValue([buildBackupLicensesVspcTenant('vspc-1')]);
    vi.mocked(getBackupLicenses).mockResolvedValue(mockBackupLicenses);
  });

  it('shows the loading state while the servers are being fetched', async () => {
    mockedGetBackupServers.mockReturnValue(new Promise(() => {}));

    await renderWithProviders(<LinkedServersPage />);

    // La topbar est rendue dès le chargement : le CTA d'ajout est toujours présent.
    expect(screen.getByTestId('linked-servers-topbar')).toBeInTheDocument();
    expect(
      screen.queryByText("La liste de vos serveurs n'a pas pu être chargée."),
    ).not.toBeInTheDocument();
  });

  it('renders the fetched servers', async () => {
    mockedGetBackupServers.mockResolvedValue(mockBackupServers.slice(0, 2));

    await renderWithProviders(<LinkedServersPage />);

    await waitFor(() => expect(screen.getByText('VBR-CUST-SERV-01')).toBeInTheDocument());
    expect(screen.getByText('VBR-CUST-SERV-02')).toBeInTheDocument();
  });

  it('renders the empty state label and keeps the topbar on an empty list', async () => {
    mockedGetBackupServers.mockResolvedValue([]);

    await renderWithProviders(<LinkedServersPage />);

    await waitFor(() =>
      expect(screen.getByText(labels.linkedServers.empty_state)).toBeInTheDocument(),
    );
    expect(screen.getByTestId('linked-servers-topbar')).toBeInTheDocument();
  });

  it('shows loading skeleton rows again when clicking refresh', async () => {
    mockedGetBackupServers.mockResolvedValueOnce(mockBackupServers.slice(0, 1));

    await renderWithProviders(<LinkedServersPage />);

    await waitFor(() => expect(screen.getByText('VBR-CUST-SERV-01')).toBeInTheDocument());

    mockedGetBackupServers.mockReturnValue(new Promise(() => {}));
    fireEvent.click(screen.getByTestId('refresh-backup-servers'));

    await waitFor(() => expect(screen.getAllByTestId('loading-row').length).toBeGreaterThan(0));
  });

  it('renders an error message and refetches on retry', async () => {
    mockedGetBackupServers.mockRejectedValue(new Error('boom'));

    await renderWithProviders(<LinkedServersPage />);

    await waitFor(() =>
      expect(
        screen.getByText("La liste de vos serveurs n'a pas pu être chargée."),
      ).toBeInTheDocument(),
    );
    expect(screen.getByTestId('linked-servers-topbar')).toBeInTheDocument();

    mockedGetBackupServers.mockResolvedValue([]);
    fireEvent.click(screen.getByTestId('linked-servers-retry'));

    await waitFor(() => expect(mockedGetBackupServers).toHaveBeenCalledTimes(2));
  });
});
