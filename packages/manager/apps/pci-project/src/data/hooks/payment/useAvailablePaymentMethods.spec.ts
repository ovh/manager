import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { FetchResultV6 } from '@ovh-ux/manager-react-components';
import {
  useAvailablePaymentMethods,
  availablePaymentMethodQueryKey,
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

const mockAvailablePaymentMethods: FetchResultV6<TAvailablePaymentMethod> = {
  data: [
    {
      paymentMethodId: 1,
      formSessionId: 'session123',
      icon: {
        data: undefined,
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
      readableName: {
        key: 'ovh_payment_type_credit_card',
        ns: 'payment/register/payment-types',
      },
    },
    {
      paymentMethodId: 2,
      formSessionId: undefined,
      icon: {
        data: 'base64data',
        name: 'paypal',
        url: undefined,
      },
      integration: TPaymentMethodIntegration.REDIRECT,
      merchantId: undefined,
      oneshot: true,
      organizationId: undefined,
      paymentSubType: undefined,
      paymentType: TPaymentMethodType.PAYPAL,
      registerable: false,
      registerableWithTransaction: true,
      readableName: {
        key: 'ovh_payment_type_paypal',
        ns: 'payment/register/payment-types',
      },
    },
  ],
};

describe('useAvailablePaymentMethods', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the correct query key', () => {
    const queryKey = availablePaymentMethodQueryKey();
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
