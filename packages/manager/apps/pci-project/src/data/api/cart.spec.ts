import { describe, it, expect, beforeEach, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import {
  createCart,
  assignCart,
  addOptionToCart,
  checkoutCart,
  getCartSummary,
} from './cart';
import {
  AddOptionToCartResponse,
  Cart,
  CartSummary,
} from '@/data/types/cart.type';

const mockedV6Post = vi.mocked(v6.post);
const mockedV6Get = vi.mocked(v6.get);

describe('cart API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createCart', () => {
    it('should call v6.post with correct endpoint and payload', async () => {
      const mockCart: Cart = {
        cartId: 'cart-1',
        description: 'Test cart',
        expire: '2024-12-31T23:59:59Z',
        readonly: false,
      };
      mockedV6Post.mockResolvedValue({ data: mockCart });

      const result = await createCart('FR');

      expect(mockedV6Post).toHaveBeenCalledWith('/order/cart', {
        ovhSubsidiary: 'FR',
      });
      expect(result).toBe(mockCart);
    });

    it('should throw error when API call fails', async () => {
      mockedV6Post.mockRejectedValue(new Error('API Error'));

      await expect(createCart('FR')).rejects.toThrow('API Error');
    });
  });

  describe('assignCart', () => {
    it('should call v6.post with correct endpoint', async () => {
      mockedV6Post.mockResolvedValue({});

      await assignCart('cart-1');

      expect(mockedV6Post).toHaveBeenCalledWith('/order/cart/cart-1/assign', {
        cartId: 'cart-1',
      });
    });

    it('should throw error when API call fails', async () => {
      mockedV6Post.mockRejectedValue(new Error('API Error'));

      await expect(assignCart('cart-1')).rejects.toThrow('API Error');
    });
  });

  describe('addOptionToCart', () => {
    it('should call v6.post with correct endpoint and payload', async () => {
      const mockResponse: AddOptionToCartResponse = {
        cartId: 'cart-1',
        itemId: 123,
        prices: [
          {
            price: {
              value: 10,
              currencyCode: 'EUR',
              priceInUcents: 1000,
              text: '10.00 €',
            },
            label: 'Test price',
          },
        ],
        duration: 'P1M',
        settings: {
          cartId: 'cart-1',
          pricingMode: 'default',
          subscription_id: 1,
          planCode: 'plan-1',
          quantity: 1,
        },
        offerId: null,
        options: [],
        productId: 'product-1',
      };
      mockedV6Post.mockResolvedValue({ data: mockResponse });

      const options = {
        cartId: 'cart-1',
        duration: 'P1M',
        planCode: 'plan-1',
        pricingMode: 'default',
        quantity: 1,
      };
      const result = await addOptionToCart('project-1', options);

      expect(mockedV6Post).toHaveBeenCalledWith(
        '/order/cartServiceOption/cloud/project-1',
        options,
      );
      expect(result).toBe(mockResponse);
    });

    it('should throw error when API call fails', async () => {
      mockedV6Post.mockRejectedValue(new Error('API Error'));

      await expect(
        addOptionToCart('project-1', {
          cartId: 'cart-1',
          duration: 'P1M',
          planCode: 'plan-1',
          pricingMode: 'default',
          quantity: 1,
        }),
      ).rejects.toThrow('API Error');
    });
  });

  describe('checkoutCart', () => {
    it('should call v6.post with correct endpoint and payload', async () => {
      const mockResponse: CartSummary = {
        contracts: [],
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
        details: [],
        orderId: 123,
        url: 'https://order-url',
      };
      mockedV6Post.mockResolvedValue({ data: mockResponse });

      const result = await checkoutCart('cart-1');

      expect(mockedV6Post).toHaveBeenCalledWith('/order/cart/cart-1/checkout', {
        cartId: 'cart-1',
      });
      expect(result).toBe(mockResponse);
    });

    it('should throw error when API call fails', async () => {
      mockedV6Post.mockRejectedValue(new Error('API Error'));

      await expect(checkoutCart('cart-1')).rejects.toThrow('API Error');
    });
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
