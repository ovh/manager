import React from 'react';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ShellContextType } from '@ovh-ux/manager-react-shell-client';
import { Currency } from '@ovh-ux/manager-config';
import { createWrapper } from '@/wrapperRenders';
import SetAsDefaultPaymentMethod, {
  SetAsDefaultPaymentMethodProps,
} from './SetAsDefaultPaymentMethod';
import {
  TEligibility,
  TEligibilityPaymentMethod,
  TEligibilityRequiredAction,
} from '@/data/types/payment/eligibility.type';
import {
  TAvailablePaymentMethod,
  TPaymentMethodType,
  TPaymentMethodIntegration,
} from '@/data/types/payment/payment-method.type';

describe('SetAsDefaultPaymentMethod', () => {
  const createMockShellContext = (ovhSubsidiary = 'FR'): ShellContextType =>
    (({
      environment: {
        getUser: () => ({
          currency: { code: 'EUR' } as Currency,
          ovhSubsidiary,
        }),
        getRegion: () => 'EU',
      },
    } as unknown) as ShellContextType);

  const createMockEligibility = (
    overrides: Partial<TEligibility> = {},
  ): TEligibility => ({
    actionsRequired: [TEligibilityRequiredAction.ADD_PAYMENT_METHOD],
    minimumCredit: null,
    paymentMethodsAuthorized: [
      TEligibilityPaymentMethod.CREDIT_CARD,
      TEligibilityPaymentMethod.PAYPAL,
    ],
    voucher: null,
    ...overrides,
  });

  const createMockPaymentMethod = (
    overrides: Partial<TAvailablePaymentMethod> = {},
  ): TAvailablePaymentMethod => ({
    paymentType: TPaymentMethodType.CREDIT_CARD,
    icon: {
      data: undefined,
      name: 'credit-card',
      url: undefined,
      componentIcon: undefined,
    },
    readableName: {
      key: 'payment_method_credit_card',
      ns: 'payment/register/payment-types',
    },
    integration: TPaymentMethodIntegration.NONE,
    oneshot: false,
    registerable: true,
    registerableWithTransaction: false,
    ...overrides,
  });

  const defaultProps: SetAsDefaultPaymentMethodProps = {
    selectedPaymentMethod: createMockPaymentMethod(),
    eligibility: createMockEligibility(),
    availablePaymentMethods: [createMockPaymentMethod()],
    isSetAsDefault: false,
    handleSetAsDefaultChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Visibility conditions', () => {
    it('should not render when payment method is not registerable', () => {
      const mockShellContext = createMockShellContext();
      const Wrapper = createWrapper(mockShellContext);

      const { container } = render(
        <SetAsDefaultPaymentMethod
          {...defaultProps}
          selectedPaymentMethod={createMockPaymentMethod({
            registerable: false,
          })}
        />,
        { wrapper: Wrapper },
      );

      expect(container.firstChild).toBeNull();
    });

    it('should not render when actions required does not include addPaymentMethod', () => {
      const mockShellContext = createMockShellContext();
      const Wrapper = createWrapper(mockShellContext);

      const { container } = render(
        <SetAsDefaultPaymentMethod
          {...defaultProps}
          eligibility={createMockEligibility({
            actionsRequired: [
              TEligibilityRequiredAction.CHALLENGE_PAYMENT_METHOD,
            ],
          })}
        />,
        { wrapper: Wrapper },
      );

      expect(container.firstChild).toBeNull();
    });

    it('should not render when no payment methods available', () => {
      const mockShellContext = createMockShellContext();
      const Wrapper = createWrapper(mockShellContext);

      const { container } = render(
        <SetAsDefaultPaymentMethod
          {...defaultProps}
          availablePaymentMethods={[]}
        />,
        { wrapper: Wrapper },
      );

      expect(container.firstChild).toBeNull();
    });

    it('should not render when no payment method is selected', () => {
      const mockShellContext = createMockShellContext();
      const Wrapper = createWrapper(mockShellContext);

      const { container } = render(
        <SetAsDefaultPaymentMethod
          {...defaultProps}
          selectedPaymentMethod={null}
        />,
        { wrapper: Wrapper },
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render when all conditions are met', () => {
      const mockShellContext = createMockShellContext();
      const Wrapper = createWrapper(mockShellContext);

      render(<SetAsDefaultPaymentMethod {...defaultProps} />, {
        wrapper: Wrapper,
      });

      expect(
        screen.getByTestId('ods-checkbox-set-as-default'),
      ).toBeInTheDocument();
    });
  });

  describe('Checkbox functionality', () => {
    it('should render checkbox with correct initial state', () => {
      const mockShellContext = createMockShellContext();
      const Wrapper = createWrapper(mockShellContext);

      render(<SetAsDefaultPaymentMethod {...defaultProps} />, {
        wrapper: Wrapper,
      });

      const checkbox = screen.getByTestId('ods-checkbox-set-as-default');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toHaveAttribute('is-checked', 'true');
    });

    it('should render checkbox as checked when isSetAsDefault is true', () => {
      const mockShellContext = createMockShellContext();
      const Wrapper = createWrapper(mockShellContext);

      render(
        <SetAsDefaultPaymentMethod {...defaultProps} isSetAsDefault={true} />,
        { wrapper: Wrapper },
      );

      const checkbox = screen.getByTestId('ods-checkbox-set-as-default');
      expect(checkbox).toHaveAttribute('is-checked', 'true');
    });

    it('should call handleSetAsDefaultChange when checkbox is clicked', async () => {
      const handleSetAsDefaultChange = vi.fn();
      const mockShellContext = createMockShellContext();
      const Wrapper = createWrapper(mockShellContext);

      render(
        <SetAsDefaultPaymentMethod
          {...defaultProps}
          handleSetAsDefaultChange={handleSetAsDefaultChange}
        />,
        { wrapper: Wrapper },
      );

      const checkbox = screen.getByTestId('ods-checkbox-set-as-default');
      expect(checkbox).toBeInTheDocument();

      act(() => {
        fireEvent(
          checkbox,
          new CustomEvent('odsChange', { detail: { checked: true } }),
        );
      });

      await waitFor(() => {
        expect(handleSetAsDefaultChange).toHaveBeenCalledWith(true);
      });
    });

    it('should render checkbox label text', () => {
      const mockShellContext = createMockShellContext();
      const Wrapper = createWrapper(mockShellContext);

      render(<SetAsDefaultPaymentMethod {...defaultProps} />, {
        wrapper: Wrapper,
      });

      expect(
        screen.getByText('ovh_payment_method_register_set_as_default_choice'),
      ).toBeInTheDocument();
    });

    it('should render checkbox as required', () => {
      const mockShellContext = createMockShellContext();
      const Wrapper = createWrapper(mockShellContext);

      render(<SetAsDefaultPaymentMethod {...defaultProps} />, {
        wrapper: Wrapper,
      });

      const checkbox = screen.getByTestId('ods-checkbox-set-as-default');
      expect(checkbox).toHaveAttribute('is-required', 'true');
    });
  });

  describe('Regional message display', () => {
    it('should display non-US message for non-US regions', () => {
      const mockShellContext = createMockShellContext('FR');
      const Wrapper = createWrapper(mockShellContext);

      render(<SetAsDefaultPaymentMethod {...defaultProps} />, {
        wrapper: Wrapper,
      });

      expect(
        screen.getByText(
          'ovh_payment_method_register_set_as_default_choice_information_no_default_payment_method_ovh_sas',
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          'ovh_payment_method_register_set_as_default_choice_information',
        ),
      ).toBeInTheDocument();
    });

    it('should not display US message when not in US region and not checked', () => {
      const mockShellContext = createMockShellContext('FR');
      const Wrapper = createWrapper(mockShellContext);

      render(
        <SetAsDefaultPaymentMethod {...defaultProps} isSetAsDefault={false} />,
        { wrapper: Wrapper },
      );

      expect(
        screen.queryByText(
          'ovh_payment_method_register_set_as_default_choice_information_US',
        ),
      ).not.toBeInTheDocument();
    });

    it('should display US message when in US region and checkbox is checked', () => {
      const mockShellContext = createMockShellContext('US');
      const Wrapper = createWrapper(mockShellContext);

      render(
        <SetAsDefaultPaymentMethod {...defaultProps} isSetAsDefault={true} />,
        { wrapper: Wrapper },
      );

      expect(
        screen.getByText(
          'ovh_payment_method_register_set_as_default_choice_information_US',
        ),
      ).toBeInTheDocument();
    });

    it('should not display US message when in US region but checkbox is not checked', () => {
      const mockShellContext = createMockShellContext('US');
      const Wrapper = createWrapper(mockShellContext);

      render(
        <SetAsDefaultPaymentMethod {...defaultProps} isSetAsDefault={false} />,
        { wrapper: Wrapper },
      );

      expect(
        screen.queryByText(
          'ovh_payment_method_register_set_as_default_choice_information_US',
        ),
      ).not.toBeInTheDocument();
    });
  });

  describe('Message display states', () => {
    it('should display information message with correct color', () => {
      const mockShellContext = createMockShellContext();
      const Wrapper = createWrapper(mockShellContext);

      render(<SetAsDefaultPaymentMethod {...defaultProps} />, {
        wrapper: Wrapper,
      });

      const message = screen.getByTestId('ods-message');
      expect(message).toHaveAttribute('data-color', 'information');
    });

    it('should display message as non-dismissible', () => {
      const mockShellContext = createMockShellContext();
      const Wrapper = createWrapper(mockShellContext);

      render(<SetAsDefaultPaymentMethod {...defaultProps} />, {
        wrapper: Wrapper,
      });

      const message = screen.getByTestId('ods-message');
      expect(message).toHaveAttribute('data-is-dismissible', 'false');
    });
  });

  describe('Default callback functions', () => {
    it('should work with default callback function', () => {
      const mockShellContext = createMockShellContext();
      const Wrapper = createWrapper(mockShellContext);

      render(
        <SetAsDefaultPaymentMethod
          {...defaultProps}
          handleSetAsDefaultChange={undefined}
        />,
        { wrapper: Wrapper },
      );

      const checkbox = screen.getByTestId('ods-checkbox-set-as-default');
      expect(() =>
        fireEvent(
          checkbox,
          new CustomEvent('odsChange', { detail: { checked: true } }),
        ),
      ).not.toThrow();
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined selectedPaymentMethod gracefully', () => {
      const mockShellContext = createMockShellContext();
      const Wrapper = createWrapper(mockShellContext);

      const { container } = render(
        <SetAsDefaultPaymentMethod
          {...defaultProps}
          selectedPaymentMethod={undefined}
        />,
        { wrapper: Wrapper },
      );

      expect(container.firstChild).toBeNull();
    });

    it('should handle payment method with registerable false', () => {
      const mockShellContext = createMockShellContext();
      const Wrapper = createWrapper(mockShellContext);

      const { container } = render(
        <SetAsDefaultPaymentMethod
          {...defaultProps}
          selectedPaymentMethod={createMockPaymentMethod({
            registerable: false,
          })}
        />,
        { wrapper: Wrapper },
      );

      expect(container.firstChild).toBeNull();
    });

    it('should handle different eligibility action requirements', () => {
      const mockShellContext = createMockShellContext();
      const Wrapper = createWrapper(mockShellContext);

      const { container } = render(
        <SetAsDefaultPaymentMethod
          {...defaultProps}
          eligibility={createMockEligibility({
            actionsRequired: [
              TEligibilityRequiredAction.VERIFY_PAYPAL,
              TEligibilityRequiredAction.CHALLENGE_PAYMENT_METHOD,
            ],
          })}
        />,
        { wrapper: Wrapper },
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render when multiple actions are required including addPaymentMethod', () => {
      const mockShellContext = createMockShellContext();
      const Wrapper = createWrapper(mockShellContext);

      render(
        <SetAsDefaultPaymentMethod
          {...defaultProps}
          eligibility={createMockEligibility({
            actionsRequired: [
              TEligibilityRequiredAction.ADD_PAYMENT_METHOD,
              TEligibilityRequiredAction.VERIFY_PAYPAL,
            ],
          })}
        />,
        { wrapper: Wrapper },
      );

      expect(
        screen.getByTestId('ods-checkbox-set-as-default'),
      ).toBeInTheDocument();
    });

    it('should handle empty availablePaymentMethods array', () => {
      const mockShellContext = createMockShellContext();
      const Wrapper = createWrapper(mockShellContext);

      const { container } = render(
        <SetAsDefaultPaymentMethod
          {...defaultProps}
          availablePaymentMethods={[]}
        />,
        { wrapper: Wrapper },
      );

      expect(container.firstChild).toBeNull();
    });

    it('should handle multiple available payment methods', () => {
      const mockShellContext = createMockShellContext();
      const Wrapper = createWrapper(mockShellContext);

      render(
        <SetAsDefaultPaymentMethod
          {...defaultProps}
          availablePaymentMethods={[
            createMockPaymentMethod({
              paymentType: TPaymentMethodType.CREDIT_CARD,
            }),
            createMockPaymentMethod({ paymentType: TPaymentMethodType.PAYPAL }),
            createMockPaymentMethod({
              paymentType: TPaymentMethodType.SEPA_DIRECT_DEBIT,
            }),
          ]}
        />,
        { wrapper: Wrapper },
      );

      expect(
        screen.getByTestId('ods-checkbox-set-as-default'),
      ).toBeInTheDocument();
    });
  });

  describe('Component structure', () => {
    it('should render with correct CSS classes', () => {
      const mockShellContext = createMockShellContext();
      const Wrapper = createWrapper(mockShellContext);

      render(<SetAsDefaultPaymentMethod {...defaultProps} />, {
        wrapper: Wrapper,
      });

      const container = screen
        .getByTestId('ods-checkbox-set-as-default')
        .closest('div');
      expect(container).toHaveClass('my-6');

      const label = screen
        .getByTestId('ods-checkbox-set-as-default')
        .closest('label');
      expect(label).toHaveClass('mb-6', 'flex', 'items-center');

      const checkbox = screen.getByTestId('ods-checkbox-set-as-default');
      expect(checkbox).toHaveClass('mr-3');
    });

    it('should have correct input attributes', () => {
      const mockShellContext = createMockShellContext();
      const Wrapper = createWrapper(mockShellContext);

      render(<SetAsDefaultPaymentMethod {...defaultProps} />, {
        wrapper: Wrapper,
      });

      const checkbox = screen.getByTestId('ods-checkbox-set-as-default');
      expect(checkbox).toHaveAttribute('name', 'setAsDefault');
    });

    it('should render OdsText components within message', () => {
      const mockShellContext = createMockShellContext();
      const Wrapper = createWrapper(mockShellContext);

      render(<SetAsDefaultPaymentMethod {...defaultProps} />, {
        wrapper: Wrapper,
      });

      const textElements = screen.getAllByTestId('ods-text');
      expect(textElements.length).toBeGreaterThanOrEqual(2);
    });
  });
});
