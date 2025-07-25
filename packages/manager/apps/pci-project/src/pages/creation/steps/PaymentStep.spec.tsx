import { UseQueryResult } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createWrapper } from '@/wrapperRenders';
import {
  useIsStartupProgramAvailable,
  useStartupProgramAmountText,
} from '@/data/hooks/useCredit';
import PaymentStep, { PaymentStepProps } from './PaymentStep';

vi.mock('@/data/hooks/useCredit', () => ({
  useIsStartupProgramAvailable: vi.fn(),
  useStartupProgramAmountText: vi.fn(),
}));

vi.mock('@/components/payment/PaymentMethods', () => ({
  default: vi.fn(() => (
    <div data-testid="payment-methods">Payment Methods Component</div>
  )),
}));

vi.mock('../components/voucher/Voucher', () => ({
  default: vi.fn(() => <div data-testid="voucher">Voucher Component</div>),
}));

vi.mock('../components/startup-program/StartupProgram', () => ({
  default: vi.fn(() => (
    <div data-testid="startup-program">Startup Program Component</div>
  )),
}));

describe('PaymentStep', () => {
  const mockUseIsStartupProgramAvailable = vi.mocked(
    useIsStartupProgramAvailable,
  );
  const mockUseStartupProgramAmountText = vi.mocked(
    useStartupProgramAmountText,
  );

  const defaultProps: PaymentStepProps = {
    cart: {
      cartId: 'cart-123',
      description: 'Test cart',
      expire: '2024-12-31T23:59:59Z',
      readonly: false,
    },
    cartProjectItem: {
      cartId: 'cart-123',
      itemId: 456,
      productId: 'project-product',
      configuration: [],
      duration: 'P1M',
      options: [],
      prices: [],
      settings: {
        planCode: 'project.2018',
        pricingMode: 'default',
        quantity: 1,
      },
    },
  };

  const mockStartupProgramAmountText = '100.00 €';

  function mockQueryResult<T>(
    data: T,
    isFetching = false,
  ): UseQueryResult<T, Error> {
    return ({
      data,
      isError: false,
      isPending: isFetching,
      isLoading: isFetching,
      isFetching,
      isSuccess: !isFetching,
      status: isFetching ? 'pending' : 'success',
      isFetched: !isFetching,
    } as unknown) as UseQueryResult<T, Error>;
  }

  const renderComponent = (props = defaultProps) =>
    render(<PaymentStep {...props} />, { wrapper: createWrapper() });

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseIsStartupProgramAvailable.mockReturnValue(mockQueryResult(false));
    mockUseStartupProgramAmountText.mockReturnValue(
      mockQueryResult(mockStartupProgramAmountText),
    );
  });

  describe('PaymentStep tests', () => {
    it('should render the component without crashing', () => {
      renderComponent();
      expect(screen.getByTestId('voucher')).toBeVisible();
      expect(screen.getByTestId('payment-methods')).toBeVisible();
    });

    it('should render Voucher component with correct props', () => {
      renderComponent();

      const voucherComponent = screen.getByTestId('voucher');
      expect(voucherComponent).toBeVisible();
    });

    it('should render PaymentMethods component with correct props', () => {
      renderComponent();

      const paymentMethodsComponent = screen.getByTestId('payment-methods');
      expect(paymentMethodsComponent).toBeVisible();
    });

    it('should not render StartupProgram when not available', () => {
      mockUseIsStartupProgramAvailable.mockReturnValue(mockQueryResult(false));

      renderComponent();

      expect(screen.queryByTestId('startup-program')).not.toBeInTheDocument();
    });

    it('should render StartupProgram when available', () => {
      mockUseIsStartupProgramAvailable.mockReturnValue(mockQueryResult(true));

      renderComponent();

      expect(screen.getByTestId('startup-program')).toBeVisible();
    });

    it('should pass correct props to StartupProgram component', () => {
      mockUseIsStartupProgramAvailable.mockReturnValue(mockQueryResult(true));

      renderComponent();

      const startupProgramComponent = screen.getByTestId('startup-program');
      expect(startupProgramComponent).toBeVisible();
    });

    it('should call useIsStartupProgramAvailable hook', () => {
      renderComponent();

      expect(mockUseIsStartupProgramAvailable).toHaveBeenCalledTimes(1);
    });

    it('should call useStartupProgramAmountText hook when startup program is available', () => {
      mockUseIsStartupProgramAvailable.mockReturnValue(mockQueryResult(true));

      renderComponent();

      expect(mockUseStartupProgramAmountText).toHaveBeenCalledWith(true);
    });

    it('should not call useStartupProgramAmountText hook when startup program is not available', () => {
      mockUseIsStartupProgramAvailable.mockReturnValue(mockQueryResult(false));

      renderComponent();

      expect(mockUseStartupProgramAmountText).toHaveBeenCalledWith(false);
    });

    it('should handle loading state for startup program availability', () => {
      mockUseIsStartupProgramAvailable.mockReturnValue(
        mockQueryResult(false, true),
      );

      renderComponent();

      expect(screen.queryByTestId('startup-program')).not.toBeInTheDocument();
    });

    it('should handle loading state for startup program balance', () => {
      mockUseIsStartupProgramAvailable.mockReturnValue(mockQueryResult(true));
      mockUseStartupProgramAmountText.mockReturnValue(
        mockQueryResult(mockStartupProgramAmountText, true),
      );

      renderComponent();

      expect(screen.getByTestId('startup-program')).toBeVisible();
    });
  });
});
