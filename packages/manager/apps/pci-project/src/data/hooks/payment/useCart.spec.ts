import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { useGetCreditAddonOption } from './useCart';
import { createWrapper } from '@/wrapperRenders';

// Mock React Query
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

// Mock constants
vi.mock('@/payment/constants', () => ({
  CREDIT_ORDER_CART: {
    planCode: 'credit.default',
    projectPlanCode: 'project.2018',
  },
}));

// Mock cart API
vi.mock('@/data/api/payment/cart', () => ({
  getPublicCloudOptions: vi.fn(),
}));

describe('useCart hooks', () => {
  const mockUseQuery = vi.mocked(useQuery);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useGetCreditAddonOption', () => {
    it('should call useQuery with correct parameters when cartId is provided', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
        isError: false,
      } as never);

      renderHook(() => useGetCreditAddonOption('cart-123'), {
        wrapper: createWrapper(),
      });

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['order/cart/cart-123/cloud/options?planCode=project.2018'],
        queryFn: expect.any(Function),
        select: expect.any(Function),
        enabled: true,
      });
    });

    it('should be disabled when cartId is not provided', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
        isError: false,
      } as never);

      renderHook(() => useGetCreditAddonOption(), {
        wrapper: createWrapper(),
      });

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['order/cart/undefined/cloud/options?planCode=project.2018'],
        queryFn: expect.any(Function),
        select: expect.any(Function),
        enabled: false,
      });
    });

    it('should be disabled when cartId is empty string', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
        isError: false,
      } as never);

      renderHook(() => useGetCreditAddonOption(''), {
        wrapper: createWrapper(),
      });

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: ['order/cart//cloud/options?planCode=project.2018'],
        queryFn: expect.any(Function),
        select: expect.any(Function),
        enabled: false,
      });
    });

    it('should return loading state when query is loading', () => {
      const mockQueryResult = {
        data: undefined,
        isLoading: true,
        error: null,
        isError: false,
      };

      mockUseQuery.mockReturnValue(mockQueryResult as never);

      const { result } = renderHook(() => useGetCreditAddonOption('cart-123'), {
        wrapper: createWrapper(),
      });

      expect(result.current).toEqual(mockQueryResult);
    });

    it('should return error state when query fails', () => {
      const error = new Error('API Error');
      const mockQueryResult = {
        data: undefined,
        isLoading: false,
        error,
        isError: true,
      };

      mockUseQuery.mockReturnValue(mockQueryResult as never);

      const { result } = renderHook(() => useGetCreditAddonOption('cart-123'), {
        wrapper: createWrapper(),
      });

      expect(result.current).toEqual(mockQueryResult);
    });

    it('should return data when query succeeds', () => {
      const mockData = {
        planCode: 'credit.default',
        prices: [
          {
            price: { value: 10, currencyCode: 'EUR', text: '10.00 €' },
            duration: 'P1M',
            pricingMode: 'default',
          },
        ],
      };

      const mockQueryResult = {
        data: mockData,
        isLoading: false,
        error: null,
        isError: false,
      };

      mockUseQuery.mockReturnValue(mockQueryResult as never);

      const { result } = renderHook(() => useGetCreditAddonOption('cart-123'), {
        wrapper: createWrapper(),
      });

      expect(result.current).toEqual(mockQueryResult);
    });

    it('should test the select function logic', () => {
      // Mock the query function and selector to test the select logic
      const mockCloudOptions = [
        {
          planCode: 'credit.default',
          family: 'addon',
          prices: [
            {
              price: { value: 10, currencyCode: 'EUR', text: '10.00 €' },
              duration: 'P1M',
              pricingMode: 'default',
            },
          ],
        },
        {
          planCode: 'other.option',
          family: 'addon',
          prices: [
            {
              price: { value: 20, currencyCode: 'EUR', text: '20.00 €' },
              duration: 'P1M',
              pricingMode: 'default',
            },
          ],
        },
      ];

      let capturedSelector:
        | ((data: typeof mockCloudOptions) => unknown)
        | undefined;

      mockUseQuery.mockImplementation((options) => {
        capturedSelector = options.select;
        return {
          data: undefined,
          isLoading: false,
          error: null,
          isError: false,
        } as never;
      });

      renderHook(() => useGetCreditAddonOption('cart-123'), {
        wrapper: createWrapper(),
      });

      // Test the selector function
      if (capturedSelector) {
        const result = capturedSelector(mockCloudOptions);
        expect(result).toEqual(mockCloudOptions[0]); // Should return the credit option
      }
    });

    it('should handle cloud options without matching credit option', () => {
      const mockCloudOptions = [
        {
          planCode: 'other.option',
          family: 'addon',
          prices: [
            {
              price: { value: 20, currencyCode: 'EUR', text: '20.00 €' },
              duration: 'P1M',
              pricingMode: 'default',
            },
          ],
        },
      ];

      let capturedSelector:
        | ((data: typeof mockCloudOptions) => unknown)
        | undefined;

      mockUseQuery.mockImplementation((options) => {
        capturedSelector = options.select;
        return {
          data: undefined,
          isLoading: false,
          error: null,
          isError: false,
        } as never;
      });

      renderHook(() => useGetCreditAddonOption('cart-123'), {
        wrapper: createWrapper(),
      });

      // Test the selector function with no matching credit option
      if (capturedSelector) {
        const result = capturedSelector(mockCloudOptions);
        expect(result).toBeUndefined();
      }
    });

    it('should handle empty cloud options', () => {
      const mockCloudOptions: unknown[] = [];

      let capturedSelector:
        | ((data: typeof mockCloudOptions) => unknown)
        | undefined;

      mockUseQuery.mockImplementation((options) => {
        capturedSelector = options.select;
        return {
          data: undefined,
          isLoading: false,
          error: null,
          isError: false,
        } as never;
      });

      renderHook(() => useGetCreditAddonOption('cart-123'), {
        wrapper: createWrapper(),
      });

      // Test the selector function with empty options
      if (capturedSelector) {
        const result = capturedSelector(mockCloudOptions);
        expect(result).toBeUndefined();
      }
    });

    it('should use correct query key format', () => {
      mockUseQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: null,
        isError: false,
      } as never);

      renderHook(() => useGetCreditAddonOption('my-cart-456'), {
        wrapper: createWrapper(),
      });

      expect(mockUseQuery).toHaveBeenCalledWith({
        queryKey: [
          'order/cart/my-cart-456/cloud/options?planCode=project.2018',
        ],
        queryFn: expect.any(Function),
        select: expect.any(Function),
        enabled: true,
      });
    });
  });
});
