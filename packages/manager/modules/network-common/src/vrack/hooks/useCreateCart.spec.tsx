import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Contract } from '@ovh-ux/manager-module-order';
import { useCreateVrackServicesCart } from './useCreateVrackServicesCart';
import { createVrackServicesCart } from '../../vrack/utils/cart';
import '@testing-library/jest-dom';

vi.mock('../../vrack/utils/cart', async () => {
  const actual = await vi.importActual<typeof import('../../vrack/utils/cart')>(
    '../../vrack/utils/cart',
  );
  return {
    ...actual,
    createVrackServicesCart: vi.fn(),
  };
});

vi.mock('../index', async () => {
  const actual = await vi.importActual<typeof import('../index')>('../index');
  return {
    ...actual,
  };
});

const queryClient = new QueryClient();
const useSendOrder = vi.fn().mockReturnValue({
  sendOrder: vi.fn(),
  isPending: false,
  isError: false,
  sendOrderState: null,
  error: undefined,
  data: undefined,
});

const TestComponent = () => {
  const {
    createCart,
    isPending,
    isError,
    error,
    data,
  } = useCreateVrackServicesCart(useSendOrder);

  const handleCreateCart = () => {
    createCart({ region: 'EU', ovhSubsidiary: 'FR' });
  };

  return (
    <div>
      <button onClick={handleCreateCart}>Create Cart</button>
      {isPending && <p>Creating Cart...</p>}
      {isError && <p>Error: {error?.message}</p>}
      {data && <p>Cart Created: {data.cartId}</p>}
    </div>
  );
};

describe('useCreateVrackServicesCart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    queryClient.clear();

    vi.mocked(useSendOrder).mockReturnValue({
      sendOrder: vi.fn(),
      isPending: false,
      isError: false,
      sendOrderState: null,
      error: undefined,
      data: undefined,
    });
  });

  it('should successfully create a cart and call sendOrder when necessary', async () => {
    const mockCreateCartResponse = { cartId: 'cart-id', contractList: [] };
    const mockSendOrder = vi.fn().mockResolvedValue({});

    vi.mocked(createVrackServicesCart).mockResolvedValue(
      mockCreateCartResponse,
    );
    vi.mocked(useSendOrder).mockReturnValue({
      sendOrder: mockSendOrder,
      isPending: false,
      isError: false,
      sendOrderState: null,
      error: undefined,
      data: undefined,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('Create Cart'));

    await waitFor(() => screen.getByText('Cart Created: cart-id'));

    expect(createVrackServicesCart).toHaveBeenCalledWith({
      region: 'EU',
      ovhSubsidiary: 'FR',
    });
    expect(mockSendOrder).toHaveBeenCalledWith({ cartId: 'cart-id' });
    expect(screen.getByText('Cart Created: cart-id')).toBeInTheDocument();
  });

  it('should handle error when createCart fails', async () => {
    const mockError = new Error('Failed to create cart');
    vi.mocked(createVrackServicesCart).mockRejectedValue(mockError);

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('Create Cart'));

    await waitFor(() => screen.getByText(`Error: ${mockError.message}`));

    expect(screen.getByText(`Error: ${mockError.message}`)).toBeInTheDocument();
  });

  it('should show loading state while the cart is being created', async () => {
    vi.mocked(createVrackServicesCart).mockResolvedValue({
      cartId: 'cart-id',
      contractList: [],
    });
    vi.mocked(useSendOrder).mockReturnValue({
      sendOrder: vi.fn().mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({ data: {} });
            }, 30000000);
          }),
      ),

      isPending: true,
      isError: false,
      sendOrderState: null,
      error: undefined,
      data: undefined,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('Create Cart'));
    await waitFor(() => screen.getByText('Creating Cart...'));
    expect(screen.getByText('Creating Cart...')).toBeInTheDocument();
  });

  it('should call sendOrder only if contractList is empty', async () => {
    const mockCreateCartResponse = { cartId: 'cart-id', contractList: [] };
    const mockSendOrder = vi.fn().mockResolvedValue({});
    vi.mocked(createVrackServicesCart).mockResolvedValue(
      mockCreateCartResponse,
    );
    vi.mocked(useSendOrder).mockReturnValue({
      sendOrder: mockSendOrder,
      isPending: false,
      isError: false,
      sendOrderState: null,
      error: undefined,
      data: undefined,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('Create Cart'));

    await waitFor(() => screen.getByText('Cart Created: cart-id'));

    expect(mockSendOrder).toHaveBeenCalledWith({ cartId: 'cart-id' });
  });

  it('should not call sendOrder if contractList is not empty', async () => {
    const mockCreateCartResponse = {
      cartId: 'cart-id',
      contractList: ['contract-1'],
    };
    const mockSendOrder = vi.fn().mockResolvedValue({});
    vi.mocked(createVrackServicesCart).mockResolvedValue({
      cartId: 'cart-id',
      contractList: [('contract-1' as unknown) as Contract],
    });
    vi.mocked(useSendOrder).mockReturnValue({
      sendOrder: mockSendOrder,
      isPending: false,
      isError: false,
      sendOrderState: null,
      error: undefined,
      data: undefined,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('Create Cart'));

    await waitFor(() => screen.getByText('Cart Created: cart-id'));

    expect(mockSendOrder).not.toHaveBeenCalled();
  });
});
