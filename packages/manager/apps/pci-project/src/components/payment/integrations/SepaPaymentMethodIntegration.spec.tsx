import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SepaPaymentMethodIntegration from './SepaPaymentMethodIntegration';
import {
  TPaymentMethodIntegrationRef,
  TPaymentMethod,
  TPaymentMethodType,
  TRegisterPaymentMethod,
} from '@/data/types/payment/payment-method.type';
import { TCart } from '@/data/types/payment/cart.type';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('SepaPaymentMethodIntegration', () => {
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
    // Mock window.top for redirect functionality
    Object.defineProperty(window, 'top', {
      value: { location: { href: '' } },
      writable: true,
    });
  });

  it('should render without crashing', () => {
    render(
      <TestWrapper>
        <SepaPaymentMethodIntegration
          handleValidityChange={mockHandleValidityChange}
          paymentHandler={mockPaymentHandler}
        />
      </TestWrapper>,
    );
  });

  it('should call handleValidityChange with true on mount', () => {
    render(
      <TestWrapper>
        <SepaPaymentMethodIntegration
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
        <SepaPaymentMethodIntegration
          handleValidityChange={mockHandleValidityChange}
          paymentHandler={mockPaymentHandler}
          handleCustomSubmitButton={mockHandleCustomSubmitButton}
        />
      </TestWrapper>,
    );

    expect(mockHandleCustomSubmitButton).toHaveBeenCalledWith(
      'pci_project_new_payment_btn_continue_sepa_direct_debit',
    );
  });

  it('should not call handleCustomSubmitButton when not provided', () => {
    render(
      <TestWrapper>
        <SepaPaymentMethodIntegration
          handleValidityChange={mockHandleValidityChange}
          paymentHandler={mockPaymentHandler}
        />
      </TestWrapper>,
    );

    expect(mockHandleCustomSubmitButton).not.toHaveBeenCalled();
  });

  it('should return null (not render any DOM elements)', () => {
    const { container } = render(
      <TestWrapper>
        <SepaPaymentMethodIntegration
          handleValidityChange={mockHandleValidityChange}
          paymentHandler={mockPaymentHandler}
        />
      </TestWrapper>,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should handle concurrent calls to effect hooks properly', () => {
    // Render multiple times to test effect handling
    const { rerender } = render(
      <TestWrapper>
        <SepaPaymentMethodIntegration
          handleValidityChange={mockHandleValidityChange}
          paymentHandler={mockPaymentHandler}
          handleCustomSubmitButton={mockHandleCustomSubmitButton}
        />
      </TestWrapper>,
    );

    rerender(
      <TestWrapper>
        <SepaPaymentMethodIntegration
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

  describe('payment handler methods', () => {
    const mockPaymentMethod = {
      paymentType: TPaymentMethodType.SEPA_DIRECT_DEBIT,
      paymentMethodId: 1,
    } as TPaymentMethod;

    const mockCart = {
      cartId: 'test-cart-123',
    } as TCart;

    beforeEach(() => {
      render(
        <TestWrapper>
          <SepaPaymentMethodIntegration
            handleValidityChange={mockHandleValidityChange}
            paymentHandler={mockPaymentHandler}
          />
        </TestWrapper>,
      );
    });

    describe('registerPaymentMethod', () => {
      it('should return continueProcessing: true when no registerPaymentMethod URL provided', async () => {
        if (mockPaymentHandler.current?.registerPaymentMethod) {
          const result = await mockPaymentHandler.current.registerPaymentMethod(
            mockPaymentMethod,
            mockCart,
          );
          expect(result).toEqual({ continueProcessing: true });
        }
      });

      it('should return continueProcessing: true when no window.top available', async () => {
        Object.defineProperty(window, 'top', {
          value: null,
          writable: true,
        });

        const mockRegisterPaymentMethod = {
          url: 'https://example.com/sepa-redirect',
        } as TRegisterPaymentMethod;

        if (mockPaymentHandler.current?.registerPaymentMethod) {
          const result = await mockPaymentHandler.current.registerPaymentMethod(
            mockPaymentMethod,
            mockCart,
            mockRegisterPaymentMethod,
          );
          expect(result).toEqual({ continueProcessing: true });
        }
      });

      it('should redirect to registerPaymentMethod URL when available', async () => {
        const mockRegisterPaymentMethod = {
          url: 'https://example.com/sepa-redirect',
        } as TRegisterPaymentMethod;

        const mockWindowTop = {
          location: { href: '' },
        };

        Object.defineProperty(window, 'top', {
          value: mockWindowTop,
          writable: true,
        });

        if (mockPaymentHandler.current?.registerPaymentMethod) {
          const result = await mockPaymentHandler.current.registerPaymentMethod(
            mockPaymentMethod,
            mockCart,
            mockRegisterPaymentMethod,
          );

          expect(mockWindowTop.location.href).toBe(
            'https://example.com/sepa-redirect',
          );
          expect(result).toEqual({ continueProcessing: false });
        }
      });
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
});
