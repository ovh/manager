import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { UseQueryResult } from '@tanstack/react-query';
import { FetchResultV6 } from '@ovh-ux/manager-react-components';
import PaymentMethods, {
  PaymentMethodsProps,
  TPaymentMethodRef,
} from './PaymentMethods';
import { createWrapper } from '@/wrapperRenders';
import {
  TPaymentMethod,
  TPaymentMethodType,
  TPaymentMethodIntegration,
  TPaymentMethodStatus,
  TUserPaymentMethod,
} from '@/data/types/payment/payment-method.type';
import {
  TEligibility,
  TEligibilityPaymentMethod,
} from '@/data/types/payment/eligibility.type';
import { TCart } from '@/data/types/payment/cart.type';
import { useEligibility } from '@/data/hooks/payment/useEligibility';
import { usePaymentMethods } from '@/data/hooks/payment/usePaymentMethods';
import { usePaymentChallenge } from '@/data/hooks/payment/usePaymentChallenge';
import queryClient from '@/queryClient';

// Mock queryClient
vi.mock('@/queryClient', () => ({
  default: {
    invalidateQueries: vi.fn(),
  },
}));

const mockQueryClient = vi.mocked(queryClient);

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
  eligibilityQueryKey: vi.fn(() => ['cloud', 'eligibility']),
}));

vi.mock('@/data/hooks/payment/usePaymentMethods', () => ({
  usePaymentMethods: vi.fn(),
  paymentMathodQueryKey: vi.fn(() => ['me', 'payment', 'method']),
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

// Mock dependencies for PaymentMethodChallenge
vi.mock('@/data/hooks/payment/usePaymentChallenge', () => ({
  usePaymentChallenge: vi.fn(() => ({
    mutate: vi.fn(),
  })),
}));

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(() => ({
    t: (key: string) => key,
  })),
}));

describe('PaymentMethods', () => {
  const mockUseEligibility = vi.mocked(useEligibility);
  const mockUsePaymentMethods = vi.mocked(usePaymentMethods);

  const createMockEligibility = (overrides = {}): TEligibility => ({
    paymentMethodsAuthorized: [
      TEligibilityPaymentMethod.CREDIT_CARD,
      TEligibilityPaymentMethod.PAYPAL,
    ],
    actionsRequired: [],
    minimumCredit: null,
    voucher: null,
    ...overrides,
  });

  const createMockCart = (): TCart => ({
    cartId: 'cart-123',
    prices: {
      withTax: {
        value: 10.0,
      },
    },
    url: null,
  });

  const createMockProps = (overrides = {}): PaymentMethodsProps => ({
    handlePaymentMethodChange: vi.fn(),
    handleSetAsDefaultChange: vi.fn(),
    handleValidityChange: vi.fn(),
    paymentMethodHandler: React.createRef(),
    cartId: 'cart-123',
    itemId: 123,
    ...overrides,
  });

  const Wrapper = createWrapper();

  beforeEach(() => {
    vi.clearAllMocks();
    mockQueryClient.invalidateQueries.mockClear();
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
        <PaymentMethods
          {...createMockProps({ paymentMethodHandler: React.createRef() })}
        />
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

  describe('Payment Method Challenge', () => {
    it('should render PaymentMethodChallenge', () => {
      const mockEligibility = createMockEligibility({
        actionsRequired: ['challengePaymentMethod'],
      });
      const mockPaymentMethod = createMockUserPaymentMethod({
        paymentType: TPaymentMethodType.CREDIT_CARD,
        default: true,
      });

      mockUseEligibility.mockReturnValue(
        createMockEligibilityResult(mockEligibility),
      );
      // Mock both default payment methods query (used by PaymentMethods) and general query (used in test)
      mockUsePaymentMethods.mockImplementation((params) => {
        if (params?.default) {
          return createMockPaymentMethodsResult({ data: [mockPaymentMethod] });
        }
        return createMockPaymentMethodsResult({ data: [mockPaymentMethod] });
      });

      render(
        <Wrapper>
          <PaymentMethods {...createMockProps()} />
        </Wrapper>,
      );

      // Check that the challenge component is rendered by looking for challenge elements
      expect(screen.getByPlaceholderText('XXXX XX')).toBeInTheDocument();
      expect(screen.getByDisplayValue('')).toBeInTheDocument(); // The challenge input
    });

    it('should handle challenge validity changes and call handleValidityChange', async () => {
      const user = userEvent.setup();
      const mockHandleValidityChange = vi.fn();
      const mockEligibility = createMockEligibility({
        actionsRequired: ['challengePaymentMethod'],
      });
      const mockPaymentMethod = createMockUserPaymentMethod({
        default: true,
        paymentType: TPaymentMethodType.CREDIT_CARD,
      });

      mockUseEligibility.mockReturnValue(
        createMockEligibilityResult(mockEligibility),
      );
      mockUsePaymentMethods.mockImplementation((params) => {
        if (params?.default) {
          return createMockPaymentMethodsResult({ data: [mockPaymentMethod] });
        }
        return createMockPaymentMethodsResult({ data: [mockPaymentMethod] });
      });

      await act(async () => {
        render(
          <Wrapper>
            <PaymentMethods
              {...createMockProps({
                handleValidityChange: mockHandleValidityChange,
              })}
            />
          </Wrapper>,
        );
      });

      // Wait for component to initialize and set initial validity
      await waitFor(() => {
        expect(mockHandleValidityChange).toHaveBeenCalled();
      });

      // Type a valid challenge value (6 digits for credit card)
      const challengeInput = screen.getByPlaceholderText('XXXX XX');

      await act(async () => {
        await user.type(challengeInput, '123456');
      });

      await waitFor(() => {
        expect(mockHandleValidityChange).toHaveBeenCalledWith(true);
      });

      // Clear the input to make it invalid again
      await act(async () => {
        await user.clear(challengeInput);
      });

      await waitFor(() => {
        expect(mockHandleValidityChange).toHaveBeenCalledWith(false);
      });
    });

    it('should call handleValidityChange with false when no payment method is selected', async () => {
      const mockHandleValidityChange = vi.fn();
      const mockEligibility = createMockEligibility();

      mockUseEligibility.mockReturnValue(
        createMockEligibilityResult(mockEligibility),
      );
      mockUsePaymentMethods.mockReturnValue(
        createMockPaymentMethodsResult({ data: [] }),
      );

      render(
        <Wrapper>
          <PaymentMethods
            {...createMockProps({
              handleValidityChange: mockHandleValidityChange,
            })}
          />
        </Wrapper>,
      );

      await waitFor(() => {
        expect(mockHandleValidityChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('Payment Method Submission', () => {
    it('should submit payment method successfully when challenge passes', async () => {
      const mockEligibility = createMockEligibility();
      const mockPaymentMethod = createMockUserPaymentMethod({ default: true });
      const paymentMethodRef = React.createRef<TPaymentMethodRef>();

      mockUseEligibility.mockReturnValue(
        createMockEligibilityResult(mockEligibility),
      );
      mockUsePaymentMethods.mockReturnValue(
        createMockPaymentMethodsResult({ data: [mockPaymentMethod] }),
      );

      render(
        <Wrapper>
          <PaymentMethods
            {...createMockProps({
              paymentMethodHandler: paymentMethodRef,
            })}
          />
        </Wrapper>,
      );

      await waitFor(() => {
        expect(paymentMethodRef.current).toBeTruthy();
      });

      if (!paymentMethodRef.current) {
        throw new Error('Payment method ref is null');
      }

      const mockCart = createMockCart();
      const result = await paymentMethodRef.current.submitPaymentMethod(
        mockCart,
      );
      expect(result).toBe(true);
    });

    it('should handle challenge retry error', async () => {
      const mockEligibility = createMockEligibility({
        actionsRequired: ['challengePaymentMethod'],
      });
      const mockPaymentMethod = createMockUserPaymentMethod({
        default: true,
        paymentType: TPaymentMethodType.CREDIT_CARD,
      });
      const paymentMethodRef = React.createRef<TPaymentMethodRef>();

      // Mock the challenge hook to return retry status
      const mockChallengeMutate = vi.fn();
      const mockUsePaymentChallenge = vi.mocked(usePaymentChallenge);
      mockUsePaymentChallenge.mockReturnValue(({
        mutate: mockChallengeMutate,
      } as unknown) as ReturnType<typeof usePaymentChallenge>);

      mockUseEligibility.mockReturnValue(
        createMockEligibilityResult(mockEligibility),
      );
      mockUsePaymentMethods.mockImplementation((params) => {
        if (params?.default) {
          return createMockPaymentMethodsResult({ data: [mockPaymentMethod] });
        }
        return createMockPaymentMethodsResult({ data: [mockPaymentMethod] });
      });

      const { getByPlaceholderText } = render(
        <Wrapper>
          <PaymentMethods
            {...createMockProps({
              paymentMethodHandler: paymentMethodRef,
            })}
          />
        </Wrapper>,
      );

      await waitFor(() => {
        expect(paymentMethodRef.current).toBeTruthy();
        expect(getByPlaceholderText('XXXX XX')).toBeInTheDocument();
      });

      // Enter a valid challenge value to make the validation pass
      const user = userEvent.setup();
      const challengeInput = getByPlaceholderText('XXXX XX');
      await act(async () => {
        await user.type(challengeInput, '123456');
      });

      // Wait for validation to update
      await waitFor(() => {
        expect(challengeInput).toHaveValue('123456');
      });

      if (!paymentMethodRef.current) {
        throw new Error('Payment method ref is null');
      }

      // Mock the challenge mutate to call onSuccess with 'retry' status
      mockChallengeMutate.mockImplementation((_, { onSuccess }) => {
        onSuccess('retry');
      });

      const mockCart = createMockCart();
      await expect(
        paymentMethodRef.current.submitPaymentMethod(mockCart),
      ).rejects.toThrow('challenge_retry');
    });

    it('should handle payment method deactivated error and invalidate queries', async () => {
      const mockEligibility = createMockEligibility({
        actionsRequired: ['challengePaymentMethod'],
      });
      const mockPaymentMethod = createMockUserPaymentMethod({
        default: true,
        paymentType: TPaymentMethodType.CREDIT_CARD,
      });
      const paymentMethodRef = React.createRef<TPaymentMethodRef>();

      // Mock the challenge hook to return deactivated status
      const mockChallengeMutate = vi.fn();
      const mockUsePaymentChallenge = vi.mocked(usePaymentChallenge);
      mockUsePaymentChallenge.mockReturnValue(({
        mutate: mockChallengeMutate,
      } as unknown) as ReturnType<typeof usePaymentChallenge>);

      mockUseEligibility.mockReturnValue(
        createMockEligibilityResult(mockEligibility),
      );
      mockUsePaymentMethods.mockImplementation((params) => {
        if (params?.default) {
          return createMockPaymentMethodsResult({ data: [mockPaymentMethod] });
        }
        return createMockPaymentMethodsResult({ data: [mockPaymentMethod] });
      });

      render(
        <Wrapper>
          <PaymentMethods
            {...createMockProps({
              paymentMethodHandler: paymentMethodRef,
            })}
          />
        </Wrapper>,
      );

      await waitFor(() => {
        expect(paymentMethodRef.current).toBeTruthy();
      });

      // Enter a valid challenge value to make the validation pass
      const user = userEvent.setup();
      const challengeInput = screen.getByPlaceholderText('XXXX XX');
      await act(async () => {
        await user.type(challengeInput, '123456');
      });

      // Wait for validation to update
      await waitFor(() => {
        expect(challengeInput).toHaveValue('123456');
      });

      if (!paymentMethodRef.current) {
        throw new Error('Payment method ref is null');
      }

      // Mock the challenge mutate to call onSuccess with 'deactivated' status
      mockChallengeMutate.mockImplementation((_, { onSuccess }) => {
        onSuccess('deactivated');
      });

      const mockCart = createMockCart();
      await expect(
        paymentMethodRef.current.submitPaymentMethod(mockCart),
      ).rejects.toThrow('payment_method_deactivated');

      // Should invalidate both payment methods and eligibility queries
      expect(mockQueryClient.invalidateQueries).toHaveBeenCalledTimes(2);
    });

    it('should handle submission when no payment method challenge handler exists', async () => {
      const mockEligibility = createMockEligibility();
      const mockPaymentMethod = createMockUserPaymentMethod({ default: true });
      const paymentMethodRef = React.createRef<TPaymentMethodRef>();

      mockUseEligibility.mockReturnValue(
        createMockEligibilityResult(mockEligibility),
      );
      mockUsePaymentMethods.mockReturnValue(
        createMockPaymentMethodsResult({ data: [mockPaymentMethod] }),
      );

      render(
        <Wrapper>
          <PaymentMethods
            {...createMockProps({
              paymentMethodHandler: paymentMethodRef,
            })}
          />
        </Wrapper>,
      );

      await waitFor(() => {
        expect(paymentMethodRef.current).toBeTruthy();
      });

      if (!paymentMethodRef.current) {
        throw new Error('Payment method ref is null');
      }

      // This should work even if the challenge ref is not properly set
      const mockCart = createMockCart();
      const result = await paymentMethodRef.current.submitPaymentMethod(
        mockCart,
      );
      expect(result).toBe(true);
    });
  });

  describe('Validity Logic', () => {
    it('should be valid when payment method is selected, default, and challenge is valid', async () => {
      const mockHandleValidityChange = vi.fn();
      const mockEligibility = createMockEligibility();
      const mockPaymentMethod = createMockUserPaymentMethod({ default: true });

      mockUseEligibility.mockReturnValue(
        createMockEligibilityResult(mockEligibility),
      );
      mockUsePaymentMethods.mockReturnValue(
        createMockPaymentMethodsResult({ data: [mockPaymentMethod] }),
      );

      render(
        <Wrapper>
          <PaymentMethods
            {...createMockProps({
              handleValidityChange: mockHandleValidityChange,
            })}
          />
        </Wrapper>,
      );

      await waitFor(() => {
        expect(mockHandleValidityChange).toHaveBeenCalledWith(true);
      });
    });

    it('should be invalid when payment method is not default', async () => {
      const mockHandleValidityChange = vi.fn();
      const mockEligibility = createMockEligibility();
      const mockPaymentMethod = createMockUserPaymentMethod({ default: false });

      mockUseEligibility.mockReturnValue(
        createMockEligibilityResult(mockEligibility),
      );
      mockUsePaymentMethods.mockReturnValue(
        createMockPaymentMethodsResult({ data: [mockPaymentMethod] }),
      );

      render(
        <Wrapper>
          <PaymentMethods
            {...createMockProps({
              handleValidityChange: mockHandleValidityChange,
            })}
          />
        </Wrapper>,
      );

      await waitFor(() => {
        expect(mockHandleValidityChange).toHaveBeenCalledWith(false);
      });
    });

    it('should be valid when payment method conditions are met', async () => {
      const mockHandleValidityChange = vi.fn();
      const mockEligibility = createMockEligibility();
      const mockPaymentMethod = createMockUserPaymentMethod({ default: true });

      mockUseEligibility.mockReturnValue(
        createMockEligibilityResult(mockEligibility),
      );
      mockUsePaymentMethods.mockReturnValue(
        createMockPaymentMethodsResult({ data: [mockPaymentMethod] }),
      );

      render(
        <Wrapper>
          <PaymentMethods
            {...createMockProps({
              handleValidityChange: mockHandleValidityChange,
            })}
          />
        </Wrapper>,
      );

      await waitFor(() => {
        expect(mockHandleValidityChange).toHaveBeenCalledWith(true);
      });
    });
  });
});
