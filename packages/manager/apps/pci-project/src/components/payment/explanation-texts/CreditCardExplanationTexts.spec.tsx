import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ShellContextType } from '@ovh-ux/manager-react-shell-client';
import { Currency } from '@ovh-ux/manager-config';
import CreditCardExplanationTexts from './CreditCardExplanationTexts';
import { createWrapper } from '@/wrapperRenders';
import { TPaymentFeaturesState } from '@/data/hooks/payment/usePaymentFeatureAvailabilities';

describe('CreditCardExplanationTexts', () => {
  const mockShellContext: ShellContextType = ({
    environment: {
      getUser: () => ({
        currency: { code: 'EUR' } as Currency,
        ovhSubsidiary: 'FR',
      }),
      getRegion: () => 'EU',
    },
    shell: {
      navigation: {
        navigateTo: vi.fn(),
        getURL: vi.fn(),
      },
    },
  } as unknown) as ShellContextType;

  const createMockFeatures = (overrides = {}): TPaymentFeaturesState =>
    (({
      'payments:adyen-live-in': false,
      'payments-cross-border': false,
      'payments:rupay-message': false,
      'payments:sepa-information-message': false,
      'public-cloud:paypal-charge': false,
      'public-cloud:project:sepa-direct-debit': false,
      ...overrides,
    } as unknown) as TPaymentFeaturesState);

  it('should render component without crashing', () => {
    const mockFeatures = createMockFeatures();
    const Wrapper = createWrapper(mockShellContext);

    const { container } = render(
      <Wrapper>
        <CreditCardExplanationTexts features={mockFeatures} />
      </Wrapper>,
    );

    expect(container.firstChild).toBeTruthy();
  });

  it('should render CreditCardChargesExplanationTexts when RUPAY_CHARGE is true', () => {
    const mockFeatures = createMockFeatures({ RUPAY_CHARGE: true });
    const Wrapper = createWrapper(mockShellContext);

    render(
      <Wrapper>
        <CreditCardExplanationTexts features={mockFeatures} />
      </Wrapper>,
    );

    // Should render the charges explanation component
    expect(
      screen.getByText(
        'ovh_payment_method_register_explanation_credit_card_registration_charges_info',
      ),
    ).toBeInTheDocument();
  });

  it('should render generic credit card explanations when RUPAY_CHARGE is false', () => {
    const mockFeatures = createMockFeatures({ RUPAY_CHARGE: false });
    const Wrapper = createWrapper(mockShellContext);

    render(
      <Wrapper>
        <CreditCardExplanationTexts features={mockFeatures} />
      </Wrapper>,
    );

    // Should render generic explanations
    expect(
      screen.getByText(
        'ovh_payment_method_register_explanation_credit_card_selected_explain_generic',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'ovh_payment_method_register_explanation_credit_card_selected',
      ),
    ).toBeInTheDocument();
  });

  it('should render cross-border explanation when CREDIT_CARD_CROSS_BORDER is true', () => {
    const mockFeatures = createMockFeatures({
      RUPAY_CHARGE: false,
      CREDIT_CARD_CROSS_BORDER: true,
    });
    const Wrapper = createWrapper(mockShellContext);

    render(
      <Wrapper>
        <CreditCardExplanationTexts features={mockFeatures} />
      </Wrapper>,
    );

    expect(
      screen.getByText(
        'ovh_payment_method_register_explanation_credit_card_selected_explain_ovh_transaction',
      ),
    ).toBeInTheDocument();
  });

  it('should not render cross-border explanation when CREDIT_CARD_CROSS_BORDER is false', () => {
    const mockFeatures = createMockFeatures({
      RUPAY_CHARGE: false,
      CREDIT_CARD_CROSS_BORDER: false,
    });
    const Wrapper = createWrapper(mockShellContext);

    render(
      <Wrapper>
        <CreditCardExplanationTexts features={mockFeatures} />
      </Wrapper>,
    );

    expect(
      screen.queryByText(
        'ovh_payment_method_register_explanation_credit_card_selected_explain_ovh_transaction',
      ),
    ).not.toBeInTheDocument();
  });

  it('should render OdsMessage with correct props', () => {
    const mockFeatures = createMockFeatures();
    const Wrapper = createWrapper(mockShellContext);

    const { container } = render(
      <Wrapper>
        <CreditCardExplanationTexts features={mockFeatures} />
      </Wrapper>,
    );

    const messageElement = container.querySelector(
      '[data-testid="ods-message"]',
    );
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveAttribute('data-color', 'information');
  });
});
