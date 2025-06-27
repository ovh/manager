import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

import usePaymentFeatureAvailabilities from './usePaymentFeatureAvailabilities';
import { createWrapper } from '@/wrapperRenders';

// Mock constants to avoid PNG import issues - this must be done before the hook import
vi.mock('@/payment/constants', () => ({
  TPaymentFeatureAvailability: {
    ADYEN_LIVE_IN: 'payments.adyenLiveIn',
    CREDIT_CARD_CROSS_BORDER: 'payments.creditCardCrossBorder',
    RUPAY_CHARGE: 'payments.rupayCharge',
    SEPA_INFO_MSG: 'payments.sepaInfoMsg',
    PAYPAL_CHARGE: 'payments.paypalCharge',
    SEPA_DIRECT_DEBIT: 'payments.sepaDirectDebit',
  },
}));

// Mock the feature availability hook
vi.mock('@ovh-ux/manager-react-components', () => ({
  useFeatureAvailability: vi.fn(),
}));

// Import the mocked constants after the mock
const TPaymentFeatureAvailability = {
  ADYEN_LIVE_IN: 'payments.adyenLiveIn',
  CREDIT_CARD_CROSS_BORDER: 'payments.creditCardCrossBorder',
  RUPAY_CHARGE: 'payments.rupayCharge',
  SEPA_INFO_MSG: 'payments.sepaInfoMsg',
  PAYPAL_CHARGE: 'payments.paypalCharge',
  SEPA_DIRECT_DEBIT: 'payments.sepaDirectDebit',
};

const mockUseFeatureAvailability = useFeatureAvailability as ReturnType<
  typeof vi.fn
>;

describe('usePaymentFeatureAvailabilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return feature availabilities when loaded', () => {
    const mockAvailabilities = {
      [TPaymentFeatureAvailability.SEPA_DIRECT_DEBIT]: true,
      [TPaymentFeatureAvailability.PAYPAL_CHARGE]: true,
      [TPaymentFeatureAvailability.CREDIT_CARD_CROSS_BORDER]: false,
      [TPaymentFeatureAvailability.ADYEN_LIVE_IN]: true,
      [TPaymentFeatureAvailability.RUPAY_CHARGE]: false,
    };

    mockUseFeatureAvailability.mockReturnValue(({
      data: mockAvailabilities,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    const wrapper = createWrapper();

    const { result } = renderHook(() => usePaymentFeatureAvailabilities(), {
      wrapper,
    });

    expect(result.current.features.SEPA_DIRECT_DEBIT).toBe(true);
    expect(result.current.features.PAYPAL_CHARGE).toBe(true);
    expect(result.current.features.CREDIT_CARD_CROSS_BORDER).toBe(false);
    expect(result.current.features.ADYEN_LIVE_IN).toBe(true);
    expect(result.current.features.RUPAY_CHARGE).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle loading state', () => {
    mockUseFeatureAvailability.mockReturnValue(({
      data: undefined,
      isLoading: true,
      error: null,
      isError: false,
      isSuccess: false,
      refetch: vi.fn(),
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    const wrapper = createWrapper();

    const { result } = renderHook(() => usePaymentFeatureAvailabilities(), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.features.SEPA_DIRECT_DEBIT).toBe(false);
    expect(result.current.features.PAYPAL_CHARGE).toBe(false);
    expect(result.current.features.CREDIT_CARD_CROSS_BORDER).toBe(false);
    expect(result.current.features.ADYEN_LIVE_IN).toBe(false);
    expect(result.current.features.RUPAY_CHARGE).toBe(false);
  });

  it('should default to false for missing features', () => {
    const partialAvailability = {
      [TPaymentFeatureAvailability.SEPA_DIRECT_DEBIT]: true,
    };

    mockUseFeatureAvailability.mockReturnValue(({
      data: partialAvailability,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    const wrapper = createWrapper();

    const { result } = renderHook(() => usePaymentFeatureAvailabilities(), {
      wrapper,
    });

    expect(result.current.features.SEPA_DIRECT_DEBIT).toBe(true);
    expect(result.current.features.PAYPAL_CHARGE).toBe(false);
    expect(result.current.features.CREDIT_CARD_CROSS_BORDER).toBe(false);
    expect(result.current.features.ADYEN_LIVE_IN).toBe(false);
    expect(result.current.features.RUPAY_CHARGE).toBe(false);
  });

  it('should handle undefined availability data', () => {
    mockUseFeatureAvailability.mockReturnValue(({
      data: undefined,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    const wrapper = createWrapper();

    const { result } = renderHook(() => usePaymentFeatureAvailabilities(), {
      wrapper,
    });

    expect(result.current.features.SEPA_DIRECT_DEBIT).toBe(false);
    expect(result.current.features.PAYPAL_CHARGE).toBe(false);
    expect(result.current.features.CREDIT_CARD_CROSS_BORDER).toBe(false);
    expect(result.current.features.ADYEN_LIVE_IN).toBe(false);
    expect(result.current.features.RUPAY_CHARGE).toBe(false);
  });

  it('should call useFeatureAvailability with correct parameters', () => {
    mockUseFeatureAvailability.mockReturnValue(({
      data: {},
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    const wrapper = createWrapper();

    renderHook(() => usePaymentFeatureAvailabilities(), {
      wrapper,
    });

    expect(mockUseFeatureAvailability).toHaveBeenCalledWith(
      Object.values(TPaymentFeatureAvailability),
      { enabled: true },
    );
  });

  it('should handle error state', () => {
    const mockError = new Error('Feature availability error');

    mockUseFeatureAvailability.mockReturnValue(({
      data: undefined,
      isLoading: false,
      error: mockError,
      isError: true,
      isSuccess: false,
      refetch: vi.fn(),
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    const wrapper = createWrapper();

    const { result } = renderHook(() => usePaymentFeatureAvailabilities(), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.features.SEPA_DIRECT_DEBIT).toBe(false);
    expect(result.current.features.PAYPAL_CHARGE).toBe(false);
    expect(result.current.features.CREDIT_CARD_CROSS_BORDER).toBe(false);
    expect(result.current.features.ADYEN_LIVE_IN).toBe(false);
    expect(result.current.features.RUPAY_CHARGE).toBe(false);
  });
});
