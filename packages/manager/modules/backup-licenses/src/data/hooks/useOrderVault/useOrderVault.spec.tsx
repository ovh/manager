import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ShellContext, ShellContextType } from '@ovh-ux/manager-react-shell-client';

import { getBackupLicenses } from '@/data/api/backupLicenses/backupLicenses.requests';
import { getBackupServicesTenants, getVspcTenants } from '@/data/api/tenants/tenants.requests';
import { orderVault } from '@/data/api/vaults/vaults.requests';
import { queryKeys } from '@/data/queries/queryKeys';
import {
  MOCK_BACKUP_LICENSE_RESOURCE_NAME,
  mockBackupLicenses,
} from '@/mocks/backupLicenses/backupLicenses.mock';
import { mockBackupServicesTenants, mockVspcTenants } from '@/mocks/tenants/tenants.mock';

import { useOrderVault } from './useOrderVault';

vi.mock('@/data/api/tenants/tenants.requests');
vi.mock('@/data/api/backupLicenses/backupLicenses.requests');
vi.mock('@/data/api/vaults/vaults.requests', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/data/api/vaults/vaults.requests')>()),
  orderVault: vi.fn(),
}));

const mockedOrderVault = vi.mocked(orderVault);

const OVH_SUBSIDIARY = 'FR';

const SERVICE_NAME = MOCK_BACKUP_LICENSE_RESOURCE_NAME;

const order = { name: 'vault-paygo-01', region: 'eu-west-par' };

const shellContext = {
  environment: { getUser: () => ({ ovhSubsidiary: OVH_SUBSIDIARY }) },
} as unknown as ShellContextType;

const renderOrderVault = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  // A sequence rather than two call counts: what matters is that the refresh completes *before* the
  // caller is told, which only the order shows.
  const sequence: string[] = [];
  const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries').mockImplementation(() => {
    sequence.push('refreshed');
    return Promise.resolve();
  });
  const onSuccess = vi.fn(() => {
    sequence.push('confirmed');
  });
  const { result } = renderHook(() => useOrderVault({ onSuccess }), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <ShellContext.Provider value={shellContext}>{children}</ShellContext.Provider>
      </QueryClientProvider>
    ),
  });

  return { result, invalidateQueries, onSuccess, sequence };
};

describe('useOrderVault', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getBackupServicesTenants).mockResolvedValue(mockBackupServicesTenants);
    vi.mocked(getVspcTenants).mockResolvedValue(mockVspcTenants);
    vi.mocked(getBackupLicenses).mockResolvedValue(mockBackupLicenses);
  });

  it('sends the form values plus the context the customer never supplies', async () => {
    mockedOrderVault.mockResolvedValue(undefined);
    const { result } = renderOrderVault();

    result.current.mutate(order);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedOrderVault).toHaveBeenCalledWith(order, {
      ovhSubsidiary: OVH_SUBSIDIARY,
      serviceName: SERVICE_NAME,
    });
  });

  it('refreshes the vault list before handing back, so the new row is already there', async () => {
    mockedOrderVault.mockResolvedValue(undefined);
    const { result, invalidateQueries, onSuccess, sequence } = renderOrderVault();

    result.current.mutate(order);

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: queryKeys.vaults.all() });
    expect(sequence).toEqual(['refreshed', 'confirmed']);
  });

  it('neither refreshes nor confirms when the order is refused', async () => {
    mockedOrderVault.mockRejectedValue(new Error('nope'));
    const { result, invalidateQueries, onSuccess } = renderOrderVault();

    result.current.mutate(order);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(invalidateQueries).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('orders nothing at all when the service it would buy onto cannot be resolved', async () => {
    vi.mocked(getBackupServicesTenants).mockResolvedValue([]);
    const { result, onSuccess } = renderOrderVault();

    result.current.mutate(order);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockedOrderVault).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
