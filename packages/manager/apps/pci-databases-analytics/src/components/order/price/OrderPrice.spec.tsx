import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import OrderPrice from '@/components/order/price/OrderPrice.component';

describe('OrderPrice component', () => {
  beforeEach(() => {
    vi.mock('@/hooks/api/catalog/useGetCatalog.hook', () => {
      return {
        useGetCatalog: vi.fn(() => ({
          isSuccess: true,
          data: {
            locale: {
              currencyCode: 'EUR',
            },
          },
        })),
      };
    });
    vi.mock('@/hooks/useLocale', () => {
      return {
        useLocale: vi.fn(() => 'fr_FR'),
      };
    });
  });
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
