import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { createVrackOnlyCart } from '../utils/cart';
import { useCreateCartWithVrack } from './useCreateCartWithVrack';

vi.mock('../utils/cart', async () => {
  const actual = await vi.importActual<typeof import('../utils/cart')>('../utils/cart');
  return {
    ...actual,
    createVrackOnlyCart: vi.fn(),
  };
});

const queryClient = new QueryClient();

const TestComponent = ({ ovhSubsidiary }: { ovhSubsidiary: string }) => {
  const { createCart, isPending, isError, error, data } = useCreateCartWithVrack(ovhSubsidiary);

  const handleCreateCart = () => {
    createCart();
  };

  return (
    <div>
      <button onClick={handleCreateCart}>Create Vrack Cart</button>
      {isPending && <p>Creating Cart...</p>}
      {isError && <p>Error: {error?.message}</p>}
      {data && <p>Cart Created: {data.cartId}</p>}
    </div>
  );
};

describe('useCreateCartWithVrack', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    queryClient.clear();
  });

  it('should successfully create a cart', async () => {
    vi.mocked(createVrackOnlyCart).mockResolvedValue({
      cartId: 'cart-id',
      contractList: [],
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent ovhSubsidiary="FR" />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('Create Vrack Cart'));

    await waitFor(() => screen.getByText('Cart Created: cart-id'));

    expect(createVrackOnlyCart).toHaveBeenCalledWith('FR');
    expect(screen.getByText('Cart Created: cart-id')).toBeInTheDocument();
  });

  it('should handle error when createCart fails', async () => {
    const mockError = new Error('Failed to create cart');
    vi.mocked(createVrackOnlyCart).mockRejectedValue(mockError);

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent ovhSubsidiary="FR" />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('Create Vrack Cart'));

    await waitFor(() => screen.getByText(`Error: ${mockError.message}`));

    expect(screen.getByText(`Error: ${mockError.message}`)).toBeInTheDocument();
  });

  it('should show loading state while the cart is being created', async () => {
    vi.mocked(createVrackOnlyCart).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            return resolve({
              cartId: 'cart-id',
              contractList: [],
            });
          }, 30000000);
        }),
    );

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent ovhSubsidiary="FR" />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('Create Vrack Cart'));
    await waitFor(() => screen.getByText('Creating Cart...'));
    expect(screen.getByText('Creating Cart...')).toBeInTheDocument();
  });
});
