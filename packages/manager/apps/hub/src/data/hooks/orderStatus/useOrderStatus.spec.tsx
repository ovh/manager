import { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider, onlineManager } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getOrderStatus } from '@/data/api/order/order';

import { useOrderStatus } from './useOrderStatus';

vi.mock('@/data/api/order/order', () => ({
  getOrderStatus: vi.fn(),
}));

const createWrapper = () => {
  onlineManager.setOnline(true);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { wrapper, queryClient };
};

describe('useOrderStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return order status when orderId is provided', async () => {
    const { wrapper } = createWrapper();

    const mockedStatus = 'delivered';
    vi.mocked(getOrderStatus).mockResolvedValue(mockedStatus);

    const { result } = renderHook(() => useOrderStatus(1), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBe(mockedStatus);
    expect(result.current.error).toBeNull();
    expect(getOrderStatus).toHaveBeenCalledTimes(1);
    expect(getOrderStatus).toHaveBeenCalledWith(1);
  });

  it('should not run the query when orderId is undefined', () => {
    const { wrapper } = createWrapper();

    const { result } = renderHook(() => useOrderStatus(undefined as unknown as number), {
      wrapper,
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(getOrderStatus).not.toHaveBeenCalled();
  });
});
