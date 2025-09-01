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
import { createWrapper } from '@/wrapperRenders';

// Mock the useAddPaymentMethod hook
vi.mock('@/data/hooks/payment/usePaymentMethods', () => ({
  useAddPaymentMethod: vi.fn(() => ({
    mutateAsync: vi.fn(),
  })),
  useFinalizePaymentMethod: vi.fn(() => ({
    mutateAsync: vi.fn(),
  })),
}));

// Mock the payment method API
vi.mock('@/data/api/payment/payment-method', () => ({
  getPaymentMethod: vi.fn(),
}));

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
    paymentMethodId: 1,
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
    paymentMethodId: 2,
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

  const Wrapper = createWrapper();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render CreditPaymentMethodIntegration for CREDIT payment type', () => {
    render(
      <Wrapper>
        <PaymentMethodIntegration
          {...defaultProps}
          paymentMethod={mockCreditPaymentMethod}
          onPaymentSubmit={vi.fn()}
        />
      </Wrapper>,
    );

    expect(
      screen.getByTestId('credit-payment-integration'),
    ).toBeInTheDocument();
    expect(screen.getByText('Credit Payment Integration')).toBeInTheDocument();
  });

  it('should render nothing for non-CREDIT payment types', () => {
    const { container } = render(
      <Wrapper>
        <PaymentMethodIntegration
          {...defaultProps}
          paymentMethod={mockCardPaymentMethod}
          onPaymentSubmit={vi.fn()}
        />
      </Wrapper>,
    );

    expect(container.firstChild).toBeNull();
    expect(
      screen.queryByTestId('credit-payment-integration'),
    ).not.toBeInTheDocument();
  });

  it('should render nothing when paymentMethod is null', () => {
    const { container } = render(
      <Wrapper>
        <PaymentMethodIntegration
          {...defaultProps}
          paymentMethod={null}
          onPaymentSubmit={vi.fn()}
        />
      </Wrapper>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render nothing when paymentMethod is undefined', () => {
    const { container } = render(
      <Wrapper>
        <PaymentMethodIntegration
          {...defaultProps}
          paymentMethod={undefined}
          onPaymentSubmit={vi.fn()}
        />
      </Wrapper>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should handle SEPA payment type (should render nothing)', () => {
    const sepaPaymentMethod: TPaymentMethod = {
      paymentMethodId: 3,
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
      <Wrapper>
        <PaymentMethodIntegration
          {...defaultProps}
          paymentMethod={sepaPaymentMethod}
          onPaymentSubmit={vi.fn()}
        />
      </Wrapper>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should handle PayPal payment type (should render nothing)', () => {
    const paypalPaymentMethod: TPaymentMethod = {
      paymentMethodId: 4,
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
      <Wrapper>
        <PaymentMethodIntegration
          {...defaultProps}
          paymentMethod={paypalPaymentMethod}
          onPaymentSubmit={vi.fn()}
        />
      </Wrapper>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should handle bank account payment type (should render nothing)', () => {
    const bankPaymentMethod: TPaymentMethod = {
      paymentMethodId: 5,
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
      <Wrapper>
        <PaymentMethodIntegration
          {...defaultProps}
          paymentMethod={bankPaymentMethod}
          onPaymentSubmit={vi.fn()}
        />
      </Wrapper>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should handle deferred payment account type (should render nothing)', () => {
    const deferredPaymentMethod: TPaymentMethod = {
      paymentMethodId: 6,
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
      <Wrapper>
        <PaymentMethodIntegration
          {...defaultProps}
          paymentMethod={deferredPaymentMethod}
          onPaymentSubmit={vi.fn()}
        />
      </Wrapper>,
    );

    expect(container.firstChild).toBeNull();
  });
});
