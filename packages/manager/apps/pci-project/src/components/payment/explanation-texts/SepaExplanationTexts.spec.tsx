import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ShellContextType } from '@ovh-ux/manager-react-shell-client';
import { Currency } from '@ovh-ux/manager-config';
import SepaExplanationTexts from './SepaExplanationTexts';
import { createWrapper } from '@/wrapperRenders';
import { TPaymentFeaturesState } from '@/data/hooks/payment/usePaymentFeatureAvailabilities';

describe('SepaExplanationTexts', () => {
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
        <SepaExplanationTexts features={mockFeatures} />
      </Wrapper>,
    );

    expect(container.firstChild).toBeTruthy();
  });

  it('should render both warning and information messages', () => {
    const mockFeatures = createMockFeatures();
    const Wrapper = createWrapper(mockShellContext);

    const { container } = render(
      <Wrapper>
        <SepaExplanationTexts features={mockFeatures} />
      </Wrapper>,
    );

    const messageElements = container.querySelectorAll(
      '[data-testid="ods-message"]',
    );
    expect(messageElements).toHaveLength(2);

    // First message should be warning
    expect(messageElements[0]).toHaveAttribute('data-color', 'warning');
    // Second message should be information
    expect(messageElements[1]).toHaveAttribute('data-color', 'information');
  });

  it('should render all warning texts', () => {
    const mockFeatures = createMockFeatures();
    const Wrapper = createWrapper(mockShellContext);

    render(
      <Wrapper>
        <SepaExplanationTexts features={mockFeatures} />
      </Wrapper>,
    );

    expect(
      screen.getByText(
        'ovh_payment_method_register_explanation_sepa_direct_debit_warning_redirection',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'ovh_payment_method_register_explanation_sepa_direct_debit_warning_order',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'ovh_payment_method_register_explanation_sepa_direct_debit_warning_owner_identity',
      ),
    ).toBeInTheDocument();
  });

  it('should render all information texts', () => {
    const mockFeatures = createMockFeatures();
    const Wrapper = createWrapper(mockShellContext);

    render(
      <Wrapper>
        <SepaExplanationTexts features={mockFeatures} />
      </Wrapper>,
    );

    expect(
      screen.getByText(
        'ovh_payment_method_register_explanation_sepa_direct_debit_data_processing_info',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'ovh_payment_method_register_explanation_sepa_direct_debit_digital_signature_info',
      ),
    ).toBeInTheDocument();
  });

  it('should render OdsText components with correct CSS classes', () => {
    const mockFeatures = createMockFeatures();
    const Wrapper = createWrapper(mockShellContext);

    const { container } = render(
      <Wrapper>
        <SepaExplanationTexts features={mockFeatures} />
      </Wrapper>,
    );

    const textElements = container.querySelectorAll('[data-testid="ods-text"]');
    expect(textElements.length).toBeGreaterThan(0);

    // All text elements should have mb-0 class
    textElements.forEach((element) => {
      expect(element).toHaveClass('mb-0');
    });
  });

  it('should render messages with correct layout classes', () => {
    const mockFeatures = createMockFeatures();
    const Wrapper = createWrapper(mockShellContext);

    const { container } = render(
      <Wrapper>
        <SepaExplanationTexts features={mockFeatures} />
      </Wrapper>,
    );

    const messageElements = container.querySelectorAll(
      '[data-testid="ods-message"]',
    );

    messageElements.forEach((element) => {
      expect(element).toHaveClass('w-full', 'mb-3', 'text-justify');
    });
  });
});
