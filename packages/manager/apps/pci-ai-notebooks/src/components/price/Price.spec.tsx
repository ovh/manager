import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Price from '@/components/price/Price.component';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options: Record<string, string | number>): string => {
      return `${key} ${options.price}`;
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

describe('Price component renders', () => {
  it('should display the 2 span', () => {
    render(
      <Price priceInUcents={1000000000} taxInUcents={2000000} decimals={2} />,
    );
    expect(screen.getByTestId('pricing-ht')).toBeInTheDocument();
    expect(screen.getByTestId('pricing-ttc')).toBeInTheDocument();
  });
});

describe('Price component value', () => {
  it('should display price with tax', () => {
    render(
      <Price priceInUcents={1000000000} taxInUcents={200000000} decimals={2} />,
    );
    expect(screen.getByTestId('pricing-ht')).toHaveTextContent(
      'pricing_ht 600,00 €',
    );
    expect(screen.getByTestId('pricing-ttc')).toHaveTextContent(
      '(pricing_ttc 720,00 €)',
    );
  });

  it('should display price without tax', () => {
    render(<Price priceInUcents={1000000000} taxInUcents={0} decimals={2} />);
    expect(screen.getByTestId('pricing-ht')).toHaveTextContent(
      'pricing_ht 600,00 €',
    );
    expect(screen.getByTestId('pricing-ttc')).toHaveTextContent(
      '(pricing_ttc 600,00 €)',
    );
  });

  it('should display price with 3 decimals', () => {
    render(
      <Price priceInUcents={1000000000} taxInUcents={200000000} decimals={3} />,
    );
    expect(screen.getByTestId('pricing-ht')).toHaveTextContent(
      'pricing_ht 600,000 €',
    );
    expect(screen.getByTestId('pricing-ttc')).toHaveTextContent(
      '(pricing_ttc 720,000 €)',
    );
  });

  it('should display 0,00 when given 0', () => {
    render(<Price priceInUcents={0} taxInUcents={0} decimals={2} />);
    expect(screen.getByTestId('pricing-ht')).toHaveTextContent(
      'pricing_ht 0,00 €',
    );
    expect(screen.getByTestId('pricing-ttc')).toHaveTextContent(
      '(pricing_ttc 0,00 €)',
    );
  });
});
