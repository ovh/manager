import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CurrencyCode } from '@ovh-ux/manager-react-components';
import { renderHook, waitFor } from '@testing-library/react';
import { useEligibility, eligibilityQueryKey } from './useEligibility';
import { getEligibility } from '@/data/api/payment/eligibility';
import { createWrapper } from '@/wrapperRenders';
import {
  TEligibilityRequiredAction,
  TEligibility,
  TEligibilityPaymentMethod,
} from '@/data/types/payment/eligibility.type';

vi.mock('@/data/api/payment/eligibility', () => ({
  getEligibility: vi.fn(),
}));

const mockGetEligibility = vi.mocked(getEligibility);

describe('useEligibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return eligibility data when API call succeeds', async () => {
    const mockEligibility: TEligibility | undefined = {
      actionsRequired: [TEligibilityRequiredAction.ADD_PAYMENT_METHOD],
      minimumCredit: {
        currencyCode: CurrencyCode.EUR,
        priceInUcents: 1000,
        text: '10.00 EUR',
        value: 10,
      },
      paymentMethodsAuthorized: [
        TEligibilityPaymentMethod.CREDIT_CARD,
        TEligibilityPaymentMethod.PAYPAL,
      ],
      voucher: {
        credit: {
          currencyCode: CurrencyCode.EUR,
          priceInUcents: 500,
          text: '5.00 EUR',
          value: 5,
        },
        paymentMethodRequired: true,
      },
    };

    mockGetEligibility.mockResolvedValue(mockEligibility);

    const { result } = renderHook(() => useEligibility(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockEligibility);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockGetEligibility).toHaveBeenCalledTimes(1);
  });

  it('should return correct query key', () => {
    expect(eligibilityQueryKey()).toEqual(['cloud', 'eligibility']);
  });

  it('should handle null values in eligibility data', async () => {
    const mockEligibility: TEligibility | undefined = {
      actionsRequired: [],
      minimumCredit: null,
      paymentMethodsAuthorized: [TEligibilityPaymentMethod.BANK_ACCOUNT],
      voucher: null,
    };

    mockGetEligibility.mockResolvedValue(mockEligibility);

    const { result } = renderHook(() => useEligibility(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockEligibility);
    expect(result.current.data?.minimumCredit).toBeNull();
    expect(result.current.data?.voucher).toBeNull();
  });
});
