import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { renderHook, waitFor, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PCI_PROJECT_ORDER_CART } from '@/constants';
import {
  addItemToCart,
  assignCart,
  attachConfigurationToCartItem,
  createCart,
  deleteConfigurationItemFromCart,
  getCartSummary,
  getPublicCloudOptions,
  orderCloudProject,
  removeItemFromCart,
  getCart,
  getCartItems,
  getCartConfiguration,
} from '@/data/api/cart';
import {
  Cart,
  CartProductOption,
  CartProductType,
  CartSummary,
  OrderedProduct,
  PlanCode,
} from '@/data/types/cart.type';
import queryClient from '@/queryClient';
import { createWrapper } from '@/wrapperRenders';
import {
  getCartSummaryQueryKey,
  getContractAgreementsQueryKey,
  getCartItemsQueryOptions,
  useAddItemToCart,
  useAttachConfigurationToCartItem,
  useContractAgreements,
  useCreateAndAssignCart,
  useCreateCart,
  useDeleteConfigurationItemFromCart,
  useGetCart,
  useGetCartSummary,
  useGetHdsAddonOption,
  useGetOrderProjectId,
  useGetCartConfiguration,
  useIsHdsChecked,
  useOrderProjectItem,
  useRemoveItemFromCart,
} from './useCart';

vi.mock('@/data/api/cart', () => ({
  getCartSummary: vi.fn(),
  createCart: vi.fn(),
  assignCart: vi.fn(),
  getPublicCloudOptions: vi.fn(),
  orderCloudProject: vi.fn(),
  attachConfigurationToCartItem: vi.fn(),
  deleteConfigurationItemFromCart: vi.fn(),
  addItemToCart: vi.fn(),
  removeItemFromCart: vi.fn(),
  getCart: vi.fn(),
  getCartItems: vi.fn(),
  getCartConfiguration: vi.fn(),
}));

describe('useCart hooks', () => {
  const mockCart: Cart = {
    cartId: 'cart-1',
    description: 'Test cart',
    expire: '2024-12-31',
    readonly: false,
    prices: {
      withTax: {
        value: 100,
      },
    },
    url: 'https://example.com/cart',
  };

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
    contracts: [
      {
        name: 'Contract 1',
        url: 'https://contract1.url',
        content: 'Contract 1 content',
      },
      {
        name: 'Contract 2',
        url: 'https://contract2.url',
        content: 'Contract 2 content',
      },
    ],
  };

  const mockOrderedProduct: OrderedProduct = {
    cartId: 'cart-1',
    itemId: 123,
    productId: 'product-1',
    configuration: [],
    duration: 'P1M',
    options: [],
    prices: [],
    settings: {
      planCode: 'project.2018',
      pricingMode: 'default',
      quantity: 1,
    },
  };

  const mockCartProductOptions: CartProductOption[] = [
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

  describe('getContractAgreementsQueryKey', () => {
    it('should return correct query key for cartId', () => {
      expect(getContractAgreementsQueryKey('cart-1')).toEqual([
        'new-cart',
        'cart-1',
        'contract-agreements',
      ]);
    });

    it('should handle null cartId', () => {
      expect(getContractAgreementsQueryKey(null)).toEqual([
        'new-cart',
        null,
        'contract-agreements',
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

  describe('useCreateCart', () => {
    it('should create cart and order project successfully', async () => {
      vi.mocked(createCart).mockResolvedValueOnce(mockCart);
      vi.mocked(assignCart).mockResolvedValueOnce(undefined);
      vi.mocked(getPublicCloudOptions).mockResolvedValueOnce(
        mockCartProductOptions,
      );
      vi.mocked(orderCloudProject).mockResolvedValueOnce(mockOrderedProduct);
      vi.mocked(attachConfigurationToCartItem).mockResolvedValueOnce({
        id: 1,
        label: 'description',
        value: 'Test project',
      });

      const { result } = renderHook(
        () =>
          useCreateCart(
            OvhSubsidiary.FR,
            PlanCode.PROJECT_2018,
            'Test project',
          ),
        { wrapper: createWrapper() },
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(createCart).toHaveBeenCalledWith(OvhSubsidiary.FR);
      expect(assignCart).toHaveBeenCalledWith('cart-1');
      expect(getPublicCloudOptions).toHaveBeenCalledWith(
        'cart-1',
        PlanCode.PROJECT_2018,
      );
      expect(orderCloudProject).toHaveBeenCalledWith(
        'cart-1',
        PlanCode.PROJECT_2018,
      );
      expect(attachConfigurationToCartItem).toHaveBeenCalledWith(
        'cart-1',
        123,
        {
          label: 'description',
          value: 'Test project',
        },
      );
      expect(result.current.data).toEqual(mockCart);
    });
  });

  describe('useContractAgreements', () => {
    it('should fetch contract agreements when cartId is provided', async () => {
      vi.mocked(getCartSummary).mockResolvedValueOnce(mockCartSummary);

      const { result } = renderHook(() => useContractAgreements('cart-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(getCartSummary).toHaveBeenCalledWith('cart-1');
      expect(result.current.data).toEqual([
        { name: 'Contract 1', url: 'https://contract1.url' },
        { name: 'Contract 2', url: 'https://contract2.url' },
      ]);
    });

    it('should not fetch when cartId is null', () => {
      const { result } = renderHook(() => useContractAgreements(null), {
        wrapper: createWrapper(),
      });

      expect(getCartSummary).not.toHaveBeenCalled();
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('useCreateAndAssignCart', () => {
    it('should create and assign cart successfully', async () => {
      vi.mocked(createCart).mockResolvedValueOnce(mockCart);
      vi.mocked(assignCart).mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useCreateAndAssignCart(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ ovhSubsidiary: OvhSubsidiary.FR });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(createCart).toHaveBeenCalledWith(OvhSubsidiary.FR);
      expect(assignCart).toHaveBeenCalledWith('cart-1');
      expect(result.current.data).toEqual(mockCart);
    });
  });

  describe('useOrderProjectItem', () => {
    it('should order project item successfully', async () => {
      vi.mocked(orderCloudProject).mockResolvedValueOnce(mockOrderedProduct);

      const { result } = renderHook(() => useOrderProjectItem(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ cartId: 'cart-1' });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(orderCloudProject).toHaveBeenCalledWith(
        'cart-1',
        PCI_PROJECT_ORDER_CART.planCode,
      );
      expect(result.current.data).toEqual(mockOrderedProduct);
    });
  });

  describe('useAddItemToCart', () => {
    it('should add item to cart successfully', async () => {
      vi.mocked(addItemToCart).mockResolvedValueOnce(mockOrderedProduct);
      const onSuccess = vi.fn();

      const { result } = renderHook(() => useAddItemToCart({ onSuccess }), {
        wrapper: createWrapper(),
      });

      const itemParams = {
        cartId: 'cart-1',
        item: {
          itemId: 123,
          duration: 'P1M',
          planCode: 'project.2018',
          pricingMode: 'default',
          quantity: 1,
        },
      };

      result.current.mutate(itemParams);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(addItemToCart).toHaveBeenCalledWith('cart-1', itemParams.item);
      expect(onSuccess).toHaveBeenCalledWith(mockOrderedProduct);
      expect(result.current.data).toEqual(mockOrderedProduct);
    });
  });

  describe('useRemoveItemFromCart', () => {
    it('should remove item from cart successfully', async () => {
      vi.mocked(removeItemFromCart).mockResolvedValueOnce(undefined);
      const onSuccess = vi.fn();

      const { result } = renderHook(
        () => useRemoveItemFromCart({ onSuccess }),
        {
          wrapper: createWrapper(),
        },
      );

      result.current.mutate({ cartId: 'cart-1', itemId: 123 });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(removeItemFromCart).toHaveBeenCalledWith('cart-1', 123);
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  describe('useAttachConfigurationToCartItem', () => {
    it('should attach configuration to cart item successfully', async () => {
      vi.mocked(attachConfigurationToCartItem).mockResolvedValueOnce({
        id: 1,
        label: 'description',
        value: 'Test project',
      });
      const onSuccess = vi.fn();

      const { result } = renderHook(
        () => useAttachConfigurationToCartItem({ onSuccess }),
        {
          wrapper: createWrapper(),
        },
      );

      const params = {
        cartId: 'cart-1',
        itemId: 123,
        payload: { label: 'description', value: 'Test description' },
      };

      result.current.mutate(params);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(attachConfigurationToCartItem).toHaveBeenCalledWith(
        'cart-1',
        123,
        {
          label: 'description',
          value: 'Test description',
        },
      );
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  describe('useGetHdsAddonOption', () => {
    it('should get HDS addon option when cartId is provided', async () => {
      vi.mocked(getPublicCloudOptions).mockResolvedValueOnce(
        mockCartProductOptions,
      );

      const { result } = renderHook(() => useGetHdsAddonOption('cart-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(getPublicCloudOptions).toHaveBeenCalledWith(
        'cart-1',
        PCI_PROJECT_ORDER_CART.planCode,
      );
      expect(result.current.data).toEqual(mockCartProductOptions[0]);
    });

    it('should not fetch when cartId is not provided', () => {
      const { result } = renderHook(() => useGetHdsAddonOption(undefined), {
        wrapper: createWrapper(),
      });

      expect(getPublicCloudOptions).not.toHaveBeenCalled();
      expect(result.current.data).toBeUndefined();
    });

    it('should return undefined when HDS option is not found', async () => {
      const optionsWithoutHds = [
        {
          mandatory: false,
          exclusive: false,
          productName: 'cloud',
          planCode: 'other.option',
          family: 'other-family',
          productType: CartProductType.CLOUD_SERVICE,
          prices: [],
        },
      ];
      vi.mocked(getPublicCloudOptions).mockResolvedValueOnce(optionsWithoutHds);

      const { result } = renderHook(() => useGetHdsAddonOption('cart-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toBeUndefined();
    });
  });

  describe('useDeleteConfigurationItemFromCart', () => {
    it('should delete configuration from cart item successfully', async () => {
      vi.mocked(deleteConfigurationItemFromCart).mockResolvedValueOnce(
        undefined,
      );
      const onSuccess = vi.fn();

      const { result } = renderHook(
        () => useDeleteConfigurationItemFromCart({ onSuccess }),
        {
          wrapper: createWrapper(),
        },
      );

      expect(result.current.isPending).toBe(false);

      act(() => {
        result.current.mutate({
          cartId: 'cart-1',
          itemId: 123,
          configurationId: 456,
        });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(deleteConfigurationItemFromCart).toHaveBeenCalledWith(
        'cart-1',
        123,
        456,
      );
      expect(onSuccess).toHaveBeenCalled();
    });

    it('should handle delete configuration errors', async () => {
      const mockError = new Error('API Error');
      vi.mocked(deleteConfigurationItemFromCart).mockRejectedValueOnce(
        mockError,
      );
      const onError = vi.fn();

      const { result } = renderHook(
        () => useDeleteConfigurationItemFromCart({ onError }),
        {
          wrapper: createWrapper(),
        },
      );

      act(() => {
        result.current.mutate({
          cartId: 'cart-1',
          itemId: 123,
          configurationId: 456,
        });
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(onError).toHaveBeenCalledWith(
        mockError,
        {
          cartId: 'cart-1',
          itemId: 123,
          configurationId: 456,
        },
        undefined,
      );
    });

    it('should work without onSuccess and onError callbacks', async () => {
      vi.mocked(deleteConfigurationItemFromCart).mockResolvedValueOnce(
        undefined,
      );

      const { result } = renderHook(
        () => useDeleteConfigurationItemFromCart(),
        {
          wrapper: createWrapper(),
        },
      );

      act(() => {
        result.current.mutate({
          cartId: 'cart-1',
          itemId: 123,
          configurationId: 456,
        });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(deleteConfigurationItemFromCart).toHaveBeenCalledWith(
        'cart-1',
        123,
        456,
      );
    });
  });

  describe('useGetCart', () => {
    it('should fetch cart when cartId is provided', async () => {
      vi.mocked(getCart).mockResolvedValue(mockCart);

      const { result } = renderHook(() => useGetCart('cart-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(getCart).toHaveBeenCalledWith('cart-1');
      expect(result.current.data).toEqual(mockCart);
    });

    it('should not fetch when cartId is not provided', () => {
      const { result } = renderHook(() => useGetCart(undefined), {
        wrapper: createWrapper(),
      });

      expect(result.current.data).toBeUndefined();
      expect(getCart).not.toHaveBeenCalled();
    });
  });

  describe('useGetOrderProjectId', () => {
    it('should fetch and select project item when cartId is provided', async () => {
      vi.mocked(getCartItems).mockResolvedValue([mockOrderedProduct]);

      const { result } = renderHook(() => useGetOrderProjectId('cart-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(getCartItems).toHaveBeenCalledWith('cart-1');
      expect(result.current.data).toEqual(mockOrderedProduct);
    });

    it('should return undefined when no matching project item found', async () => {
      const nonProjectItem = {
        ...mockOrderedProduct,
        settings: {
          ...mockOrderedProduct.settings,
          planCode: 'other.plan',
        },
      };
      vi.mocked(getCartItems).mockResolvedValue([nonProjectItem]);

      const { result } = renderHook(() => useGetOrderProjectId('cart-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeUndefined();
    });
  });

  describe('useIsHdsChecked', () => {
    it('should fetch and select HDS item when cartId is provided', async () => {
      const hdsItem = {
        ...mockOrderedProduct,
        settings: {
          ...mockOrderedProduct.settings,
          planCode: 'certification.hds.2018',
        },
      };
      vi.mocked(getCartItems).mockResolvedValue([hdsItem]);

      const { result } = renderHook(() => useIsHdsChecked('cart-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(getCartItems).toHaveBeenCalledWith('cart-1');
      expect(result.current.data).toEqual(hdsItem);
    });

    it('should return undefined when no HDS item found', async () => {
      vi.mocked(getCartItems).mockResolvedValue([mockOrderedProduct]);

      const { result } = renderHook(() => useIsHdsChecked('cart-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeUndefined();
    });
  });

  describe('useGetCartConfiguration', () => {
    const mockConfigurations = [
      {
        id: 123,
        label: 'description',
        value: 'Test description',
      },
      {
        id: 124,
        label: 'other',
        value: 'Other value',
      },
    ];

    it('should fetch and select configuration by label when cartId and itemId are provided', async () => {
      vi.mocked(getCartConfiguration).mockResolvedValue(mockConfigurations);

      const { result } = renderHook(
        () => useGetCartConfiguration('description', 'cart-1', 123),
        {
          wrapper: createWrapper(),
        },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(getCartConfiguration).toHaveBeenCalledWith('cart-1', 123);
      expect(result.current.data).toEqual(mockConfigurations[0]);
    });

    it('should not fetch when cartId or itemId is not provided', () => {
      const { result } = renderHook(
        () => useGetCartConfiguration('description', undefined, 123),
        {
          wrapper: createWrapper(),
        },
      );

      expect(result.current.data).toBeUndefined();
      expect(getCartConfiguration).not.toHaveBeenCalled();
    });

    it('should return undefined when no matching configuration found', async () => {
      vi.mocked(getCartConfiguration).mockResolvedValue(mockConfigurations);

      const { result } = renderHook(
        () => useGetCartConfiguration('nonexistent', 'cart-1', 123),
        {
          wrapper: createWrapper(),
        },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeUndefined();
    });
  });

  describe('getCartItemsQueryOptions', () => {
    it('should return correct query options for cartId', () => {
      const options = getCartItemsQueryOptions('cart-1');

      expect(options).toEqual({
        queryKey: ['order', 'cart', 'cart-1', 'item'],
        queryFn: expect.any(Function),
        enabled: true,
      });
    });

    it('should return disabled options when cartId is not provided', () => {
      const options = getCartItemsQueryOptions(undefined);

      expect(options.enabled).toBe(false);
    });
  });
});
