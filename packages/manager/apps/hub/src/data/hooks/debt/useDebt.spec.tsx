import React, { PropsWithChildren } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, vi } from 'vitest';
import { useFetchHubDebt } from '@/data/hooks/debt/useDebt';
import * as DebtApi from '@/data/api/debt';
import { Debt } from '@/types/debt.type';

const queryClient = new QueryClient();

const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useFetchHubDebt', () => {
  it('returns no debt if api returned none', async () => {
    const debt: Debt | null = null;
    const getDebt = vi
      .spyOn(DebtApi, 'getDebt')
      .mockReturnValue(Promise.resolve(debt));

    const { result } = renderHook(() => useFetchHubDebt(), {
      wrapper,
    });

    await waitFor(() => {
      expect(getDebt).toHaveBeenCalledWith();
      expect(result.current.data).toEqual(debt);
    });
  });

  it('returns a banner if api returned one', async () => {
    const debt: Debt = {
      pendingAmount: {
        value: 0,
        text: '0.00 €',
        currencyCode: 'EUR',
      },
      dueAmount: {
        value: 0,
        text: '0.00 €',
        currencyCode: 'EUR',
      },
      unmaturedAmount: {
        value: 0,
        text: '0.00 €',
        currencyCode: 'EUR',
      },
      todoAmount: {
        value: 0,
        text: '0.00 €',
        currencyCode: 'EUR',
      },
      active: false,
    };
    vi.spyOn(DebtApi, 'getDebt').mockReturnValue(Promise.resolve(debt));

    const { result } = renderHook(() => useFetchHubDebt(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(debt);
    });
  });
});
