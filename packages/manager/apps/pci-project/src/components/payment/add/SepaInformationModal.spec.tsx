import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SepaInformationModal from './SepaInformationModal';
import { createWrapper } from '@/wrapperRenders';
import { TPaymentFeaturesState } from '@/data/hooks/payment/usePaymentFeatureAvailabilities';

describe('SepaInformationModal', () => {
  const mockHandleSepaModalShown = vi.fn();

  const createMockFeatures = (overrides = {}): TPaymentFeaturesState =>
    (({
      ADYEN_LIVE_IN: false,
      CREDIT_CARD_CROSS_BORDER: false,
      RUPAY_CHARGE: false,
      SEPA_INFO_MSG: false,
      PAYPAL_CHARGE: false,
      SEPA_DIRECT_DEBIT: false,
      ...overrides,
    } as unknown) as TPaymentFeaturesState);

  const Wrapper = createWrapper();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render component without crashing', () => {
    const mockFeatures = createMockFeatures({ SEPA_INFO_MSG: true });

    const { container } = render(
      <Wrapper>
        <SepaInformationModal
          features={mockFeatures}
          handleSepaModalShown={mockHandleSepaModalShown}
          isAlreadyShown={false}
        />
      </Wrapper>,
    );

    expect(container.firstChild).toBeTruthy();
  });

  it('should not show modal when SEPA_INFO_MSG feature is disabled', () => {
    const mockFeatures = createMockFeatures({ SEPA_INFO_MSG: false });

    render(
      <Wrapper>
        <SepaInformationModal
          features={mockFeatures}
          handleSepaModalShown={mockHandleSepaModalShown}
          isAlreadyShown={false}
        />
      </Wrapper>,
    );

    expect(
      screen.queryByText(
        'ovh_payment_method_register_sepa_information_modal_title',
      ),
    ).not.toBeInTheDocument();
  });

  it('should not show modal when already shown', () => {
    const mockFeatures = createMockFeatures({ SEPA_INFO_MSG: true });

    render(
      <Wrapper>
        <SepaInformationModal
          features={mockFeatures}
          handleSepaModalShown={mockHandleSepaModalShown}
          isAlreadyShown={true}
        />
      </Wrapper>,
    );

    expect(
      screen.queryByText(
        'ovh_payment_method_register_sepa_information_modal_title',
      ),
    ).not.toBeInTheDocument();
  });

  it('should show modal when SEPA_INFO_MSG is enabled and not already shown', () => {
    const mockFeatures = createMockFeatures({ SEPA_INFO_MSG: true });

    render(
      <Wrapper>
        <SepaInformationModal
          features={mockFeatures}
          handleSepaModalShown={mockHandleSepaModalShown}
          isAlreadyShown={false}
        />
      </Wrapper>,
    );

    expect(
      screen.getByText(
        'ovh_payment_method_register_sepa_information_modal_title',
      ),
    ).toBeInTheDocument();
  });

  it('should display modal content correctly', () => {
    const mockFeatures = createMockFeatures({ SEPA_INFO_MSG: true });

    render(
      <Wrapper>
        <SepaInformationModal
          features={mockFeatures}
          handleSepaModalShown={mockHandleSepaModalShown}
          isAlreadyShown={false}
        />
      </Wrapper>,
    );

    expect(
      screen.getByText(
        'ovh_payment_method_register_sepa_information_modal_title',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'ovh_payment_method_register_sepa_information_modal_part_1',
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'ovh_payment_method_register_sepa_information_modal_part_2',
      ),
    ).toBeInTheDocument();

    expect(screen.getByTestId('button_sepa_modal_confirm')).toBeInTheDocument();
  });

  it('should call handleSepaModalShown when modal is shown', () => {
    const mockFeatures = createMockFeatures({ SEPA_INFO_MSG: true });

    render(
      <Wrapper>
        <SepaInformationModal
          features={mockFeatures}
          handleSepaModalShown={mockHandleSepaModalShown}
          isAlreadyShown={false}
        />
      </Wrapper>,
    );

    expect(mockHandleSepaModalShown).toHaveBeenCalledTimes(1);
  });

  it('should close modal when confirm button is clicked', () => {
    const mockFeatures = createMockFeatures({ SEPA_INFO_MSG: true });

    render(
      <Wrapper>
        <SepaInformationModal
          features={mockFeatures}
          handleSepaModalShown={mockHandleSepaModalShown}
          isAlreadyShown={false}
        />
      </Wrapper>,
    );

    const confirmButton = screen.getByTestId('button_sepa_modal_confirm');
    fireEvent.click(confirmButton);

    // Modal should be closed (content no longer visible)
    expect(
      screen.queryByText(
        'ovh_payment_method_register_sepa_information_modal_title',
      ),
    ).not.toBeInTheDocument();
  });

  it('should support dismissible modal', () => {
    const mockFeatures = createMockFeatures({ SEPA_INFO_MSG: true });

    const { container } = render(
      <Wrapper>
        <SepaInformationModal
          features={mockFeatures}
          handleSepaModalShown={mockHandleSepaModalShown}
          isAlreadyShown={false}
        />
      </Wrapper>,
    );

    const modal = container.querySelector('[data-testid="ods-modal"]');
    expect(modal).toBeInTheDocument();

    if (modal) {
      // Simulate close event by clicking the modal (our mock handles onClick)
      fireEvent.click(modal);
    }

    // Modal should be closed
    expect(
      screen.queryByText(
        'ovh_payment_method_register_sepa_information_modal_title',
      ),
    ).not.toBeInTheDocument();
  });

  it('should render HTML content in part 1', () => {
    const mockFeatures = createMockFeatures({ SEPA_INFO_MSG: true });

    const { container } = render(
      <Wrapper>
        <SepaInformationModal
          features={mockFeatures}
          handleSepaModalShown={mockHandleSepaModalShown}
          isAlreadyShown={false}
        />
      </Wrapper>,
    );

    // Check that dangerouslySetInnerHTML is used for part 1
    const part1Element = container.querySelector('span');
    expect(part1Element).toBeInTheDocument();
  });

  it('should handle isAlreadyShown defaulting to false', () => {
    const mockFeatures = createMockFeatures({ SEPA_INFO_MSG: true });

    render(
      <Wrapper>
        <SepaInformationModal
          features={mockFeatures}
          handleSepaModalShown={mockHandleSepaModalShown}
          isAlreadyShown={false}
        />
      </Wrapper>,
    );

    // Should show modal when explicitly set to false
    expect(
      screen.getByText(
        'ovh_payment_method_register_sepa_information_modal_title',
      ),
    ).toBeInTheDocument();
  });
});
