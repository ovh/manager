import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import {
  useAvailablePaymentMethods,
  availablePaymentMathodQueryKey,
} from './useAvailablePaymentMethods';
import {
  TAvailablePaymentMethod,
  TPaymentMethodType,
  TPaymentMethodIntegration,
  TPaymentSubType,
} from '@/data/types/payment/payment-method.type';
import { createWrapper } from '@/wrapperRenders';
import { getAvailablePaymentMethods } from '@/data/api/payment/payment-method';

// Mock the API function
vi.mock('@/data/api/payment/payment-method', () => ({
  getAvailablePaymentMethods: vi.fn(),
}));

const mockGetAvailablePaymentMethods = vi.mocked(getAvailablePaymentMethods);

const mockAvailablePaymentMethods: TAvailablePaymentMethod[] = [
  {
    formSessionId: 'session123',
    icon: {
      data: null,
      name: 'visa',
      url: 'https://example.com/visa.png',
    },
    integration: TPaymentMethodIntegration.COMPONENT,
    merchantId: 'merchant123',
    oneshot: false,
    organizationId: 'org123',
    paymentSubType: TPaymentSubType.VISA,
    paymentType: TPaymentMethodType.CREDIT_CARD,
    registerable: true,
    registerableWithTransaction: false,
  },
  {
    formSessionId: null,
    icon: {
      data: 'base64data',
      name: 'paypal',
      url: null,
    },
    integration: TPaymentMethodIntegration.REDIRECT,
    merchantId: null,
    oneshot: true,
    organizationId: null,
    paymentSubType: null,
    paymentType: TPaymentMethodType.PAYPAL,
    registerable: false,
    registerableWithTransaction: true,
  },
];

describe('useAvailablePaymentMethods', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the correct query key', () => {
    const queryKey = availablePaymentMathodQueryKey();
    expect(queryKey).toEqual(['me', 'payment', 'availableMethods']);
  });

  it('should fetch available payment methods successfully', async () => {
    mockGetAvailablePaymentMethods.mockResolvedValue(
      mockAvailablePaymentMethods,
    );

    const { result } = renderHook(() => useAvailablePaymentMethods(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockAvailablePaymentMethods);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockGetAvailablePaymentMethods).toHaveBeenCalledTimes(1);
  });

  it('should have loading state initially', () => {
    const { result } = renderHook(() => useAvailablePaymentMethods(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
  });
});
