import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { getOrderDetails } from '@/data/api/order/order';
import { OrderDetail } from '@/types/order.type';

import { useOrderDetails } from './useOrderDetails';

vi.mock('@/data/api/order/order', () => ({
  getOrderDetails: vi.fn(),
}));

const queryClient = new QueryClient();

describe('useOrderDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('should return order details when orderId is provided', async () => {
    const mockedDetails: OrderDetail[] = [
      {
        orderDetailId: 1,
        description: 'Item1',
        domain: 'domain1',
        detailType: 'domain',
        cancelled: false,
        quantity: '1',
        totalPrice: {
          currencyCode: 'EUR',
          text: '10.00 €',
          value: 10,
        },
        unitPrice: {
          currencyCode: 'EUR',
          text: '10.00 €',
          value: 10,
        },
      },
      {
        orderDetailId: 2,
        description: 'Item2',
        domain: 'domain2',
        detailType: 'domain',
        cancelled: false,
        quantity: '1',
        totalPrice: {
          currencyCode: 'EUR',
          text: '10.00 €',
          value: 10,
        },
        unitPrice: {
          currencyCode: 'EUR',
          text: '10.00 €',
          value: 10,
        },
      },
    ];
    vi.mocked(getOrderDetails).mockResolvedValue(mockedDetails);

    const { result } = renderHook(() => useOrderDetails(1), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.data).toEqual(mockedDetails);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should not run the query when orderId is undefined', async () => {
    const { result } = renderHook(() => useOrderDetails(undefined as unknown as number), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });
});
