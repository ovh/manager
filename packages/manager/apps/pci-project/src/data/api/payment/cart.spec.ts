import { describe, it, expect, vi, beforeEach } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getPublicCloudOptions, addCartCreditOption } from './cart';
import {
  TCart,
  TCartOptionPayload,
  TCartProductOption,
} from '@/data/types/payment/cart.type';

vi.mock('@ovh-ux/manager-core-api');

const mockV6Get = vi.mocked(v6.get);
const mockV6Post = vi.mocked(v6.post);

describe('cart API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPublicCloudOptions', () => {
    const mockCartProductOptions: TCartProductOption[] = [
      {
        planCode: 'credit.default',
        prices: [
          {
            capacities: ['standard'],
            description: 'Credit option',
            duration: 'P1M',
            interval: 1,
            maximumQuantity: 100,
            maximumRepeat: 1,
            minimumQuantity: 1,
            minimumRepeat: 1,
            price: {
              value: 10,
              currencyCode: 'EUR',
              text: '10.00 €',
            },
            priceInUcents: 1000,
            pricingMode: 'default',
            pricingType: 'purchase',
          },
        ],
      },
    ];

    it('should call v6.get with correct endpoint and return cloud options', async () => {
      mockV6Get.mockResolvedValue({ data: mockCartProductOptions });

      const result = await getPublicCloudOptions('cart-123', 'project.2018');

      expect(mockV6Get).toHaveBeenCalledWith(
        'order/cart/cart-123/cloud/options?planCode=project.2018',
      );
      expect(result).toEqual(mockCartProductOptions);
    });

    it('should handle API errors', async () => {
      const apiError = new Error('API Error');
      mockV6Get.mockRejectedValue(apiError);

      await expect(
        getPublicCloudOptions('cart-123', 'project.2018'),
      ).rejects.toThrow('API Error');
    });

    it('should handle empty cart ID', async () => {
      mockV6Get.mockResolvedValue({ data: [] });

      const result = await getPublicCloudOptions('', 'project.2018');

      expect(mockV6Get).toHaveBeenCalledWith(
        'order/cart//cloud/options?planCode=project.2018',
      );
      expect(result).toEqual([]);
    });

    it('should handle special characters in planCode', async () => {
      mockV6Get.mockResolvedValue({ data: mockCartProductOptions });

      await getPublicCloudOptions('cart-123', 'project.2018+special');

      expect(mockV6Get).toHaveBeenCalledWith(
        'order/cart/cart-123/cloud/options?planCode=project.2018+special',
      );
    });
  });

  describe('addCartCreditOption', () => {
    const mockCart: TCart = {
      cartId: 'cart-123',
      prices: {
        withTax: {
          value: 100,
        },
      },
      url: 'https://example.com/cart',
    };

    const mockOptions: TCartOptionPayload = {
      duration: 'P1M',
      itemId: 456,
      planCode: 'credit.default',
      pricingMode: 'default',
      quantity: 10,
    };

    it('should call v6.post with correct endpoint and payload and return cart', async () => {
      mockV6Post.mockResolvedValue({ data: mockCart });

      const result = await addCartCreditOption('cart-123', mockOptions);

      expect(mockV6Post).toHaveBeenCalledWith(
        'order/cart/cart-123/cloud/options',
        mockOptions,
      );
      expect(result).toEqual(mockCart);
    });

    it('should handle API errors', async () => {
      const apiError = new Error('Failed to add credit option');
      mockV6Post.mockRejectedValue(apiError);

      await expect(
        addCartCreditOption('cart-123', mockOptions),
      ).rejects.toThrow('Failed to add credit option');
    });

    it('should pass through all option properties', async () => {
      const fullOptions: TCartOptionPayload = {
        duration: 'P6M',
        itemId: 789,
        planCode: 'credit.premium',
        pricingMode: 'monthly',
        quantity: 5,
      };

      mockV6Post.mockResolvedValue({ data: mockCart });

      await addCartCreditOption('cart-456', fullOptions);

      expect(mockV6Post).toHaveBeenCalledWith(
        'order/cart/cart-456/cloud/options',
        fullOptions,
      );
    });

    it('should handle different cart IDs', async () => {
      mockV6Post.mockResolvedValue({ data: mockCart });

      await addCartCreditOption('different-cart-id', mockOptions);

      expect(mockV6Post).toHaveBeenCalledWith(
        'order/cart/different-cart-id/cloud/options',
        mockOptions,
      );
    });

    it('should handle zero quantity', async () => {
      const zeroQuantityOptions: TCartOptionPayload = {
        ...mockOptions,
        quantity: 0,
      };

      mockV6Post.mockResolvedValue({ data: mockCart });

      await addCartCreditOption('cart-123', zeroQuantityOptions);

      expect(mockV6Post).toHaveBeenCalledWith(
        'order/cart/cart-123/cloud/options',
        zeroQuantityOptions,
      );
    });
  });
});
