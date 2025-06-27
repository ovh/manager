import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ShellContextType } from '@ovh-ux/manager-react-shell-client';
import { Currency } from '@ovh-ux/manager-config';
import CreditCardChargesExplanationTexts from './CreditCardChargesExplanationTexts';
import { createWrapper } from '@/wrapperRenders';
import { TPaymentFeaturesState } from '@/data/hooks/payment/usePaymentFeatureAvailabilities';

// Mock the pricing hook
vi.mock('@ovh-ux/manager-pci-common', () => ({
  usePricing: vi.fn(),
}));

// Mock the constants
vi.mock('@/payment/constants', () => ({
  CONFIRM_CREDIT_CARD_TEST_AMOUNT: 2,
}));

const mockUsePricing = vi.mocked(
  (await import('@ovh-ux/manager-pci-common')).usePricing,
);

describe('CreditCardChargesExplanationTexts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePricing.mockReturnValue({
      formatPrice: vi.fn(() => '2.00 EUR'),
      getPriceDetails: vi.fn(),
      getTextPrice: vi.fn(),
    });
  });

  const mockFeatures = ({
    'payments:adyen-live-in': false,
    'payments-cross-border': true,
    'payments:rupay-message': false,
    'payments:sepa-information-message': false,
    'public-cloud:paypal-charge': false,
    'public-cloud:project:sepa-direct-debit': false,
  } as unknown) as TPaymentFeaturesState;

  it('should render component without crashing', () => {
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

    const Wrapper = createWrapper(mockShellContext);

    const { container } = render(
      <Wrapper>
        <CreditCardChargesExplanationTexts features={mockFeatures} />
      </Wrapper>,
    );

    // Basic test to ensure component renders
    expect(container.firstChild).toBeTruthy();
  });

  it('should display translated text', () => {
    const mockShellContext: ShellContextType = ({
      environment: {
        getUser: () => ({
          currency: { code: 'USD' } as Currency,
          ovhSubsidiary: 'US',
        }),
        getRegion: () => 'US',
      },
      shell: {
        navigation: {
          navigateTo: vi.fn(),
          getURL: vi.fn(),
        },
      },
    } as unknown) as ShellContextType;

    const Wrapper = createWrapper(mockShellContext);

    render(
      <Wrapper>
        <CreditCardChargesExplanationTexts features={mockFeatures} />
      </Wrapper>,
    );

    // Check if the translation key is rendered (due to the mock in setupTests)
    expect(
      screen.getByText(
        'ovh_payment_method_register_explanation_credit_card_registration_charges_info',
      ),
    ).toBeInTheDocument();
  });

  it('should call formatPrice with correct parameters', () => {
    const mockFormatPrice = vi.fn(() => '2.00 GBP');

    mockUsePricing.mockReturnValue({
      formatPrice: mockFormatPrice,
      getPriceDetails: vi.fn(),
      getTextPrice: vi.fn(),
    });

    const mockShellContext: ShellContextType = ({
      environment: {
        getUser: () => ({
          currency: { code: 'GBP' } as Currency,
          ovhSubsidiary: 'GB',
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

    const Wrapper = createWrapper(mockShellContext);

    render(
      <Wrapper>
        <CreditCardChargesExplanationTexts features={mockFeatures} />
      </Wrapper>,
    );

    expect(mockFormatPrice).toHaveBeenCalledWith(2, { unit: 1 });
  });

  it('should format price correctly and display in text', () => {
    const mockShellContext: ShellContextType = ({
      environment: {
        getUser: () => ({
          currency: { code: 'JPY' } as Currency,
          ovhSubsidiary: 'JP',
        }),
        getRegion: () => 'APAC',
      },
      shell: {
        navigation: {
          navigateTo: vi.fn(),
          getURL: vi.fn(),
        },
      },
    } as unknown) as ShellContextType;

    const Wrapper = createWrapper(mockShellContext);

    const { container } = render(
      <Wrapper>
        <CreditCardChargesExplanationTexts features={mockFeatures} />
      </Wrapper>,
    );

    const odsTextElement = container.querySelector('[data-testid="ods-text"]');
    expect(odsTextElement).toBeInTheDocument();
    expect(odsTextElement).toHaveTextContent(
      'ovh_payment_method_register_explanation_credit_card_registration_charges_info',
    );
  });
});
