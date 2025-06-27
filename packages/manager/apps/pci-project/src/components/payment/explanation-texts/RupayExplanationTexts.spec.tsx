import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ShellContextType } from '@ovh-ux/manager-react-shell-client';
import { Currency } from '@ovh-ux/manager-config';
import RupayExplanationTexts from './RupayExplanationTexts';
import { createWrapper } from '@/wrapperRenders';
import { TPaymentFeaturesState } from '@/data/hooks/payment/usePaymentFeatureAvailabilities';

// Mock the price formatter
vi.mock('@/utils/price-formatter', () => ({
  formatPrice: vi.fn(() => '2.00 EUR'),
}));

// Mock the constants
vi.mock('@/payment/constants', () => ({
  CONFIRM_CREDIT_CARD_TEST_AMOUNT: 2,
}));

describe('RupayExplanationTexts', () => {
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
        <RupayExplanationTexts features={mockFeatures} />
      </Wrapper>,
    );

    expect(container.firstChild).toBeTruthy();
  });

  it('should render OdsMessage with correct props', () => {
    const mockFeatures = createMockFeatures();
    const Wrapper = createWrapper(mockShellContext);

    const { container } = render(
      <Wrapper>
        <RupayExplanationTexts features={mockFeatures} />
      </Wrapper>,
    );

    const messageElement = container.querySelector(
      '[data-testid="ods-message"]',
    );
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveAttribute('data-color', 'information');
  });

  it('should render CreditCardChargesExplanationTexts component', () => {
    const mockFeatures = createMockFeatures();
    const Wrapper = createWrapper(mockShellContext);

    render(
      <Wrapper>
        <RupayExplanationTexts features={mockFeatures} />
      </Wrapper>,
    );

    // Should render the charges explanation component content
    expect(
      screen.getByText(
        'ovh_payment_method_register_explanation_credit_card_registration_charges_info',
      ),
    ).toBeInTheDocument();
  });

  it('should pass features prop to CreditCardChargesExplanationTexts', () => {
    const mockFeatures = createMockFeatures({ RUPAY_CHARGE: true });
    const Wrapper = createWrapper(mockShellContext);

    const { container } = render(
      <Wrapper>
        <RupayExplanationTexts features={mockFeatures} />
      </Wrapper>,
    );

    // The component should render and contain the expected content
    expect(container.firstChild).toBeTruthy();
    expect(
      screen.getByText(
        'ovh_payment_method_register_explanation_credit_card_registration_charges_info',
      ),
    ).toBeInTheDocument();
  });
});
