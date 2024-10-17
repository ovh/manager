import React, { PropsWithChildren } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, vi } from 'vitest';
import { useFetchHubBills } from '@/data/hooks/bills/useBills';
import * as BillsApi from '@/data/api/bills';
import { Bills } from '@/types/bills.type';

const queryClient = new QueryClient();

const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useFetchHubBills', () => {
  it('returns no bills summary if api returned none', async () => {
    const bills: Bills | null = null;
    const getBills = vi
      .spyOn(BillsApi, 'getBills')
      .mockReturnValue(Promise.resolve(bills));

    const { result } = renderHook(() => useFetchHubBills(1), {
      wrapper,
    });

    await waitFor(() => {
      expect(getBills).toHaveBeenCalledWith(1);
      expect(result.current.data).toEqual(bills);
    });
  });

  it('returns a bills summary if api returned one', async () => {
    const bills: Bills = {
      currency: {
        code: 'EUR',
        format: '{{price}} €',
        symbol: '€',
      },
      period: { from: '2024-08-01', to: '2024-08-31' },
      total: 0,
    };
    vi.spyOn(BillsApi, 'getBills').mockReturnValue(Promise.resolve(bills));

    const { result } = renderHook(() => useFetchHubBills(1), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(bills);
    });
  });
});
