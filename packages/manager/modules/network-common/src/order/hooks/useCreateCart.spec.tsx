import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { Contract } from '@ovh-ux/manager-module-order';

import { createVrackServicesCart } from '../utils/cart';
import { useCreateVrackServicesCart } from './useCreateVrackServicesCart';
import { SendOrderState, useSendOrder } from './useSendOrder';

vi.mock('../utils/cart', async () => {
  const actual = await vi.importActual<typeof import('../utils/cart')>('../utils/cart');
  return {
    ...actual,
    createVrackServicesCart: vi.fn(),
  };
});

vi.mock('./useSendOrder', () => ({
  useSendOrder: vi.fn().mockReturnValue({
    sendOrder: vi.fn(),
    isPending: false,
    isError: false,
    sendOrderState: null,
    error: undefined,
    data: undefined,
  }),
}));

const queryClient = new QueryClient();

const TestComponent = () => {
  const { createCart, isPending, isError, error, data } = useCreateVrackServicesCart();

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
      sendOrderState: {} as SendOrderState,
      error: null,
      data: undefined,
    });
  });

  it('should successfully create a cart and call sendOrder when necessary', async () => {
    const mockCreateCartResponse = { cartId: 'cart-id', contractList: [] };
    const mockSendOrder = vi.fn().mockResolvedValue({});

    vi.mocked(createVrackServicesCart).mockResolvedValue(mockCreateCartResponse);
    vi.mocked(useSendOrder).mockReturnValue({
      sendOrder: mockSendOrder,
      isPending: false,
      isError: false,
      sendOrderState: {} as SendOrderState,
      error: null,
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
      sendOrderState: {} as SendOrderState,
      error: null,
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
    vi.mocked(createVrackServicesCart).mockResolvedValue(mockCreateCartResponse);
    vi.mocked(useSendOrder).mockReturnValue({
      sendOrder: mockSendOrder,
      isPending: false,
      isError: false,
      sendOrderState: {} as SendOrderState,
      error: null,
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
    const mockSendOrder = vi.fn().mockResolvedValue({});
    vi.mocked(createVrackServicesCart).mockResolvedValue({
      cartId: 'cart-id',
      contractList: ['contract-1' as unknown as Contract],
    });
    vi.mocked(useSendOrder).mockReturnValue({
      sendOrder: mockSendOrder,
      isPending: false,
      isError: false,
      sendOrderState: {} as SendOrderState,
      error: null,
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
