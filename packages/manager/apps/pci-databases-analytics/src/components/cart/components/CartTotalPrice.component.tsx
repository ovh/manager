import { useTranslation } from 'react-i18next';
import { Separator } from '@datatr-ux/uxlib';
import { hourlyToMonthlyFactor } from '@/lib/pricingHelper';
import { useLocale } from '@/hooks/useLocale';
import { order } from '@/types/catalog';
import { usePriceFormatter } from '@/hooks/usePriceFormatter.hook';

interface CartTotalPriceProps {
  price: number;
  priceWithTax: number;
  currency: order.CurrencyCodeEnum;
}

const CartTotalPrice = ({
  price,
  priceWithTax,
  currency,
}: CartTotalPriceProps) => {
  const locale = useLocale();
  const { t } = useTranslation('pricing');
  const priceFormatter = usePriceFormatter({ locale, currency, decimals: 3 });
  const monthPriceFormatter = usePriceFormatter({
    locale,
    currency,
    decimals: 0,
  });

  return (
    <div data-testid="cart-total-price">
      <div className="flex justify-between pt-4">
        <h5 className="self-start">{t('total_hour_label')}</h5>
        <div className="flex flex-col items-end text-end">
          <h3>{t('pricing_ht', { price: priceFormatter(price) })}</h3>
          <span>
            {t('pricing_ttc', { price: priceFormatter(priceWithTax) })}
          </span>
        </div>
      </div>
      <Separator className="my-2 bg-neutral-100 h-[2px]" />
      <div className="flex justify-between text-neutral-500">
        <p className="font-bold self-start">{t('estimated_month_label')}</p>
        <div className="flex flex-col items-end">
          <h6 className="text-neutral-500">
            {t('pricing_ht', {
              price: monthPriceFormatter(price * hourlyToMonthlyFactor),
            })}
          </h6>
          <span>
            {t('pricing_ttc', {
              price: monthPriceFormatter(priceWithTax * hourlyToMonthlyFactor),
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartTotalPrice;
