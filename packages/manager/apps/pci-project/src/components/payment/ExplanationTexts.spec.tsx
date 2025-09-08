import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ExplanationTexts from './ExplanationTexts';
import { createWrapper } from '@/wrapperRenders';
import {
  TAvailablePaymentMethod,
  TPaymentMethodType,
  TPaymentMethodIntegration,
} from '@/data/types/payment/payment-method.type';
import { TPaymentFeaturesState } from '@/data/hooks/payment/usePaymentFeatureAvailabilities';

// Mock the explanation text components
vi.mock('./explanation-texts/CreditCardExplanationTexts', () => ({
  default: vi.fn(() => (
    <div data-testid="credit-card-explanation">Credit Card Explanation</div>
  )),
}));

vi.mock('./explanation-texts/SepaExplanationTexts', () => ({
  default: vi.fn(() => (
    <div data-testid="sepa-explanation">SEPA Explanation</div>
  )),
}));

vi.mock('./explanation-texts/PaypalExplanationTexts', () => ({
  default: vi.fn(() => (
    <div data-testid="paypal-explanation">PayPal Explanation</div>
  )),
}));

vi.mock('./explanation-texts/RupayExplanationTexts', () => ({
  default: vi.fn(() => (
    <div data-testid="rupay-explanation">Rupay Explanation</div>
  )),
}));

describe('ExplanationTexts', () => {
  const mockFeatures: TPaymentFeaturesState = ({
    ADYEN_LIVE_IN: false,
    CREDIT_CARD_CROSS_BORDER: true,
    RUPAY_CHARGE: false,
    SEPA_INFO_MSG: false,
    PAYPAL_CHARGE: false,
    SEPA_DIRECT_DEBIT: false,
  } as unknown) as TPaymentFeaturesState;

  const createMockPaymentMethod = (
    paymentType: TPaymentMethodType,
  ): TAvailablePaymentMethod => ({
    paymentMethodId: 1,
    paymentType,
    integration: TPaymentMethodIntegration.COMPONENT,
    paymentSubType: null,
    oneshot: false,
    registerable: true,
    registerableWithTransaction: false,
    icon: {
      name: 'test',
      data: undefined,
      url: 'https://example.com/test.png',
      componentIcon: undefined,
    },
  });

  const Wrapper = createWrapper();

  it('should render nothing when selectedPaymentMethod is null', () => {
    const { container } = render(
      <Wrapper>
        <ExplanationTexts
          selectedPaymentMethod={null}
          features={mockFeatures}
        />
      </Wrapper>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render nothing when selectedPaymentMethod is undefined', () => {
    const { container } = render(
      <Wrapper>
        <ExplanationTexts
          selectedPaymentMethod={undefined}
          features={mockFeatures}
        />
      </Wrapper>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render CreditCardExplanationTexts for CREDIT_CARD payment type', () => {
    const mockPaymentMethod = createMockPaymentMethod(
      TPaymentMethodType.CREDIT_CARD,
    );

    render(
      <Wrapper>
        <ExplanationTexts
          selectedPaymentMethod={mockPaymentMethod}
          features={mockFeatures}
        />
      </Wrapper>,
    );

    expect(screen.getByTestId('credit-card-explanation')).toBeInTheDocument();
    expect(screen.getByText('Credit Card Explanation')).toBeInTheDocument();
  });

  it('should render SepaExplanationTexts for SEPA_DIRECT_DEBIT payment type', () => {
    const mockPaymentMethod = createMockPaymentMethod(
      TPaymentMethodType.SEPA_DIRECT_DEBIT,
    );

    render(
      <Wrapper>
        <ExplanationTexts
          selectedPaymentMethod={mockPaymentMethod}
          features={mockFeatures}
        />
      </Wrapper>,
    );

    expect(screen.getByTestId('sepa-explanation')).toBeInTheDocument();
    expect(screen.getByText('SEPA Explanation')).toBeInTheDocument();
  });

  it('should render PaypalExplanationTexts for PAYPAL payment type', () => {
    const mockPaymentMethod = createMockPaymentMethod(
      TPaymentMethodType.PAYPAL,
    );

    render(
      <Wrapper>
        <ExplanationTexts
          selectedPaymentMethod={mockPaymentMethod}
          features={mockFeatures}
        />
      </Wrapper>,
    );

    expect(screen.getByTestId('paypal-explanation')).toBeInTheDocument();
    expect(screen.getByText('PayPal Explanation')).toBeInTheDocument();
  });

  it('should render RupayExplanationTexts for RUPAY payment type', () => {
    const mockPaymentMethod = createMockPaymentMethod(TPaymentMethodType.RUPAY);

    render(
      <Wrapper>
        <ExplanationTexts
          selectedPaymentMethod={mockPaymentMethod}
          features={mockFeatures}
        />
      </Wrapper>,
    );

    expect(screen.getByTestId('rupay-explanation')).toBeInTheDocument();
    expect(screen.getByText('Rupay Explanation')).toBeInTheDocument();
  });

  it('should render nothing for unsupported payment types', () => {
    const mockPaymentMethod = createMockPaymentMethod(
      TPaymentMethodType.BANK_ACCOUNT,
    );

    const { container } = render(
      <Wrapper>
        <ExplanationTexts
          selectedPaymentMethod={mockPaymentMethod}
          features={mockFeatures}
        />
      </Wrapper>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render nothing for CREDIT payment type', () => {
    const mockPaymentMethod = createMockPaymentMethod(
      TPaymentMethodType.CREDIT,
    );

    const { container } = render(
      <Wrapper>
        <ExplanationTexts
          selectedPaymentMethod={mockPaymentMethod}
          features={mockFeatures}
        />
      </Wrapper>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should pass features prop to explanation components', async () => {
    const { default: CreditCardExplanationTexts } = await import(
      './explanation-texts/CreditCardExplanationTexts'
    );

    const mockPaymentMethod = createMockPaymentMethod(
      TPaymentMethodType.CREDIT_CARD,
    );

    render(
      <Wrapper>
        <ExplanationTexts
          selectedPaymentMethod={mockPaymentMethod}
          features={mockFeatures}
        />
      </Wrapper>,
    );

    expect(CreditCardExplanationTexts).toHaveBeenCalledWith(
      { features: mockFeatures },
      {},
    );
  });
});
