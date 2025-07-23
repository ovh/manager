import { describe, it, expect, beforeEach, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import {
  createCart,
  assignCart,
  addOptionToCart,
  checkoutCart,
  getCartSummary,
  getPublicCloudOptions,
  attachConfigurationToCartItem,
  deleteConfigurationItemFromCart,
  orderCloudProject,
  getCart,
  addItemToCart,
  removeItemFromCart,
} from './cart';
import {
  AddOptionToCartResponse,
  Cart,
  CartSummary,
  CartProductOption,
  CartProduct,
  OrderedProduct,
  PlanCode,
  CartProductType,
} from '@/data/types/cart.type';

const mockedV6Post = vi.mocked(v6.post);
const mockedV6Get = vi.mocked(v6.get);
const mockedV6Delete = vi.mocked(v6.delete);

describe('cart API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPublicCloudOptions', () => {
    it('should call v6.get with correct endpoint and return options', async () => {
      const mockOptions: CartProductOption[] = [
        {
          mandatory: false,
          exclusive: false,
          productName: 'cloud',
          planCode: 'certification.hds.2018',
          family: 'certification-hds',
          productType: CartProductType.CLOUD_SERVICE,
          prices: [],
        },
      ];
      mockedV6Get.mockResolvedValue({ data: mockOptions });

      const result = await getPublicCloudOptions(
        'cart-1',
        PlanCode.PROJECT_2018,
      );

      expect(mockedV6Get).toHaveBeenCalledWith(
        'order/cart/cart-1/cloud/options?planCode=project.2018',
      );
      expect(result).toBe(mockOptions);
    });

    it('should throw error when API call fails', async () => {
      mockedV6Get.mockRejectedValue(new Error('API Error'));

      await expect(
        getPublicCloudOptions('cart-1', PlanCode.PROJECT_2018),
      ).rejects.toThrow('API Error');
    });
  });

  describe('attachConfigurationToCartItem', () => {
    it('should call v6.post with correct endpoint and payload', async () => {
      mockedV6Post.mockResolvedValue({});

      const payload = { label: 'description', value: 'Test project' };
      await attachConfigurationToCartItem('cart-1', 123, payload);

      expect(mockedV6Post).toHaveBeenCalledWith(
        'order/cart/cart-1/item/123/configuration',
        payload,
      );
    });

    it('should throw error when API call fails', async () => {
      mockedV6Post.mockRejectedValue(new Error('API Error'));

      await expect(
        attachConfigurationToCartItem('cart-1', 123, {
          label: 'test',
          value: 'value',
        }),
      ).rejects.toThrow('API Error');
    });
  });

  describe('orderCloudProject', () => {
    const mockCartProducts: CartProduct[] = [
      {
        planCode: PlanCode.PROJECT_2018,
        productName: 'cloud',
        productType: CartProductType.CLOUD_SERVICE,
        prices: [
          {
            capacities: ['renew'],
            description: 'Project 2018 plan',
            duration: 'P1M',
            interval: 1,
            maximumQuantity: 1,
            maximumRepeat: 1,
            minimumQuantity: 1,
            minimumRepeat: 1,
            price: {
              value: 0,
              currencyCode: 'EUR',
              text: '0.00 €',
            },
            priceInUcents: 0,
            pricingMode: 'default',
            pricingType: 'purchase',
          },
        ],
      },
    ];

    const mockOrderedProduct: OrderedProduct = {
      cartId: 'cart-1',
      itemId: 123,
      productId: 'product-1',
      configuration: [],
      duration: 'P1M',
      options: [],
      prices: [],
      settings: {
        planCode: PlanCode.PROJECT_2018,
        pricingMode: 'default',
        quantity: 1,
      },
    };

    it('should successfully order cloud project', async () => {
      mockedV6Get.mockResolvedValue({ data: mockCartProducts });
      mockedV6Post.mockResolvedValue({ data: mockOrderedProduct });

      const result = await orderCloudProject('cart-1', PlanCode.PROJECT_2018);

      expect(mockedV6Get).toHaveBeenCalledWith('order/cart/cart-1/cloud');
      expect(mockedV6Post).toHaveBeenCalledWith('order/cart/cart-1/cloud', {
        duration: 'P1M',
        planCode: PlanCode.PROJECT_2018,
        pricingMode: 'default',
        quantity: 1,
      });
      expect(result).toBe(mockOrderedProduct);
    });

    it('should throw error when plan code not found', async () => {
      mockedV6Get.mockResolvedValue({ data: [] });

      await expect(
        orderCloudProject('cart-1', PlanCode.PROJECT_2018),
      ).rejects.toThrow('planCode project.2018 not found');
    });

    it('should throw error when renew price not found', async () => {
      const productsWithoutRenewPrice: CartProduct[] = [
        {
          planCode: PlanCode.PROJECT_2018,
          productName: 'cloud',
          productType: CartProductType.CLOUD_SERVICE,
          prices: [
            {
              capacities: ['detach'],
              description: 'Project 2018 plan - detach only',
              duration: 'P1M',
              interval: 1,
              maximumQuantity: 1,
              maximumRepeat: 1,
              minimumQuantity: 1,
              minimumRepeat: 1,
              price: {
                value: 0,
                currencyCode: 'EUR',
                text: '0.00 €',
              },
              priceInUcents: 0,
              pricingMode: 'default',
              pricingType: 'purchase',
            },
          ],
        },
      ];
      mockedV6Get.mockResolvedValue({ data: productsWithoutRenewPrice });

      await expect(
        orderCloudProject('cart-1', PlanCode.PROJECT_2018),
      ).rejects.toThrow("could not find 'renew' price in product offer.");
    });

    it('should throw error when API call fails', async () => {
      mockedV6Get.mockRejectedValue(new Error('API Error'));

      await expect(
        orderCloudProject('cart-1', PlanCode.PROJECT_2018),
      ).rejects.toThrow('API Error');
    });
  });

  describe('getCart', () => {
    it('should call v6.get with correct endpoint and return cart', async () => {
      const mockCart: Cart = {
        cartId: 'cart-1',
        description: 'Test cart',
        expire: '2024-12-31T23:59:59Z',
        readonly: false,
      };
      mockedV6Get.mockResolvedValue({ data: mockCart });

      const result = await getCart('cart-1');

      expect(mockedV6Get).toHaveBeenCalledWith('/order/cart/cart-1');
      expect(result).toBe(mockCart);
    });

    it('should throw error when API call fails', async () => {
      mockedV6Get.mockRejectedValue(new Error('API Error'));

      await expect(getCart('cart-1')).rejects.toThrow('API Error');
    });
  });

  describe('addItemToCart', () => {
    it('should call v6.post with correct endpoint and payload', async () => {
      const mockOrderedProduct: OrderedProduct = {
        cartId: 'cart-1',
        itemId: 123,
        productId: 'product-1',
        configuration: [],
        duration: 'P1M',
        options: [],
        prices: [],
        settings: {
          planCode: 'plan-1',
          pricingMode: 'default',
          quantity: 1,
        },
      };
      mockedV6Post.mockResolvedValue({ data: mockOrderedProduct });

      const item = {
        itemId: 123,
        duration: 'P1M',
        planCode: 'plan-1',
        pricingMode: 'default',
        quantity: 1,
      };
      const result = await addItemToCart('cart-1', item);

      expect(mockedV6Post).toHaveBeenCalledWith(
        '/order/cart/cart-1/cloud/options',
        item,
      );
      expect(result).toBe(mockOrderedProduct);
    });

    it('should throw error when API call fails', async () => {
      mockedV6Post.mockRejectedValue(new Error('API Error'));

      await expect(
        addItemToCart('cart-1', {
          itemId: 123,
          duration: 'P1M',
          planCode: 'plan-1',
          pricingMode: 'default',
          quantity: 1,
        }),
      ).rejects.toThrow('API Error');
    });
  });

  describe('removeItemFromCart', () => {
    it('should call v6.delete with correct endpoint', async () => {
      mockedV6Delete.mockResolvedValue({});

      await removeItemFromCart('cart-1', 123);

      expect(mockedV6Delete).toHaveBeenCalledWith(
        '/order/cart/cart-1/item/123',
      );
    });

    it('should throw error when API call fails', async () => {
      mockedV6Delete.mockRejectedValue(new Error('API Error'));

      await expect(removeItemFromCart('cart-1', 123)).rejects.toThrow(
        'API Error',
      );
    });
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

  describe('deleteConfigurationItemFromCart', () => {
    it('should call v6.delete with correct endpoint', async () => {
      mockedV6Delete.mockResolvedValueOnce(undefined);

      await deleteConfigurationItemFromCart('cart-1', 123, 456);

      expect(mockedV6Delete).toHaveBeenCalledWith(
        'order/cart/cart-1/item/123/configuration/456',
      );
    });

    it('should throw error when API call fails', async () => {
      mockedV6Delete.mockRejectedValue(new Error('API Error'));

      await expect(
        deleteConfigurationItemFromCart('cart-1', 123, 456),
      ).rejects.toThrow('API Error');
    });
  });

  describe('getCart', () => {
    it('should call v6.get with correct endpoint and return cart data', async () => {
      const mockCart: Cart = {
        cartId: 'cart-1',
        description: 'Test cart',
        expire: '2024-12-31',
        readonly: false,
      };
      mockedV6Get.mockResolvedValue({ data: mockCart });

      const result = await getCart('cart-1');

      expect(mockedV6Get).toHaveBeenCalledWith('/order/cart/cart-1');
      expect(result).toBe(mockCart);
    });

    it('should throw error when API call fails', async () => {
      mockedV6Get.mockRejectedValue(new Error('API Error'));

      await expect(getCart('cart-1')).rejects.toThrow('API Error');
    });
  });

  describe('assignCart', () => {
    it('should call v6.post with correct endpoint and payload', async () => {
      mockedV6Post.mockResolvedValueOnce(undefined);

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

  describe('removeItemFromCart', () => {
    it('should call v6.delete with correct endpoint', async () => {
      mockedV6Delete.mockResolvedValueOnce(undefined);

      await removeItemFromCart('cart-1', 123);

      expect(mockedV6Delete).toHaveBeenCalledWith(
        '/order/cart/cart-1/item/123',
      );
    });

    it('should throw error when API call fails', async () => {
      mockedV6Delete.mockRejectedValue(new Error('API Error'));

      await expect(removeItemFromCart('cart-1', 123)).rejects.toThrow(
        'API Error',
      );
    });
  });

  describe('checkoutCart', () => {
    it('should call v6.post with correct endpoint and return cart summary', async () => {
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
      mockedV6Post.mockResolvedValue({ data: mockSummary });

      const result = await checkoutCart('cart-1');

      expect(mockedV6Post).toHaveBeenCalledWith('/order/cart/cart-1/checkout', {
        cartId: 'cart-1',
      });
      expect(result).toBe(mockSummary);
    });

    it('should throw error when API call fails', async () => {
      mockedV6Post.mockRejectedValue(new Error('API Error'));

      await expect(checkoutCart('cart-1')).rejects.toThrow('API Error');
    });
  });

  describe('addOptionToCart', () => {
    it('should call v6.post with correct endpoint and return response', async () => {
      const mockResponse: AddOptionToCartResponse = {
        cartId: 'cart-1',
        itemId: 123,
        prices: [
          {
            price: {
              value: 10,
              currencyCode: 'EUR',
              priceInUcents: 1000,
              text: '10.00 EUR',
            },
            label: 'Monthly',
          },
        ],
        duration: 'P1M',
        settings: {
          cartId: 'cart-1',
          pricingMode: 'default',
          subscription_id: 123,
          planCode: 'plan-code',
          quantity: 1,
        },
        offerId: 'offer-1',
        options: [],
        productId: 'product-1',
      };
      const options = {
        cartId: 'cart-1',
        duration: 'P1M',
        planCode: 'plan-code',
        pricingMode: 'default',
        quantity: 1,
      };

      mockedV6Post.mockResolvedValue({ data: mockResponse });

      const result = await addOptionToCart('project-1', options);

      expect(mockedV6Post).toHaveBeenCalledWith(
        '/order/cartServiceOption/cloud/project-1',
        options,
      );
      expect(result).toBe(mockResponse);
    });

    it('should throw error when API call fails', async () => {
      const options = {
        cartId: 'cart-1',
        duration: 'P1M',
        planCode: 'plan-code',
        pricingMode: 'default',
        quantity: 1,
      };
      mockedV6Post.mockRejectedValue(new Error('API Error'));

      await expect(addOptionToCart('project-1', options)).rejects.toThrow(
        'API Error',
      );
    });
  });
});
