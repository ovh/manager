import { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider, onlineManager } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getOrderDetails } from '@/data/api/order/order';
import { OrderDetail } from '@/types/order.type';

import { useOrderDetails } from './useOrderDetails';

vi.mock('@/data/api/order/order', () => ({
  getOrderDetails: vi.fn(),
}));

const createWrapper = () => {
  onlineManager.setOnline(true);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { wrapper, queryClient };
};

describe('useOrderDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return order details when orderId is provided', async () => {
    const { wrapper } = createWrapper();

    const mockedDetails: OrderDetail[] = [
      {
        orderDetailId: 1,
        description: 'Item1',
        domain: 'domain1',
        detailType: 'domain',
        cancelled: false,
        quantity: '1',
        totalPrice: { currencyCode: 'EUR', text: '10.00 €', value: 10 },
        unitPrice: { currencyCode: 'EUR', text: '10.00 €', value: 10 },
      },
      {
        orderDetailId: 2,
        description: 'Item2',
        domain: 'domain2',
        detailType: 'domain',
        cancelled: false,
        quantity: '1',
        totalPrice: { currencyCode: 'EUR', text: '10.00 €', value: 10 },
        unitPrice: { currencyCode: 'EUR', text: '10.00 €', value: 10 },
      },
    ];

    vi.mocked(getOrderDetails).mockResolvedValue(mockedDetails);

    const { result } = renderHook(() => useOrderDetails(1), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockedDetails);
    expect(result.current.error).toBeNull();
    expect(getOrderDetails).toHaveBeenCalledTimes(1);
    expect(getOrderDetails).toHaveBeenCalledWith(1);
  });

  it('should not run the query when orderId is undefined', async () => {
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useOrderDetails(undefined as unknown as number), {
      wrapper,
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(getOrderDetails).not.toHaveBeenCalled();
  });
});
