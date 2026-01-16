import { AccordionContent, Separator } from '@datatr-ux/uxlib';
import { CartItemDetail } from '../cart.types';
import { Locale } from '@/hooks/useLocale';
import { order } from '@/types/catalog';
import { usePriceFormatter } from '@/lib/pricingHelper';

interface CartItemDetailsProps {
  details: CartItemDetail[];
  locale: Locale;
  currency: order.CurrencyCodeEnum;
}

const CartItemDetails = ({
  details,
  locale,
  currency,
}: CartItemDetailsProps) => {
  const priceFormatter = usePriceFormatter({ locale, currency, decimals: 3 });

  return (
    <AccordionContent className="bg-[--ods-color-neutral-050] px-6 py-3">
      {details.map(({ name, description, price }, index) => (
        <div className="m-3" key={name}>
          <p className="text-sm text-[--ods-color-heading]">{name}</p>
          <div className="flex justify-between text-base font-semibold text-[--ods-color-heading]">
            {description}
            {price !== undefined && price !== 0 && (
              <h6>{priceFormatter(price)}</h6>
            )}
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
