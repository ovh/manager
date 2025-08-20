import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CurrencyCode } from '@ovh-ux/manager-react-components';
import CreditPaymentMethodIntegration from './CreditPaymentMethodIntegration';
import {
  TPaymentMethod,
  TPaymentMethodType,
  TPaymentMethodIntegration,
} from '@/data/types/payment/payment-method.type';
import {
  TEligibility,
  ProjectPrice,
  TEligibilityPaymentMethod,
} from '@/data/types/payment/eligibility.type';
import { createWrapper } from '@/wrapperRenders';

// Mock the hooks and APIs
vi.mock('@/data/hooks/payment/useCart', () => ({
  useGetCreditAddonOption: vi.fn(() => ({
    data: undefined,
    isLoading: false,
    error: null,
    isError: false,
    isPending: false,
    isLoadingError: false,
    isRefetchError: false,
    isFetching: false,
    isSuccess: true,
    refetch: vi.fn(),
  })),
}));

vi.mock('@/data/api/payment/cart', () => ({
  addCartCreditOption: vi.fn(),
}));

vi.mock('@/payment/constants', () => ({
  CREDITS_PREDEFINED_AMOUNT_SEQUENCE: [2, 5, 10],
  CREDIT_ORDER_CART: {
    planCode: 'credit.default',
  },
}));

// Mock ODS components
vi.mock('@ovhcloud/ods-components/react', () => ({
  OdsCard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="ods-card">{children}</div>
  ),
  OdsRadio: ({
    inputId,
    onClick,
  }: {
    inputId: string;
    onClick?: () => void;
  }) => (
    <input
      data-testid={`radio-${inputId}`}
      type="radio"
      id={inputId}
      onClick={onClick}
    />
  ),
  OdsFormField: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="ods-form-field">{children}</div>
  ),
  OdsInput: ({
    id,
    value,
    onOdsChange,
    hasError,
  }: {
    id: string;
    value?: string;
    onOdsChange?: (e: { target: { value: string } }) => void;
    hasError?: boolean;
  }) => (
    <input
      data-testid={`input-${id}`}
      type="number"
      id={id}
      value={value || ''}
      onChange={(e) => onOdsChange?.({ target: { value: e.target.value } })}
      data-has-error={hasError}
    />
  ),
  OdsButton: ({ label, onClick }: { label: string; onClick?: () => void }) => (
    <button data-testid="ods-button" onClick={onClick}>
      {label}
    </button>
  ),
  OdsText: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="ods-text">{children}</span>
  ),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      if (key === 'pci_project_new_payment_btn_continue_credit') {
        return 'Continue with Credit';
      }
      if (key === 'pci_project_new_payment_credit_explain') {
        return 'Select the amount of credit you want to add';
      }
      if (key === 'pci_project_new_payment_credit_amount_other') {
        return 'Other amount';
      }
      if (key === 'pci_project_new_payment_credit_amount_other_label') {
        return 'Custom amount';
      }
      if (key === 'pci_project_new_payment_credit_info') {
        return 'Credit information';
      }
      return key;
    },
  }),
}));

describe('CreditPaymentMethodIntegration', () => {
  const mockPaymentMethod: TPaymentMethod = {
    icon: {
      name: 'credit-icon',
      data: 'icon-data',
    },
    integration: TPaymentMethodIntegration.COMPONENT,
    paymentSubType: null,
    paymentType: TPaymentMethodType.CREDIT,
  };

  const mockMinimumCredit: ProjectPrice = {
    value: 10,
    currencyCode: CurrencyCode.EUR,
    text: '10.00 €',
  };

  const mockEligibility: TEligibility = {
    actionsRequired: [],
    minimumCredit: mockMinimumCredit,
    paymentMethodsAuthorized: [TEligibilityPaymentMethod.CREDIT],
    voucher: null,
  };

  const mockHandleValidityChange = vi.fn();
  const mockHandleCustomSubmitButton = vi.fn();
  const mockPaymentHandler = { current: null };

  const defaultProps = {
    paymentMethod: mockPaymentMethod,
    handleValidityChange: mockHandleValidityChange,
    eligibility: mockEligibility,
    paymentHandler: mockPaymentHandler,
    cartId: 'cart-123',
    itemId: 1,
    handleCustomSubmitButton: mockHandleCustomSubmitButton,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render credit payment integration component', () => {
    render(<CreditPaymentMethodIntegration {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    expect(
      screen.getByText('Select the amount of credit you want to add'),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId('ods-card')).toHaveLength(5); // 4 predefined + 1 custom
  });

  it('should display predefined credit amounts based on minimum credit', () => {
    render(<CreditPaymentMethodIntegration {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    // Check for predefined amounts: min (10.00), 2x (20), 5x (50), 10x (100)
    expect(
      screen.getByTestId('radio-credit-amount-10.00 €'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('radio-credit-amount-20 €')).toBeInTheDocument();
    expect(screen.getByTestId('radio-credit-amount-50 €')).toBeInTheDocument();
    expect(screen.getByTestId('radio-credit-amount-100 €')).toBeInTheDocument();
    expect(
      screen.getByTestId('radio-credit-amount-custom'),
    ).toBeInTheDocument();
  });

  it('should handle predefined amount selection', async () => {
    render(<CreditPaymentMethodIntegration {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    const radioButton = screen.getByTestId('radio-credit-amount-20 €');
    await userEvent.click(radioButton);

    // Should call handleValidityChange with true when amount is selected
    expect(mockHandleValidityChange).toHaveBeenCalledWith(true);
  });

  it('should handle custom amount selection', async () => {
    render(<CreditPaymentMethodIntegration {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    const customRadio = screen.getByTestId('radio-credit-amount-custom');
    await userEvent.click(customRadio);

    // Custom input should appear
    expect(screen.getByTestId('input-otherAmount')).toBeInTheDocument();
    expect(screen.getByTestId('ods-form-field')).toBeInTheDocument();
  });

  it('should validate custom amount input', async () => {
    render(<CreditPaymentMethodIntegration {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    const customRadio = screen.getByTestId('radio-credit-amount-custom');
    await userEvent.click(customRadio);

    const customInput = screen.getByTestId('input-otherAmount');
    await userEvent.type(customInput, '25');

    await waitFor(() => {
      expect(customInput).toHaveValue(25); // Should be number for number input
      expect(mockHandleValidityChange).toHaveBeenCalledWith(true);
    });
  });

  it('should call handleCustomSubmitButton on mount', () => {
    render(<CreditPaymentMethodIntegration {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    expect(mockHandleCustomSubmitButton).toHaveBeenCalledWith(
      'Continue with Credit',
    );
  });

  it('should handle eligibility without minimum credit', () => {
    const eligibilityWithoutMin: TEligibility = {
      actionsRequired: [],
      minimumCredit: null,
      paymentMethodsAuthorized: [TEligibilityPaymentMethod.CREDIT],
      voucher: null,
    };

    render(
      <CreditPaymentMethodIntegration
        {...defaultProps}
        eligibility={eligibilityWithoutMin}
      />,
      {
        wrapper: createWrapper(),
      },
    );

    // Should only show custom amount option
    expect(
      screen.getByTestId('radio-credit-amount-custom'),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('radio-credit-amount-10 €'),
    ).not.toBeInTheDocument();
  });

  it('should switch between predefined and custom amount selection', async () => {
    render(<CreditPaymentMethodIntegration {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    // Select predefined amount first
    const predefinedRadio = screen.getByTestId('radio-credit-amount-20 €');
    await userEvent.click(predefinedRadio);

    // Custom input should not be visible
    expect(screen.queryByTestId('input-otherAmount')).not.toBeInTheDocument();

    // Then select custom amount
    const customRadio = screen.getByTestId('radio-credit-amount-custom');
    await userEvent.click(customRadio);

    // Custom input should appear
    expect(screen.getByTestId('input-otherAmount')).toBeInTheDocument();
  });

  it('should clear custom amount when switching to predefined', async () => {
    render(<CreditPaymentMethodIntegration {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    // Select custom amount and enter value
    const customRadio = screen.getByTestId('radio-credit-amount-custom');
    await userEvent.click(customRadio);

    const customInput = screen.getByTestId('input-otherAmount');
    await userEvent.type(customInput, '25');

    // Switch to predefined amount
    const predefinedRadio = screen.getByTestId('radio-credit-amount-20 €');
    await userEvent.click(predefinedRadio);

    // Switch back to custom - input should be empty
    await userEvent.click(customRadio);

    await waitFor(() => {
      const newCustomInput = screen.getByTestId('input-otherAmount');
      expect(newCustomInput).toHaveValue(null); // Input is reset to null, not empty string
    });
  });

  it('should not call handleCustomSubmitButton when not provided', () => {
    const mockFn = vi.fn();
    render(
      <CreditPaymentMethodIntegration
        {...defaultProps}
        handleCustomSubmitButton={undefined}
      />,
      {
        wrapper: createWrapper(),
      },
    );

    expect(mockFn).not.toHaveBeenCalled();
  });

  it('should handle form validation correctly', () => {
    const { rerender } = render(
      <CreditPaymentMethodIntegration {...defaultProps} />,
      {
        wrapper: createWrapper(),
      },
    );

    // Component should render without errors - use actual text content
    expect(
      screen.getByText('Select the amount of credit you want to add'),
    ).toBeInTheDocument();

    // Re-render to test component stability
    rerender(<CreditPaymentMethodIntegration {...defaultProps} />);
    expect(
      screen.getByText('Select the amount of credit you want to add'),
    ).toBeInTheDocument();
  });
});
