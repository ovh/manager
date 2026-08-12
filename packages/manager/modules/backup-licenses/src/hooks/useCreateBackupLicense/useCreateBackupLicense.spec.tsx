import React from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createBackupLicense } from '@/data/api/backupLicenses/backupLicenses.requests';
import { getBackupServicesTenants, getVspcTenants } from '@/data/api/tenants/tenants.requests';
import { queryKeys } from '@/data/queries/queryKeys';
import { buildBackupLicensesVspcTenant } from '@/mocks/tenants/tenants.mock';
import { createQueryClientTest } from '@/test-utils/renderWithProviders';
import { BackupServerResource } from '@/types/BackupServer.type';
import { BackupServicesTenant } from '@/types/BackupServicesTenant.type';
import { LicenseApiValue } from '@/types/Order.type';
import { Resource } from '@/types/Resource.type';

import { useCreateBackupLicense } from './useCreateBackupLicense';

vi.mock('@/data/api/backupLicenses/backupLicenses.requests');
vi.mock('@/data/api/tenants/tenants.requests');

const mockedCreateBackupLicense = vi.mocked(createBackupLicense);
const mockedGetBackupServicesTenants = vi.mocked(getBackupServicesTenants);
const mockedGetVspcTenants = vi.mocked(getVspcTenants);

const buildResource = <T,>(id: string, currentState: T): Resource<T> => ({
  id,
  resourceStatus: 'READY',
  currentState,
});

const renderUseCreateBackupLicense = () => {
  const queryClient = createQueryClientTest();
  const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

  const hook = renderHook(() => useCreateBackupLicense(), {
    wrapper: ({ children }: React.PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });

  return { ...hook, invalidateSpy };
};

describe('useCreateBackupLicense', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetBackupServicesTenants.mockResolvedValue([
      buildResource<BackupServicesTenant>('service-1', { id: 'service-1', name: 'service' }),
    ]);
    mockedGetVspcTenants.mockResolvedValue([buildBackupLicensesVspcTenant('vspc-1')]);
  });

  it('résout la cascade backupServicesId → vspcTenantId puis crée la licence, et invalide la liste des serveurs', async () => {
    mockedCreateBackupLicense.mockResolvedValue({} as BackupServerResource);
    const { result, invalidateSpy } = renderUseCreateBackupLicense();

    result.current.mutate({
      displayName: 'backup-prod',
      licenseType: LicenseApiValue.ENTERPRISE_PLUS,
      backupServerExternalIp: ['185.26.17.45'],
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedGetVspcTenants).toHaveBeenCalledWith('service-1');
    expect(mockedCreateBackupLicense).toHaveBeenCalledWith({
      backupServicesId: 'service-1',
      vspcTenantId: 'vspc-1',
      body: {
        displayName: 'backup-prod',
        licenseType: LicenseApiValue.ENTERPRISE_PLUS,
        backupServerExternalIp: ['185.26.17.45'],
      },
    });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: queryKeys.backupServers.all() });
  });

  it("remonte l'erreur sans invalider la liste quand la cascade échoue", async () => {
    mockedGetBackupServicesTenants.mockResolvedValue([]);
    const { result, invalidateSpy } = renderUseCreateBackupLicense();

    result.current.mutate({
      displayName: 'backup-prod',
      licenseType: LicenseApiValue.ENTERPRISE_PLUS,
      backupServerExternalIp: ['185.26.17.45'],
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockedCreateBackupLicense).not.toHaveBeenCalled();
    expect(invalidateSpy).not.toHaveBeenCalled();
  });
});
