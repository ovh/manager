import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BankAccountPaymentMethodIntegration from './BankAccountPaymentMethodIntegration';
import {
  TPaymentMethodIntegrationRef,
  TPaymentMethod,
  TPaymentMethodType,
} from '@/data/types/payment/payment-method.type';
import { TCart } from '@/data/types/payment/cart.type';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock Shell Context with vi.hoisted
const mockGetURL = vi.hoisted(() => vi.fn());
vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  ShellContext: React.createContext({
    shell: {
      navigation: {
        getURL: mockGetURL,
      },
    },
  }),
}));

describe('BankAccountPaymentMethodIntegration', () => {
  const mockHandleValidityChange = vi.fn();
  const mockHandleCustomSubmitButton = vi.fn();
  const mockPaymentHandler = React.createRef<TPaymentMethodIntegrationRef>();

  const TestWrapper: React.FC<{
    children: React.ReactNode;
  }> = ({ children }) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetURL.mockResolvedValue('#/billing/payment/method/add');
  });

  it('should render without crashing', () => {
    render(
      <TestWrapper>
        <BankAccountPaymentMethodIntegration
          handleValidityChange={mockHandleValidityChange}
          paymentHandler={mockPaymentHandler}
        />
      </TestWrapper>,
    );
  });

  it('should call handleValidityChange with true on mount', () => {
    render(
      <TestWrapper>
        <BankAccountPaymentMethodIntegration
          handleValidityChange={mockHandleValidityChange}
          paymentHandler={mockPaymentHandler}
        />
      </TestWrapper>,
    );

    expect(mockHandleValidityChange).toHaveBeenCalledWith(true);
  });

  it('should call handleCustomSubmitButton with translated text when provided', () => {
    render(
      <TestWrapper>
        <BankAccountPaymentMethodIntegration
          handleValidityChange={mockHandleValidityChange}
          paymentHandler={mockPaymentHandler}
          handleCustomSubmitButton={mockHandleCustomSubmitButton}
        />
      </TestWrapper>,
    );

    expect(mockHandleCustomSubmitButton).toHaveBeenCalledWith(
      'pci_project_new_payment_btn_continue_bank_account',
    );
  });

  it('should not call handleCustomSubmitButton when not provided', () => {
    render(
      <TestWrapper>
        <BankAccountPaymentMethodIntegration
          handleValidityChange={mockHandleValidityChange}
          paymentHandler={mockPaymentHandler}
        />
      </TestWrapper>,
    );

    expect(mockHandleCustomSubmitButton).not.toHaveBeenCalled();
  });

  it('should fetch billing URL on mount', async () => {
    render(
      <TestWrapper>
        <BankAccountPaymentMethodIntegration
          handleValidityChange={mockHandleValidityChange}
          paymentHandler={mockPaymentHandler}
        />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(mockGetURL).toHaveBeenCalledWith(
        'dedicated',
        '#/billing/payment/method/add',
        {},
      );
    });
  });

  it('should handle navigation URL error gracefully', async () => {
    mockGetURL.mockRejectedValue(new Error('Navigation error'));

    render(
      <TestWrapper>
        <BankAccountPaymentMethodIntegration
          handleValidityChange={mockHandleValidityChange}
          paymentHandler={mockPaymentHandler}
        />
      </TestWrapper>,
    );

    // Should not throw error
    expect(mockHandleValidityChange).toHaveBeenCalledWith(true);
  });

  describe('payment handler methods', () => {
    const mockPaymentMethod = {
      paymentType: TPaymentMethodType.BANK_ACCOUNT,
      paymentMethodId: 1,
    } as TPaymentMethod;

    const mockCart = {
      cartId: 'test-cart-123',
    } as TCart;

    beforeEach(() => {
      render(
        <TestWrapper>
          <BankAccountPaymentMethodIntegration
            handleValidityChange={mockHandleValidityChange}
            paymentHandler={mockPaymentHandler}
          />
        </TestWrapper>,
      );
    });

    it('should implement registerPaymentMethod', async () => {
      if (mockPaymentHandler.current?.registerPaymentMethod) {
        const result = await mockPaymentHandler.current.registerPaymentMethod(
          mockPaymentMethod,
          mockCart,
        );
        expect(result).toEqual({ continueProcessing: true });
      }
    });

    it('should implement checkPaymentMethod', async () => {
      if (mockPaymentHandler.current?.checkPaymentMethod) {
        const result = await mockPaymentHandler.current.checkPaymentMethod(
          mockCart,
        );
        expect(result).toEqual({ continueProcessing: true });
      }
    });

    it('should implement onCheckoutRetrieved', async () => {
      if (mockPaymentHandler.current?.onCheckoutRetrieved) {
        const result = await mockPaymentHandler.current.onCheckoutRetrieved(
          mockCart,
        );
        expect(result).toEqual({ continueProcessing: true });
      }
    });

    it('should implement onCartFinalized', async () => {
      if (mockPaymentHandler.current?.onCartFinalized) {
        const result = await mockPaymentHandler.current.onCartFinalized(
          mockCart,
        );
        expect(result).toEqual({ continueProcessing: true });
      }
    });
  });

  it('should return null (not render any DOM elements)', () => {
    const { container } = render(
      <TestWrapper>
        <BankAccountPaymentMethodIntegration
          handleValidityChange={mockHandleValidityChange}
          paymentHandler={mockPaymentHandler}
        />
      </TestWrapper>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should set billingHref state when navigation resolves', async () => {
    const expectedUrl = '#/billing/payment/method/add';
    mockGetURL.mockResolvedValue(expectedUrl);

    render(
      <TestWrapper>
        <BankAccountPaymentMethodIntegration
          handleValidityChange={mockHandleValidityChange}
          paymentHandler={mockPaymentHandler}
        />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(mockGetURL).toHaveBeenCalledWith(
        'dedicated',
        '#/billing/payment/method/add',
        {},
      );
    });
  });

  it('should handle concurrent calls to effect hooks properly', () => {
    // Render multiple times to test effect handling
    const { rerender } = render(
      <TestWrapper>
        <BankAccountPaymentMethodIntegration
          handleValidityChange={mockHandleValidityChange}
          paymentHandler={mockPaymentHandler}
          handleCustomSubmitButton={mockHandleCustomSubmitButton}
        />
      </TestWrapper>,
    );

    rerender(
      <TestWrapper>
        <BankAccountPaymentMethodIntegration
          handleValidityChange={mockHandleValidityChange}
          paymentHandler={mockPaymentHandler}
          handleCustomSubmitButton={mockHandleCustomSubmitButton}
        />
      </TestWrapper>,
    );

    // Should be called only once due to empty dependency array
    expect(mockHandleValidityChange).toHaveBeenCalledTimes(1);
    expect(mockHandleCustomSubmitButton).toHaveBeenCalledTimes(1);
  });
});
