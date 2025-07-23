import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CurrencyCode } from '@ovh-ux/manager-react-components';
import { renderHook, waitFor, act } from '@testing-library/react';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  useEligibility,
  eligibilityQueryKey,
  useCheckVoucherEligibility,
} from './useEligibility';
import {
  getEligibility,
  checkVoucherEligibility,
} from '@/data/api/payment/eligibility';
import { createWrapper } from '@/wrapperRenders';
import {
  TEligibilityRequiredAction,
  TEligibility,
  TEligibilityPaymentMethod,
  TEligibilityVoucher,
} from '@/data/types/payment/eligibility.type';

vi.mock('@/data/api/payment/eligibility', () => ({
  getEligibility: vi.fn(),
  checkVoucherEligibility: vi.fn(),
}));

const mockGetEligibility = vi.mocked(getEligibility);
const mockCheckVoucherEligibility = vi.mocked(checkVoucherEligibility);

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

describe('useCheckVoucherEligibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call onSuccess when voucher eligibility check succeeds', async () => {
    const mockVoucherEligibility: TEligibilityVoucher = {
      credit: {
        currencyCode: CurrencyCode.EUR,
        priceInUcents: 1000,
        text: '10.00 EUR',
        value: 10,
      },
      paymentMethodRequired: false,
    };

    const onSuccess = vi.fn();
    const onError = vi.fn();

    mockCheckVoucherEligibility.mockResolvedValue(mockVoucherEligibility);

    const { result } = renderHook(
      () => useCheckVoucherEligibility({ onSuccess, onError }),
      {
        wrapper: createWrapper(),
      },
    );

    expect(result.current.isPending).toBe(false);
    expect(result.current.data).toBeUndefined();

    act(() => {
      result.current.mutate('VALID_VOUCHER_CODE');
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockCheckVoucherEligibility).toHaveBeenCalledWith(
      'VALID_VOUCHER_CODE',
    );
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onError).not.toHaveBeenCalled();
    expect(result.current.data).toEqual(mockVoucherEligibility);
  });

  it('should call onError when voucher eligibility check fails', async () => {
    const mockError = { message: 'VOUCHER_INVALID' } as ApiError;
    const onSuccess = vi.fn();
    const onError = vi.fn();

    mockCheckVoucherEligibility.mockRejectedValue(mockError);

    const { result } = renderHook(
      () => useCheckVoucherEligibility({ onSuccess, onError }),
      {
        wrapper: createWrapper(),
      },
    );

    act(() => {
      result.current.mutate('INVALID_VOUCHER_CODE');
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockCheckVoucherEligibility).toHaveBeenCalledWith(
      'INVALID_VOUCHER_CODE',
    );
    expect(onError).toHaveBeenCalledWith(
      mockError,
      'INVALID_VOUCHER_CODE',
      undefined,
    );
    expect(onSuccess).not.toHaveBeenCalled();
    expect(result.current.error).toEqual(mockError);
  });

  it('should work without onSuccess and onError callbacks', async () => {
    const mockVoucherEligibility: TEligibilityVoucher = {
      credit: {
        currencyCode: CurrencyCode.EUR,
        priceInUcents: 500,
        text: '5.00 EUR',
        value: 5,
      },
      paymentMethodRequired: true,
    };

    mockCheckVoucherEligibility.mockResolvedValue(mockVoucherEligibility);

    const { result } = renderHook(() => useCheckVoucherEligibility({}), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate('VOUCHER_CODE');
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockCheckVoucherEligibility).toHaveBeenCalledWith('VOUCHER_CODE');
    expect(result.current.data).toEqual(mockVoucherEligibility);
  });

  it('should handle voucher with zero credit value', async () => {
    const mockVoucherEligibility: TEligibilityVoucher = {
      credit: {
        currencyCode: CurrencyCode.EUR,
        priceInUcents: 0,
        text: '0.00 EUR',
        value: 0,
      },
      paymentMethodRequired: false,
    };

    const onSuccess = vi.fn();

    mockCheckVoucherEligibility.mockResolvedValue(mockVoucherEligibility);

    const { result } = renderHook(
      () => useCheckVoucherEligibility({ onSuccess }),
      {
        wrapper: createWrapper(),
      },
    );

    act(() => {
      result.current.mutate('FREE_VOUCHER');
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.credit.value).toBe(0);
    expect(result.current.data?.paymentMethodRequired).toBe(false);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});
