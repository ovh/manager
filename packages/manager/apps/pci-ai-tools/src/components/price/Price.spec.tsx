import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Price from '@/components/price/Price.component';

// vi.mock('react-i18next', () => ({
//   useTranslation: () => ({
//     t: (key: string, options: Record<string, string | number>): string => {
//       if (key === 'pricingInHour') return '';
//       return `${key} ${options.price}`;
//     },
//   }),
//   Trans: ({ children }: { children: React.ReactNode }) => children,
// }));
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

describe('Price component renders', () => {
  it('should display the 2 span', () => {
    render(
      <Price
        priceInUcents={1000000000}
        taxInUcents={2000000}
        decimals={2}
        displayInHour={true}
      />,
    );
    expect(screen.getByTestId('pricing-ht')).toBeTruthy();
    expect(screen.getByTestId('pricing-ttc')).toBeTruthy();
  });
});

describe('Price component value', () => {
  it('should display price with tax', () => {
    render(
      <Price
        priceInUcents={1000000000}
        taxInUcents={200000000}
        decimals={2}
        displayInHour={true}
      />,
    );
    expect(screen.getByTestId('pricing-ht').textContent).toBe('pricingHt');
    expect(screen.getByTestId('pricing-ttc').textContent).toStrictEqual(
      '(pricingTtc)',
    );
  });
});
