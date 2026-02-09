import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { CartTotalPrice } from '../components';

vi.mock('@ovh-ux/muk', () => ({
  useCatalogPrice: () => ({
    getTextPrice: (price: number) => `${(price / 100).toFixed(4)} €`,
  }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const hourlyTotalValue = 5000;
const monthlyTotalValue = 36000;

describe('Considering CartTotalPrice component', () => {
  test('Should render hourly and monthly totals in hourly mode', () => {
    render(
      <CartTotalPrice
        hourlyTotal={hourlyTotalValue}
        monthlyTotal={monthlyTotalValue}
        billingType={'hourly'}
      />,
    );

    const cartTotalPriceElement = screen.getByTestId('cart-total-price');
    const cartHourlyTotalPriceElement = screen.getByTestId('cart-hourly-total-price');
    const cartMonthlyTotalPriceElement = screen.getByTestId('cart-monthly-total-price');

    expect(cartTotalPriceElement).toBeInTheDocument();
    expect(cartHourlyTotalPriceElement).toBeInTheDocument();
    expect(cartMonthlyTotalPriceElement).toBeInTheDocument();

    expect(cartTotalPriceElement).toHaveTextContent('50.0000 €');
    expect(cartTotalPriceElement).toHaveTextContent('360.0000 €');
  });

  test('Should render only monthly total in monthly mode', () => {
    render(
      <CartTotalPrice
        hourlyTotal={null}
        monthlyTotal={monthlyTotalValue}
        billingType={'monthly'}
      />,
    );

    const cartTotalPriceElement = screen.getByTestId('cart-total-price');
    const cartMonthlyTotalPriceElement = screen.getByTestId('cart-monthly-total-price');

    expect(cartTotalPriceElement).toBeInTheDocument();
    expect(cartMonthlyTotalPriceElement).toBeInTheDocument();

    expect(screen.queryByTestId('cart-hourly-total-price')).not.toBeInTheDocument();

    expect(cartTotalPriceElement).toHaveTextContent('360.0000 €');
  });
});
