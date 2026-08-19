import React from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getBackupLicenses } from '@/data/api/backupLicenses/backupLicenses.requests';
import { getBackupServicesTenants, getVspcTenants } from '@/data/api/tenants/tenants.requests';
import { mockBackupLicenses } from '@/mocks/backupLicenses/backupLicenses.mock';
import { buildBackupLicensesVspcTenant } from '@/mocks/tenants/tenants.mock';
import { createQueryClientTest } from '@/test-utils/renderWithProviders';
import { BackupServicesTenant } from '@/types/BackupServicesTenant.type';
import { Resource } from '@/types/Resource.type';

import { useBackupLicenseUrn } from './useBackupLicenseUrn';

vi.mock('@/data/api/backupLicenses/backupLicenses.requests');
vi.mock('@/data/api/tenants/tenants.requests');

const mockedGetBackupLicenses = vi.mocked(getBackupLicenses);

const renderUseBackupLicenseUrn = () => {
  const queryClient = createQueryClientTest();

  return renderHook(() => useBackupLicenseUrn(), {
    wrapper: ({ children }: React.PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
};

describe('useBackupLicenseUrn', () => {
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
  });

  it("résout la cascade service → tenant → licence puis renvoie l'urn IAM de la licence", async () => {
    mockedGetBackupLicenses.mockResolvedValue(mockBackupLicenses);

    const { result } = renderUseBackupLicenseUrn();

    await waitFor(() => expect(result.current).toBe(mockBackupLicenses[0]!.iam?.urn));
    expect(mockedGetBackupLicenses).toHaveBeenCalledWith({
      backupServicesId: 'service-1',
      vspcTenantId: 'vspc-1',
    });
  });

  it("renvoie undefined tant que la licence n'a pas d'urn IAM (contrat BE non confirmé)", async () => {
    mockedGetBackupLicenses.mockResolvedValue([
      { id: 'license-1', resourceStatus: 'READY', currentState: { id: 'license-1' } },
    ]);

    const { result } = renderUseBackupLicenseUrn();

    await waitFor(() => expect(mockedGetBackupLicenses).toHaveBeenCalled());
    expect(result.current).toBeUndefined();
  });

  it('renvoie undefined quand la cascade échoue', async () => {
    mockedGetBackupLicenses.mockRejectedValue(new Error('boom'));

    const { result } = renderUseBackupLicenseUrn();

    await waitFor(() => expect(mockedGetBackupLicenses).toHaveBeenCalled());
    expect(result.current).toBeUndefined();
  });
});
