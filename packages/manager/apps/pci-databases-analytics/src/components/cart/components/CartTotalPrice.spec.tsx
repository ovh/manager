import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CartTotalPrice from './CartTotalPrice.component';
import { order } from '@/types/catalog';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, string | number>): string => {
      return `${key} ${options?.price}`;
    },
  }),
}));
vi.mock('@/hooks/usePriceFormatter.hook', () => ({
  usePriceFormatter: ({ currency }: { currency: string }) => (value: number) =>
    `${currency} ${value.toFixed(3)}`,
}));
vi.mock('@/hooks/useLocale', () => ({
  useLocale: () => 'en_GB',
}));

describe('CartTotalPrice', () => {
  it('should render hourly and monthly prices with correct formatting', () => {
    render(
      <CartTotalPrice
        price={1.5}
        priceWithTax={1.8}
        currency={order.CurrencyCodeEnum.EUR}
      />,
    );

    expect(screen.getByTestId('cart-total-price')).toBeInTheDocument();
    expect(screen.getByText('total_hour_label undefined')).toBeInTheDocument();
    expect(screen.getByText('pricing_ht EUR 1.500')).toBeInTheDocument();
    expect(screen.getByText('pricing_ttc EUR 1.800')).toBeInTheDocument();
  });

  it('should calculate monthly estimates correctly using hourly to monthly factor', () => {
    const hourlyPrice = 2.0;
    const hourlyPriceWithTax = 2.4;

    render(
      <CartTotalPrice
        price={hourlyPrice}
        priceWithTax={hourlyPriceWithTax}
        currency={order.CurrencyCodeEnum.USD}
      />,
    );

    expect(
      screen.getByText('estimated_month_label undefined'),
    ).toBeInTheDocument();
    // Monthly estimates should be hourly price * 730 (hourlyToMonthlyFactor)
    expect(screen.getByText('pricing_ht USD 1460.000')).toBeInTheDocument();
    expect(screen.getByText('pricing_ttc USD 1752.000')).toBeInTheDocument();
  });
});
