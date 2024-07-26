import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import OrderPrice from '@/components/order/price/OrderPrice.component';

describe('OrderPrice component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should display Price component', async () => {
    const mockedPrices = {
      hourly: {
        price: 10,
        tax: 1,
      },
      monthly: {
        price: 10,
        tax: 1,
      },
    };

    render(<OrderPrice showMonthly={false} prices={mockedPrices} />);
    await waitFor(() => {
      expect(screen.getByTestId('order-price-container')).toBeInTheDocument();
      expect(screen.getByTestId('pricing-ht')).toBeInTheDocument();
      expect(screen.getByTestId('pricing-ttc')).toBeInTheDocument();
    });
  });
});
