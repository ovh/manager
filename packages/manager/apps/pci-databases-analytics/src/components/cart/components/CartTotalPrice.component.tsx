import { usePriceFormatter } from '@/lib/pricingHelper';
import { Locale } from '@/hooks/useLocale';
import { order } from '@/types/catalog';

interface CartTotalPriceProps {
  price: number;
  text: string;
  displayHourlyPrice?: boolean;
  displayMonthlyPrice?: boolean;
  locale: Locale;
  currency: order.CurrencyCodeEnum;
}

const CartTotalPrice = ({
  price,
  text,
  displayHourlyPrice,
  displayMonthlyPrice,
  locale,
  currency,
}: CartTotalPriceProps) => {
  const priceFormatter = usePriceFormatter({ locale, currency, decimals: 3 });

  return (
    <div data-testid="cart-total-price">
      <div className="flex justify-between pt-4">
        <h5 className="self-end">{text}</h5>
        <h3>{priceFormatter(price)}</h3>
      </div>
      <div className="flex flex-col items-end">
        {displayHourlyPrice && (
          <p data-testid="cart-hourly-total-price">
            {priceFormatter(price)}/hour
          </p>
        )}
        {displayMonthlyPrice && (
          <p data-testid="cart-monthly-total-price">
            {priceFormatter(price)}/month
          </p>
        )}
      </div>
    </div>
  );
};

export default CartTotalPrice;
