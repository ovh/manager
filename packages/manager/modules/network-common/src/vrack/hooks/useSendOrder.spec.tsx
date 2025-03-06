import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { postOrderCartCartIdCheckout } from '@ovh-ux/manager-module-order';
import { useSendOrder, SendOrderState } from './useSendOrder';

// Mock the necessary functions
vi.mock('@ovh-ux/manager-module-order', () => ({
  postOrderCartCartIdCheckout: vi.fn(),
}));

const queryClient = new QueryClient();

const TestComponent = ({ cartId, onSuccess, onError }: any) => {
  const {
    sendOrder,
    isPending,
    sendOrderState,
    error,
    isError,
  } = useSendOrder();

  const handleSendOrder = () => {
    sendOrder({ cartId, onSuccess, onError });
  };

  return (
    <div>
      <button onClick={handleSendOrder}>Send Order</button>
      {isPending && <p>Processing Order...</p>}
      {isError && <p>Error: {error?.message}</p>}
      {sendOrderState === SendOrderState.DONE && <p>Order Sent Successfully</p>}
      {sendOrderState === SendOrderState.ERROR && <p>Order Failed</p>}
    </div>
  );
};

describe('useSendOrder', () => {
  it('should successfully create an order', async () => {
    const mockOnSuccess = vi.fn();
    const mockResponse: any = {
      data: {
        contracts: [],
        details: [],
        orderId: 0,
        prices: {
          originalWithoutTax: {
            currencyCode: 'AUD',
            text: '',
            priceInUcents: 0,
            value: 0,
          },
          reduction: {
            currencyCode: 'AUD',
            text: '',
            priceInUcents: 0,
            value: 0,
          },
          tax: {
            currencyCode: 'AUD',
            text: '',
            priceInUcents: 0,
            value: 0,
          },
          withTax: {
            currencyCode: 'AUD',
            text: '',
            priceInUcents: 0,
            value: 0,
          },
          withoutTax: {
            currencyCode: 'AUD',
            text: '',
            priceInUcents: 0,
            value: 0,
          },
        },
        url: '',
      },
      status: 0,
      statusText: '',
      headers: undefined,
      config: undefined,
    };

    vi.mocked(postOrderCartCartIdCheckout).mockResolvedValue(mockResponse);

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent
          cartId="cart-id"
          onSuccess={mockOnSuccess}
          onError={vi.fn()}
        />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('Send Order'));

    await waitFor(() => screen.getByText('Order Sent Successfully'));

    expect(postOrderCartCartIdCheckout).toHaveBeenCalledWith({
      cartId: 'cart-id',
      autoPayWithPreferredPaymentMethod: true,
      waiveRetractationPeriod: true,
    });
    expect(mockOnSuccess).toHaveBeenCalledWith(mockResponse);
    expect(screen.getByText('Order Sent Successfully')).toBeInTheDocument();
  });

  it('should handle error with status 400 and try again with different parameters', async () => {
    const mockResponse = {
      data: { id: 'order-id', url: 'https://redirect.url' },
    };
    const mockOnSuccess = vi.fn();
    const mockOnError = vi.fn();

    vi.mocked(postOrderCartCartIdCheckout).mockRejectedValueOnce({
      request: { status: 400 },
    });
    vi.mocked(postOrderCartCartIdCheckout).mockResolvedValueOnce({
      data: {
        url: 'https://redirect.url',
        contracts: [],
        details: [],
        orderId: 0,
        prices: {
          originalWithoutTax: {
            currencyCode: 'AUD',
            text: '',
            priceInUcents: 0,
            value: 0,
          },
          reduction: {
            currencyCode: 'AUD',
            text: '',
            priceInUcents: 0,
            value: 0,
          },
          tax: {
            currencyCode: 'AUD',
            text: '',
            priceInUcents: 0,
            value: 0,
          },
          withTax: {
            currencyCode: 'AUD',
            text: '',
            priceInUcents: 0,
            value: 0,
          },
          withoutTax: {
            currencyCode: 'AUD',
            text: '',
            priceInUcents: 0,
            value: 0,
          },
        },
      },
      status: 0,
      statusText: '',
      headers: undefined,
      config: undefined,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent
          cartId="cart-id"
          onSuccess={mockOnSuccess}
          onError={mockOnError}
        />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('Send Order'));

    await waitFor(() => screen.getByText('Order Sent Successfully'));

    expect(postOrderCartCartIdCheckout).toHaveBeenCalledWith({
      cartId: 'cart-id',
      autoPayWithPreferredPaymentMethod: true,
      waiveRetractationPeriod: true,
    });
    expect(postOrderCartCartIdCheckout).toHaveBeenCalledWith({
      cartId: 'cart-id',
      autoPayWithPreferredPaymentMethod: false,
      waiveRetractationPeriod: true,
    });
    expect(mockOnSuccess).toHaveBeenCalledWith(mockResponse);
    expect(screen.getByText('Order Sent Successfully')).toBeInTheDocument();
  });

  it('should handle general error and show failure state', async () => {
    const mockError = new Error('Order Failed');
    const mockOnError = vi.fn();

    vi.mocked(postOrderCartCartIdCheckout).mockRejectedValueOnce(mockError);

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent
          cartId="cart-id"
          onSuccess={vi.fn()}
          onError={mockOnError}
        />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('Send Order'));

    await waitFor(() => screen.getByText('Order Failed'));

    expect(mockOnError).toHaveBeenCalledWith(mockError);
    expect(screen.getByText('Order Failed')).toBeInTheDocument();
  });

  it('should show loading state while processing the order', async () => {
    const mockOnSuccess = vi.fn();

    vi.mocked(postOrderCartCartIdCheckout).mockResolvedValueOnce({
      data: {
        contracts: [],
        details: [],
        orderId: 0,
        prices: {
          originalWithoutTax: {
            currencyCode: 'AUD',
            text: '',
            priceInUcents: 0,
            value: 0,
          },
          reduction: {
            currencyCode: 'AUD',
            text: '',
            priceInUcents: 0,
            value: 0,
          },
          tax: {
            currencyCode: 'AUD',
            text: '',
            priceInUcents: 0,
            value: 0,
          },
          withTax: {
            currencyCode: 'AUD',
            text: '',
            priceInUcents: 0,
            value: 0,
          },
          withoutTax: {
            currencyCode: 'AUD',
            text: '',
            priceInUcents: 0,
            value: 0,
          },
        },
        url: '',
      },
      status: 0,
      statusText: '',
      headers: undefined,
      config: undefined,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent
          cartId="cart-id"
          onSuccess={mockOnSuccess}
          onError={vi.fn()}
        />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('Send Order'));

    expect(screen.getByText('Processing Order...')).toBeInTheDocument();
  });
});
