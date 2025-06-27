import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePaymentMethods } from './usePaymentMethods';
import { useFilteredPaymentMethods } from './useFilteredPaymentMethods';
import { createWrapper } from '@/wrapperRenders';
import {
  TUserPaymentMethod,
  TPaymentMethodType,
  TPaymentMethodStatus,
  TPaymentMethodIntegration,
} from '@/data/types/payment/payment-method.type';

// Mock the dependencies
vi.mock('./usePaymentMethods', () => ({
  usePaymentMethods: vi.fn(),
}));

describe('useFilteredPaymentMethods', () => {
  const mockUsePaymentMethods = vi.mocked(usePaymentMethods);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockPaymentMethod = (
    overrides: Partial<TUserPaymentMethod> = {},
  ): TUserPaymentMethod => ({
    paymentMethodId: 123,
    paymentType: TPaymentMethodType.CREDIT_CARD,
    label: '1234567890123456',
    expirationDate: '2025-12-31',
    default: false,
    icon: {
      name: 'visa',
      data: undefined,
      url: 'https://example.com/visa.png',
      componentIcon: undefined,
    },
    integration: TPaymentMethodIntegration.COMPONENT,
    paymentSubType: null,
    billingContactId: null,
    creationDate: '2023-01-01',
    description: null,
    formSessionId: null,
    lastUpdate: '2023-01-01',
    merchantId: null,
    oneclick: null,
    paymentMeanId: null,
    status: TPaymentMethodStatus.VALID,
    ...overrides,
  });

  it('should filter valid payment methods correctly', () => {
    const mockPaymentMethods = [
      createMockPaymentMethod({
        paymentMethodId: 1,
        status: TPaymentMethodStatus.VALID,
        default: false,
      }),
      createMockPaymentMethod({
        paymentMethodId: 2,
        status: TPaymentMethodStatus.VALID,
        default: true,
      }),
      createMockPaymentMethod({
        paymentMethodId: 3,
        status: TPaymentMethodStatus.ERROR,
        default: false,
      }),
    ];

    mockUsePaymentMethods.mockReturnValue(({
      data: { data: mockPaymentMethods },
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as unknown) as ReturnType<typeof usePaymentMethods>);

    const wrapper = createWrapper();

    const { result } = renderHook(() => useFilteredPaymentMethods(), {
      wrapper,
    });

    expect(result.current.filtered.valid).toHaveLength(2);
    expect(result.current.filtered.valid[0].paymentMethodId).toBe(1);
    expect(result.current.filtered.valid[1].paymentMethodId).toBe(2);
  });

  it('should identify default payment method correctly', () => {
    const defaultMethod = createMockPaymentMethod({
      paymentMethodId: 2,
      status: TPaymentMethodStatus.VALID,
      default: true,
    });

    const mockPaymentMethods = [
      createMockPaymentMethod({
        paymentMethodId: 1,
        status: TPaymentMethodStatus.VALID,
        default: false,
      }),
      defaultMethod,
      createMockPaymentMethod({
        paymentMethodId: 3,
        status: TPaymentMethodStatus.VALID,
        default: false,
      }),
    ];

    mockUsePaymentMethods.mockReturnValue(({
      data: { data: mockPaymentMethods },
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as unknown) as ReturnType<typeof usePaymentMethods>);

    const wrapper = createWrapper();

    const { result } = renderHook(() => useFilteredPaymentMethods(), {
      wrapper,
    });

    expect(result.current.filtered.default).toEqual(defaultMethod);
  });

  it('should handle no default payment method', () => {
    const mockPaymentMethods = [
      createMockPaymentMethod({
        paymentMethodId: 1,
        status: TPaymentMethodStatus.VALID,
        default: false,
      }),
      createMockPaymentMethod({
        paymentMethodId: 2,
        status: TPaymentMethodStatus.VALID,
        default: false,
      }),
    ];

    mockUsePaymentMethods.mockReturnValue(({
      data: { data: mockPaymentMethods },
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as unknown) as ReturnType<typeof usePaymentMethods>);

    const wrapper = createWrapper();

    const { result } = renderHook(() => useFilteredPaymentMethods(), {
      wrapper,
    });

    expect(result.current.filtered.default).toBeNull();
  });

  it('should handle empty payment methods array', () => {
    mockUsePaymentMethods.mockReturnValue(({
      data: { data: [] },
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as unknown) as ReturnType<typeof usePaymentMethods>);

    const wrapper = createWrapper();

    const { result } = renderHook(() => useFilteredPaymentMethods(), {
      wrapper,
    });

    expect(result.current.filtered.valid).toHaveLength(0);
    expect(result.current.filtered.default).toBeNull();
  });

  it('should handle undefined data', () => {
    mockUsePaymentMethods.mockReturnValue(({
      data: undefined,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as unknown) as ReturnType<typeof usePaymentMethods>);

    const wrapper = createWrapper();

    const { result } = renderHook(() => useFilteredPaymentMethods(), {
      wrapper,
    });

    expect(result.current.filtered.valid).toHaveLength(0);
    expect(result.current.filtered.default).toBeNull();
  });

  it('should pass through loading state', () => {
    mockUsePaymentMethods.mockReturnValue(({
      data: undefined,
      isLoading: true,
      error: null,
      isError: false,
      isSuccess: false,
      refetch: vi.fn(),
    } as unknown) as ReturnType<typeof usePaymentMethods>);

    const wrapper = createWrapper();

    const { result } = renderHook(() => useFilteredPaymentMethods(), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should pass through error state', () => {
    const mockError = new Error('API Error');
    mockUsePaymentMethods.mockReturnValue(({
      data: undefined,
      isLoading: false,
      error: mockError,
      isError: true,
      isSuccess: false,
      refetch: vi.fn(),
    } as unknown) as ReturnType<typeof usePaymentMethods>);

    const wrapper = createWrapper();

    const { result } = renderHook(() => useFilteredPaymentMethods(), {
      wrapper,
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toEqual(mockError);
  });

  it('should exclude invalid payment methods', () => {
    const mockPaymentMethods = [
      createMockPaymentMethod({
        paymentMethodId: 1,
        status: TPaymentMethodStatus.VALID,
      }),
      createMockPaymentMethod({
        paymentMethodId: 2,
        status: TPaymentMethodStatus.ERROR,
      }),
      createMockPaymentMethod({
        paymentMethodId: 3,
        status: TPaymentMethodStatus.CREATED,
      }),
    ];

    mockUsePaymentMethods.mockReturnValue(({
      data: { data: mockPaymentMethods },
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as unknown) as ReturnType<typeof usePaymentMethods>);

    const wrapper = createWrapper();

    const { result } = renderHook(() => useFilteredPaymentMethods(), {
      wrapper,
    });

    expect(result.current.filtered.valid).toHaveLength(1);
    expect(result.current.filtered.valid[0].paymentMethodId).toBe(1);
  });
});
