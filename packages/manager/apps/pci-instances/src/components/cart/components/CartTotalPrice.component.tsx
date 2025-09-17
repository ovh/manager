import { useCatalogPrice } from '@ovh-ux/manager-react-components';
import { Text } from '@ovhcloud/ods-react';

type TCartTotalPriceProps = {
  price: number;
  text?: string;
  displayHourlyPrice?: boolean;
  displayMonthlyPrice?: boolean;
};

// TODO: add "total" translation in common-translations
export const CartTotalPrice = ({
  text,
  price,
  displayHourlyPrice,
  displayMonthlyPrice,
}: TCartTotalPriceProps) => {
  const {
    getTextPrice,
    getFormattedHourlyCatalogPrice,
    getFormattedMonthlyCatalogPrice,
  } = useCatalogPrice();

  return (
    <div data-testid="cart-total-price">
      <div className="flex justify-between pt-7">
        <Text preset="heading-5" className="self-end">
          {text ?? 'Total'}
        </Text>
        <Text preset="heading-3">{getTextPrice(price)}</Text>
      </div>
      <div className="flex flex-col items-end">
        {displayHourlyPrice && (
          <Text data-testid="cart-hourly-total-price">
            {getFormattedHourlyCatalogPrice(price)}
          </Text>
        )}
        {displayMonthlyPrice && (
          <Text data-testid="cart-monthly-total-price">
            {getFormattedMonthlyCatalogPrice(price)}
          </Text>
        )}
      </div>
    </div>
  );
};
