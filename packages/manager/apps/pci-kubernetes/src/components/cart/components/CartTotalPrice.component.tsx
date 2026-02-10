import { useTranslation } from 'react-i18next';

import { Divider, Text } from '@ovhcloud/ods-react';

import { convertHourlyPriceToMonthly, useCatalogPrice } from '@ovh-ux/manager-react-components';

type TCartTotalPriceProps = {
  price: number;
  text?: string;
  displayMonthlyPrice?: boolean;
};

export const CartTotalPrice = ({
  text,
  price,

  displayMonthlyPrice,
}: TCartTotalPriceProps) => {
  const { t } = useTranslation(['add', 'order-price']);
  const { getTextPrice } = useCatalogPrice();

  const exclVatMonthlyLabel = `${t('order-price:order_catalog_price_tax_excl_label', { price: '' })} / ${t('order-price:order_catalog_price_interval_month')}`;
  const exclVatHourlyLabel = `${t('order-price:order_catalog_price_tax_excl_label', { price: '' })} / ${t('order-price:order_catalog_price_interval_hour')}`;

  return (
    <div data-testid="cart-total-price">
      <div className="flex justify-between pt-7">
        <Text preset="heading-5" className="self-end">
          {text ?? t('add:kube_add_cart_total_price')}
        </Text>
        <Text preset="heading-3">{getTextPrice(price)}</Text>
      </div>
      <div className="flex flex-col items-end">
        <Text preset="caption" data-testid="cart-hourly-total-price">
          {exclVatHourlyLabel}
        </Text>
      </div>
      {displayMonthlyPrice && (
        <>
          <Divider spacing="32" />
          <div className="flex justify-between" data-testid="cart-monthly-total-price">
            <Text className="font-semibold">{t('add:kube_add_cart_monthly_price')}</Text>
            <div>
              <Text className="font-bold">{getTextPrice(convertHourlyPriceToMonthly(price))}</Text>
              <Text preset="caption">{exclVatMonthlyLabel}</Text>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
