import { AccordionContent, Separator } from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import { CartItemDetail } from '../cart.types';
import { useLocale } from '@/hooks/useLocale';
import { order } from '@/types/catalog';
import { usePriceFormatter } from '@/hooks/usePriceFormatter.hook';

interface CartItemDetailsProps {
  details: CartItemDetail[];
  currency: order.CurrencyCodeEnum;
}

const CartItemDetails = ({ details, currency }: CartItemDetailsProps) => {
  const locale = useLocale();
  const { t } = useTranslation('pricing');
  const priceFormatter = usePriceFormatter({ locale, currency, decimals: 3 });

  return (
    <AccordionContent className="bg-[--ods-color-neutral-050] px-6 py-3 max-h-[50vh] overflow-y-auto">
      {details.map(({ name, description, price, priceWithTax }, index) => (
        <div className="m-3" key={name}>
          <p className="text-sm text-[--ods-color-heading]">{name}</p>
          <div className="flex justify-between text-base font-semibold text-[--ods-color-heading]">
            {description}
            <div className="text-end">
              {price !== undefined && price !== 0 && (
                <h6>{t('pricing_ht', { price: priceFormatter(price) })}</h6>
              )}
              {priceWithTax !== undefined && priceWithTax !== 0 && (
                <p className="text-sm font-normal">
                  {t('pricing_ttc', { price: priceFormatter(priceWithTax) })}
                </p>
              )}
            </div>
          </div>
          {index !== details.length - 1 && (
            <Separator className="bg-[#ebebeb] h-[2px] mt-3" />
          )}
        </div>
      ))}
    </AccordionContent>
  );
};

export default CartItemDetails;
