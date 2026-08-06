import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { getBackupServicesCatalog } from '@/data/api/catalog/catalog.requests';
import { testWrapperBuilder } from '@/test-utils/testWrapperBuilder';
import { OrderCatalog } from '@/types/Catalog.type';

import { useBackupServicesCatalog } from './useBackupServicesCatalog';

vi.mock('@/data/api/catalog/catalog.requests');

const mockedGetBackupServicesCatalog = vi.mocked(getBackupServicesCatalog);

const catalog: OrderCatalog = {
  locale: { currencyCode: 'EUR', taxRate: 0.2 },
  plans: [{ planCode: 'backup-tenant', pricings: [] }],
  addons: [
    {
      planCode: 'vspc-backuplicenses-foundation-vm',
      pricings: [
        {
          mode: 'default',
          commitment: 0,
          intervalUnit: 'none',
          interval: 0,
          price: 1_500_000_000,
          tax: 300_000_000,
        },
      ],
    },
  ],
};

const renderUseBackupServicesCatalog = async () => {
  const wrapper = await testWrapperBuilder().withQueryClient().withShellContext().build();
  return renderHook(() => useBackupServicesCatalog(), { wrapper });
};

describe('useBackupServicesCatalog', () => {
  it("expose le catalogue résolu pour la subsidiary de l'utilisateur courant", async () => {
    mockedGetBackupServicesCatalog.mockResolvedValue(catalog);

    const { result } = await renderUseBackupServicesCatalog();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(catalog);
    expect(mockedGetBackupServicesCatalog).toHaveBeenCalledWith(expect.any(String));
  });

  it("remonte l'erreur quand l'appel échoue", async () => {
    mockedGetBackupServicesCatalog.mockRejectedValue(new Error('boom'));

    const { result } = await renderUseBackupServicesCatalog();

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
