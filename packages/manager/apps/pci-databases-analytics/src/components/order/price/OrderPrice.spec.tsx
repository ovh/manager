import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import OrderPrice from '@/components/order/price/OrderPrice.component';

describe('OrderPrice component', () => {
  const mockedPrices = {
    hourly: {
      price: 1000500,
      tax: 1005000,
    },
    monthly: {
      price: 1000050000,
      tax: 1000500000,
    },
  };
  beforeEach(() => {
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string, options: Record<string, string | number>): string => {
          return `${key} ${options?.price}`;
        },
      }),
      Trans: ({ children }: { children: React.ReactNode }) => children,
    }));
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
    render(<OrderPrice showMonthly={false} prices={mockedPrices} />);
    await waitFor(() => {
      expect(screen.getByTestId('order-price-container')).toBeInTheDocument();
      expect(screen.getByTestId('pricing-ht')).toBeInTheDocument();
      expect(screen.getByTestId('pricing-ttc')).toBeInTheDocument();
    });
  });
  it('should display Price component with montly values', async () => {
    render(<OrderPrice showMonthly={true} prices={mockedPrices} />);
    await waitFor(() => {
      expect(screen.getByTestId('order-price-container')).toBeInTheDocument();
      expect(screen.getByTestId('pricing-ht')).toBeInTheDocument();
      expect(screen.getByText('pricing_ht 10,00 €')).toBeInTheDocument();
      expect(screen.getByText('(pricing_ttc 20,01 €)')).toBeInTheDocument();
    });
  });
});
