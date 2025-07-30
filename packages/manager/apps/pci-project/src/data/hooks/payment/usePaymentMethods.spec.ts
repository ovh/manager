/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FetchResultV6 } from '@ovh-ux/manager-react-components';
import { usePaymentMethods, paymentMathodQueryKey } from './usePaymentMethods';
import { createOptimalWrapper } from '@/test-utils/lightweight-wrappers';
import {
  TPaymentMethodIntegration,
  TPaymentMethodStatus,
  TPaymentMethodType,
  TPaymentSubType,
  TUserPaymentMethod,
} from '@/data/types/payment/payment-method.type';
import {
  getPaymentMethods,
  TPaymentMethodParams,
} from '@/data/api/payment/payment-method';

// Mock the API function
vi.mock('@/data/api/payment/payment-method', () => ({
  getPaymentMethods: vi.fn(),
}));

const mockPaymentMethods: FetchResultV6<TUserPaymentMethod> = {
  data: [
    {
      paymentMethodId: 1,
      billingContactId: 123,
      creationDate: '2023-01-01T00:00:00Z',
      default: true,
      description: 'Test payment method',
      expirationDate: '2025-01-01T00:00:00Z',
      formSessionId: 'session123',
      icon: {
        data: undefined,
        name: 'visa',
        url: 'https://example.com/visa.png',
      },
      integration: TPaymentMethodIntegration.COMPONENT,
      label: 'My Visa Card',
      lastUpdate: '2023-01-01T00:00:00Z',
      merchantId: 'merchant123',
      oneclick: true,
      paymentMeanId: 456,
      paymentSubType: TPaymentSubType.VISA,
      paymentType: TPaymentMethodType.CREDIT_CARD,
      status: TPaymentMethodStatus.VALID,
    },
  ],
};

describe('usePaymentMethods', () => {
  const mockGetPaymentMethods = vi.mocked(getPaymentMethods);

  beforeEach(() => {
    mockGetPaymentMethods.mockResolvedValue(mockPaymentMethods);
  });

  it('should generate correct query key without parameters', () => {
    const queryKey = paymentMathodQueryKey();
    expect(queryKey).toEqual(['me', 'payment', 'method', []]);
  });

  it('should generate correct query key with parameters', () => {
    const params: TPaymentMethodParams = { status: TPaymentMethodStatus.VALID };
    const queryKey = paymentMathodQueryKey(params);
    expect(queryKey).toEqual([
      'me',
      'payment',
      'method',
      [['status', 'VALID']],
    ]);
  });

  it('should fetch payment methods without parameters', async () => {
    const { result } = renderHook(() => usePaymentMethods(), {
      wrapper: createOptimalWrapper({ queries: true }),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockGetPaymentMethods).toHaveBeenCalledWith(undefined);
    expect(result.current.data).toEqual(mockPaymentMethods);
  });

  it('should fetch payment methods with parameters', async () => {
    const params: TPaymentMethodParams = { status: TPaymentMethodStatus.VALID };

    const { result } = renderHook(() => usePaymentMethods(params), {
      wrapper: createOptimalWrapper({ queries: true }),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockGetPaymentMethods).toHaveBeenCalledWith(params);
    expect(result.current.data).toEqual(mockPaymentMethods);
  });

  it('should use correct query key for caching', async () => {
    const params: TPaymentMethodParams = { status: TPaymentMethodStatus.VALID };

    const { result } = renderHook(() => usePaymentMethods(params), {
      wrapper: createOptimalWrapper({ queries: true }),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify the query key structure matches what we expect
    const expectedQueryKey = paymentMathodQueryKey(params);
    expect(expectedQueryKey).toEqual([
      'me',
      'payment',
      'method',
      [['status', 'VALID']],
    ]);
  });
});
