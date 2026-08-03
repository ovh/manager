import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { VAULT_ORDER_CHANNEL_UNAVAILABLE, orderVault } from '@/data/api/vaults/vaults.requests';
import { queryKeys } from '@/data/queries/queryKeys';

import { useOrderVault } from './useOrderVault';

vi.mock('@/data/api/vaults/vaults.requests', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/data/api/vaults/vaults.requests')>()),
  orderVault: vi.fn(),
}));

const mockedOrderVault = vi.mocked(orderVault);

const order = { name: 'vault-paygo-01', region: 'eu-west-par' };

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
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });

  return { result, invalidateQueries, onSuccess, sequence };
};

describe('useOrderVault', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends the name and the region the customer supplied, and nothing else', async () => {
    mockedOrderVault.mockResolvedValue(undefined);
    const { result } = renderOrderVault();

    result.current.mutate(order);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedOrderVault).toHaveBeenCalledWith(order);
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

  it('fails today, because no ordering channel is published to send an order to', async () => {
    const { orderVault: realOrderVault } = await vi.importActual<
      typeof import('@/data/api/vaults/vaults.requests')
    >('@/data/api/vaults/vaults.requests');

    await expect(realOrderVault(order)).rejects.toThrow(VAULT_ORDER_CHANNEL_UNAVAILABLE);
  });
});
