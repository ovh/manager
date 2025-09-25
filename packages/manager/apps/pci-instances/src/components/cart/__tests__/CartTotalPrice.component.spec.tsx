import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { CartTotalPrice } from '../components';

vi.mock('@ovh-ux/manager-react-components', () => ({
  useCatalogPrice: vi.fn().mockReturnValue({
    getTextPrice: vi.fn((price: number) => `${price}`),
    getFormattedHourlyCatalogPrice: vi.fn(),
    getFormattedMonthlyCatalogPrice: vi.fn(),
  }),
}));

const totalPriceText = 'Items Total Price';
const totalPriceValue = 50;

describe('Considering CartTotalPrice component', () => {
  test('Should render total prices', () => {
    render(
      <CartTotalPrice
        price={totalPriceValue}
        text={totalPriceText}
        displayHourlyPrice
        displayMonthlyPrice
      />,
    );

    const cartTotalPriceElement = screen.getByTestId('cart-total-price');
    const cartHourlyTotalPriceElement = screen.getByTestId(
      'cart-hourly-total-price',
    );
    const cartMonthlyTotalPriceElement = screen.getByTestId(
      'cart-monthly-total-price',
    );

    expect(cartTotalPriceElement).toBeInTheDocument();
    expect(cartTotalPriceElement).toHaveTextContent(totalPriceText);
    expect(cartTotalPriceElement).toHaveTextContent(`${totalPriceValue}`);

    expect(cartHourlyTotalPriceElement).toBeInTheDocument();
    expect(cartMonthlyTotalPriceElement).toBeInTheDocument();
  });
});
