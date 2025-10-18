import { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { getCompleteHistory } from '@/data/api/order/order';
import { OrderHistory } from '@/types/order.type';

import { useOrderCompleteHistory } from './useOrderCompleteHistory';

vi.mock('@/data/api/order/order', () => ({
  getCompleteHistory: vi.fn(),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useOrderCompleteHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('should return complete order history when inputs are valid', async () => {
    const mockedHistory: OrderHistory[] = [
      { date: '2025-10-22', label: 'Created' },
      { date: '2025-10-23', label: 'Processed' },
    ];
    vi.mocked(getCompleteHistory).mockResolvedValue(mockedHistory);

    const { result } = renderHook(() => useOrderCompleteHistory(1, 'processed', '2025-10-22'), {
      wrapper,
    });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.data).toEqual(mockedHistory);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should not run the query when any input is undefined', async () => {
    const { result } = renderHook(
      () =>
        useOrderCompleteHistory(
          undefined as unknown as number,
          undefined as unknown as string,
          undefined as unknown as string,
        ),
      {
        wrapper,
      },
    );

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });
});
