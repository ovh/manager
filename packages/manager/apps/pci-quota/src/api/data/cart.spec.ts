import { describe, it, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { createAndAssignCart, checkoutCart } from './cart';

describe('cart API', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createAndAssignCart', () => {
    it('should create and assign a cart', async () => {
      const mockCartId = 'mockCartId';
      vi.mocked(v6.post)
        .mockResolvedValueOnce({ data: { cartId: mockCartId } })
        .mockResolvedValueOnce({});

      const result = await createAndAssignCart('FR');

      expect(v6.post).toHaveBeenCalledWith('/order/cart', {
        ovhSubsidiary: 'FR',
      });
      expect(v6.post).toHaveBeenCalledWith(`/order/cart/${mockCartId}/assign`);
      expect(result).toBe(mockCartId);
    });
  });

  describe('checkoutCart', () => {
    it('should checkout a cart', async () => {
      const mockCartId = 'mockCartId';
      const mockCheckout = { url: 'http://checkout.url' };
      vi.mocked(v6.post).mockResolvedValueOnce({ data: mockCheckout });

      const result = await checkoutCart(mockCartId);

      expect(v6.post).toHaveBeenCalledWith(
        `/order/cart/${mockCartId}/checkout`,
        {
          cartId: mockCartId,
          autoPayWithPreferredPaymentMethod: true,
        },
      );
      expect(result).toEqual(mockCheckout);
    });
  });
});
