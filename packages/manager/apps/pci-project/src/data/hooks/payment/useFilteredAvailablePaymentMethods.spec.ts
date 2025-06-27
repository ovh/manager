import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  TAvailablePaymentMethod,
  TPaymentMethodType,
  TPaymentMethodIntegration,
} from '@/data/types/payment/payment-method.type';
import { TEligibility } from '@/data/types/payment/eligibility.type';
import { TPaymentFeaturesState } from './usePaymentFeatureAvailabilities';
import { useAvailablePaymentMethods } from './useAvailablePaymentMethods';
import { useFilteredAvailablePaymentMethods } from './useFilteredAvailablePaymentMethods';
import { createWrapper } from '@/wrapperRenders';

// Mock the dependencies
vi.mock('./useAvailablePaymentMethods', () => ({
  useAvailablePaymentMethods: vi.fn(),
}));

// Mock constants to avoid PNG import issues
vi.mock('@/payment/constants', () => ({
  CREDIT_PAYMENT_METHOD: {
    icon: {
      data: undefined,
      name: 'credit',
      url: undefined,
      componentIcon: 'plus',
    },
    integration: 'NONE',
    oneshot: true,
    paymentType: 'CREDIT',
    registerable: false,
    registerableWithTransaction: false,
    readableName: {
      key: 'pci_project_new_payment_method_add_credit',
      ns: 'payment/add',
    },
  },
  PREFERRED_PAYMENT_METHOD_ORDER: [
    'CREDIT_CARD',
    'PAYPAL',
    'BANK_ACCOUNT',
    'CREDIT',
    'SEPA_DIRECT_DEBIT',
    'RUPAY',
  ],
}));

// Import the mocked constants
const CREDIT_PAYMENT_METHOD: TAvailablePaymentMethod = {
  icon: {
    data: undefined,
    name: 'credit',
    url: undefined,
    componentIcon: 'plus',
  },
  integration: TPaymentMethodIntegration.NONE,
  oneshot: true,
  paymentType: TPaymentMethodType.CREDIT,
  registerable: false,
  registerableWithTransaction: false,
  readableName: {
    key: 'pci_project_new_payment_method_add_credit',
    ns: 'payment/add',
  },
};

const PREFERRED_PAYMENT_METHOD_ORDER = [
  TPaymentMethodType.CREDIT_CARD,
  TPaymentMethodType.PAYPAL,
  TPaymentMethodType.BANK_ACCOUNT,
  TPaymentMethodType.CREDIT,
  TPaymentMethodType.SEPA_DIRECT_DEBIT,
  TPaymentMethodType.RUPAY,
];

describe('useFilteredAvailablePaymentMethods', () => {
  const mockUseAvailablePaymentMethods = vi.mocked(useAvailablePaymentMethods);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPaymentMethods: TAvailablePaymentMethod[] = [
    {
      paymentType: TPaymentMethodType.CREDIT_CARD,
      icon: {
        data: undefined,
        name: 'visa',
        url: undefined,
        componentIcon: undefined,
      },
      readableName: {
        key: 'ovh_payment_type_credit_card',
        ns: 'payment/register/payment-types',
      },
      integration: TPaymentMethodIntegration.REDIRECT,
      oneshot: false,
      registerable: true,
      registerableWithTransaction: true,
    },
    {
      paymentType: TPaymentMethodType.SEPA_DIRECT_DEBIT,
      icon: {
        data: undefined,
        name: 'sepa',
        url: undefined,
        componentIcon: undefined,
      },
      readableName: {
        key: 'ovh_payment_type_sepa_direct_debit',
        ns: 'payment/register/payment-types',
      },
      integration: TPaymentMethodIntegration.COMPONENT,
      oneshot: false,
      registerable: true,
      registerableWithTransaction: true,
    },
    {
      paymentType: TPaymentMethodType.PAYPAL,
      icon: {
        data: undefined,
        name: 'paypal',
        url: undefined,
        componentIcon: undefined,
      },
      readableName: {
        key: 'ovh_payment_type_paypal',
        ns: 'payment/register/payment-types',
      },
      integration: TPaymentMethodIntegration.REDIRECT,
      oneshot: false,
      registerable: true,
      registerableWithTransaction: true,
    },
  ];

  const mockEligibility: TEligibility = {
    actionsRequired: [],
    minimumCredit: null,
    paymentMethodsAuthorized: ['creditCard', 'paypal'],
    voucher: null,
  };

  const mockFeatures: TPaymentFeaturesState = {
    ADYEN_LIVE_IN: false,
    CREDIT_CARD_CROSS_BORDER: false,
    RUPAY_CHARGE: false,
    SEPA_INFO_MSG: false,
    PAYPAL_CHARGE: false,
    SEPA_DIRECT_DEBIT: false,
  };

  it('should filter out unauthorized payment methods', () => {
    mockUseAvailablePaymentMethods.mockReturnValue(({
      data: { data: mockPaymentMethods },
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as unknown) as ReturnType<typeof useAvailablePaymentMethods>);

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useFilteredAvailablePaymentMethods(mockEligibility, mockFeatures),
      { wrapper },
    );

    // Should include credit card and paypal, but not SEPA (and not credit since it's not authorized)
    expect(result.current.data?.data).toHaveLength(2);
    expect(
      result.current.data?.data?.find(
        (method: TAvailablePaymentMethod) =>
          method.paymentType === TPaymentMethodType.CREDIT_CARD,
      ),
    ).toBeDefined();
    expect(
      result.current.data?.data?.find(
        (method: TAvailablePaymentMethod) =>
          method.paymentType === TPaymentMethodType.PAYPAL,
      ),
    ).toBeDefined();
    expect(
      result.current.data?.data?.find(
        (method: TAvailablePaymentMethod) =>
          method.paymentType === TPaymentMethodType.SEPA_DIRECT_DEBIT,
      ),
    ).toBeUndefined();
  });

  it('should add SEPA payment method when SEPA feature is enabled', () => {
    const eligibilityWithSepa: TEligibility = {
      ...mockEligibility,
      paymentMethodsAuthorized: [
        ...mockEligibility.paymentMethodsAuthorized,
        'sepaDirectDebit',
      ],
    };

    const featuresWithSepa: TPaymentFeaturesState = {
      ...mockFeatures,
      SEPA_DIRECT_DEBIT: true,
    };

    mockUseAvailablePaymentMethods.mockReturnValue(({
      data: { data: mockPaymentMethods },
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as unknown) as ReturnType<typeof useAvailablePaymentMethods>);

    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        useFilteredAvailablePaymentMethods(
          eligibilityWithSepa,
          featuresWithSepa,
        ),
      { wrapper },
    );

    expect(
      result.current.data?.data?.find(
        (method: TAvailablePaymentMethod) =>
          method.paymentType === TPaymentMethodType.SEPA_DIRECT_DEBIT,
      ),
    ).toBeDefined();
  });

  it('should add credit payment method', () => {
    const eligibilityWithCredit: TEligibility = {
      actionsRequired: [],
      minimumCredit: null,
      paymentMethodsAuthorized: ['creditCard', 'paypal', 'credit'],
      voucher: null,
    };

    mockUseAvailablePaymentMethods.mockReturnValue(({
      data: { data: mockPaymentMethods },
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as unknown) as ReturnType<typeof useAvailablePaymentMethods>);

    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        useFilteredAvailablePaymentMethods(eligibilityWithCredit, mockFeatures),
      { wrapper },
    );

    expect(
      result.current.data?.data?.find(
        (method: TAvailablePaymentMethod) =>
          method.paymentType === CREDIT_PAYMENT_METHOD.paymentType,
      ),
    ).toBeDefined();
  });

  it('should sort payment methods according to preferred order', () => {
    mockUseAvailablePaymentMethods.mockReturnValue(({
      data: { data: mockPaymentMethods },
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as unknown) as ReturnType<typeof useAvailablePaymentMethods>);

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useFilteredAvailablePaymentMethods(mockEligibility, mockFeatures),
      { wrapper },
    );

    const paymentTypes = result.current.data?.data?.map(
      (method: TAvailablePaymentMethod) => method.paymentType,
    );

    // Check that payment types are sorted according to preference
    // Only check the ones that should be present
    paymentTypes?.forEach((type: TPaymentMethodType, index: number) => {
      if (index < paymentTypes.length - 1) {
        const currentPreferenceIndex = PREFERRED_PAYMENT_METHOD_ORDER.indexOf(
          type,
        );
        const nextPreferenceIndex = PREFERRED_PAYMENT_METHOD_ORDER.indexOf(
          paymentTypes[index + 1],
        );
        expect(currentPreferenceIndex).toBeLessThan(nextPreferenceIndex);
      }
    });
  });

  it('should return loading state when useAvailablePaymentMethods is loading', () => {
    mockUseAvailablePaymentMethods.mockReturnValue(({
      data: undefined,
      isLoading: true,
      error: null,
      isError: false,
      isSuccess: false,
      refetch: vi.fn(),
    } as unknown) as ReturnType<typeof useAvailablePaymentMethods>);

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useFilteredAvailablePaymentMethods(mockEligibility, mockFeatures),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('should return error state when useAvailablePaymentMethods has error', () => {
    const mockError = new Error('Test error');
    mockUseAvailablePaymentMethods.mockReturnValue(({
      data: undefined,
      isLoading: false,
      error: mockError,
      isError: true,
      isSuccess: false,
      refetch: vi.fn(),
    } as unknown) as ReturnType<typeof useAvailablePaymentMethods>);

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useFilteredAvailablePaymentMethods(mockEligibility, mockFeatures),
      { wrapper },
    );

    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(mockError);
    expect(result.current.data).toBeUndefined();
  });

  it('should handle empty payment methods array', () => {
    mockUseAvailablePaymentMethods.mockReturnValue(({
      data: { data: [] },
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as unknown) as ReturnType<typeof useAvailablePaymentMethods>);

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useFilteredAvailablePaymentMethods(mockEligibility, mockFeatures),
      { wrapper },
    );

    // Should have no payment methods since credit is not authorized and there are no other methods
    expect(result.current.data?.data).toHaveLength(0);
  });
});
