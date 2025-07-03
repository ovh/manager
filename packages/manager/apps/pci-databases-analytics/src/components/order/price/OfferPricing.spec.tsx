import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { mockedServicePrice } from '@/__tests__/helpers/mocks/servicePrice';
import OfferPricing from './OfferPricing.component';

describe('OfferPricing component', () => {
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

  it('should display Offer Pricing component', async () => {
    render(<OfferPricing prices={mockedServicePrice} />);
    await waitFor(() => {
      expect(screen.getByTestId('table-price-container')).toBeInTheDocument();
    });
  });
  it('should display Price component with montly values', async () => {
    render(<OfferPricing prices={mockedServicePrice} />);
    await waitFor(() => {
      expect(screen.getByTestId('table-price-container')).toBeInTheDocument();
      expect(screen.getByText('pricing_ht 10 €')).toBeInTheDocument();
      expect(screen.getByText('(pricing_ttc 20 €)')).toBeInTheDocument();
    });
  });
});
