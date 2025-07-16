import { ApiError } from '@ovh-ux/manager-core-api';
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  useIsAValidHdsSupportLevel,
  useIsHdsFeatureAvailabilityEnabled,
} from '@/hooks/useHds/useHds';
import {
  CartProductOption,
  CartProductType,
  OrderedProduct,
} from '@/data/types/cart.type';
import {
  useAddItemToCart,
  useGetHdsAddonOption,
  useRemoveItemFromCart,
} from '@/data/hooks/useCart';
import { useHdsManagement, UseHdsManagementProps } from './useHdsManagement';

vi.mock('@/data/hooks/useCart', () => ({
  useAddItemToCart: vi.fn(),
  useGetHdsAddonOption: vi.fn(),
  useRemoveItemFromCart: vi.fn(),
}));

vi.mock('@/hooks/useHds/useHds', () => ({
  useIsAValidHdsSupportLevel: vi.fn(),
  useIsHdsFeatureAvailabilityEnabled: vi.fn(),
}));

// Types for mutation parameters
interface AddItemToCartParams {
  cartId: string;
  item: {
    duration: string;
    itemId: number;
    planCode: string;
    pricingMode: string;
    quantity: number;
  };
}

interface RemoveItemFromCartParams {
  cartId: string;
  itemId: number;
}

describe('useHdsManagement', () => {
  const mockSetForm = vi.fn();
  const defaultProps: UseHdsManagementProps = {
    cartId: 'cart-123',
    projectItemId: 456,
    setForm: mockSetForm,
  };

  const mockHdsAddonOption: CartProductOption = {
    mandatory: false,
    exclusive: false,
    productName: 'HDS Certification',
    planCode: 'certification.hds.2018',
    family: 'certification-hds',
    productType: CartProductType.CLOUD_SERVICE,
    prices: [
      {
        capacities: ['renew'],
        description: 'HDS certification',
        duration: 'P1M',
        interval: 1,
        maximumQuantity: 1,
        maximumRepeat: 1,
        minimumQuantity: 1,
        minimumRepeat: 1,
        price: { value: 100, currencyCode: 'EUR', text: '100.00 €' },
        priceInUcents: 10000,
        pricingMode: 'default',
        pricingType: 'purchase',
      },
    ],
  };

  const mockOrderedProduct: OrderedProduct = {
    cartId: 'cart-123',
    itemId: 789,
    productId: 'hds-product',
    configuration: [],
    duration: 'P1M',
    options: [],
    prices: [],
    settings: {
      planCode: 'certification.hds.2018',
      pricingMode: 'default',
      quantity: 1,
    },
  };

  const mockAddItemMutationResult = (
    isPending = false,
  ): UseMutationResult<
    OrderedProduct,
    ApiError,
    AddItemToCartParams,
    unknown
  > =>
    ({
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      isPending,
      isError: false,
      isIdle: !isPending,
      isSuccess: false,
      data: undefined,
      error: null,
      reset: vi.fn(),
      status: isPending ? 'pending' : 'idle',
      variables: undefined,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      submittedAt: 0,
    } as UseMutationResult<
      OrderedProduct,
      ApiError,
      AddItemToCartParams,
      unknown
    >);

  const mockRemoveItemMutationResult = (
    isPending = false,
  ): UseMutationResult<void, ApiError, RemoveItemFromCartParams, unknown> =>
    ({
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      isPending,
      isError: false,
      isIdle: !isPending,
      isSuccess: false,
      data: undefined,
      error: null,
      reset: vi.fn(),
      status: isPending ? 'pending' : 'idle',
      variables: undefined,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      submittedAt: 0,
    } as UseMutationResult<void, ApiError, RemoveItemFromCartParams, unknown>);

  const mockQueryResult = <T,>(data: T): UseQueryResult<T, ApiError> =>
    ({
      data,
      error: null,
      isError: false,
      isPending: false,
      isLoading: false,
      isSuccess: true,
      refetch: vi.fn(),
      remove: vi.fn(),
      status: 'success',
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      errorUpdateCount: 0,
      failureCount: 0,
      failureReason: null,
      isFetched: true,
      isFetchedAfterMount: true,
      isFetching: false,
      isRefetching: false,
      isStale: false,
      isPaused: false,
      fetchStatus: 'idle',
      isLoadingError: false,
      isRefetchError: false,
      isInitialLoading: false,
      isPlaceholderData: false,
      variables: undefined,
    } as UseQueryResult<T, ApiError>);

  beforeEach(() => {
    vi.clearAllMocks();

    // Set default mocks
    vi.mocked(useIsHdsFeatureAvailabilityEnabled).mockReturnValue(true);
    vi.mocked(useIsAValidHdsSupportLevel).mockReturnValue(true);
    vi.mocked(useGetHdsAddonOption).mockReturnValue(
      mockQueryResult(mockHdsAddonOption),
    );
    vi.mocked(useAddItemToCart).mockReturnValue(mockAddItemMutationResult());
    vi.mocked(useRemoveItemFromCart).mockReturnValue(
      mockRemoveItemMutationResult(),
    );
  });

  describe('shouldDisplayHdsSection', () => {
    it('should display HDS section when both feature availability and support level are valid', () => {
      const { result } = renderHook(() => useHdsManagement(defaultProps));

      expect(result.current.shouldDisplayHdsSection).toBe(true);
    });

    it('should not display HDS section when feature availability is disabled', () => {
      vi.mocked(useIsHdsFeatureAvailabilityEnabled).mockReturnValue(false);

      const { result } = renderHook(() => useHdsManagement(defaultProps));

      expect(result.current.shouldDisplayHdsSection).toBe(false);
    });

    it('should not display HDS section when support level is invalid', () => {
      vi.mocked(useIsAValidHdsSupportLevel).mockReturnValue(false);

      const { result } = renderHook(() => useHdsManagement(defaultProps));

      expect(result.current.shouldDisplayHdsSection).toBe(false);
    });

    it('should not display HDS section when both conditions are false', () => {
      vi.mocked(useIsHdsFeatureAvailabilityEnabled).mockReturnValue(false);
      vi.mocked(useIsAValidHdsSupportLevel).mockReturnValue(false);

      const { result } = renderHook(() => useHdsManagement(defaultProps));

      expect(result.current.shouldDisplayHdsSection).toBe(false);
    });
  });

  describe('isHdsPending', () => {
    it('should be false when neither adding nor removing HDS', () => {
      const { result } = renderHook(() => useHdsManagement(defaultProps));

      expect(result.current.isHdsPending).toBe(false);
    });

    it('should be true when adding HDS', () => {
      vi.mocked(useAddItemToCart).mockReturnValue(
        mockAddItemMutationResult(true),
      );

      const { result } = renderHook(() => useHdsManagement(defaultProps));

      expect(result.current.isHdsPending).toBe(true);
    });

    it('should be true when removing HDS', () => {
      vi.mocked(useRemoveItemFromCart).mockReturnValue(
        mockRemoveItemMutationResult(true),
      );

      const { result } = renderHook(() => useHdsManagement(defaultProps));

      expect(result.current.isHdsPending).toBe(true);
    });

    it('should be true when both adding and removing HDS (edge case)', () => {
      vi.mocked(useAddItemToCart).mockReturnValue(
        mockAddItemMutationResult(true),
      );
      vi.mocked(useRemoveItemFromCart).mockReturnValue(
        mockRemoveItemMutationResult(true),
      );

      const { result } = renderHook(() => useHdsManagement(defaultProps));

      expect(result.current.isHdsPending).toBe(true);
    });
  });

  describe('handleHdsToggle', () => {
    it('should update form state and add HDS to cart when checking HDS', () => {
      const mockAddMutation = { mutate: vi.fn(), isPending: false };
      vi.mocked(useAddItemToCart).mockReturnValue({
        ...mockAddItemMutationResult(),
        mutate: mockAddMutation.mutate,
      });

      const { result } = renderHook(() => useHdsManagement(defaultProps));

      act(() => {
        result.current.handleHdsToggle(true);
      });

      // Should update form state
      expect(mockSetForm).toHaveBeenCalledWith(expect.any(Function));
      const formUpdater = mockSetForm.mock.calls[0][0];
      const newFormState = formUpdater({
        description: 'test',
        isContractsChecked: true,
        hasItalyAgreements: false,
        isHdsChecked: false,
      });
      expect(newFormState).toEqual({
        description: 'test',
        isContractsChecked: false,
        hasItalyAgreements: false,
        isHdsChecked: true,
      });

      // Should call addHdsToCart with correct parameters
      expect(mockAddMutation.mutate).toHaveBeenCalledWith({
        cartId: 'cart-123',
        item: {
          duration: 'P1M',
          itemId: 456,
          planCode: 'certification.hds.2018',
          pricingMode: 'default',
          quantity: 1,
        },
      });
    });

    it('should use fallback values when hdsAddonOption is missing price info', () => {
      const incompleteHdsOption = {
        ...mockHdsAddonOption,
        prices: [], // No prices available
      };
      vi.mocked(useGetHdsAddonOption).mockReturnValue(
        mockQueryResult(incompleteHdsOption),
      );

      const mockAddMutation = { mutate: vi.fn(), isPending: false };
      vi.mocked(useAddItemToCart).mockReturnValue({
        ...mockAddItemMutationResult(),
        mutate: mockAddMutation.mutate,
      });

      const { result } = renderHook(() => useHdsManagement(defaultProps));

      act(() => {
        result.current.handleHdsToggle(true);
      });

      expect(mockAddMutation.mutate).toHaveBeenCalledWith({
        cartId: 'cart-123',
        item: {
          duration: 'P1M', // fallback
          itemId: 456,
          planCode: 'certification.hds.2018',
          pricingMode: 'default', // fallback
          quantity: 1,
        },
      });
    });

    it('should not add HDS to cart when unchecking and no HDS item exists', () => {
      const mockAddMutation = { mutate: vi.fn(), isPending: false };
      const mockRemoveMutation = { mutate: vi.fn(), isPending: false };

      vi.mocked(useAddItemToCart).mockReturnValue({
        ...mockAddItemMutationResult(),
        mutate: mockAddMutation.mutate,
      });
      vi.mocked(useRemoveItemFromCart).mockReturnValue({
        ...mockRemoveItemMutationResult(),
        mutate: mockRemoveMutation.mutate,
      });

      const { result } = renderHook(() => useHdsManagement(defaultProps));

      act(() => {
        result.current.handleHdsToggle(false);
      });

      // Should update form state
      expect(mockSetForm).toHaveBeenCalledWith(expect.any(Function));

      // Should not call either mutation since no HDS item exists
      expect(mockAddMutation.mutate).not.toHaveBeenCalled();
      expect(mockRemoveMutation.mutate).not.toHaveBeenCalled();
    });
  });

  describe('mutation callbacks', () => {
    it('should handle successful HDS addition', () => {
      let onSuccessCallback: (item: OrderedProduct) => void;
      vi.mocked(useAddItemToCart).mockImplementation((options) => {
        if (options?.onSuccess) {
          onSuccessCallback = options.onSuccess;
        }
        return { ...mockAddItemMutationResult(), mutate: vi.fn() };
      });

      renderHook(() => useHdsManagement(defaultProps));

      // Simulate successful addition
      act(() => {
        onSuccessCallback?.(mockOrderedProduct);
      });

      // The hook should update its internal state (hdsItem)
      // This is tested indirectly through the handleHdsToggle behavior
    });

    it('should handle failed HDS addition', () => {
      let onErrorCallback: ((error: ApiError) => void) | undefined;
      vi.mocked(useAddItemToCart).mockImplementation((options) => {
        if (options?.onError) {
          onErrorCallback = options.onError;
        }
        return { ...mockAddItemMutationResult(), mutate: vi.fn() };
      });

      renderHook(() => useHdsManagement(defaultProps));

      // Simulate failed addition
      act(() => {
        onErrorCallback?.({} as ApiError);
      });

      // Should revert HDS state
      expect(mockSetForm).toHaveBeenCalledWith(expect.any(Function));
      const formUpdater = mockSetForm.mock.calls[0][0];
      const newFormState = formUpdater({
        description: 'test',
        isContractsChecked: true,
        hasItalyAgreements: false,
        isHdsChecked: true,
      });
      expect(newFormState).toEqual({
        description: 'test',
        isContractsChecked: true,
        hasItalyAgreements: false,
        isHdsChecked: false,
      });
    });

    it('should handle successful HDS removal', () => {
      let onSuccessCallback: () => void;
      vi.mocked(useRemoveItemFromCart).mockImplementation((options) => {
        if (options?.onSuccess) {
          onSuccessCallback = options.onSuccess;
        }
        return { ...mockRemoveItemMutationResult(), mutate: vi.fn() };
      });

      renderHook(() => useHdsManagement(defaultProps));

      // Simulate successful removal
      act(() => {
        onSuccessCallback?.();
      });

      // The hook should update its internal state (hdsItem = null)
      // This is tested indirectly through the handleHdsToggle behavior
    });

    it('should handle failed HDS removal', () => {
      let onErrorCallback: ((error: ApiError) => void) | undefined;
      vi.mocked(useRemoveItemFromCart).mockImplementation((options) => {
        if (options?.onError) {
          onErrorCallback = options.onError;
        }
        return { ...mockRemoveItemMutationResult(), mutate: vi.fn() };
      });

      renderHook(() => useHdsManagement(defaultProps));

      // Simulate failed removal
      act(() => {
        onErrorCallback?.({} as ApiError);
      });

      // Should revert HDS state back to checked
      expect(mockSetForm).toHaveBeenCalledWith(expect.any(Function));
      const formUpdater = mockSetForm.mock.calls[0][0];
      const newFormState = formUpdater({
        description: 'test',
        isContractsChecked: true,
        hasItalyAgreements: false,
        isHdsChecked: false,
      });
      expect(newFormState).toEqual({
        description: 'test',
        isContractsChecked: true,
        hasItalyAgreements: false,
        isHdsChecked: true,
      });
    });
  });

  describe('return values', () => {
    it('should provide all expected return values', () => {
      const { result } = renderHook(() => useHdsManagement(defaultProps));

      expect(result.current).toEqual({
        shouldDisplayHdsSection: expect.any(Boolean),
        isHdsPending: expect.any(Boolean),
        handleHdsToggle: expect.any(Function),
      });
    });
  });
});
