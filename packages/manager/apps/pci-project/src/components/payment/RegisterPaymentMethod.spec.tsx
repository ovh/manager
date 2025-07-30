/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ShellContextType } from '@ovh-ux/manager-react-shell-client';
import usePaymentFeatureAvailabilities, {
  TPaymentFeaturesState,
} from '@/data/hooks/payment/usePaymentFeatureAvailabilities';
import { useFilteredAvailablePaymentMethods } from '@/data/hooks/payment/useFilteredAvailablePaymentMethods';
import { createOptimalWrapper } from '@/test-utils/lightweight-wrappers';
import RegisterPaymentMethod, {
  RegisterPaymentMethodProps,
} from './RegisterPaymentMethod';
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

// Mock the hooks
vi.mock('@/data/hooks/payment/usePaymentFeatureAvailabilities');
vi.mock('@/data/hooks/payment/useFilteredAvailablePaymentMethods');

// Mock the child components
vi.mock('./PaymentIcon', () => ({
  default: ({ icon }: { icon: { name: string } }) => (
    <div data-testid="payment-icon" data-icon={icon.name} />
  ),
}));

vi.mock('./SetAsDefaultPaymentMethod', () => ({
  default: ({
    isSetAsDefault,
    handleSetAsDefaultChange,
  }: {
    isSetAsDefault: boolean;
    handleSetAsDefaultChange?: (value: boolean) => void;
  }) => (
    <div data-testid="set-as-default-payment-method">
      <button
        onClick={() =>
          handleSetAsDefaultChange && handleSetAsDefaultChange(!isSetAsDefault)
        }
        data-testid="set-as-default-button"
      >
        Set as default: {isSetAsDefault ? 'true' : 'false'}
      </button>
    </div>
  ),
}));

vi.mock('./ExplanationTexts', () => ({
  default: ({
    selectedPaymentMethod,
  }: {
    selectedPaymentMethod: TAvailablePaymentMethod | null;
  }) => (
    <div data-testid="explanation-texts">
      {selectedPaymentMethod?.paymentType || 'no-selection'}
    </div>
  ),
}));

vi.mock('./SepaInformationModal', () => ({
  default: ({
    isAlreadyShown,
    handleSepaModalShown,
  }: {
    isAlreadyShown: boolean;
    handleSepaModalShown: () => void;
  }) => (
    <div data-testid="sepa-information-modal">
      <button onClick={handleSepaModalShown} data-testid="sepa-modal-trigger">
        SEPA Modal {isAlreadyShown ? 'shown' : 'not shown'}
      </button>
    </div>
  ),
}));

describe('RegisterPaymentMethod', () => {
  const mockEligibility: TEligibility = {
    actionsRequired: [TEligibilityRequiredAction.ADD_PAYMENT_METHOD],
    minimumCredit: null,
    paymentMethodsAuthorized: [
      TEligibilityPaymentMethod.CREDIT_CARD,
      TEligibilityPaymentMethod.PAYPAL,
      TEligibilityPaymentMethod.SEPA_DIRECT_DEBIT,
    ],
    voucher: null,
  };

  const mockFeatures: TPaymentFeaturesState = {
    PAYPAL_CHARGE: true,
    SEPA_DIRECT_DEBIT: true,
    CREDIT_CARD_CROSS_BORDER: true,
    RUPAY_CHARGE: true,
    SEPA_INFO_MSG: true,
    ADYEN_LIVE_IN: true,
  };

  const mockAvailablePaymentMethods: TAvailablePaymentMethod[] = [
    {
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
        key: 'payment_method_paypal',
        ns: 'payment/register/payment-types',
      },
      integration: TPaymentMethodIntegration.NONE,
      oneshot: false,
      registerable: true,
      registerableWithTransaction: false,
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
        key: 'payment_method_sepa',
        ns: 'payment/register/payment-types',
      },
      integration: TPaymentMethodIntegration.NONE,
      oneshot: false,
      registerable: true,
      registerableWithTransaction: false,
    },
  ];

  const mockShellContext: ShellContextType = ({
    environment: {
      getUser: () => ({
        ovhSubsidiary: 'FR',
      }),
    },
  } as unknown) as ShellContextType;

  const defaultProps: RegisterPaymentMethodProps = {
    eligibility: mockEligibility,
    handlePaymentMethodChange: vi.fn(),
    handleSetAsDefaultChange: vi.fn(),
  };

  beforeEach(() => {
    vi.mocked(usePaymentFeatureAvailabilities).mockReturnValue({
      features: mockFeatures,
      isLoading: false,
    });

    vi.mocked(useFilteredAvailablePaymentMethods).mockReturnValue({
      data: { data: mockAvailablePaymentMethods },
      error: null,
      isError: false,
      isPending: false,
      isLoading: false,
      isLoadingError: false,
      isRefetchError: false,
      isSuccess: true,
      status: 'success',
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      errorUpdateCount: 0,
      failureCount: 0,
      failureReason: null,
      fetchStatus: 'idle',
      isFetched: true,
      isFetchedAfterMount: true,
      isFetching: false,
      isInitialLoading: false,
      isPaused: false,
      isPlaceholderData: false,
      isRefetching: false,
      isStale: false,
      refetch: vi.fn(),
    });
  });

  describe('Loading states', () => {
    it('should render spinner when features are loading', () => {
      vi.mocked(usePaymentFeatureAvailabilities).mockReturnValue({
        features: mockFeatures,
        isLoading: true,
      });

      const Wrapper = createOptimalWrapper({ shell: true }, mockShellContext);
      render(<RegisterPaymentMethod {...defaultProps} />, { wrapper: Wrapper });

      expect(screen.getByTestId('ods-spinner')).toBeInTheDocument();
    });

    it('should render spinner when payment methods are loading', () => {
      vi.mocked(useFilteredAvailablePaymentMethods).mockReturnValue({
        data: undefined,
        error: null,
        isError: false,
        isPending: true,
        isLoading: true,
        isLoadingError: false,
        isRefetchError: false,
        isSuccess: false,
        status: 'pending',
        dataUpdatedAt: 0,
        errorUpdatedAt: 0,
        errorUpdateCount: 0,
        failureCount: 0,
        failureReason: null,
        fetchStatus: 'fetching',
        isFetched: false,
        isFetchedAfterMount: false,
        isFetching: true,
        isInitialLoading: true,
        isPaused: false,
        isPlaceholderData: false,
        isRefetching: false,
        isStale: false,
        refetch: vi.fn(),
      });

      const Wrapper = createOptimalWrapper({ shell: true }, mockShellContext);
      render(<RegisterPaymentMethod {...defaultProps} />, { wrapper: Wrapper });

      expect(screen.getByTestId('ods-spinner')).toBeInTheDocument();
    });

    it('should render spinner when no available payment methods', () => {
      vi.mocked(useFilteredAvailablePaymentMethods).mockReturnValue(({
        data: undefined,
        isLoading: false,
      } as unknown) as ReturnType<typeof useFilteredAvailablePaymentMethods>);

      const Wrapper = createOptimalWrapper({ shell: true }, mockShellContext);
      render(<RegisterPaymentMethod {...defaultProps} />, { wrapper: Wrapper });

      expect(screen.getByTestId('ods-spinner')).toBeInTheDocument();
    });
  });

  describe('Content rendering', () => {
    it('should render the main title', () => {
      const Wrapper = createOptimalWrapper({ shell: true }, mockShellContext);

      render(<RegisterPaymentMethod {...defaultProps} />, {
        wrapper: Wrapper,
      });

      expect(
        screen.getByText('pci_project_new_payment_register_title'),
      ).toBeInTheDocument();
    });

    it('should render explanation text parts', () => {
      const Wrapper = createOptimalWrapper({ shell: true }, mockShellContext);

      render(<RegisterPaymentMethod {...defaultProps} />, {
        wrapper: Wrapper,
      });

      expect(
        screen.getByText('pci_project_new_payment_method_save_explain_part_1'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('pci_project_new_payment_method_save_explain_part_2'),
      ).toBeInTheDocument();
    });

    it('should render available payment methods', () => {
      const Wrapper = createOptimalWrapper({ shell: true }, mockShellContext);

      render(<RegisterPaymentMethod {...defaultProps} />, {
        wrapper: Wrapper,
      });

      expect(
        screen.getByText('payment_method_credit_card'),
      ).toBeInTheDocument();
      expect(screen.getByText('payment_method_paypal')).toBeInTheDocument();
      expect(screen.getByText('payment_method_sepa')).toBeInTheDocument();

      expect(screen.getAllByTestId('payment-icon')).toHaveLength(3);
      expect(screen.getAllByTestId('payment-icon')[0]).toHaveAttribute(
        'data-icon',
        'credit-card',
      );

      expect(screen.getAllByTestId('ods-radio')).toHaveLength(3);
    });

    it('should render error message when no payment methods available', () => {
      vi.mocked(useFilteredAvailablePaymentMethods).mockReturnValue(({
        data: { data: [] },
        isLoading: false,
      } as unknown) as ReturnType<typeof useFilteredAvailablePaymentMethods>);

      const Wrapper = createOptimalWrapper({ shell: true }, mockShellContext);

      render(<RegisterPaymentMethod {...defaultProps} />, {
        wrapper: Wrapper,
      });

      expect(
        screen.getByText('ovh_payment_method_register_antifraud_error_message'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('ods-message')).toHaveAttribute(
        'data-color',
        'critical',
      );
    });
  });

  describe('Payment method selection', () => {
    it('should handle payment method selection', async () => {
      const handlePaymentMethodChange = vi.fn();
      const Wrapper = createOptimalWrapper({ shell: true }, mockShellContext);

      await act(async () => {
        render(
          <RegisterPaymentMethod
            {...defaultProps}
            handlePaymentMethodChange={handlePaymentMethodChange}
          />,
          { wrapper: Wrapper },
        );
      });

      const creditCardRadio = screen.getAllByTestId('ods-radio')[0];

      await act(async () => {
        fireEvent.click(creditCardRadio);
      });

      expect(handlePaymentMethodChange).toHaveBeenCalledWith(
        mockAvailablePaymentMethods[0],
      );
    });

    it('should update selected payment method styling', async () => {
      const Wrapper = createOptimalWrapper({ shell: true }, mockShellContext);

      render(<RegisterPaymentMethod {...defaultProps} />, {
        wrapper: Wrapper,
      });

      const creditCardRadio = screen.getAllByTestId('ods-radio')[0];

      await act(async () => {
        fireEvent.click(creditCardRadio);
      });

      const cards = screen.getAllByTestId('ods-card');
      expect(cards[0]).toHaveClass(
        'bg-[var(--ods-color-primary-050)]',
        'border-[var(--ods-color-primary-700)]',
      );
    });

    it('should pass selected payment method to child components', async () => {
      const Wrapper = createOptimalWrapper({ shell: true }, mockShellContext);

      await act(async () => {
        render(<RegisterPaymentMethod {...defaultProps} />, {
          wrapper: Wrapper,
        });
      });

      expect(screen.getByTestId('explanation-texts')).toHaveTextContent(
        'no-selection',
      );

      const paypalRadio = screen.getAllByTestId('ods-radio')[1];

      await act(async () => {
        fireEvent.click(paypalRadio);
      });

      expect(screen.getByTestId('explanation-texts')).toHaveTextContent(
        TPaymentMethodType.PAYPAL,
      );
    });
  });

  describe('Set as default functionality', () => {
    it('should handle set as default change', async () => {
      const handleSetAsDefaultChange = vi.fn();
      const Wrapper = createOptimalWrapper({ shell: true }, mockShellContext);

      await act(async () => {
        render(
          <RegisterPaymentMethod
            {...defaultProps}
            handleSetAsDefaultChange={handleSetAsDefaultChange}
          />,
          { wrapper: Wrapper },
        );
      });

      const setAsDefaultButton = screen.getByTestId('set-as-default-button');

      await act(async () => {
        fireEvent.click(setAsDefaultButton);
      });

      expect(handleSetAsDefaultChange).toHaveBeenCalledWith(true);
    });

    it('should pass correct props to SetAsDefaultPaymentMethod', async () => {
      const Wrapper = createOptimalWrapper({ shell: true }, mockShellContext);

      render(<RegisterPaymentMethod {...defaultProps} />, {
        wrapper: Wrapper,
      });

      expect(
        screen.getByTestId('set-as-default-payment-method'),
      ).toBeInTheDocument();

      expect(screen.getByTestId('set-as-default-button')).toHaveTextContent(
        'Set as default: false',
      );

      await act(async () => {
        fireEvent.click(screen.getByTestId('set-as-default-button'));
      });

      expect(screen.getByTestId('set-as-default-button')).toHaveTextContent(
        'Set as default: true',
      );
    });
  });

  describe('SEPA information modal', () => {
    it('should render SEPA modal when SEPA payment method is selected', async () => {
      const Wrapper = createOptimalWrapper({ shell: true }, mockShellContext);

      await act(async () => {
        render(<RegisterPaymentMethod {...defaultProps} />, {
          wrapper: Wrapper,
        });
      });

      expect(
        screen.queryByTestId('sepa-information-modal'),
      ).not.toBeInTheDocument();

      const sepaRadio = screen.getAllByTestId('ods-radio')[2];

      await act(async () => {
        fireEvent.click(sepaRadio);
      });

      expect(screen.getByTestId('sepa-information-modal')).toBeInTheDocument();
      expect(screen.getByTestId('sepa-modal-trigger')).toHaveTextContent(
        'SEPA Modal not shown',
      );
    });

    it('should not render SEPA modal for non-SEPA payment methods', async () => {
      const Wrapper = createOptimalWrapper({ shell: true }, mockShellContext);

      await act(async () => {
        render(<RegisterPaymentMethod {...defaultProps} />, {
          wrapper: Wrapper,
        });
      });

      const creditCardRadio = screen.getAllByTestId('ods-radio')[0];

      await act(async () => {
        fireEvent.click(creditCardRadio);
      });

      expect(
        screen.queryByTestId('sepa-information-modal'),
      ).not.toBeInTheDocument();

      const paypalRadio = screen.getAllByTestId('ods-radio')[1];

      await act(async () => {
        fireEvent.click(paypalRadio);
      });

      expect(
        screen.queryByTestId('sepa-information-modal'),
      ).not.toBeInTheDocument();
    });

    it('should handle SEPA modal shown state', async () => {
      const Wrapper = createOptimalWrapper({ shell: true }, mockShellContext);

      await act(async () => {
        render(<RegisterPaymentMethod {...defaultProps} />, {
          wrapper: Wrapper,
        });
      });

      const sepaRadio = screen.getAllByTestId('ods-radio')[2];

      await act(async () => {
        fireEvent.click(sepaRadio);
      });

      const sepaModalTrigger = screen.getByTestId('sepa-modal-trigger');
      expect(sepaModalTrigger).toHaveTextContent('SEPA Modal not shown');

      await act(async () => {
        fireEvent.click(sepaModalTrigger);
      });

      expect(sepaModalTrigger).toHaveTextContent('SEPA Modal shown');
    });
  });

  describe('Child components integration', () => {
    it('should pass features to child components', async () => {
      const Wrapper = createOptimalWrapper({ shell: true }, mockShellContext);

      await act(async () => {
        render(<RegisterPaymentMethod {...defaultProps} />, {
          wrapper: Wrapper,
        });
      });

      expect(screen.getByTestId('explanation-texts')).toBeInTheDocument();

      const sepaRadio = screen.getAllByTestId('ods-radio')[2];

      await act(async () => {
        fireEvent.click(sepaRadio);
      });

      expect(screen.getByTestId('sepa-information-modal')).toBeInTheDocument();
    });

    it('should pass eligibility and available payment methods to SetAsDefaultPaymentMethod', async () => {
      const Wrapper = createOptimalWrapper({ shell: true }, mockShellContext);

      await act(async () => {
        render(<RegisterPaymentMethod {...defaultProps} />, {
          wrapper: Wrapper,
        });
      });

      expect(
        screen.getByTestId('set-as-default-payment-method'),
      ).toBeInTheDocument();
    });
  });

  describe('Default callback functions', () => {
    it('should work with default callback functions', async () => {
      const Wrapper = createOptimalWrapper({ shell: true }, mockShellContext);

      await act(async () => {
        render(<RegisterPaymentMethod eligibility={mockEligibility} />, {
          wrapper: Wrapper,
        });
      });

      const creditCardRadio = screen.getAllByTestId('ods-radio')[0];

      await act(async () => {
        expect(() => fireEvent.click(creditCardRadio)).not.toThrow();
      });

      const setAsDefaultButton = screen.getByTestId('set-as-default-button');

      await act(async () => {
        expect(() => fireEvent.click(setAsDefaultButton)).not.toThrow();
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty payment method names gracefully', async () => {
      const methodsWithoutNames: TAvailablePaymentMethod[] = [
        {
          paymentType: TPaymentMethodType.CREDIT_CARD,
          icon: {
            data: undefined,
            name: 'credit-card',
            url: undefined,
            componentIcon: undefined,
          },
          readableName: undefined,
          integration: TPaymentMethodIntegration.NONE,
          oneshot: false,
          registerable: true,
          registerableWithTransaction: false,
        },
      ];

      vi.mocked(useFilteredAvailablePaymentMethods).mockReturnValue(({
        data: { data: methodsWithoutNames },
        isLoading: false,
      } as unknown) as ReturnType<typeof useFilteredAvailablePaymentMethods>);

      const Wrapper = createOptimalWrapper({ shell: true }, mockShellContext);

      await act(async () => {
        render(<RegisterPaymentMethod {...defaultProps} />, {
          wrapper: Wrapper,
        });
      });

      expect(screen.getByTestId('ods-card')).toBeInTheDocument();
      expect(screen.getByTestId('payment-icon')).toBeInTheDocument();
    });

    it('should handle selection of payment methods with different properties', async () => {
      const methodWithLimitedProps: TAvailablePaymentMethod[] = [
        {
          paymentType: TPaymentMethodType.CREDIT_CARD,
          icon: {
            data: undefined,
            name: '',
            url: undefined,
            componentIcon: undefined,
          },
          readableName: {
            key: 'minimal_method',
            ns: 'test',
          },
          integration: TPaymentMethodIntegration.NONE,
          oneshot: false,
          registerable: false,
          registerableWithTransaction: false,
        },
      ];

      vi.mocked(useFilteredAvailablePaymentMethods).mockReturnValue(({
        data: { data: methodWithLimitedProps },
        isLoading: false,
      } as unknown) as ReturnType<typeof useFilteredAvailablePaymentMethods>);

      const handlePaymentMethodChange = vi.fn();
      const Wrapper = createOptimalWrapper({ shell: true }, mockShellContext);

      await act(async () => {
        render(
          <RegisterPaymentMethod
            {...defaultProps}
            handlePaymentMethodChange={handlePaymentMethodChange}
          />,
          { wrapper: Wrapper },
        );
      });

      const radio = screen.getByTestId('ods-radio');

      await act(async () => {
        fireEvent.click(radio);
      });

      expect(handlePaymentMethodChange).toHaveBeenCalledWith(
        methodWithLimitedProps[0],
      );
    });
  });
});
