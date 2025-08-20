import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PaymentMethodIntegration from './PaymentMethodIntegration';
import {
  TPaymentMethod,
  TPaymentMethodType,
  TPaymentMethodIntegrationRef,
} from '@/data/types/payment/payment-method.type';
import { TEligibility } from '@/data/types/payment/eligibility.type';

// Mock the CreditPaymentMethodIntegration component
vi.mock('./CreditPaymentMethodIntegration', () => ({
  default: vi.fn(() => (
    <div data-testid="credit-payment-integration">
      Credit Payment Integration
    </div>
  )),
}));

describe('PaymentMethodIntegration', () => {
  const mockHandleValidityChange = vi.fn();
  const mockHandleCustomSubmitButton = vi.fn();
  const mockPaymentHandler = React.createRef<TPaymentMethodIntegrationRef>();

  const mockEligibility: TEligibility = {
    actionsRequired: [],
    paymentMethodsAuthorized: [],
    minimumCredit: {
      value: 10,
      currencyCode: 'EUR' as never,
      text: '10.00 €',
    },
    voucher: null,
  };

  const mockCreditPaymentMethod: TPaymentMethod = {
    paymentType: TPaymentMethodType.CREDIT,
    integration: 'NONE' as never,
    icon: {
      name: 'credit',
      data: undefined,
      url: undefined,
      componentIcon: undefined,
    },
  };

  const mockCardPaymentMethod: TPaymentMethod = {
    paymentType: TPaymentMethodType.CREDIT_CARD,
    integration: 'COMPONENT' as never,
    icon: {
      name: 'visa',
      data: undefined,
      url: undefined,
      componentIcon: undefined,
    },
  };

  const defaultProps = {
    handleValidityChange: mockHandleValidityChange,
    eligibility: mockEligibility,
    paymentHandler: mockPaymentHandler,
    cartId: 'cart-123',
    itemId: 456,
    handleCustomSubmitButton: mockHandleCustomSubmitButton,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render CreditPaymentMethodIntegration for CREDIT payment type', () => {
    render(
      <PaymentMethodIntegration
        {...defaultProps}
        paymentMethod={mockCreditPaymentMethod}
      />,
    );

    expect(
      screen.getByTestId('credit-payment-integration'),
    ).toBeInTheDocument();
    expect(screen.getByText('Credit Payment Integration')).toBeInTheDocument();
  });

  it('should render nothing for non-CREDIT payment types', () => {
    const { container } = render(
      <PaymentMethodIntegration
        {...defaultProps}
        paymentMethod={mockCardPaymentMethod}
      />,
    );

    expect(container.firstChild).toBeNull();
    expect(
      screen.queryByTestId('credit-payment-integration'),
    ).not.toBeInTheDocument();
  });

  it('should render nothing when paymentMethod is null', () => {
    const { container } = render(
      <PaymentMethodIntegration {...defaultProps} paymentMethod={null} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render nothing when paymentMethod is undefined', () => {
    const { container } = render(
      <PaymentMethodIntegration {...defaultProps} paymentMethod={undefined} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should handle SEPA payment type (should render nothing)', () => {
    const sepaPaymentMethod: TPaymentMethod = {
      paymentType: TPaymentMethodType.SEPA_DIRECT_DEBIT,
      integration: 'NONE' as never,
      icon: {
        name: 'sepa',
        data: undefined,
        url: undefined,
        componentIcon: undefined,
      },
    };

    const { container } = render(
      <PaymentMethodIntegration
        {...defaultProps}
        paymentMethod={sepaPaymentMethod}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should handle PayPal payment type (should render nothing)', () => {
    const paypalPaymentMethod: TPaymentMethod = {
      paymentType: TPaymentMethodType.PAYPAL,
      integration: 'IN_CONTEXT' as never,
      icon: {
        name: 'paypal',
        data: undefined,
        url: undefined,
        componentIcon: undefined,
      },
    };

    const { container } = render(
      <PaymentMethodIntegration
        {...defaultProps}
        paymentMethod={paypalPaymentMethod}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should handle bank account payment type (should render nothing)', () => {
    const bankPaymentMethod: TPaymentMethod = {
      paymentType: TPaymentMethodType.BANK_ACCOUNT,
      integration: 'BANK_TRANSFER' as never,
      icon: {
        name: 'bank',
        data: undefined,
        url: undefined,
        componentIcon: undefined,
      },
    };

    const { container } = render(
      <PaymentMethodIntegration
        {...defaultProps}
        paymentMethod={bankPaymentMethod}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should handle deferred payment account type (should render nothing)', () => {
    const deferredPaymentMethod: TPaymentMethod = {
      paymentType: TPaymentMethodType.DEFERRED_PAYMENT_ACCOUNT,
      integration: 'NONE' as never,
      icon: {
        name: 'deferred',
        data: undefined,
        url: undefined,
        componentIcon: undefined,
      },
    };

    const { container } = render(
      <PaymentMethodIntegration
        {...defaultProps}
        paymentMethod={deferredPaymentMethod}
      />,
    );

    expect(container.firstChild).toBeNull();
  });
});
