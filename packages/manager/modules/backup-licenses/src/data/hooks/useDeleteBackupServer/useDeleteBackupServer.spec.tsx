import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { deleteBackupServer } from '@/data/api/backupServers/backupServers.requests';
import { getBackupServicesTenants, getVspcTenants } from '@/data/api/tenants/tenants.requests';
import { queryKeys } from '@/data/queries/queryKeys';
import { BackupServicesTenant } from '@/types/BackupServicesTenant.type';
import { Resource } from '@/types/Resource.type';
import { VspcTenant } from '@/types/VspcTenant.type';

import { useDeleteBackupServer } from './useDeleteBackupServer';

vi.mock('@/data/api/backupServers/backupServers.requests');
vi.mock('@/data/api/tenants/tenants.requests');

const mockedDeleteBackupServer = vi.mocked(deleteBackupServer);

const renderDeleteHook = (
  options: Parameters<typeof useDeleteBackupServer>[0] = {},
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  }),
) => ({
  queryClient,
  ...renderHook(() => useDeleteBackupServer(options), {
    wrapper: ({ children }: React.PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  }),
});

describe('useDeleteBackupServer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedDeleteBackupServer.mockResolvedValue(undefined);
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

  it('deletes the server with the ids resolved by the cascade', async () => {
    const { result } = renderDeleteHook();

    result.current.mutate('server-1');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedDeleteBackupServer).toHaveBeenCalledWith({
      backupServicesId: 'service-1',
      vspcTenantId: 'vspc-1',
      backupServerId: 'server-1',
    });
  });

  it('invalidates the server list before handing over to the caller', async () => {
    const onSuccess = vi.fn();
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderDeleteHook({ onSuccess }, queryClient);

    result.current.mutate('server-1');

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: queryKeys.backupServers.all() });
    // L'ordre compte : la liste doit être à jour quand l'appelant ferme la modale.
    expect(invalidateQueries.mock.invocationCallOrder[0]!).toBeLessThan(
      onSuccess.mock.invocationCallOrder[0]!,
    );
  });

  it('does not invalidate the list when the deletion fails', async () => {
    mockedDeleteBackupServer.mockRejectedValue(new Error('boom'));
    const onError = vi.fn();
    const { queryClient, result } = renderDeleteHook({ onError });
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');

    result.current.mutate('server-1');

    await waitFor(() => expect(onError).toHaveBeenCalled());
    expect(invalidateQueries).not.toHaveBeenCalled();
  });

  it('fails without calling the API when no service is found', async () => {
    vi.mocked(getBackupServicesTenants).mockResolvedValue([]);
    const { result } = renderDeleteHook();

    result.current.mutate('server-1');

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockedDeleteBackupServer).not.toHaveBeenCalled();
  });
});
