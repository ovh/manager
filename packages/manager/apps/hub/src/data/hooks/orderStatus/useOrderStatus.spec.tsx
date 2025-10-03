import { PropsWithChildren } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { getOrderStatus } from '@/data/api/order/order';

import { useOrderStatus } from './useOrderStatus';

vi.mock('@/data/api/order/order', () => ({
  getOrderStatus: vi.fn(),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useOrderStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('should return order status when orderId is provided', async () => {
    const mockedStatus = 'delivered';
    vi.mocked(getOrderStatus).mockResolvedValue(mockedStatus);

    const { result } = renderHook(() => useOrderStatus(1), {
      wrapper,
    });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.data).toBe(mockedStatus);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should not run the query when orderId is undefined', async () => {
    const { result } = renderHook(() => useOrderStatus(undefined as unknown as number), {
      wrapper,
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });
});
