import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import OrderPrice from './OrderPrice.component';
import { mockedPricing } from '@/__tests__/helpers/mocks/catalog/catalog';

describe('OrderPrice component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  vi.mock('@/data/hooks/catalog/useGetCatalog.hook', () => {
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

  it('should display OrderPrice Component', async () => {
    render(
      <OrderPrice minuteConverter={60} quantity={1} price={mockedPricing} />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('order-price-container')).toBeInTheDocument();
      expect(screen.getByTestId('pricing-ttc')).toBeInTheDocument();
      expect(screen.getByTestId('pricing-ht')).toBeInTheDocument();
    });
  });
});
