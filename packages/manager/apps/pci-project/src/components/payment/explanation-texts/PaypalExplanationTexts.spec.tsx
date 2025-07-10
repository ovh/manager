import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ShellContextType } from '@ovh-ux/manager-react-shell-client';
import { Currency } from '@ovh-ux/manager-config';
import PaypalExplanationTexts from './PaypalExplanationTexts';
import { createWrapper } from '@/wrapperRenders';
import { TPaymentFeaturesState } from '@/data/hooks/payment/usePaymentFeatureAvailabilities';
import { usePaypalChargeAmount } from '@/data/hooks/payment/usePaypalChargeAmount';

// Mock the pricing hook
vi.mock('@ovh-ux/manager-pci-common', () => ({
  usePricing: vi.fn(),
}));

// Mock the paypal charge amount hook
vi.mock('@/data/hooks/payment/usePaypalChargeAmount', () => ({
  usePaypalChargeAmount: vi.fn(),
}));

const mockUsePricing = vi.mocked(
  (await import('@ovh-ux/manager-pci-common')).usePricing,
);

const mockUsePaypalChargeAmount = vi.mocked(usePaypalChargeAmount);

describe('PaypalExplanationTexts', () => {
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

  const createMockShellContext = (ovhSubsidiary = 'FR'): ShellContextType =>
    (({
      environment: {
        getUser: () => ({
          currency: { code: 'USD' } as Currency,
          ovhSubsidiary,
        }),
        getRegion: () => 'US',
      },
      shell: {
        navigation: {
          navigateTo: vi.fn(),
          getURL: vi.fn(),
        },
      },
    } as unknown) as ShellContextType);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePaypalChargeAmount.mockReturnValue(({
      data: 5,
      isLoading: false,
      isPending: false,
      isError: false,
      isSuccess: true,
      error: null,
      status: 'success',
      isLoadingError: false,
      isRefetchError: false,
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      errorUpdateCount: 0,
      failureCount: 0,
      failureReason: null,
      refetch: vi.fn(),
      fetchStatus: 'idle',
      isFetched: true,
      isFetchedAfterMount: true,
      isFetching: false,
      isInitialLoading: false,
      isPlaceholderData: false,
      isRefetching: false,
      isStale: false,
      isPaused: false,
    } as unknown) as ReturnType<typeof usePaypalChargeAmount>);

    mockUsePricing.mockReturnValue({
      formatPrice: vi.fn(() => '5.00 USD'),
      getPriceDetails: vi.fn(),
      getTextPrice: vi.fn(),
    });
  });

  it('should render component without crashing', () => {
    const mockFeatures = createMockFeatures();
    const mockShellContext = createMockShellContext();
    const Wrapper = createWrapper(mockShellContext);

    const { container } = render(
      <Wrapper>
        <PaypalExplanationTexts features={mockFeatures} />
      </Wrapper>,
    );

    expect(container.firstChild).toBeTruthy();
  });

  it('should show loading spinner when data is loading', () => {
    mockUsePaypalChargeAmount.mockReturnValue(({
      data: undefined,
      isLoading: true,
      isPending: true,
      isError: false,
      isSuccess: false,
      error: null,
      status: 'pending',
      isLoadingError: false,
      isRefetchError: false,
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      errorUpdateCount: 0,
      failureCount: 0,
      failureReason: null,
      refetch: vi.fn(),
      fetchStatus: 'fetching',
      isFetched: false,
      isFetchedAfterMount: false,
      isFetching: true,
      isInitialLoading: true,
      isPlaceholderData: false,
      isRefetching: false,
      isStale: false,
      isPaused: false,
    } as unknown) as ReturnType<typeof usePaypalChargeAmount>);

    const mockFeatures = createMockFeatures();
    const mockShellContext = createMockShellContext();
    const Wrapper = createWrapper(mockShellContext);

    render(
      <Wrapper>
        <PaypalExplanationTexts features={mockFeatures} />
      </Wrapper>,
    );

    expect(screen.getByTestId('ods-spinner')).toBeInTheDocument();
  });

  it('should render generic text when not in US region', () => {
    const mockFeatures = createMockFeatures();
    const mockShellContext = createMockShellContext('FR');
    const Wrapper = createWrapper(mockShellContext);

    render(
      <Wrapper>
        <PaypalExplanationTexts features={mockFeatures} />
      </Wrapper>,
    );

    expect(
      screen.getByText(
        'ovh_payment_method_register_explanation_selected_paypal_redirect',
      ),
    ).toBeInTheDocument();
  });

  it('should render US-specific text when in US region', () => {
    const mockFeatures = createMockFeatures();
    const mockShellContext = createMockShellContext('US');
    const Wrapper = createWrapper(mockShellContext);

    render(
      <Wrapper>
        <PaypalExplanationTexts features={mockFeatures} />
      </Wrapper>,
    );

    expect(
      screen.getByText(
        'ovh_payment_method_register_explanation_selected_paypal_redirect_US',
      ),
    ).toBeInTheDocument();
  });

  it('should show warning message when PAYPAL_CHARGE feature is enabled', () => {
    const mockFeatures = createMockFeatures({ PAYPAL_CHARGE: true });
    const mockShellContext = createMockShellContext();
    const Wrapper = createWrapper(mockShellContext);

    render(
      <Wrapper>
        <PaypalExplanationTexts features={mockFeatures} />
      </Wrapper>,
    );

    expect(
      screen.getByText(
        'pci_project_new_payment_method_add_warning_paypal_account',
      ),
    ).toBeInTheDocument();
  });

  it('should not show warning message when PAYPAL_CHARGE feature is disabled', () => {
    const mockFeatures = createMockFeatures({ PAYPAL_CHARGE: false });
    const mockShellContext = createMockShellContext();
    const Wrapper = createWrapper(mockShellContext);

    render(
      <Wrapper>
        <PaypalExplanationTexts features={mockFeatures} />
      </Wrapper>,
    );

    expect(
      screen.queryByText(
        'pci_project_new_payment_method_add_warning_paypal_account',
      ),
    ).not.toBeInTheDocument();
  });

  it('should call formatPrice with correct parameters when PAYPAL_CHARGE is enabled', () => {
    const mockFormatPrice = vi.fn(() => '5.00 USD');

    mockUsePricing.mockReturnValue({
      formatPrice: mockFormatPrice,
      getPriceDetails: vi.fn(),
      getTextPrice: vi.fn(),
    });

    const mockFeatures = createMockFeatures({ PAYPAL_CHARGE: true });
    const mockShellContext = createMockShellContext('GB');
    const Wrapper = createWrapper(mockShellContext);

    render(
      <Wrapper>
        <PaypalExplanationTexts features={mockFeatures} />
      </Wrapper>,
    );

    expect(mockFormatPrice).toHaveBeenCalledWith(5, {});
  });

  it('should handle when amount is 0', () => {
    mockUsePaypalChargeAmount.mockReturnValue(({
      data: 0,
      isLoading: false,
      isPending: false,
      isError: false,
      isSuccess: true,
      error: null,
      status: 'success',
      isLoadingError: false,
      isRefetchError: false,
      dataUpdatedAt: Date.now(),
      errorUpdatedAt: 0,
      errorUpdateCount: 0,
      failureCount: 0,
      failureReason: null,
      refetch: vi.fn(),
      fetchStatus: 'idle',
      isFetched: true,
      isFetchedAfterMount: true,
      isFetching: false,
      isInitialLoading: false,
      isPlaceholderData: false,
      isRefetching: false,
      isStale: false,
      isPaused: false,
    } as unknown) as ReturnType<typeof usePaypalChargeAmount>);

    const mockFeatures = createMockFeatures({ PAYPAL_CHARGE: true });
    const mockShellContext = createMockShellContext();
    const Wrapper = createWrapper(mockShellContext);

    const { container } = render(
      <Wrapper>
        <PaypalExplanationTexts features={mockFeatures} />
      </Wrapper>,
    );

    expect(container.firstChild).toBeTruthy();
  });
});
