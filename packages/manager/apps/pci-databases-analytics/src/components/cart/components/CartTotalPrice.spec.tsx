import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CartTotalPrice from './CartTotalPrice.component';
import { Locale } from '@/hooks/useLocale';
import { order } from '@/types/catalog';

vi.mock('@/lib/pricingHelper', () => ({
  usePriceFormatter: ({ currency }: { currency: string }) => (value: number) =>
    `${currency} ${value.toFixed(3)}`,
}));

describe('CartTotalPrice component', () => {
  const defaultProps = {
    text: 'Total',
    price: 99.99,
    locale: Locale.en_GB,
    currency: order.CurrencyCodeEnum.USD,
  };

  it('should render with custom or default text and format price correctly', () => {
    const { rerender } = render(<CartTotalPrice {...defaultProps} />);
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('USD 99.990')).toBeInTheDocument();

    rerender(<CartTotalPrice {...defaultProps} text="Grand Total" />);
    expect(screen.getByText('Grand Total')).toBeInTheDocument();
    expect(screen.queryByText('Total')).not.toBeInTheDocument();

    rerender(
      <CartTotalPrice
        text="Total Amount"
        price={50}
        locale={Locale.fr_FR}
        currency={order.CurrencyCodeEnum.EUR}
      />,
    );
    expect(screen.getByText('EUR 50.000')).toBeInTheDocument();
  });

  it('should conditionally display hourly and monthly prices', () => {
    const { rerender } = render(<CartTotalPrice {...defaultProps} />);
    expect(
      screen.queryByTestId('cart-hourly-total-price'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('cart-monthly-total-price'),
    ).not.toBeInTheDocument();

    rerender(<CartTotalPrice {...defaultProps} displayHourlyPrice />);
    expect(screen.getByTestId('cart-hourly-total-price')).toHaveTextContent(
      'USD 99.990/hour',
    );
    expect(
      screen.queryByTestId('cart-monthly-total-price'),
    ).not.toBeInTheDocument();

    rerender(<CartTotalPrice {...defaultProps} displayMonthlyPrice />);
    expect(
      screen.queryByTestId('cart-hourly-total-price'),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('cart-monthly-total-price')).toHaveTextContent(
      'USD 99.990/month',
    );

    rerender(
      <CartTotalPrice
        {...defaultProps}
        displayHourlyPrice
        displayMonthlyPrice
      />,
    );
    expect(screen.getByTestId('cart-hourly-total-price')).toHaveTextContent(
      'USD 99.990/hour',
    );
    expect(screen.getByTestId('cart-monthly-total-price')).toHaveTextContent(
      'USD 99.990/month',
    );
  });
});
