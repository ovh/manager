import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { mockedServicePrice } from '@/__tests__/helpers/mocks/servicePrice';
import OfferPricing from './OfferPricing.component';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options: Record<string, string | number>): string => {
      return `${key} ${options?.price}`;
    },
  }),
}));

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
vi.mock('@/hooks/useLocale.hook', () => {
  return {
    useLocale: vi.fn(() => 'fr_FR'),
  };
});

describe('OfferPricing component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
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
      expect(screen.getByText('pricing_ht 7 €')).toBeInTheDocument();
      expect(screen.getByText('(pricing_ttc 15 €)')).toBeInTheDocument();
    });
  });
});
