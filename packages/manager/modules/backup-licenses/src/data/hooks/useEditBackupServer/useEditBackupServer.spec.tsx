import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { editBackupServer } from '@/data/api/backupServers/backupServers.requests';
import { getBackupServicesTenants, getVspcTenants } from '@/data/api/tenants/tenants.requests';
import { queryKeys } from '@/data/queries/queryKeys';
import { buildBackupLicensesVspcTenant } from '@/mocks/tenants/tenants.mock';
import { BackupServicesTenant } from '@/types/BackupServicesTenant.type';
import { Resource } from '@/types/Resource.type';

import { useEditBackupServer } from './useEditBackupServer';

vi.mock('@/data/api/backupServers/backupServers.requests');
vi.mock('@/data/api/tenants/tenants.requests');

const mockedEditBackupServer = vi.mocked(editBackupServer);

const payload = {
  backupServerId: 'server-1',
  displayName: 'VBR-CUST-SERV-01',
  licenseType: 'VEEAM_DATA_PLATFORM_PREMIUM',
  externalIps: ['203.0.113.10'],
  privateIps: ['192.168.10.2'],
};

const renderEditHook = (
  options: Parameters<typeof useEditBackupServer>[0] = {},
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  }),
) => ({
  queryClient,
  ...renderHook(() => useEditBackupServer(options), {
    wrapper: ({ children }: React.PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  }),
});

describe('useEditBackupServer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedEditBackupServer.mockResolvedValue(undefined);
    vi.mocked(getBackupServicesTenants).mockResolvedValue([
      {
        id: 'service-1',
        resourceStatus: 'READY',
        currentState: { id: 'service-1', name: 'service' },
      } as Resource<BackupServicesTenant>,
    ]);
    vi.mocked(getVspcTenants).mockResolvedValue([buildBackupLicensesVspcTenant('vspc-1')]);
  });

  it('edits the server with the ids resolved by the cascade and the payload', async () => {
    const { result } = renderEditHook();

    result.current.mutate(payload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedEditBackupServer).toHaveBeenCalledWith({
      backupServicesId: 'service-1',
      vspcTenantId: 'vspc-1',
      ...payload,
    });
  });

  it('invalidates the server list before handing over to the caller', async () => {
    const onSuccess = vi.fn();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderEditHook({ onSuccess }, queryClient);

    result.current.mutate(payload);

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: queryKeys.backupServers.all() });
    // L'ordre compte : la liste doit être à jour quand l'appelant ferme la modale.
    expect(invalidateQueries.mock.invocationCallOrder[0]!).toBeLessThan(
      onSuccess.mock.invocationCallOrder[0]!,
    );
  });

  it('does not invalidate the list when the edit fails', async () => {
    mockedEditBackupServer.mockRejectedValue(new Error('boom'));
    const onError = vi.fn();
    const { queryClient, result } = renderEditHook({ onError });
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');

    result.current.mutate(payload);

    await waitFor(() => expect(onError).toHaveBeenCalled());
    expect(invalidateQueries).not.toHaveBeenCalled();
  });

  it('fails without calling the API when no service is found', async () => {
    vi.mocked(getBackupServicesTenants).mockResolvedValue([]);
    const { result } = renderEditHook();

    result.current.mutate(payload);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockedEditBackupServer).not.toHaveBeenCalled();
  });
});
