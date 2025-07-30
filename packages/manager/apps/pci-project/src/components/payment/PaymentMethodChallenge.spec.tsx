/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createRef } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UseMutationResult } from '@tanstack/react-query';
import PaymentMethodChallenge, {
  TPaymentMethodChallengeProps,
  TPaymentMethodChallengeRef,
} from './PaymentMethodChallenge';
import { createOptimalWrapper } from '@/test-utils/lightweight-wrappers';
import {
  TPaymentMethodType,
  TUserPaymentMethod,
  TPaymentMethodIntegration,
  TPaymentMethodStatus,
} from '@/data/types/payment/payment-method.type';
import {
  TEligibility,
  TEligibilityPaymentMethod,
  TEligibilityRequiredAction,
} from '@/data/types/payment/eligibility.type';
import { TChallengeStatus } from '@/data/types/payment/payment-challenge.type';
import { usePaymentChallenge } from '@/data/hooks/payment/usePaymentChallenge';

// Mock the payment challenge hook
vi.mock('@/data/hooks/payment/usePaymentChallenge');

const mockMutate = vi.fn();
const mockUsePaymentChallenge = usePaymentChallenge as ReturnType<typeof vi.fn>;

// Helper function to create a mock user payment method
const createMockUserPaymentMethod = (
  paymentType: TPaymentMethodType,
  paymentMethodId = 123,
): TUserPaymentMethod => ({
  paymentType,
  paymentMethodId,
  billingContactId: null,
  creationDate: '2024-01-01T00:00:00.000Z',
  default: false,
  description: null,
  expirationDate: null,
  formSessionId: null,
  integration: TPaymentMethodIntegration.REDIRECT,
  label: `Test ${paymentType}`,
  lastUpdate: '2024-01-01T00:00:00.000Z',
  merchantId: null,
  oneclick: null,
  paymentMeanId: null,
  status: TPaymentMethodStatus.VALID,
  icon: {
    name: 'test-icon',
    data: 'test-data',
  },
  paymentSubType: null,
});

// Helper function to create eligibility with challenge required
const createEligibilityWithChallenge = (): TEligibility => ({
  actionsRequired: [TEligibilityRequiredAction.CHALLENGE_PAYMENT_METHOD],
  minimumCredit: null,
  paymentMethodsAuthorized: [
    TEligibilityPaymentMethod.CREDIT_CARD,
    TEligibilityPaymentMethod.BANK_ACCOUNT,
    TEligibilityPaymentMethod.PAYPAL,
  ],
  voucher: null,
});

// Helper function to create eligibility without challenge
const createEligibilityWithoutChallenge = (): TEligibility => ({
  actionsRequired: [TEligibilityRequiredAction.ADD_PAYMENT_METHOD],
  minimumCredit: null,
  paymentMethodsAuthorized: [
    TEligibilityPaymentMethod.CREDIT_CARD,
    TEligibilityPaymentMethod.BANK_ACCOUNT,
    TEligibilityPaymentMethod.PAYPAL,
  ],
  voucher: null,
});

const renderPaymentMethodChallenge = (
  props: Partial<TPaymentMethodChallengeProps> = {},
) => {
  const challengeHandler = createRef<TPaymentMethodChallengeRef>();
  const handleValidityChange = vi.fn();

  const defaultProps: TPaymentMethodChallengeProps = {
    challengeHandler,
    eligibility: createEligibilityWithChallenge(),
    paymentMethod: undefined,
    handleValidityChange,
    ...props,
  };

  const Wrapper = createOptimalWrapper({ queries: true, shell: true });

  return {
    ...render(
      <Wrapper>
        <PaymentMethodChallenge {...defaultProps} />
      </Wrapper>,
    ),
    challengeHandler,
    handleValidityChange,
    props: defaultProps,
  };
};

describe('PaymentMethodChallenge', () => {
  beforeEach(() => {
    mockUsePaymentChallenge.mockReturnValue(({
      mutate: mockMutate,
      data: undefined,
      error: null,
      isError: false,
      isIdle: true,
      isLoading: false,
      isPending: false,
      isSuccess: false,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      status: 'idle',
      variables: undefined,
      mutateAsync: vi.fn(),
      reset: vi.fn(),
      context: undefined,
      submittedAt: 0,
    } as unknown) as UseMutationResult<TChallengeStatus, Error, unknown, unknown>);
  });

  describe('when challenge is not required', () => {
    it('should not render anything when challenge is not required', async () => {
      await act(async () => {
        renderPaymentMethodChallenge({
          eligibility: createEligibilityWithoutChallenge(),
        });
      });

      expect(screen.queryByTestId('ods-card')).not.toBeInTheDocument();
    });

    it('should call handleValidityChange with true when challenge is not required', async () => {
      const { handleValidityChange } = renderPaymentMethodChallenge({
        eligibility: createEligibilityWithoutChallenge(),
      });

      expect(handleValidityChange).toHaveBeenCalledWith(true);
    });
  });

  describe('when challenge is required', () => {
    it('should not render challenge UI when no payment method is provided', async () => {
      renderPaymentMethodChallenge({
        paymentMethod: undefined,
      });

      // Should not contain any payment-specific challenge UI
      expect(screen.queryByTestId('ods-card')).not.toBeInTheDocument();
    });

    it('should call handleValidityChange with false when no payment method is provided', async () => {
      const { handleValidityChange } = renderPaymentMethodChallenge({
        paymentMethod: undefined,
      });

      expect(handleValidityChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Credit Card Challenge', () => {
    const creditCardPaymentMethod = createMockUserPaymentMethod(
      TPaymentMethodType.CREDIT_CARD,
    );

    it('should render credit card challenge UI', async () => {
      await act(async () => {
        renderPaymentMethodChallenge({
          paymentMethod: creditCardPaymentMethod,
        });
      });

      expect(screen.getByTestId('ods-card')).toBeInTheDocument();
      expect(screen.getByTestId('ods-text')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('XXXX XX')).toBeInTheDocument();
    });

    it('should validate credit card input correctly', async () => {
      const user = userEvent.setup();
      const { handleValidityChange } = renderPaymentMethodChallenge({
        paymentMethod: creditCardPaymentMethod,
      });

      const input = screen.getByRole('textbox');

      // Initially invalid
      expect(handleValidityChange).toHaveBeenCalledWith(false);

      // Valid 6-digit input
      await act(async () => {
        await user.type(input, '123456');
      });
      expect(input).toHaveValue('123456');
      await waitFor(() => {
        expect(handleValidityChange).toHaveBeenCalledWith(true);
      });

      // Clear and test invalid input
      await act(async () => {
        await user.clear(input);
        await user.type(input, '12345');
      });
      expect(input).toHaveValue('12345');
      await waitFor(() => {
        expect(handleValidityChange).toHaveBeenCalledWith(false);
      });

      // Test non-numeric input
      await act(async () => {
        await user.clear(input);
        await user.type(input, '12345a');
      });
      expect(input).toHaveValue('12345a');
      await waitFor(() => {
        expect(handleValidityChange).toHaveBeenCalledWith(false);
      });
    });

    it('should limit credit card input to 6 characters', async () => {
      const user = userEvent.setup();
      renderPaymentMethodChallenge({
        paymentMethod: creditCardPaymentMethod,
      });

      const input = screen.getByRole('textbox');
      await act(async () => {
        await user.type(input, '1234567890');
      });

      expect(input).toHaveValue('123456');
    });

    it('should submit credit card challenge successfully', async () => {
      const user = userEvent.setup();
      const { challengeHandler } = renderPaymentMethodChallenge({
        paymentMethod: creditCardPaymentMethod,
      });

      const input = screen.getByRole('textbox');
      await act(async () => {
        await user.type(input, '123456');
      });

      mockMutate.mockImplementation((_params, options) => {
        options.onSuccess('success');
      });

      await act(async () => {
        const result = await challengeHandler.current?.submitChallenge();
        expect(result).toBe('success');
        expect(mockMutate).toHaveBeenCalledWith(
          {
            paymentMethodId: '123',
            challenge: '123456',
          },
          expect.any(Object),
        );
      });
    });
  });

  describe('Bank Account Challenge', () => {
    const bankAccountPaymentMethod = createMockUserPaymentMethod(
      TPaymentMethodType.BANK_ACCOUNT,
    );

    it('should render bank account challenge UI', async () => {
      await act(async () => {
        renderPaymentMethodChallenge({
          paymentMethod: bankAccountPaymentMethod,
        });
      });

      expect(screen.getByTestId('ods-card')).toBeInTheDocument();
      expect(screen.getAllByTestId('ods-text')).toHaveLength(1);

      // Look for input by role instead of querySelector
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should validate IBAN input correctly', async () => {
      const { handleValidityChange } = renderPaymentMethodChallenge({
        paymentMethod: bankAccountPaymentMethod,
      });

      // Initially invalid
      expect(handleValidityChange).toHaveBeenCalledWith(false);

      // Type a valid IBAN using userEvent
      const user = userEvent.setup();
      const input = screen.getByRole('textbox');

      await act(async () => {
        await user.type(input, 'FR1420041010050500013M02606');
      });

      await waitFor(() => {
        expect(handleValidityChange).toHaveBeenCalledWith(true);
      });
    });

    it('should submit bank account challenge successfully', async () => {
      const { challengeHandler } = renderPaymentMethodChallenge({
        paymentMethod: bankAccountPaymentMethod,
      });

      // Get the input element and type a valid IBAN
      const user = userEvent.setup();
      const input = screen.getByRole('textbox');

      await act(async () => {
        await user.type(input, 'FR1420041010050500013M02606');
      });

      mockMutate.mockImplementation((_params, options) => {
        options.onSuccess('success');
      });

      await act(async () => {
        const result = await challengeHandler.current?.submitChallenge();
        await waitFor(() => {
          expect(result).toBe('success');
          expect(mockMutate).toHaveBeenCalledWith(
            {
              paymentMethodId: '123',
              challenge: 'FR1420041010050500013M02606',
            },
            expect.any(Object),
          );
        });
      });
    });
  });

  describe('PayPal Challenge', () => {
    const paypalPaymentMethod = createMockUserPaymentMethod(
      TPaymentMethodType.PAYPAL,
    );

    it('should render PayPal challenge UI', async () => {
      await act(async () => {
        renderPaymentMethodChallenge({
          paymentMethod: paypalPaymentMethod,
        });
      });

      expect(screen.getByTestId('ods-card')).toBeInTheDocument();
      expect(screen.getByTestId('ods-text')).toBeInTheDocument();
    });

    it('should be valid by default for PayPal', async () => {
      let handleValidityChange: ReturnType<typeof vi.fn>;
      await act(async () => {
        const result = renderPaymentMethodChallenge({
          paymentMethod: paypalPaymentMethod,
        });
        handleValidityChange = result.handleValidityChange;
      });

      await waitFor(() => {
        expect(handleValidityChange).toHaveBeenCalledWith(true);
      });
    });

    it('should not submit PayPal challenge', async () => {
      const { challengeHandler } = renderPaymentMethodChallenge({
        paymentMethod: paypalPaymentMethod,
      });

      mockMutate.mockImplementation((_params, options) => {
        options.onSuccess('success');
      });

      const result = await challengeHandler.current?.submitChallenge();
      expect(result).toBe('success');
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  describe('Challenge Submission', () => {
    const creditCardPaymentMethod = createMockUserPaymentMethod(
      TPaymentMethodType.CREDIT_CARD,
    );

    it('should handle challenge submission error', async () => {
      const user = userEvent.setup();
      const { challengeHandler } = renderPaymentMethodChallenge({
        paymentMethod: creditCardPaymentMethod,
      });

      const input = screen.getByRole('textbox');
      await act(async () => {
        await user.type(input, '123456');
      });

      mockMutate.mockImplementation((_params, options) => {
        options.onError(new Error('Network error'));
      });

      await act(async () => {
        const result = await challengeHandler.current?.submitChallenge();
        expect(result).toBe('retry');
      });
    });

    it('should handle retry status from server', async () => {
      const user = userEvent.setup();
      const { challengeHandler } = renderPaymentMethodChallenge({
        paymentMethod: creditCardPaymentMethod,
      });

      const input = screen.getByRole('textbox');
      await act(async () => {
        await user.type(input, '123456');
      });

      mockMutate.mockImplementation((_params, options) => {
        options.onSuccess('retry');
      });

      await act(async () => {
        const result = await challengeHandler.current?.submitChallenge();
        expect(result).toBe('retry');
      });
    });

    it('should show retry error message when mustRetry is true', async () => {
      const user = userEvent.setup();
      const { challengeHandler } = renderPaymentMethodChallenge({
        paymentMethod: creditCardPaymentMethod,
      });

      const input = screen.getByRole('textbox');
      await act(async () => {
        await user.type(input, '123456');
      });

      mockMutate.mockImplementation((_params, options) => {
        options.onSuccess('retry');
      });

      await act(async () => {
        await challengeHandler.current?.submitChallenge();
      });

      await waitFor(() => {
        expect(screen.getByTestId('ods-message')).toBeInTheDocument();
        expect(screen.getByTestId('ods-message')).toHaveAttribute(
          'data-color',
          'critical',
        );
      });
    });

    it('should return success immediately when challenge is not required', async () => {
      let challengeHandler!: React.RefObject<TPaymentMethodChallengeRef>;
      await act(async () => {
        const result = renderPaymentMethodChallenge({
          eligibility: createEligibilityWithoutChallenge(),
        });
        challengeHandler = result.challengeHandler;
      });

      const result = await challengeHandler.current?.submitChallenge();
      expect(result).toBe('success');
      expect(mockMutate).not.toHaveBeenCalled();
    });

    it('should return retry when payment method is missing during submission', async () => {
      const { challengeHandler } = renderPaymentMethodChallenge({
        paymentMethod: undefined,
      });

      await act(async () => {
        const result = await challengeHandler.current?.submitChallenge();
        expect(result).toBe('retry');
      });
    });
  });

  describe('Validity Change Handling', () => {
    it('should call handleValidityChange when value changes', async () => {
      const user = userEvent.setup();
      const { handleValidityChange } = renderPaymentMethodChallenge({
        paymentMethod: createMockUserPaymentMethod(
          TPaymentMethodType.CREDIT_CARD,
        ),
      });

      const input = screen.getByRole('textbox');

      // Clear previous calls
      handleValidityChange.mockClear();

      await act(async () => {
        await user.type(input, '1');
      });
      await waitFor(() => {
        expect(handleValidityChange).toHaveBeenCalledWith(false);
      });

      await act(async () => {
        await user.type(input, '23456');
      });
      await waitFor(() => {
        expect(handleValidityChange).toHaveBeenCalledWith(true);
      });
    });

    it('should call handleValidityChange when payment method changes', async () => {
      const { handleValidityChange, rerender } = renderPaymentMethodChallenge({
        paymentMethod: createMockUserPaymentMethod(
          TPaymentMethodType.CREDIT_CARD,
        ),
      });

      // Clear previous calls
      handleValidityChange.mockClear();

      // Change payment method
      const Wrapper = createOptimalWrapper({ queries: true, shell: true });
      await act(async () => {
        rerender(
          <Wrapper>
            <PaymentMethodChallenge
              challengeHandler={createRef<TPaymentMethodChallengeRef>()}
              eligibility={createEligibilityWithChallenge()}
              paymentMethod={createMockUserPaymentMethod(
                TPaymentMethodType.PAYPAL,
              )}
              handleValidityChange={handleValidityChange}
            />
          </Wrapper>,
        );
      });

      expect(handleValidityChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Translation Keys', () => {
    it('should use correct translation keys for different payment types', async () => {
      // Credit card
      await act(async () => {
        renderPaymentMethodChallenge({
          paymentMethod: createMockUserPaymentMethod(
            TPaymentMethodType.CREDIT_CARD,
          ),
        });
      });
      expect(
        screen.getByText('pci_project_new_payment_challenge_credit_card'),
      ).toBeInTheDocument();

      // PayPal
      const { rerender } = renderPaymentMethodChallenge({
        paymentMethod: createMockUserPaymentMethod(TPaymentMethodType.PAYPAL),
      });
      expect(
        screen.getByText('pci_project_new_payment_challenge_paypal'),
      ).toBeInTheDocument();

      // Bank account
      const Wrapper = createOptimalWrapper({ queries: true, shell: true });
      await act(async () => {
        rerender(
          <Wrapper>
            <PaymentMethodChallenge
              challengeHandler={createRef<TPaymentMethodChallengeRef>()}
              eligibility={createEligibilityWithChallenge()}
              paymentMethod={createMockUserPaymentMethod(
                TPaymentMethodType.BANK_ACCOUNT,
              )}
              handleValidityChange={vi.fn()}
            />
          </Wrapper>,
        );
      });
      expect(
        screen.getByText('pci_project_new_payment_challenge_bank_account'),
      ).toBeInTheDocument();
    });

    it('should use correct translation key for retry error message', async () => {
      const user = userEvent.setup();
      const { challengeHandler } = renderPaymentMethodChallenge({
        paymentMethod: createMockUserPaymentMethod(
          TPaymentMethodType.CREDIT_CARD,
        ),
      });

      const input = screen.getByRole('textbox');
      await act(async () => {
        await user.type(input, '123456');
      });

      mockMutate.mockImplementation((_params, options) => {
        options.onError(new Error('Test error'));
      });

      await act(async () => {
        await challengeHandler.current?.submitChallenge();
      });

      await waitFor(() => {
        expect(
          screen.getByText(
            'pci_project_new_payment_challenge_error_retry_challenge',
          ),
        ).toBeInTheDocument();
      });
    });
  });
});
