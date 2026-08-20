import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getBackupLicenses } from '@/data/api/backupLicenses/backupLicenses.requests';
import { createBackupServer } from '@/data/api/backupServers/backupServers.requests';
import { getBackupServicesTenants, getVspcTenants } from '@/data/api/tenants/tenants.requests';
import { queryKeys } from '@/data/queries/queryKeys';
import { mockBackupLicenses } from '@/mocks/backupLicenses/backupLicenses.mock';
import { buildBackupLicensesVspcTenant } from '@/mocks/tenants/tenants.mock';
import { CreateBackupLicenseBody } from '@/types/BackupLicense.type';
import { BackupServicesTenant } from '@/types/BackupServicesTenant.type';
import { LicenseApiValue } from '@/types/Order.type';
import { Resource } from '@/types/Resource.type';

import { useCreateBackupLicense } from './useCreateBackupLicense';

vi.mock('@/data/api/backupServers/backupServers.requests');
vi.mock('@/data/api/tenants/tenants.requests');
vi.mock('@/data/api/backupLicenses/backupLicenses.requests');

const mockedCreateBackupServer = vi.mocked(createBackupServer);

const body: CreateBackupLicenseBody = {
  displayName: 'backup-prod',
  licenseType: LicenseApiValue.ENTERPRISE_PLUS,
  externalIps: ['185.26.17.45'],
  privateIps: [],
};

const renderCreateHook = (
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  }),
) => ({
  queryClient,
  ...renderHook(() => useCreateBackupLicense(), {
    wrapper: ({ children }: React.PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  }),
});

describe('useCreateBackupLicense', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedCreateBackupServer.mockResolvedValue(undefined);
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

  it('creates the server with the ids resolved by the cascade and the submitted body', async () => {
    const { result } = renderCreateHook();

    result.current.mutate(body);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedCreateBackupServer).toHaveBeenCalledWith({
      backupServicesId: 'service-1',
      vspcTenantId: 'vspc-1',
      backupLicensesId: mockBackupLicenses[0]!.id,
      ...body,
    });
  });

  it('invalidates the backup servers list once the server has been added', async () => {
    const { queryClient, result } = renderCreateHook();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    result.current.mutate(body);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: queryKeys.backupServers.all() });
  });

  it('does not invalidate the list when the creation fails', async () => {
    mockedCreateBackupServer.mockRejectedValue(new Error('boom'));
    const { queryClient, result } = renderCreateHook();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    result.current.mutate(body);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(invalidateSpy).not.toHaveBeenCalled();
  });

  it('fails without calling the API when no service is found', async () => {
    vi.mocked(getBackupServicesTenants).mockResolvedValue([]);
    const { result } = renderCreateHook();

    result.current.mutate(body);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockedCreateBackupServer).not.toHaveBeenCalled();
  });
});
