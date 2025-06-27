import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UseQueryResult } from '@tanstack/react-query';
import { FetchResultV6 } from '@ovh-ux/manager-react-components';
import PaymentMethods, { PaymentMethodsProps } from './PaymentMethods';
import { createWrapper } from '@/wrapperRenders';
import {
  TPaymentMethod,
  TPaymentMethodType,
  TPaymentMethodIntegration,
  TPaymentMethodStatus,
  TUserPaymentMethod,
} from '@/data/types/payment/payment-method.type';
import { TEligibility } from '@/data/types/payment/eligibility.type';
import { useEligibility } from '@/data/hooks/payment/useEligibility';
import { usePaymentMethods } from '@/data/hooks/payment/usePaymentMethods';

// Type definitions for mock return values
type MockEligibilityResult = UseQueryResult<TEligibility | undefined, Error>;
type MockPaymentMethodsResult = UseQueryResult<
  FetchResultV6<TUserPaymentMethod>,
  Error
>;

// Helper functions to create complete mock results
const createMockEligibilityResult = (
  data?: TEligibility,
  isLoading = false,
): MockEligibilityResult => {
  let status: 'success' | 'pending' | 'error' = 'error';
  if (data) status = 'success';
  else if (isLoading) status = 'pending';

  const baseResult = {
    data,
    isLoading,
    error: null,
    isError: false,
    isPending: isLoading,
    isLoadingError: false,
    isRefetchError: false,
    isSuccess: !!data,
    status,
    dataUpdatedAt: 0,
    errorUpdatedAt: 0,
    failureCount: 0,
    errorUpdateCount: 0,
    failureReason: null,
    isFetched: true,
    isFetchedAfterMount: true,
    isFetching: isLoading,
    isInitialLoading: isLoading,
    isPaused: false,
    isPlaceholderData: false,
    isRefetching: false,
    isStale: false,
    refetch: vi.fn(),
    remove: vi.fn(),
    fetchStatus: isLoading ? ('fetching' as const) : ('idle' as const),
  };

  return baseResult as MockEligibilityResult;
};

const createMockPaymentMethodsResult = (
  data?: FetchResultV6<TUserPaymentMethod>,
  isLoading = false,
): MockPaymentMethodsResult => {
  let status: 'success' | 'pending' | 'error' = 'error';
  if (data) status = 'success';
  else if (isLoading) status = 'pending';

  const baseResult = {
    data,
    isLoading,
    error: null,
    isError: false,
    isPending: isLoading,
    isLoadingError: false,
    isRefetchError: false,
    isSuccess: !!data,
    status,
    dataUpdatedAt: 0,
    errorUpdatedAt: 0,
    failureCount: 0,
    errorUpdateCount: 0,
    failureReason: null,
    isFetched: true,
    isFetchedAfterMount: true,
    isFetching: isLoading,
    isInitialLoading: isLoading,
    isPaused: false,
    isPlaceholderData: false,
    isRefetching: false,
    isStale: false,
    refetch: vi.fn(),
    remove: vi.fn(),
    fetchStatus: isLoading ? ('fetching' as const) : ('idle' as const),
  };

  return baseResult as MockPaymentMethodsResult;
};

// Create mock function at the top level
const createMockUserPaymentMethod = (overrides = {}): TUserPaymentMethod => ({
  paymentType: TPaymentMethodType.CREDIT_CARD,
  icon: {
    data: undefined,
    name: 'credit-card',
    url: undefined,
    componentIcon: undefined,
  },
  integration: TPaymentMethodIntegration.NONE,
  paymentSubType: null,
  billingContactId: null,
  creationDate: '2023-01-01',
  default: true,
  description: 'Test payment method',
  expirationDate: '2025-12-31',
  formSessionId: null,
  label: '1234',
  lastUpdate: '2023-01-01',
  merchantId: null,
  oneclick: null,
  paymentMeanId: null,
  paymentMethodId: 123,
  status: TPaymentMethodStatus.VALID,
  ...overrides,
});

// Mock the hooks
vi.mock('@/data/hooks/payment/useEligibility', () => ({
  useEligibility: vi.fn(),
}));

vi.mock('@/data/hooks/payment/usePaymentMethods', () => ({
  usePaymentMethods: vi.fn(),
}));

// Mock the child components
vi.mock('./DefaultPaymentMethod', () => ({
  default: ({ method }: { method: TUserPaymentMethod }) => (
    <div
      data-testid="default-payment-method"
      data-method-id={method.paymentMethodId}
    >
      Default Payment Method
    </div>
  ),
}));

vi.mock('./RegisterPaymentMethod', () => ({
  default: ({
    eligibility,
    handlePaymentMethodChange,
    handleSetAsDefaultChange,
  }: {
    eligibility: TEligibility;
    handlePaymentMethodChange?: (method: TPaymentMethod) => void;
    handleSetAsDefaultChange?: (value: boolean) => void;
  }) => (
    <div
      data-testid="register-payment-method"
      data-eligibility={JSON.stringify(eligibility)}
    >
      Register Payment Method
      <button
        onClick={() =>
          handlePaymentMethodChange &&
          handlePaymentMethodChange(createMockUserPaymentMethod())
        }
      >
        Mock Payment Method Change
      </button>
      <button
        onClick={() =>
          handleSetAsDefaultChange && handleSetAsDefaultChange(true)
        }
      >
        Mock Set As Default Change
      </button>
    </div>
  ),
}));

describe('PaymentMethods', () => {
  const mockUseEligibility = vi.mocked(useEligibility);
  const mockUsePaymentMethods = vi.mocked(usePaymentMethods);

  const createMockEligibility = (overrides = {}): TEligibility => ({
    paymentMethodsAuthorized: ['creditCard', 'paypal'],
    actionsRequired: [],
    minimumCredit: null,
    voucher: null,
    ...overrides,
  });

  const createMockProps = (overrides = {}): PaymentMethodsProps => ({
    handlePaymentMethodChange: vi.fn(),
    handleSetAsDefaultChange: vi.fn(),
    ...overrides,
  });

  const Wrapper = createWrapper();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render component without crashing', () => {
    mockUseEligibility.mockReturnValue(
      createMockEligibilityResult(createMockEligibility()),
    );
    mockUsePaymentMethods.mockReturnValue(
      createMockPaymentMethodsResult({ data: [createMockUserPaymentMethod()] }),
    );

    const { container } = render(
      <Wrapper>
        <PaymentMethods {...createMockProps()} />
      </Wrapper>,
    );

    expect(container.firstChild).toBeTruthy();
  });

  it('should show spinner when loading eligibility', () => {
    mockUseEligibility.mockReturnValue(
      createMockEligibilityResult(undefined, true),
    );
    mockUsePaymentMethods.mockReturnValue(
      createMockPaymentMethodsResult({ data: [] }),
    );

    render(
      <Wrapper>
        <PaymentMethods {...createMockProps()} />
      </Wrapper>,
    );

    expect(screen.getByTestId('ods-spinner')).toBeInTheDocument();
  });

  it('should show spinner when loading default payment methods', () => {
    mockUseEligibility.mockReturnValue(
      createMockEligibilityResult(createMockEligibility()),
    );
    mockUsePaymentMethods.mockReturnValue(
      createMockPaymentMethodsResult(undefined, true),
    );

    render(
      <Wrapper>
        <PaymentMethods {...createMockProps()} />
      </Wrapper>,
    );

    expect(screen.getByTestId('ods-spinner')).toBeInTheDocument();
  });

  it('should show spinner when eligibility data is not available', () => {
    mockUseEligibility.mockReturnValue(
      createMockEligibilityResult(undefined, false),
    );
    mockUsePaymentMethods.mockReturnValue(
      createMockPaymentMethodsResult({ data: [] }),
    );

    render(
      <Wrapper>
        <PaymentMethods {...createMockProps()} />
      </Wrapper>,
    );

    expect(screen.getByTestId('ods-spinner')).toBeInTheDocument();
  });

  it('should render DefaultPaymentMethod when default payment method exists', () => {
    const mockPaymentMethod = createMockUserPaymentMethod();
    mockUseEligibility.mockReturnValue(
      createMockEligibilityResult(createMockEligibility()),
    );
    mockUsePaymentMethods.mockReturnValue(
      createMockPaymentMethodsResult({ data: [mockPaymentMethod] }),
    );

    render(
      <Wrapper>
        <PaymentMethods {...createMockProps()} />
      </Wrapper>,
    );

    expect(screen.getByTestId('default-payment-method')).toBeInTheDocument();
    expect(screen.getByTestId('default-payment-method')).toHaveAttribute(
      'data-method-id',
      mockPaymentMethod.paymentMethodId.toString(),
    );
  });

  it('should render RegisterPaymentMethod when no default payment method exists', () => {
    const mockEligibility = createMockEligibility();
    mockUseEligibility.mockReturnValue(
      createMockEligibilityResult(mockEligibility),
    );
    mockUsePaymentMethods.mockReturnValue(
      createMockPaymentMethodsResult({ data: [] }),
    );

    render(
      <Wrapper>
        <PaymentMethods {...createMockProps()} />
      </Wrapper>,
    );

    expect(screen.getByTestId('register-payment-method')).toBeInTheDocument();
    expect(screen.getByTestId('register-payment-method')).toHaveAttribute(
      'data-eligibility',
      JSON.stringify(mockEligibility),
    );
  });

  it('should call handlePaymentMethodChange when default payment method is available', async () => {
    const mockHandlePaymentMethodChange = vi.fn();
    const mockPaymentMethod = createMockUserPaymentMethod({ default: true });

    mockUseEligibility.mockReturnValue(
      createMockEligibilityResult(createMockEligibility()),
    );
    mockUsePaymentMethods.mockReturnValue(
      createMockPaymentMethodsResult({ data: [mockPaymentMethod] }),
    );

    render(
      <Wrapper>
        <PaymentMethods
          {...createMockProps({
            handlePaymentMethodChange: mockHandlePaymentMethodChange,
          })}
        />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(mockHandlePaymentMethodChange).toHaveBeenCalledWith(
        mockPaymentMethod,
      );
    });
  });

  it('should call handleSetAsDefaultChange when default payment method is available', async () => {
    const mockHandleSetAsDefaultChange = vi.fn();
    const mockPaymentMethod = createMockUserPaymentMethod({ default: true });

    mockUseEligibility.mockReturnValue(
      createMockEligibilityResult(createMockEligibility()),
    );
    mockUsePaymentMethods.mockReturnValue(
      createMockPaymentMethodsResult({ data: [mockPaymentMethod] }),
    );

    render(
      <Wrapper>
        <PaymentMethods
          {...createMockProps({
            handleSetAsDefaultChange: mockHandleSetAsDefaultChange,
          })}
        />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(mockHandleSetAsDefaultChange).toHaveBeenCalledWith(true);
    });
  });

  it('should call handleSetAsDefaultChange with false when default payment method has default false', async () => {
    const mockHandleSetAsDefaultChange = vi.fn();
    const mockPaymentMethod = createMockUserPaymentMethod({ default: false });

    mockUseEligibility.mockReturnValue(
      createMockEligibilityResult(createMockEligibility()),
    );
    mockUsePaymentMethods.mockReturnValue(
      createMockPaymentMethodsResult({ data: [mockPaymentMethod] }),
    );

    render(
      <Wrapper>
        <PaymentMethods
          {...createMockProps({
            handleSetAsDefaultChange: mockHandleSetAsDefaultChange,
          })}
        />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(mockHandleSetAsDefaultChange).toHaveBeenCalledWith(false);
    });
  });

  it('should use default callback functions when props are not provided', () => {
    const mockPaymentMethod = createMockUserPaymentMethod();
    mockUseEligibility.mockReturnValue(
      createMockEligibilityResult(createMockEligibility()),
    );
    mockUsePaymentMethods.mockReturnValue(
      createMockPaymentMethodsResult({ data: [mockPaymentMethod] }),
    );

    const { container } = render(
      <Wrapper>
        <PaymentMethods />
      </Wrapper>,
    );

    expect(container.firstChild).toBeTruthy();
  });

  it('should handle null/undefined default payment method gracefully', () => {
    mockUseEligibility.mockReturnValue(
      createMockEligibilityResult(createMockEligibility()),
    );
    mockUsePaymentMethods.mockReturnValue(
      createMockPaymentMethodsResult({ data: [] }),
    );

    const { container } = render(
      <Wrapper>
        <PaymentMethods {...createMockProps()} />
      </Wrapper>,
    );

    expect(container.firstChild).toBeTruthy();
    expect(screen.getByTestId('register-payment-method')).toBeInTheDocument();
  });

  it('should pass callbacks to RegisterPaymentMethod', () => {
    const mockHandlePaymentMethodChange = vi.fn();
    const mockHandleSetAsDefaultChange = vi.fn();

    mockUseEligibility.mockReturnValue(
      createMockEligibilityResult(createMockEligibility()),
    );
    mockUsePaymentMethods.mockReturnValue(
      createMockPaymentMethodsResult({ data: [] }),
    );

    render(
      <Wrapper>
        <PaymentMethods
          {...createMockProps({
            handlePaymentMethodChange: mockHandlePaymentMethodChange,
            handleSetAsDefaultChange: mockHandleSetAsDefaultChange,
          })}
        />
      </Wrapper>,
    );

    expect(screen.getByTestId('register-payment-method')).toBeInTheDocument();
  });
});
