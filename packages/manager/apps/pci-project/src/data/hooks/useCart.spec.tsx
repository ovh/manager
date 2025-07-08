import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCartSummary } from '@/data/api/cart';
import { CartSummary } from '@/data/types/cart.type';
import queryClient from '@/queryClient';
import { createWrapper } from '@/wrapperRenders';
import { getCartSummaryQueryKey, useGetCartSummary } from './useCart';

vi.mock('@/data/api/cart', () => ({
  getCartSummary: vi.fn(),
}));

describe('useCart hooks', () => {
  const mockCartSummary: CartSummary = {
    orderId: 123,
    url: 'https://order-url',
    details: [],
    prices: {
      originalWithoutTax: { value: 10, currencyCode: 'EUR', text: '10.00 €' },
      reduction: { value: 0, currencyCode: 'EUR', text: '0.00 €' },
      tax: { value: 2, currencyCode: 'EUR', text: '2.00 €' },
      withTax: { value: 12, currencyCode: 'EUR', text: '12.00 €' },
      withoutTax: { value: 10, currencyCode: 'EUR', text: '10.00 €' },
    },
    contracts: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  describe('getCartSummaryQueryKey', () => {
    it('should return correct query key for cartId', () => {
      expect(getCartSummaryQueryKey('cart-1')).toEqual([
        '/order/cart/cart-1/summary',
      ]);
    });
  });

  describe('useGetCartSummary', () => {
    it('should fetch cart summary when cartId is provided', async () => {
      vi.mocked(getCartSummary).mockResolvedValueOnce(mockCartSummary);

      const { result } = renderHook(() => useGetCartSummary('cart-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(getCartSummary).toHaveBeenCalledWith('cart-1');
      expect(result.current.data).toEqual(mockCartSummary);
      expect(result.current.error).toBeNull();
    });

    it('should not fetch cart summary when cartId is not provided', async () => {
      const { result } = renderHook(() => useGetCartSummary(undefined), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(getCartSummary).not.toHaveBeenCalled();
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });
  });
});
