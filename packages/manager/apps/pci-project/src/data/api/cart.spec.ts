import { v6 } from '@ovh-ux/manager-core-api';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CartSummary } from '@/data/types/cart.type';
import { getCartSummary } from './cart';

const mockedV6Get = vi.mocked(v6.get);

describe('cart API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCartSummary', () => {
    it('should call v6.get with correct endpoint', async () => {
      const mockSummary: CartSummary = {
        orderId: 123,
        url: 'https://order-url',
        details: [],
        prices: {
          originalWithoutTax: {
            value: 10,
            currencyCode: 'EUR',
            text: '10.00 €',
          },
          reduction: { value: 0, currencyCode: 'EUR', text: '0.00 €' },
          tax: { value: 2, currencyCode: 'EUR', text: '2.00 €' },
          withTax: { value: 12, currencyCode: 'EUR', text: '12.00 €' },
          withoutTax: { value: 10, currencyCode: 'EUR', text: '10.00 €' },
        },
        contracts: [],
      };
      mockedV6Get.mockResolvedValue({ data: mockSummary });

      const result = await getCartSummary('cart-1');

      expect(mockedV6Get).toHaveBeenCalledWith('/order/cart/cart-1/summary');
      expect(result).toBe(mockSummary);
    });

    it('should throw error when API call fails', async () => {
      mockedV6Get.mockRejectedValue(new Error('API Error'));

      await expect(getCartSummary('cart-1')).rejects.toThrow('API Error');
    });
  });
});
